import i18n from '../i18n.js';
import LanguageToggle from '../components/language-toggle.js';
import { WaitingRoomModule } from '../types/view-modules.types.js';

const WaitingRoom: WaitingRoomModule = {
  component: async (): Promise<string> => {
    const tournamentName = sessionStorage.getItem('currentTournament') || '🏆 Tournament';
    
    return `
      <div class="game-bg p-6 my-8 relative card-hover">
        <div class="flex justify-between items-center mb-8">
          <button id="back-btn" class="game-btn flex items-center py-2 px-4 bg-gray-800 hover:bg-gray-700">
            <i data-feather="arrow-left" class="w-4 h-4 mr-2"></i>
            ${i18n.t('button.back')}
          </button>
          <div class="language-toggle-container">
            ${LanguageToggle.component()}
          </div>
        </div>

        <div class="text-center mb-8">
          <div class="flex items-center justify-center mb-4">
            <i data-feather="users" class="w-12 h-12 text-indigo-400 mr-4"></i>
            <h1 class="text-4xl font-bold text-indigo-300 neon-text">${i18n.t('waitingRoom.title')}</h1>
          </div>
          <div class="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg px-6 py-3 mx-auto max-w-md mb-4">
            <span class="text-xl font-bold text-white">${tournamentName}</span>
          </div>
          <p class="text-gray-400 text-lg">${i18n.t('waitingRoom.subtitle')}</p>
        </div>

        <!-- Tournament Bracket -->
        <div class="glass-effect p-6 rounded-xl gradient-border mb-8">
          <div class="flex items-center justify-center mb-6">
            <i data-feather="git-branch" class="w-8 h-8 text-indigo-400 mr-3"></i>
            <h3 class="text-2xl font-medium text-indigo-300">${i18n.t('waitingRoom.bracket.title')}</h3>
          </div>

          <!-- Tournament Bracket Display -->
          <div class="tournament-bracket">
            <!-- Quarter Finals -->
            <div class="bracket-round">
              <h4 class="text-lg font-medium text-indigo-300 mb-4 text-center">${i18n.t('waitingRoom.bracket.quarterFinals')}</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <!-- Match 1 -->
                <div class="bracket-match">
                  <div class="bg-gray-800 rounded-lg p-4 border border-indigo-600">
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-sm text-gray-400">${i18n.t('waitingRoom.bracket.match')} 1</span>
                      <i data-feather="clock" class="w-4 h-4 text-gray-400"></i>
                    </div>
                    <div class="space-y-2">
                      <div class="flex items-center justify-between p-2 bg-gray-700 rounded">
                        <div class="flex items-center">
                          <div class="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-2"></div>
                          <span class="text-white font-medium">You</span>
                        </div>
                        <span class="text-gray-400">-</span>
                      </div>
                      <div class="flex items-center justify-between p-2 bg-gray-700 rounded">
                        <div class="flex items-center">
                          <div class="w-6 h-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mr-2"></div>
                          <span class="text-white font-medium">StarPlayer</span>
                        </div>
                        <span class="text-gray-400">-</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Match 2 -->
                <div class="bracket-match">
                  <div class="bg-gray-800 rounded-lg p-4 border border-indigo-600">
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-sm text-gray-400">${i18n.t('waitingRoom.bracket.match')} 2</span>
                      <i data-feather="clock" class="w-4 h-4 text-gray-400"></i>
                    </div>
                    <div class="space-y-2">
                      <div class="flex items-center justify-between p-2 bg-gray-700 rounded">
                        <div class="flex items-center">
                          <div class="w-6 h-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mr-2"></div>
                          <span class="text-white font-medium">PongMaster</span>
                        </div>
                        <span class="text-gray-400">-</span>
                      </div>
                      <div class="flex items-center justify-between p-2 bg-gray-700 rounded">
                        <div class="flex items-center">
                          <div class="w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mr-2"></div>
                          <span class="text-white font-medium">ThunderBolt</span>
                        </div>
                        <span class="text-gray-400">-</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Match 3 -->
                <div class="bracket-match">
                  <div class="bg-gray-800 rounded-lg p-4 border border-indigo-600">
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-sm text-gray-400">${i18n.t('waitingRoom.bracket.match')} 3</span>
                      <i data-feather="clock" class="w-4 h-4 text-gray-400"></i>
                    </div>
                    <div class="space-y-2">
                      <div class="flex items-center justify-between p-2 bg-gray-700 rounded">
                        <div class="flex items-center">
                          <div class="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mr-2"></div>
                          <span class="text-white font-medium">NeonNinja</span>
                        </div>
                        <span class="text-gray-400">-</span>
                      </div>
                      <div class="flex items-center justify-between p-2 bg-gray-700 rounded">
                        <div class="flex items-center">
                          <div class="w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mr-2"></div>
                          <span class="text-white font-medium">AquaStorm</span>
                        </div>
                        <span class="text-gray-400">-</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Match 4 -->
                <div class="bracket-match">
                  <div class="bg-gray-800 rounded-lg p-4 border border-indigo-600">
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-sm text-gray-400">${i18n.t('waitingRoom.bracket.match')} 4</span>
                      <i data-feather="clock" class="w-4 h-4 text-gray-400"></i>
                    </div>
                    <div class="space-y-2">
                      <div class="flex items-center justify-between p-2 bg-gray-700 rounded">
                        <div class="flex items-center">
                          <div class="w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mr-2"></div>
                          <span class="text-white font-medium">PixelWarrior</span>
                        </div>
                        <span class="text-gray-400">-</span>
                      </div>
                      <div class="flex items-center justify-between p-2 bg-gray-700 rounded">
                        <div class="flex items-center">
                          <div class="w-6 h-6 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full mr-2"></div>
                          <span class="text-white font-medium">ShadowGamer</span>
                        </div>
                        <span class="text-gray-400">-</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Semi Finals -->
            <div class="bracket-round">
              <h4 class="text-lg font-medium text-indigo-300 mb-4 text-center">${i18n.t('waitingRoom.bracket.semiFinals')}</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 max-w-2xl mx-auto">
                <div class="bracket-match">
                  <div class="bg-gray-800 rounded-lg p-4 border border-indigo-600">
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-sm text-gray-400">${i18n.t('waitingRoom.bracket.semi')} 1</span>
                      <i data-feather="clock" class="w-4 h-4 text-gray-400"></i>
                    </div>
                    <div class="space-y-2">
                      <div class="flex items-center justify-between p-2 bg-gray-700 rounded opacity-50">
                        <span class="text-gray-400">${i18n.t('waitingRoom.bracket.tbd')}</span>
                        <span class="text-gray-400">-</span>
                      </div>
                      <div class="flex items-center justify-between p-2 bg-gray-700 rounded opacity-50">
                        <span class="text-gray-400">${i18n.t('waitingRoom.bracket.tbd')}</span>
                        <span class="text-gray-400">-</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bracket-match">
                  <div class="bg-gray-800 rounded-lg p-4 border border-indigo-600">
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-sm text-gray-400">${i18n.t('waitingRoom.bracket.semi')} 2</span>
                      <i data-feather="clock" class="w-4 h-4 text-gray-400"></i>
                    </div>
                    <div class="space-y-2">
                      <div class="flex items-center justify-between p-2 bg-gray-700 rounded opacity-50">
                        <span class="text-gray-400">${i18n.t('waitingRoom.bracket.tbd')}</span>
                        <span class="text-gray-400">-</span>
                      </div>
                      <div class="flex items-center justify-between p-2 bg-gray-700 rounded opacity-50">
                        <span class="text-gray-400">${i18n.t('waitingRoom.bracket.tbd')}</span>
                        <span class="text-gray-400">-</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Finals -->
            <div class="bracket-round">
              <h4 class="text-lg font-medium text-indigo-300 mb-4 text-center">${i18n.t('waitingRoom.bracket.finals')}</h4>
              <div class="max-w-md mx-auto mb-8">
                <div class="bracket-match">
                  <div class="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg p-4 border-2 border-yellow-400">
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-sm text-yellow-200 font-medium">${i18n.t('waitingRoom.bracket.grandFinal')}</span>
                      <i data-feather="trophy" class="w-4 h-4 text-yellow-300"></i>
                    </div>
                    <div class="space-y-2">
                      <div class="flex items-center justify-between p-2 bg-yellow-700 bg-opacity-30 rounded opacity-50">
                        <span class="text-yellow-200">${i18n.t('waitingRoom.bracket.tbd')}</span>
                        <span class="text-yellow-200">-</span>
                      </div>
                      <div class="flex items-center justify-between p-2 bg-yellow-700 bg-opacity-30 rounded opacity-50">
                        <span class="text-yellow-200">${i18n.t('waitingRoom.bracket.tbd')}</span>
                        <span class="text-yellow-200">-</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Players Status -->
        <div class="glass-effect p-6 rounded-xl">
          <div class="flex items-center justify-center mb-4">
            <i data-feather="users" class="w-6 h-6 text-indigo-400 mr-3"></i>
            <h4 class="text-xl font-medium text-indigo-300">${i18n.t('waitingRoom.players.title')}</h4>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div class="bg-gray-800 rounded-lg p-4">
              <div class="text-2xl font-bold text-green-400">8</div>
              <div class="text-gray-400 text-sm">${i18n.t('waitingRoom.players.joined')}</div>
            </div>
            <div class="bg-gray-800 rounded-lg p-4">
              <div class="text-2xl font-bold text-indigo-400">8</div>
              <div class="text-gray-400 text-sm">${i18n.t('waitingRoom.players.max')}</div>
            </div>
            <div class="bg-gray-800 rounded-lg p-4">
              <div class="text-2xl font-bold text-orange-400">5</div>
              <div class="text-gray-400 text-sm">${i18n.t('waitingRoom.players.ready')}</div>
            </div>
            <div class="bg-gray-800 rounded-lg p-4">
              <div class="text-2xl font-bold text-yellow-400">3</div>
              <div class="text-gray-400 text-sm">${i18n.t('waitingRoom.players.waiting')}</div>
            </div>
          </div>
          
          <div class="mt-6 text-center">
            <div class="bg-green-900 bg-opacity-50 border border-green-600 rounded-lg p-4">
              <div class="flex items-center justify-center">
                <i data-feather="check-circle" class="w-5 h-5 text-green-400 mr-2"></i>
                <span class="text-green-300 font-medium">${i18n.t('waitingRoom.status.registered')}</span>
              </div>
              <p class="text-green-200 text-sm mt-2">${i18n.t('waitingRoom.status.waiting')}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  },
  init: async (): Promise<void> => {
    i18n.ensureLocaleIntegrity();
    LanguageToggle.init();

    const backBtn = document.getElementById('back-btn') as HTMLButtonElement;

    // Back button navigation
    backBtn.addEventListener('click', () => {
      window.router.navigateTo('/tournament');
    });

    // Simulate some dynamic updates
    setTimeout(() => {
      const readyCount = document.querySelector('.text-orange-400') as HTMLDivElement;
      const waitingCount = document.querySelector('.text-yellow-400') as HTMLDivElement;
      
      if (readyCount && waitingCount) {
        readyCount.textContent = '6';
        waitingCount.textContent = '2';
      }
    }, 3000);

    // Simulate tournament starting
    setTimeout(() => {
      const statusSection = document.querySelector('.bg-green-900') as HTMLDivElement;
      if (statusSection) {
        statusSection.className = 'bg-blue-900 bg-opacity-50 border border-blue-600 rounded-lg p-4';
        statusSection.innerHTML = `
          <div class="flex items-center justify-center">
            <i data-feather="play" class="w-5 h-5 text-blue-400 mr-2"></i>
            <span class="text-blue-300 font-medium">${i18n.t('waitingRoom.status.starting')}</span>
          </div>
          <p class="text-blue-200 text-sm mt-2">${i18n.t('waitingRoom.status.startingSoon')}</p>
        `;
      }
    }, 8000);
  }
};

export default WaitingRoom;
