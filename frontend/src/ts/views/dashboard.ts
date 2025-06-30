import i18n from '../i18n.js';
import { authService, userService, friendService, cacheService } from '../services/index.js';
import LanguageToggle from '../components/language-toggle.js';
import { Friend, FriendRequest } from '../types/user.types.js';
import { DashboardModule, UserProfile } from '../types/view-modules.types.js';

const Dashboard: DashboardModule = {
  component: async (): Promise<string> => {
    return `
      <div class="game-bg p-6 my-8 relative card-hover">
        <div class="flex justify-between items-center mb-8">
          <div class="relative">
            <button id="menu-toggle" class="game-btn flex items-center py-2 px-3 bg-gray-800 hover:bg-gray-700">
              <i data-feather="menu" class="w-6 h-6"></i>
            </button>
            <div id="dropdown-menu" class="hidden absolute left-0 top-full mt-2 w-64 bg-gray-900 rounded-lg shadow-lg z-50 border border-indigo-800 overflow-hidden">
              <div class="p-4 border-b border-indigo-800">
                <h3 class="text-lg font-medium text-indigo-300">${i18n.t('dashboard.title')}</h3>
              </div>
              <ul>
                <li class="border-b border-gray-800">
                  <a href="#" id="toggle-2fa-menu" class="flex items-center px-4 py-3 hover:bg-gray-800 transition-colors">
                    <i data-feather="shield" class="w-5 h-5 mr-3 text-indigo-400"></i>
                    <span class="text-gray-300">${i18n.t('dashboard.2fa.title')}</span>
                  </a>
                </li>
                <li class="border-b border-gray-800">
                  <a href="#" id="toggle-friends-menu" class="flex items-center px-4 py-3 hover:bg-gray-800 transition-colors">
                    <i data-feather="users" class="w-5 h-5 mr-3 text-indigo-400"></i>
                    <span class="text-gray-300">${i18n.t('dashboard.friends.manage')}</span>
                  </a>
                </li>
                <li>
                  <a href="#" id="settings-link" class="flex items-center px-4 py-3 hover:bg-gray-800 transition-colors">
                    <i data-feather="settings" class="w-5 h-5 mr-3 text-indigo-400"></i>
                    <span class="text-gray-300">${i18n.t('dashboard.settings')}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="language-toggle-container">
              ${LanguageToggle.component()}
            </div>
            <button id="logout-btn" class="game-btn flex items-center py-2 px-4 bg-gray-800 hover:bg-gray-700">
              <span class="mr-2">${i18n.t('button.logout')}</span>
              <i data-feather="log-out" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
        
        <div id="user-profile" class="flex flex-col items-center mb-10">
          <div id="profile-image-container" class="bg-gradient-to-r from-indigo-700 to-purple-700 w-28 h-28 rounded-full flex items-center justify-center mb-4 overflow-hidden">
            <i data-feather="user" class="w-14 h-14 text-white"></i>
          </div>
          <h3 id="user-name" class="text-2xl font-medium text-indigo-300 neon-text">${i18n.t('dashboard.loading')}</h3>
          <p id="user-email" class="text-gray-400">${i18n.t('dashboard.loading')}</p>
        </div>
        
        <div id="2fa-section" class="hidden mb-8">
          <div class="glass-effect p-6 rounded-xl gradient-border">
            <div class="flex items-center mb-4">
              <i data-feather="shield" class="w-8 h-8 text-indigo-400 mr-3"></i>
              <h4 class="text-xl font-medium text-indigo-300">${i18n.t('dashboard.2fa.title')}</h4>
            </div>
            <p class="text-gray-400 mb-6">${i18n.t('dashboard.2fa.description')}</p>
            
            <div class="flex items-center mb-4">
              <span class="mr-2 text-gray-300">${i18n.t('dashboard.2fa.status')}</span>
              <span id="2fa-status" class="font-medium">${i18n.t('dashboard.loading')}</span>
            </div>
            
            <button id="toggle-2fa" class="game-btn py-2 w-full">
              ${i18n.t('dashboard.loading')}
            </button>
          </div>
        </div>

        <div id="friends-section" class="hidden mb-8">
          <div class="glass-effect p-6 rounded-xl gradient-border">
            <div class="flex items-center mb-4">
              <i data-feather="users" class="w-8 h-8 text-indigo-400 mr-3"></i>
              <h4 class="text-xl font-medium text-indigo-300">${i18n.t('dashboard.friends.title')}</h4>
            </div>

            <div class="mb-6">
              <h5 class="text-lg font-medium text-indigo-300 mb-3">${i18n.t('dashboard.friends.add')}</h5>
              <div class="flex flex-col gap-2">
                <p class="text-gray-400 text-sm">${i18n.t('dashboard.friends.username_exact')}</p>
                <div class="flex gap-2">
                  <input type="text" id="search-friend-input" placeholder="${i18n.t('placeholder.exact_username')}" class="w-full p-2 rounded bg-gray-800 text-white border border-indigo-600 focus:outline-none focus:border-indigo-400">
                  <button id="search-friend-btn" class="game-btn py-2 px-4">
                    <i data-feather="user-plus" class="w-5 h-5"></i>
                  </button>
                </div>
                <div id="search-results" class="mt-3 max-h-60 overflow-y-auto hidden">
                  <!-- Resultados da busca serão inseridos aqui -->
                </div>
              </div>
            </div>

            <div class="mb-6">
              <h5 class="text-lg font-medium text-indigo-300 mb-3">${i18n.t('dashboard.friends.pending')}</h5>
              <div id="pending-requests" class="space-y-3">
                <p class="text-gray-400">${i18n.t('dashboard.loading')}</p>
              </div>
            </div>

            <div>
              <h5 class="text-lg font-medium text-indigo-300 mb-3">${i18n.t('dashboard.friends.current')}</h5>
              <div id="friends-list" class="space-y-3">
                <p class="text-gray-400">${i18n.t('dashboard.loading')}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-1 gap-8 mb-8">
          <div class="glass-effect p-6 rounded-xl gradient-border">
            <div class="flex items-center mb-4">
              <i data-feather="play" class="w-8 h-8 text-indigo-400 mr-3"></i>
              <h4 class="text-xl font-medium text-indigo-300">${i18n.t('dashboard.game.title')}</h4>
            </div>
            <p class="text-gray-400 mb-6">${i18n.t('dashboard.game.ready')}</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button id="play-new-game" class="game-btn py-2 w-full flex items-center justify-center">
                <i data-feather="plus-circle" class="w-5 h-5 mr-2"></i>
                ${i18n.t('button.play')}
              </button>
              
              <div class="relative">
                <input type="text" id="game-id-input" placeholder="ID do jogo" class="w-full p-2 rounded bg-gray-800 text-white border border-indigo-600 focus:outline-none focus:border-indigo-400">
                <button id="join-game" class="absolute right-2 top-1/2 transform -translate-y-1/2 text-indigo-400 hover:text-indigo-300">
                  <i data-feather="arrow-right" class="w-5 h-5"></i>
                </button>
              </div>
            </div>
            
            <!-- Tournament Button -->
            <div class="mt-4">
              <button id="tournament-btn" class="game-btn py-3 w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <i data-feather="trophy" class="w-5 h-5 mr-2"></i>
                ${i18n.t('button.tournament')}
              </button>
            </div>
          </div>
        </div>
        
        <div class="glass-effect p-6 rounded-xl mt-8">
          <h4 class="text-xl font-medium text-indigo-300 mb-4">${i18n.t('dashboard.stats.title')}</h4>
          <div class="grid grid-cols-2 gap-4 text-center">
            <div class="game-section p-4">
              <i data-feather="award" class="w-8 h-8 mx-auto mb-2 text-indigo-400"></i>
              <p class="text-indigo-300 font-bold text-xl">0</p>
              <p class="text-gray-400 text-sm">${i18n.t('dashboard.stats.wins')}</p>
            </div>
            <div class="game-section p-4">
              <i data-feather="trending-up" class="w-8 h-8 mx-auto mb-2 text-indigo-400"></i>
              <p class="text-indigo-300 font-bold text-xl">0</p>
              <p class="text-gray-400 text-sm">${i18n.t('dashboard.stats.score')}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  },
  init: async (): Promise<void> => {
    i18n.ensureLocaleIntegrity();
    LanguageToggle.init();
    
    const getAuthToken = (): string | null => {
      const cookies = document.cookie.split(';');
      let authToken = null;
      
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('auth_token=')) {
          authToken = cookie.substring('auth_token='.length, cookie.length);
          break;
        }
      }
      
      return authToken;
    };
    
    const token = getAuthToken();
    if (!token) {
      console.log('Usuário não autenticado. Redirecionando para login.');
      window.router.navigateTo('/login');
      return;
    }
    
    const menuToggle = document.getElementById('menu-toggle') as HTMLButtonElement;
    const dropdownMenu = document.getElementById('dropdown-menu') as HTMLDivElement;
    
    menuToggle.addEventListener('click', (e: MouseEvent) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('hidden');
    });
    
    document.addEventListener('click', (e: MouseEvent) => {
      if (!dropdownMenu.contains(e.target as Node) && e.target !== menuToggle) {
        dropdownMenu.classList.add('hidden');
      }
    });
    
    const toggle2FAMenu = document.getElementById('toggle-2fa-menu') as HTMLAnchorElement;
    const twoFASection = document.getElementById('2fa-section') as HTMLDivElement;
    
    toggle2FAMenu.addEventListener('click', (e: MouseEvent) => {
      e.preventDefault();
      twoFASection.classList.toggle('hidden');
      const friendsSection = document.getElementById('friends-section') as HTMLDivElement;
      friendsSection.classList.add('hidden');
      dropdownMenu.classList.add('hidden');
      
      if (!twoFASection.classList.contains('hidden')) {
        twoFASection.scrollIntoView({ behavior: 'smooth' });
      }
    });

    const toggleFriendsMenu = document.getElementById('toggle-friends-menu') as HTMLAnchorElement;
    const friendsSection = document.getElementById('friends-section') as HTMLDivElement;
    
    toggleFriendsMenu.addEventListener('click', async (e: MouseEvent) => {
      e.preventDefault();
      const wasHidden = friendsSection.classList.contains('hidden');
      friendsSection.classList.toggle('hidden');
      twoFASection.classList.add('hidden');
      dropdownMenu.classList.add('hidden');
      
      if (wasHidden && !friendsSection.classList.contains('hidden')) {
        friendsSection.scrollIntoView({ behavior: 'smooth' });
        await loadFriends();
        await loadFriendRequests();
      }
    });
    
    const settingsLink = document.getElementById('settings-link') as HTMLAnchorElement;
    settingsLink.addEventListener('click', (e: MouseEvent) => {
      e.preventDefault();
      window.router.navigateTo('/settings');
    });
    
    const logoutBtn = document.getElementById('logout-btn') as HTMLButtonElement;
    const toggle2FABtn = document.getElementById('toggle-2fa') as HTMLButtonElement;
    
    logoutBtn.addEventListener('click', () => {
      // Stop cache service before logout
      cacheService.stopPing();
      
      document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.router.navigateTo('/login');
    });
    
    const playNewGameBtn = document.getElementById('play-new-game') as HTMLButtonElement;
    const joinGameBtn = document.getElementById('join-game') as HTMLButtonElement;
    const gameIdInput = document.getElementById('game-id-input') as HTMLInputElement;
    
    playNewGameBtn.addEventListener('click', () => {
      const randomId = Math.floor(Math.random() * 1000000).toString();
      window.router.navigateTo(`/pong/${randomId}`);
    });
    
    joinGameBtn.addEventListener('click', () => {
      const gameId = gameIdInput.value.trim();
      if (gameId) {
        window.router.navigateTo(`/pong/${gameId}`);
      } else {
        alert('Por favor, insira um ID de jogo válido');
      }
    });
    
    gameIdInput.addEventListener('keypress', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        joinGameBtn.click();
      }
    });

    // Tournament button event listener
    const tournamentBtn = document.getElementById('tournament-btn') as HTMLButtonElement;
    tournamentBtn.addEventListener('click', () => {
      window.router.navigateTo('/tournament');
    });
    
    const searchFriendInput = document.getElementById('search-friend-input') as HTMLInputElement;
    const searchFriendBtn = document.getElementById('search-friend-btn') as HTMLButtonElement;
    const searchResults = document.getElementById('search-results') as HTMLDivElement;
    
    searchFriendBtn.addEventListener('click', async () => {
      const query = searchFriendInput.value.trim();
      if (!query) return;
      
      try {
        searchResults.innerHTML = `<p class="text-gray-400">${i18n.t('dashboard.loading')}</p>`;
        searchResults.classList.remove('hidden');
        
        console.log(`Iniciando busca por usuário com username: "${query}"`);
        
        try {
          const userData = await userService.findUserByUsername(query) as any;
          console.log('Dados do usuário recebidos:', userData);
          
          if (userData && userData.id) {
            console.log(`Usuário encontrado: ${userData.nickName} (${userData.id})`);
            
            console.log(`Enviando solicitação de amizade para: ${userData.id}`);
            
            try {
              const requestResponse = await friendService.sendFriendRequest(userData.id);
              console.log(`Resposta do envio de convite:`, requestResponse);
              
              console.log('Convite enviado com sucesso');
              searchResults.innerHTML = `
                <div class="p-3 bg-green-800 rounded-lg">
                  <p class="text-white text-center">
                    ${i18n.t('dashboard.friends.invite_sent')} <strong>${userData.nickName}</strong>
                  </p>
                </div>
              `;
              
              searchFriendInput.value = '';
              await loadFriendRequests();
            } catch (requestError: any) {
              console.error(`Erro ao enviar convite:`, requestError);
              
              if (requestError.message && requestError.message.includes('Uma solicitação de amizade já existe')) {
                searchResults.innerHTML = `
                  <div class="p-3 bg-yellow-800 rounded-lg">
                    <p class="text-white text-center">
                      ${i18n.t('dashboard.friends.request_pending')}
                    </p>
                  </div>
                `;
              } else if (requestError.message && requestError.message.includes('já são amigos')) {
                searchResults.innerHTML = `
                  <div class="p-3 bg-yellow-800 rounded-lg">
                    <p class="text-white text-center">
                      ${i18n.t('dashboard.friends.already_friends')}
                    </p>
                  </div>
                `;
              } else {
                searchResults.innerHTML = `
                  <div class="p-3 bg-red-800 rounded-lg">
                    <p class="text-white text-center">
                      ${i18n.t('dashboard.friends.error')}
                    </p>
                  </div>
                `;
              }
            }
          } else {
            console.error('Resposta não contém dados válidos do usuário:', userData);
            searchResults.innerHTML = `
              <div class="p-3 bg-red-800 rounded-lg">
                <p class="text-white text-center">
                  ${i18n.t('dashboard.friends.user_not_found')}
                </p>
              </div>
            `;
          }
        } catch (error) {
          console.error('Erro ao adicionar amigo:', error);
          searchResults.innerHTML = `
            <div class="p-3 bg-red-800 rounded-lg">
              <p class="text-white text-center">
                ${i18n.t('dashboard.friends.error')}
              </p>
            </div>
          `;
        }
      } catch (outerError) {
        console.error('Erro geral:', outerError);
        searchResults.innerHTML = `
          <div class="p-3 bg-red-800 rounded-lg">
            <p class="text-white text-center">
              ${i18n.t('dashboard.friends.error')}
            </p>
          </div>
        `;
      }
    });
    
    searchFriendInput.addEventListener('keypress', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        searchFriendBtn.click();
      }
    });

    const loadFriends = async () => {
      const friendsList = document.getElementById('friends-list') as HTMLDivElement;
      
      try {
        const friends = await friendService.getFriends() as any;
        
        if (!friends || friends.length === 0) {
          friendsList.innerHTML = `<p class="text-gray-400">${i18n.t('dashboard.friends.no_friends')}</p>`;
        } else {
          const friendsWithStatus = await Promise.all(
            friends.map(async (friend: Friend) => {
              try {
                const onlineStatus = await cacheService.checkUserOnline(friend.id);
                return {
                  ...friend,
                  isOnline: onlineStatus.isOnline,
                  lastSeen: onlineStatus.minutesAgo
                };
              } catch (error) {
                console.error(`Error checking online status for friend ${friend.id}:`, error);
                return {
                  ...friend,
                  isOnline: false,
                  lastSeen: null
                };
              }
            })
          );
          
          friendsWithStatus.sort((a, b) => {
            if (a.isOnline && !b.isOnline) return -1;
            if (!a.isOnline && b.isOnline) return 1;
            return a.nickName.localeCompare(b.nickName);
          });
          
          friendsList.innerHTML = friendsWithStatus.map((friend: any) => `
            <div class="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div class="flex items-center">
                <div class="relative mr-3">
                  <div class="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center overflow-hidden">
                    ${friend.foto ? 
                      `<img src="${friend.foto}" alt="${friend.nickName}" class="w-full h-full object-cover">` : 
                      `<i data-feather="user" class="w-5 h-5 text-white"></i>`
                    }
                  </div>
                  <div class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 ${
                    friend.isOnline ? 'bg-green-400' : 'bg-gray-500'
                  }"></div>
                </div>
                <div>
                  <span class="text-indigo-300">${friend.nickName}</span>
                  <div class="text-xs ${friend.isOnline ? 'text-green-400' : 'text-gray-400'}">
                    ${friend.isOnline ? 
                      i18n.t('dashboard.friends.online') : 
                      (friend.lastSeen !== null ? 
                        `${i18n.t('dashboard.friends.offline')} há ${friend.lastSeen}min` : 
                        i18n.t('dashboard.friends.offline')
                      )
                    }
                  </div>
                </div>
              </div>
              <button class="remove-friend-btn text-red-400 hover:text-red-300" 
                      data-friend-id="${friend.id}" 
                      data-friendship-id="${friend.friendshipId || ''}">
                <i data-feather="x" class="w-5 h-5"></i>
              </button>
            </div>
          `).join('');
          
          if (window.feather) {
            window.feather.replace();
          }
          
          document.querySelectorAll('.remove-friend-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
              const friendId = (e.currentTarget as HTMLButtonElement).getAttribute('data-friend-id');
              const friendshipId = (e.currentTarget as HTMLButtonElement).getAttribute('data-friendship-id');
              
              if (!friendId) return;
              
              if (confirm('Tem certeza que deseja remover este amigo?')) {
                try {
                  let removeResponse;
                  let success = false;
                  
                  if (friendshipId && friendshipId !== '') {
                    try {
                      removeResponse = await friendService.removeFriend(friendshipId);
                      success = true;
                    } catch (error: any) {
                      if (error.message && (
                        error.message.includes('não encontrada') || 
                        error.message.includes('not found') ||
                        error.message.includes('Amizade não encontrada')
                      )) {
                        success = true;
                      } else {
                        throw error;
                      }
                    }
                  } else {
                    try {
                      removeResponse = await friendService.removeFriendByUserId(friendId);
                      success = true;
                    } catch (error: any) {
                      if (error.message && (
                        error.message.includes('não encontrada') || 
                        error.message.includes('not found') ||
                        error.message.includes('Amizade não encontrada')
                      )) {
                        success = true;
                      } else {
                        throw error;
                      }
                    }
                  }
                  
                  if (success) {
                    await loadFriends();
                  } else {
                    throw new Error('Erro ao remover amigo');
                  }
                } catch (error) {
                  console.error('Erro ao remover amigo:', error);
                  alert(i18n.t('dashboard.friends.error'));
                }
              }
            });
          });
        }
      } catch (error) {
        console.error('Erro ao carregar amigos:', error);
        friendsList.innerHTML = `<p class="text-red-400">Erro ao carregar amigos</p>`;
      }
    };

    const loadFriendRequests = async () => {
      const pendingRequests = document.getElementById('pending-requests') as HTMLDivElement;
      let currentUserId = '';
      
      try {
        try {
          const userProfile = await userService.getUserProfile() as any;
          currentUserId = userProfile.id;
        } catch (error) {
          console.error('Erro ao buscar perfil do usuário:', error);
        }
        
        const requests = await friendService.getFriendRequests() as any;
        
        console.log('Friend requests data received:', requests);
        console.log('Current user ID:', currentUserId);
        
        if (requests.length === 0) {
          pendingRequests.innerHTML = `<p class="text-gray-400">${i18n.t('dashboard.friends.no_requests')}</p>`;
        } else {
          pendingRequests.innerHTML = requests.map((request: FriendRequest) => {
            if (!request.sender || !request.receiver) {
              console.error('Dados incompletos na solicitação:', request);
              return ''; 
            }
            
            const isReceived = request.receiver.id === currentUserId;
            const user = isReceived ? request.sender : request.receiver;
            
            if (!user || !user.id || !user.nickName) {
              console.error('Dados do usuário incompletos:', user);
              return '';
            }
            
            return `
              <div class="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div class="flex items-center">
                  <div class="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center overflow-hidden mr-3">
                    ${user.foto ? 
                      `<img src="${user.foto}" alt="${user.nickName}" class="w-full h-full object-cover">` : 
                      `<i data-feather="user" class="w-5 h-5 text-white"></i>`
                    }
                  </div>
                  <div>
                    <span class="text-indigo-300">${user.nickName}</span>
                    <span class="text-xs text-gray-400 ml-2">
                      ${isReceived ? i18n.t('dashboard.friends.request_received') : i18n.t('dashboard.friends.request_sent')}
                    </span>
                  </div>
                </div>
                ${isReceived ? `
                  <div class="flex gap-2">
                    <button class="accept-request-btn game-btn py-1 px-2 text-sm" data-request-id="${request.id}">
                      ${i18n.t('button.accept')}
                    </button>
                    <button class="reject-request-btn game-btn py-1 px-2 text-sm bg-red-800 hover:bg-red-700" data-request-id="${request.id}">
                      ${i18n.t('button.reject')}
                    </button>
                  </div>
                ` : ''}
              </div>
            `;
          }).filter((html: string) => html !== '').join('');
          
          if (window.feather) {
            window.feather.replace();
          }
          
          document.querySelectorAll('.accept-request-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
              const requestId = (e.currentTarget as HTMLButtonElement).getAttribute('data-request-id');
              if (!requestId) return;
              
              try {
                const acceptResponse = await friendService.acceptFriendRequest(requestId);
                
                if (acceptResponse) {
                  alert(i18n.t('dashboard.friends.accept_success'));
                  await loadFriendRequests();
                  await loadFriends();
                }
              } catch (error) {
                console.error('Erro ao aceitar solicitação:', error);
                alert(i18n.t('dashboard.friends.error'));
              }
            });
          });
          
          document.querySelectorAll('.reject-request-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
              const requestId = (e.currentTarget as HTMLButtonElement).getAttribute('data-request-id');
              if (!requestId) return;
              
              try {
                const rejectResponse = await friendService.rejectFriendRequest(requestId);
                
                if (rejectResponse) {
                  alert(i18n.t('dashboard.friends.reject_success'));
                  await loadFriendRequests();
                }
              } catch (error) {
                console.error('Erro ao rejeitar solicitação:', error);
                alert(i18n.t('dashboard.friends.error'));
              }
            });
          });
        }
      } catch (error) {
        console.error('Erro ao carregar solicitações de amizade:', error);
        pendingRequests.innerHTML = `<p class="text-red-400">Erro ao carregar solicitações</p>`;
      }
    };
    
    try {
      const userProfile: UserProfile = await userService.getUserProfile() as any;
      
      const userName = document.getElementById('user-name') as HTMLHeadingElement;
      const userEmail = document.getElementById('user-email') as HTMLParagraphElement;
      
      userName.textContent = userProfile.nickName;
      userEmail.textContent = userProfile.email;
      
      if (userProfile.foto) {
        const profileImageContainer = document.getElementById('profile-image-container') as HTMLDivElement;
        const featherIcon = profileImageContainer.querySelector('i');
        
        if (featherIcon) {
          featherIcon.remove();
        }
        
        const img = document.createElement('img');
        img.src = userProfile.foto;
        img.alt = `${userProfile.nickName} profile`;
        img.className = 'w-full h-full object-cover';
        
        profileImageContainer.appendChild(img);
      }
      
      const status2FA = document.getElementById('2fa-status') as HTMLSpanElement;
      status2FA.textContent = userProfile.twoFactorEnabled ? i18n.t('dashboard.2fa.enabled') : i18n.t('dashboard.2fa.disabled');
      status2FA.className = userProfile.twoFactorEnabled 
        ? 'font-medium text-green-400'
        : 'font-medium text-red-400';
      
      toggle2FABtn.textContent = userProfile.twoFactorEnabled ? i18n.t('dashboard.2fa.disable') : i18n.t('dashboard.2fa.enable');
      
      toggle2FABtn.addEventListener('click', async () => {
        try {
          toggle2FABtn.disabled = true;
          toggle2FABtn.textContent = i18n.t('dashboard.loading');
          
          const result = await userService.toggle2FA() as any;
          
          if (result && typeof result.twoFactorEnabled === 'boolean') {
            const newStatus = result.twoFactorEnabled;
            
            status2FA.textContent = newStatus ? i18n.t('dashboard.2fa.enabled') : i18n.t('dashboard.2fa.disabled');
            status2FA.className = newStatus
              ? 'font-medium text-green-400'
              : 'font-medium text-red-400';
              
            toggle2FABtn.textContent = newStatus ? i18n.t('dashboard.2fa.disable') : i18n.t('dashboard.2fa.enable');
            
            userProfile.twoFactorEnabled = newStatus;
            
            alert(result.message || i18n.t('dashboard.2fa.success', { state: newStatus ? 'ativada' : 'desativada' }));
          }
        } catch (error) {
          console.error('Erro ao alterar status do 2FA:', error);
          
          status2FA.textContent = userProfile.twoFactorEnabled ? i18n.t('dashboard.2fa.enabled') : i18n.t('dashboard.2fa.disabled');
          status2FA.className = userProfile.twoFactorEnabled
            ? 'font-medium text-green-400'
            : 'font-medium text-red-400';
          toggle2FABtn.textContent = userProfile.twoFactorEnabled ? i18n.t('dashboard.2fa.disable') : i18n.t('dashboard.2fa.enable');
          
          alert('Não foi possível alterar o status do 2FA. Por favor, tente novamente mais tarde.');
        } finally {
          toggle2FABtn.disabled = false;
        }
      });
      
      if (window.feather) {
        window.feather.replace();
      }
      
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
      alert('Não foi possível carregar as informações do usuário. Por favor, tente novamente mais tarde.');
    }
    if (!cacheService.isPinging()) {
      cacheService.startPing();
    }

    let friendsStatusInterval: NodeJS.Timeout | null = null;
    
    const startFriendsStatusUpdates = () => {
      if (friendsStatusInterval) {
        clearInterval(friendsStatusInterval);
      }
      
      friendsStatusInterval = setInterval(async () => {
        const friendsSection = document.getElementById('friends-section') as HTMLDivElement;
        if (!friendsSection.classList.contains('hidden')) {
          await loadFriends();
        }
      }, 30000);
    };

    const cleanup = () => {
      cacheService.stopPing();
      if (friendsStatusInterval) {
        clearInterval(friendsStatusInterval);
        friendsStatusInterval = null;
      }
    };
    
    window.addEventListener('beforeunload', cleanup);
    
    const originalNavigateTo = window.router?.navigateTo;
    if (originalNavigateTo) {
      window.router.navigateTo = function(path: string) {
        if (path !== '/dashboard' && path !== window.location.pathname) {
          cleanup();
        }
        return originalNavigateTo.call(this, path);
      };
    }
    startFriendsStatusUpdates();
  }
};

export default Dashboard;