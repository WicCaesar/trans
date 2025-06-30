import i18n from '../i18n.js';
import { authService, userService } from '../services/index.js';
import LanguageToggle from '../components/language-toggle.js';
import { TournamentModule } from '../types/view-modules.types.js';

const Tournament: TournamentModule = {
  component: async (): Promise<string> => {
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
            <i data-feather="trophy" class="w-12 h-12 text-yellow-400 mr-4"></i>
            <h1 class="text-4xl font-bold text-indigo-300 neon-text">${i18n.t('tournament.title')}</h1>
          </div>
          <p class="text-gray-400 text-lg">${i18n.t('tournament.subtitle')}</p>
        </div>

        <!-- Tournament Status Section -->
        <div class="glass-effect p-6 rounded-xl gradient-border mb-8">
          <div class="flex items-center justify-center mb-6">
            <div class="relative">
              <div id="tournament-marquee" class="bg-gray-900 rounded-lg px-6 py-3 border-2 border-indigo-600 min-w-96">
                <div class="flex items-center justify-center">
                  <div id="tournament-indicator" class="w-3 h-3 rounded-full bg-red-500 animate-pulse mr-3"></div>
                  <span id="tournament-status" class="text-lg font-medium text-gray-300">
                    ${i18n.t('tournament.status.none')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Tournament Name (only visible when tournament is active) -->
          <div id="tournament-name-section" class="hidden text-center mb-6">
            <h3 class="text-2xl font-bold text-indigo-300 mb-2">${i18n.t('tournament.current')}</h3>
            <div class="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg px-6 py-4 mx-auto max-w-md">
              <span id="tournament-name" class="text-xl font-bold text-white">🏆 Copa Galactic</span>
            </div>
          </div>

          <!-- Registration Timer (only visible when tournament is active) -->
          <div id="registration-timer-section" class="hidden text-center mb-6">
            <h4 class="text-lg text-indigo-300 mb-3">${i18n.t('tournament.registration.timeLeft')}</h4>
            <div class="bg-gray-900 rounded-lg px-8 py-4 mx-auto max-w-xs border border-orange-500">
              <div id="timer-display" class="text-3xl font-mono font-bold text-orange-400">
                05:00
              </div>
            </div>
            <!--<p class="text-gray-400 text-sm mt-2">${i18n.t('tournament.registration.info')}</p>-->
          </div>

          <!-- Join Tournament Button (only visible when tournament is active) -->
          <div id="join-tournament-section" class="hidden text-center">
            <button id="join-tournament-btn" class="game-btn py-3 px-8 text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
              <i data-feather="user-plus" class="w-5 h-5 mr-2"></i>${i18n.t('tournament.join')}
            </button>
            <!--<p class="text-gray-400 text-sm mt-3">${i18n.t('tournament.join.info')}</p>-->
          </div>

          <!-- No Tournament Message (visible when no tournament) -->
          <div id="no-tournament-section" class="text-center">
            <div class="bg-gray-800 rounded-lg p-6 mx-auto max-w-md">
              <i data-feather="calendar" class="w-12 h-12 text-gray-500 mx-auto mb-4"></i>
              <p class="text-gray-400 mb-4">${i18n.t('tournament.none.description')}</p>
              <button id="simulate-tournament-btn" class="game-btn py-2 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                ${i18n.t('tournament.simulate')}
              </button>
            </div>
          </div>
        </div>

        <!-- Tournament Rules -->
        <div class="glass-effect p-6 rounded-xl">
          <h4 class="text-xl font-medium text-indigo-300 mb-4 flex items-center">
            <i data-feather="info" class="w-6 h-6 mr-3"></i>
            ${i18n.t('tournament.rules.title')}
          </h4>
          <ul class="text-gray-400 space-y-2">
            <li class="flex items-start">
              <i data-feather="check" class="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0"></i>
              ${i18n.t('tournament.rules.1')}
            </li>
            <li class="flex items-start">
              <i data-feather="check" class="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0"></i>
              ${i18n.t('tournament.rules.2')}
            </li>
            <li class="flex items-start">
              <i data-feather="check" class="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0"></i>
              ${i18n.t('tournament.rules.3')}
            </li>
            <li class="flex items-start">
              <i data-feather="check" class="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0"></i>
              ${i18n.t('tournament.rules.4')}
            </li>
          </ul>
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

    // Tournament names database with emojis and adjectives
    const tournamentNames = [
      '🏆 Copa Galactic',
      '⚡ Thunder Championship',
      '🌟 Stellar Tournament',
      '🔥 Inferno Cup',
      '❄️ Frost Masters',
      '🌈 Rainbow Classic',
      '⚔️ Battle Royale',
      '🎯 Precision League',
      '🚀 Rocket Tournament',
      '💎 Diamond Series',
      '🌊 Wave Cup',
      '🎪 Circus Championship',
      '🦋 Butterfly Open',
      '🌙 Lunar Masters',
      '☄️ Comet Classic'
    ];

    let countdownInterval: number | null = null;
    let timeLeft = 300; // 5 minutes in seconds

    const backBtn = document.getElementById('back-btn') as HTMLButtonElement;
    const tournamentIndicator = document.getElementById('tournament-indicator') as HTMLDivElement;
    const tournamentStatus = document.getElementById('tournament-status') as HTMLSpanElement;
    const tournamentNameSection = document.getElementById('tournament-name-section') as HTMLDivElement;
    const tournamentName = document.getElementById('tournament-name') as HTMLSpanElement;
    const registrationTimerSection = document.getElementById('registration-timer-section') as HTMLDivElement;
    const joinTournamentSection = document.getElementById('join-tournament-section') as HTMLDivElement;
    const noTournamentSection = document.getElementById('no-tournament-section') as HTMLDivElement;
    const timerDisplay = document.getElementById('timer-display') as HTMLDivElement;
    const simulateTournamentBtn = document.getElementById('simulate-tournament-btn') as HTMLButtonElement;
    const joinTournamentBtn = document.getElementById('join-tournament-btn') as HTMLButtonElement;

    // Back button navigation
    backBtn.addEventListener('click', () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
      window.router.navigateTo('/dashboard');
    });

    // Format time for display
    const formatTime = (seconds: number): string => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Start tournament simulation
    const startTournament = () => {
      // Select random tournament name
      const randomName = tournamentNames[Math.floor(Math.random() * tournamentNames.length)];
      
      // Update status
      tournamentIndicator.className = 'w-3 h-3 rounded-full bg-green-500 animate-pulse mr-3';
      tournamentStatus.textContent = i18n.t('tournament.status.active');
      tournamentName.textContent = randomName;
      
      // Show tournament sections
      tournamentNameSection.classList.remove('hidden');
      registrationTimerSection.classList.remove('hidden');
      joinTournamentSection.classList.remove('hidden');
      noTournamentSection.classList.add('hidden');
      
      // Reset timer
      timeLeft = 300;
      timerDisplay.textContent = formatTime(timeLeft);
      
      // Start countdown
      countdownInterval = window.setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = formatTime(timeLeft);
        
        if (timeLeft <= 0) {
          clearInterval(countdownInterval!);
          // Tournament registration ended
          tournamentIndicator.className = 'w-3 h-3 rounded-full bg-red-500 animate-pulse mr-3';
          tournamentStatus.textContent = i18n.t('tournament.status.ended');
          joinTournamentBtn.disabled = true;
          joinTournamentBtn.textContent = i18n.t('tournament.registration.ended');
          joinTournamentBtn.className = 'game-btn py-3 px-8 text-lg bg-gray-600 cursor-not-allowed';
          timerDisplay.textContent = '00:00';
        }
      }, 1000);
    };

    // Simulate tournament button
    simulateTournamentBtn.addEventListener('click', () => {
      startTournament();
    });

    // Join tournament button
    joinTournamentBtn.addEventListener('click', () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
      // Get current tournament name for passing to waiting room
      const currentTournamentName = tournamentName.textContent || '🏆 Tournament';
      // Store tournament name in sessionStorage
      sessionStorage.setItem('currentTournament', currentTournamentName);
      window.router.navigateTo('/waiting-room');
    });

    // Check if there's an ongoing tournament (simulate 20% chance)
    if (Math.random() < 0.2) {
      setTimeout(() => {
        startTournament();
      }, 1000);
    }
  }
};

export default Tournament;
