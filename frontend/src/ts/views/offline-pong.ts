import i18n from '../i18n';
import { OfflinePongModule, Ball, Paddle, GameState } from '../types';

const OfflinePong: OfflinePongModule = {
  component: async (): Promise<string> => {
    return `
      <div class="game-bg p-3 md:p-6 lg:p-8 my-4 md:my-6 lg:my-8 relative card-hover min-h-screen flex flex-col">
        <div class="flex flex-col xl:flex-row justify-between items-center mb-4 md:mb-6 lg:mb-8 gap-4">
          <h2 class="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium text-indigo-300 neon-text text-center xl:text-left">${i18n.t('offline.title')}</h2>
          <div class="flex items-center gap-4">
            <button id="back-btn" class="game-btn flex items-center py-2 px-4 md:py-3 md:px-6 bg-gray-800 hover:bg-gray-700 text-sm md:text-base">
              <i data-feather="arrow-left" class="w-4 h-4 md:w-5 md:h-5 mr-2"></i>
              <span>${i18n.t('button.back')}</span>
            </button>
          </div>
        </div>
        
        <div id="game-container" class="flex flex-col items-center flex-1 gap-4 md:gap-6">
          <div id="game-info" class="text-center">
            <h3 class="text-lg md:text-xl lg:text-2xl text-indigo-300 mb-2">${i18n.t('offline.subtitle')}</h3>
            <p id="game-status" class="text-gray-400 text-sm md:text-base lg:text-lg">${i18n.t('offline.press_space')}</p>
          </div>
          
          <div id="score-container" class="flex justify-center items-center w-full max-w-2xl">
            <div class="text-center px-6 md:px-12 lg:px-16">
              <p class="text-gray-400 text-sm md:text-base lg:text-lg mb-1">${i18n.t('offline.player1')}</p>
              <p id="score-1" class="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-indigo-300">0</p>
            </div>
            <div class="text-4xl md:text-5xl lg:text-6xl text-gray-600 mx-4 md:mx-8">VS</div>
            <div class="text-center px-6 md:px-12 lg:px-16">
              <p class="text-gray-400 text-sm md:text-base lg:text-lg mb-1">${i18n.t('offline.player2')}</p>
              <p id="score-2" class="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-indigo-300">0</p>
            </div>
          </div>
          
          <div id="canvas-container" class="w-full max-w-7xl flex-1 flex items-center justify-center p-2 md:p-4">
            <canvas id="offline-pong-canvas" class="border-2 border-indigo-700 bg-black rounded-lg shadow-2xl max-w-full max-h-full"></canvas>
          </div>
          
          <div id="game-controls" class="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8 w-full max-w-6xl px-2 md:px-4">
            <div class="text-center order-1 xl:order-1">
              <h4 class="text-base md:text-lg lg:text-xl text-indigo-300 mb-3 font-medium">${i18n.t('offline.controls_p1')}</h4>
              <div class="flex flex-row xl:flex-col gap-2 md:gap-3 justify-center">
                <div class="bg-gray-800 px-3 md:px-4 lg:px-6 py-2 md:py-3 rounded-lg text-sm md:text-base lg:text-lg border border-gray-700">
                  <span class="text-white font-bold text-lg md:text-xl">W</span>
                  <span class="text-gray-400"> - ${i18n.t('pong.up')}</span>
                </div>
                <div class="bg-gray-800 px-3 md:px-4 lg:px-6 py-2 md:py-3 rounded-lg text-sm md:text-base lg:text-lg border border-gray-700">
                  <span class="text-white font-bold text-lg md:text-xl">S</span>
                  <span class="text-gray-400"> - ${i18n.t('pong.down')}</span>
                </div>
              </div>
            </div>
            
            <div class="text-center order-3 xl:order-2">
              <h4 class="text-base md:text-lg lg:text-xl text-indigo-300 mb-3 font-medium">${i18n.t('pong.controls')}</h4>
              <div class="flex flex-col gap-2 md:gap-3">
                <button id="start-btn" class="game-btn py-3 md:py-4 px-6 md:px-8 lg:px-10 bg-green-700 hover:bg-green-600 text-base md:text-lg lg:text-xl font-medium rounded-lg shadow-lg transition-all duration-200">${i18n.t('offline.start')}</button>
                <div class="bg-gray-800 px-3 md:px-4 lg:px-6 py-2 md:py-3 rounded-lg text-sm md:text-base lg:text-lg border border-gray-700">
                  <span class="text-white font-bold text-lg md:text-xl">SPACE</span>
                  <span class="text-gray-400"> - ${i18n.t('offline.start')}</span>
                </div>
              </div>
            </div>
            
            <div class="text-center order-2 xl:order-3">
              <h4 class="text-base md:text-lg lg:text-xl text-indigo-300 mb-3 font-medium">${i18n.t('offline.controls_p2')}</h4>
              <div class="flex flex-row xl:flex-col gap-2 md:gap-3 justify-center">
                <div class="bg-gray-800 px-3 md:px-4 lg:px-6 py-2 md:py-3 rounded-lg text-sm md:text-base lg:text-lg border border-gray-700">
                  <span class="text-white font-bold text-lg md:text-xl">↑</span>
                  <span class="text-gray-400"> - ${i18n.t('pong.up')}</span>
                </div>
                <div class="bg-gray-800 px-3 md:px-4 lg:px-6 py-2 md:py-3 rounded-lg text-sm md:text-base lg:text-lg border border-gray-700">
                  <span class="text-white font-bold text-lg md:text-xl">↓</span>
                  <span class="text-gray-400"> - ${i18n.t('pong.down')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },
  
  init: async (): Promise<void> => {
    const canvas = document.getElementById('offline-pong-canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    const canvasContainer = document.getElementById('canvas-container')!;
    const gameStatus = document.getElementById('game-status')!;
    const score1Element = document.getElementById('score-1')!;
    const score2Element = document.getElementById('score-2')!;
    const startBtn = document.getElementById('start-btn') as HTMLButtonElement;
    const backBtn = document.getElementById('back-btn')!;
    
    const BASE_WIDTH = 800;
    const BASE_HEIGHT = 600;
    const ASPECT_RATIO = BASE_WIDTH / BASE_HEIGHT;
    
    let currentWidth = BASE_WIDTH;
    let currentHeight = BASE_HEIGHT;
    let scaleFactor = 1;
    
    const BASE_PADDLE_WIDTH = 15;
    const BASE_PADDLE_HEIGHT = 100;
    const BASE_BALL_RADIUS = 10;
    const BASE_PADDLE_SPEED = 8;
    const BASE_BALL_SPEED = 3;
    const WINNING_SCORE = 10;
    
    let PADDLE_WIDTH = BASE_PADDLE_WIDTH;
    let PADDLE_HEIGHT = BASE_PADDLE_HEIGHT;
    let BALL_RADIUS = BASE_BALL_RADIUS;
    let PADDLE_SPEED = BASE_PADDLE_SPEED;
    let BALL_SPEED = BASE_BALL_SPEED;
    
    let gameState: GameState = {
      ball: {
        x: currentWidth / 2,
        y: currentHeight / 2,
        dx: BALL_SPEED,
        dy: BALL_SPEED,
        radius: BALL_RADIUS
      },
      player1: {
        x: 20,
        y: currentHeight / 2 - PADDLE_HEIGHT / 2,
        width: PADDLE_WIDTH,
        height: PADDLE_HEIGHT,
        dy: 0
      },
      player2: {
        x: currentWidth - PADDLE_WIDTH - 20,
        y: currentHeight / 2 - PADDLE_HEIGHT / 2,
        width: PADDLE_WIDTH,
        height: PADDLE_HEIGHT,
        dy: 0
      },
      score1: 0,
      score2: 0,
      isPlaying: false,
      isPaused: false,
      winner: null
    };
    
    const keys: { [key: string]: boolean } = {};
    
    function resizeCanvas(): void {
      const container = canvasContainer as HTMLElement;
      const containerRect = container.getBoundingClientRect();
      
      const maxWidth = Math.min(containerRect.width - 32, window.innerWidth - 64);
      const maxHeight = Math.min(containerRect.height - 32, window.innerHeight * 0.6);
      
      let newWidth = maxWidth;
      let newHeight = newWidth / ASPECT_RATIO;
      
      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = newHeight * ASPECT_RATIO;
      }
      
      const minWidth = 400;
      const minHeight = minWidth / ASPECT_RATIO;
      
      if (newWidth < minWidth) {
        newWidth = minWidth;
        newHeight = minHeight;
      }
      
      currentWidth = newWidth;
      currentHeight = newHeight;
      canvas.width = currentWidth;
      canvas.height = currentHeight;
      
      scaleFactor = currentWidth / BASE_WIDTH;
      
      PADDLE_WIDTH = BASE_PADDLE_WIDTH * scaleFactor;
      PADDLE_HEIGHT = BASE_PADDLE_HEIGHT * scaleFactor;
      BALL_RADIUS = BASE_BALL_RADIUS * scaleFactor;
      PADDLE_SPEED = BASE_PADDLE_SPEED * scaleFactor;
      BALL_SPEED = BASE_BALL_SPEED * scaleFactor;
      
      if (!gameState.isPlaying) {
        gameState.ball.x = currentWidth / 2;
        gameState.ball.y = currentHeight / 2;
        gameState.ball.radius = BALL_RADIUS;
        
        gameState.player1.x = 20 * scaleFactor;
        gameState.player1.y = currentHeight / 2 - PADDLE_HEIGHT / 2;
        gameState.player1.width = PADDLE_WIDTH;
        gameState.player1.height = PADDLE_HEIGHT;
        
        gameState.player2.x = currentWidth - PADDLE_WIDTH - (20 * scaleFactor);
        gameState.player2.y = currentHeight / 2 - PADDLE_HEIGHT / 2;
        gameState.player2.width = PADDLE_WIDTH;
        gameState.player2.height = PADDLE_HEIGHT;
      }
      
      render();
    }
    
    resizeCanvas();
    
    window.addEventListener('resize', resizeCanvas);
    
    const cleanup = () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = true;
      if (e.code === 'Space') {
        e.preventDefault();
        if (!gameState.isPlaying) {
          startGame();
        }
      }
      if (e.code === 'ArrowUp' || e.code === 'ArrowDown' || e.code === 'ArrowLeft' || e.code === 'ArrowRight')
        e.preventDefault();
      if (e.code === 'KeyW' || e.code === 'KeyS')
        e.preventDefault();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false;
      if (e.code === 'ArrowUp' || e.code === 'ArrowDown' || e.code === 'ArrowLeft' || e.code === 'ArrowRight')
        e.preventDefault();
      if (e.code === 'KeyW' || e.code === 'KeyS')
        e.preventDefault();
    };
    
    (window as any).offlinePongCleanup = cleanup;
    
    backBtn.addEventListener('click', () => {
      cleanup();
      window.router.navigateTo('/');
    });
    
    startBtn.addEventListener('click', startGame);
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    canvas.setAttribute('tabindex', '0');
    canvas.focus();
    
    function startGame(): void {
      gameState = {
        ball: {
          x: currentWidth / 2,
          y: currentHeight / 2,
          dx: Math.random() > 0.5 ? BALL_SPEED : -BALL_SPEED,
          dy: (Math.random() - 0.5) * BALL_SPEED,
          radius: BALL_RADIUS
        },
        player1: {
          x: 20 * scaleFactor,
          y: currentHeight / 2 - PADDLE_HEIGHT / 2,
          width: PADDLE_WIDTH,
          height: PADDLE_HEIGHT,
          dy: 0
        },
        player2: {
          x: currentWidth - PADDLE_WIDTH - (20 * scaleFactor),
          y: currentHeight / 2 - PADDLE_HEIGHT / 2,
          width: PADDLE_WIDTH,
          height: PADDLE_HEIGHT,
          dy: 0
        },
        score1: 0,
        score2: 0,
        isPlaying: true,
        isPaused: false,
        winner: null
      };
      
      updateScore();
      gameStatus.textContent = `${i18n.t('pong.started')}`;
      startBtn.disabled = true;
      gameLoop();
    }
    
    function updatePaddles(): void {
      if (keys['w'] && gameState.player1.y > 0) {
        gameState.player1.y -= PADDLE_SPEED;
      }
      if (keys['s'] && gameState.player1.y < currentHeight - PADDLE_HEIGHT) {
        gameState.player1.y += PADDLE_SPEED;
      }
      
      if (keys['arrowup'] && gameState.player2.y > 0) {
        gameState.player2.y -= PADDLE_SPEED;
      }
      if (keys['arrowdown'] && gameState.player2.y < currentHeight - PADDLE_HEIGHT) {
        gameState.player2.y += PADDLE_SPEED;
      }
    }
    
    function updateBall(): void {
      gameState.ball.x += gameState.ball.dx;
      gameState.ball.y += gameState.ball.dy;
      
      if (gameState.ball.y <= BALL_RADIUS || gameState.ball.y >= currentHeight - BALL_RADIUS) {
        gameState.ball.dy = -gameState.ball.dy;
      }
      
      if (gameState.ball.x <= gameState.player1.x + PADDLE_WIDTH &&
          gameState.ball.y >= gameState.player1.y &&
          gameState.ball.y <= gameState.player1.y + PADDLE_HEIGHT &&
          gameState.ball.dx < 0) {
        gameState.ball.dx = -gameState.ball.dx;
        const hitPos = (gameState.ball.y - gameState.player1.y) / PADDLE_HEIGHT - 0.5;
        gameState.ball.dy = hitPos * BALL_SPEED;
      }
      
      if (gameState.ball.x >= gameState.player2.x - BALL_RADIUS &&
          gameState.ball.y >= gameState.player2.y &&
          gameState.ball.y <= gameState.player2.y + PADDLE_HEIGHT &&
          gameState.ball.dx > 0) {
        gameState.ball.dx = -gameState.ball.dx;
        const hitPos = (gameState.ball.y - gameState.player2.y) / PADDLE_HEIGHT - 0.5;
        gameState.ball.dy = hitPos * BALL_SPEED;
      }
      
      if (gameState.ball.x < 0) {
        gameState.score2++;
        resetBall();
      } else if (gameState.ball.x > currentWidth) {
        gameState.score1++;
        resetBall();
      }
      
      updateScore();
      checkWinner();
    }
    
    function resetBall(): void {
      gameState.ball.x = currentWidth / 2;
      gameState.ball.y = currentHeight / 2;
      gameState.ball.dx = Math.random() > 0.5 ? BALL_SPEED : -BALL_SPEED;
      gameState.ball.dy = (Math.random() - 0.5) * BALL_SPEED;
    }
    
    function updateScore(): void {
      score1Element.textContent = gameState.score1.toString();
      score2Element.textContent = gameState.score2.toString();
    }
    
    function checkWinner(): void {
      if (gameState.score1 >= WINNING_SCORE) {
        gameState.winner = 1;
        endGame();
      } else if (gameState.score2 >= WINNING_SCORE) {
        gameState.winner = 2;
        endGame();
      }
    }
    
    function endGame(): void {
      gameState.isPlaying = false;
      gameState.isPaused = false;
      gameStatus.textContent = `${i18n.t('pong.over')} ${i18n.t('offline.player' + gameState.winner)} ${i18n.t('pong.wins')}`;
      startBtn.disabled = false;
      startBtn.textContent = i18n.t('offline.start');
    }
    
    function render(): void {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, currentWidth, currentHeight);
      
      ctx.setLineDash([10 * scaleFactor, 10 * scaleFactor]);
      ctx.beginPath();
      ctx.moveTo(currentWidth / 2, 0);
      ctx.lineTo(currentWidth / 2, currentHeight);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2 * scaleFactor;
      ctx.stroke();
      ctx.setLineDash([]);
      
      ctx.fillStyle = '#6366f1';
      ctx.fillRect(gameState.player1.x, gameState.player1.y, gameState.player1.width, gameState.player1.height);
      
      ctx.fillStyle = '#8b5cf6';
      ctx.fillRect(gameState.player2.x, gameState.player2.y, gameState.player2.width, gameState.player2.height);
      
      ctx.beginPath();
      ctx.arc(gameState.ball.x, gameState.ball.y, gameState.ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
    }
    
    function gameLoop(): void {
      if (!gameState.isPlaying || gameState.isPaused) return;
      
      updatePaddles();
      updateBall();
      render();
      
      if (gameState.isPlaying && !gameState.isPaused) {
        requestAnimationFrame(gameLoop);
      }
    }
    
    render();
    setTimeout(resizeCanvas, 100);
  }
};

export default OfflinePong;
