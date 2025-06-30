import i18n from '../i18n';
import { PongModule, OnlineGameState } from '../types/index.js';

const Pong: PongModule = {
  component: async (): Promise<string> => {
    const gameId = window.location.pathname.split('/').pop();
    
    return `
      <div class="game-bg p-6 my-8 relative card-hover">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-2xl font-medium text-indigo-300 neon-text">${i18n.t('pong.title')}</h2>
          <div class="flex items-center gap-4">
            <button id="back-btn" class="game-btn flex items-center py-2 px-4 bg-gray-800 hover:bg-gray-700">
              <i data-feather="arrow-left" class="w-4 h-4 mr-2"></i>
              <span>${i18n.t('button.back')}</span>
            </button>
          </div>
        </div>
        
        <div id="game-container" class="flex flex-col items-center">
          <div id="game-info" class="text-center mb-4">
            <h3 class="text-xl text-indigo-300">${i18n.t('pong.game')} #${gameId}</h3>
            <p id="game-status" class="text-gray-400">${i18n.t('pong.waiting')}</p>
          </div>
          
          <div id="score-container" class="flex justify-center items-center mb-4 w-full">
            <div class="text-center px-8">
              <p class="text-gray-400">${i18n.t('pong.player')} 1</p>
              <p id="score-1" class="text-2xl font-bold text-indigo-300">0</p>
            </div>
            <div class="text-center px-8">
              <p class="text-gray-400">${i18n.t('pong.player')} 2</p>
              <p id="score-2" class="text-2xl font-bold text-indigo-300">0</p>
            </div>
          </div>
          
          <canvas id="pong-canvas" width="800" height="600" class="border-2 border-indigo-700 bg-black"></canvas>
          
          <div id="game-controls" class="mt-6 text-center">
            <p class="text-gray-400 mb-2">${i18n.t('pong.controls')}</p>
            <div class="flex justify-center gap-4">
              <div class="bg-gray-800 px-4 py-2 rounded">
                <span class="text-white font-bold">W</span>
                <span class="text-gray-400"> - ${i18n.t('pong.up')}</span>
              </div>
              <div class="bg-gray-800 px-4 py-2 rounded">
                <span class="text-white font-bold">S</span>
                <span class="text-gray-400"> - ${i18n.t('pong.down')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },
  init: async (): Promise<void> => {
    const gameId = window.location.pathname.split('/').pop();
    const canvas = document.getElementById('pong-canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const gameStatus = document.getElementById('game-status');
    const score1 = document.getElementById('score-1');
    const score2 = document.getElementById('score-2');
    
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        window.router.navigateTo('/dashboard');
      });
    }
    
    let socket: WebSocket | null = null;
    let playerPosition: number | null = null;
    let clientId: string | null = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    const reconnectDelay = 2000;
    
    function connectWebSocket(): void {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.hostname}:4444`;
      
      socket = new WebSocket(wsUrl);
      
      socket.onopen = () => {
        console.log('✅ Conectado ao servidor WebSocket');
        if (gameStatus) {
          gameStatus.textContent = i18n.t('pong.waiting');
        }
        reconnectAttempts = 0;
      };
      
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 Mensagem recebida:', data);
          
          switch (data.type) {
            case 'connected':
              console.log('🔗 Conexão estabelecida, ID do cliente:', data.clientId);
              clientId = data.clientId;
              
              if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                  type: 'join',
                  gameId: gameId
                }));
                console.log(`🎮 Enviando solicitação para entrar no jogo ${gameId}`);
              }
              break;
              
            case 'joined':
              playerPosition = data.position;
              if (gameStatus) {
                gameStatus.textContent = `${i18n.t('pong.joined')} (${i18n.t('pong.player')} ${playerPosition})`;
              }
              console.log(`🎮 Entrou no jogo como jogador ${playerPosition}`);
              break;
              
            case 'player_joined':
              if (gameStatus) {
                gameStatus.textContent = `${i18n.t('pong.player')} ${data.position} ${i18n.t('pong.entered')}`;
              }
              console.log(`🎮 Jogador ${data.position} entrou no jogo`);
              break;
              
            case 'game_start':
              if (gameStatus) {
                gameStatus.textContent = i18n.t('pong.started');
              }
              console.log('🏁 Jogo iniciado!');
              break;
              
            case 'update':
              renderGame(data.payload);
              break;
              
            case 'game_over':
              if (gameStatus) {
                gameStatus.textContent = `${i18n.t('pong.over')} ${i18n.t('pong.player')} ${data.winner} ${i18n.t('pong.wins')}`;
              }
              break;
              
            case 'player_left':
              if (gameStatus) {
                gameStatus.textContent = data.message;
              }
              break;
              
            case 'error':
              console.error('Erro:', data.message);
              if (gameStatus) {
                gameStatus.textContent = `Erro: ${data.message}`;
              }
              break;
          }
        } catch (error) {
          console.error('Erro ao processar mensagem:', error);
        }
      };
      
      socket.onerror = (error) => {
        console.error('Erro na conexão WebSocket:', error);
        if (gameStatus) {
          gameStatus.textContent = i18n.t('pong.connection_error');
        }
      };
      
      socket.onclose = (event) => {
        console.log('Conexão WebSocket fechada', event);
        if (gameStatus) {
          gameStatus.textContent = i18n.t('pong.disconnected');
        }
        
        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++;
          if (gameStatus) {
            gameStatus.textContent = `${i18n.t('pong.reconnecting')} (${reconnectAttempts}/${maxReconnectAttempts})`;
          }
          
          setTimeout(() => {
            connectWebSocket();
          }, reconnectDelay);
        } else if (gameStatus) {
          gameStatus.textContent = i18n.t('pong.reconnect_failed');
        }
      };
    }
    
    connectWebSocket();
    
    document.addEventListener('keydown', (e) => {
      if (!playerPosition || !socket || socket.readyState !== WebSocket.OPEN) return;
      
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
        socket.send(JSON.stringify({
          type: 'move',
          direction: 'up'
        }));
        console.log('⬆️ Enviando movimento para cima');
      } else if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
        socket.send(JSON.stringify({
          type: 'move',
          direction: 'down'
        }));
        console.log('⬇️ Enviando movimento para baixo');
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'r' && e.ctrlKey && reconnectAttempts >= maxReconnectAttempts) {
        reconnectAttempts = 0;
        connectWebSocket();
      }
    });
    
    function renderGame(state: OnlineGameState): void {
      if (!ctx || !score1 || !score2) return;
      
      const { ball, players, score, width, height, paddleHeight, paddleWidth } = state;
      
      score1.textContent = score[1].toString();
      score2.textContent = score[2].toString();
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.stroke();
      ctx.setLineDash([]);
      
      ctx.fillStyle = '#6366f1';
      ctx.fillRect(0, players[1].y, paddleWidth, paddleHeight);
      
      ctx.fillStyle = '#8b5cf6';
      ctx.fillRect(width - paddleWidth, players[2].y, paddleWidth, paddleHeight);
      
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
    }
  }
};

export default Pong; 