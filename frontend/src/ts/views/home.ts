import i18n from '../i18n';
import LanguageToggle from '../components/language-toggle';
import { HomeModule } from '../types/view-modules.types.js';

const Home: HomeModule = {
  component: async (): Promise<string> => {
    return `
      <div class="flex flex-col items-center justify-center min-h-[80vh] relative">
        <div class="absolute top-4 right-4">
          ${LanguageToggle.component()}
        </div>
        
        <div class="glass-effect p-12 text-center max-w-3xl card-hover gradient-border">
          <div class="floating mb-8 relative z-10">
            <h1 class="text-5xl font-bold game-title mb-6">${i18n.t('app.name')}</h1>
            <p class="text-xl text-indigo-300 neon-text">${i18n.t('app.welcome')}</p>
          </div>
          
          <div class="py-10 relative z-10">
            <p class="text-gray-400 mb-12 text-lg main-description">${i18n.t('app.description')}</p>
            
            <div class="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-10 justify-center mb-8">
              <a href="/login" data-link class="game-btn home-btn py-4 px-8 text-lg w-full sm:w-auto">
                <i data-feather="log-in" class="w-6 h-6 mr-3 inline-flex"></i>
                ${i18n.t('button.login')}
              </a>
              <a href="/register" data-link class="game-btn home-btn py-4 px-8 text-lg w-full sm:w-auto">
                <i data-feather="user-plus" class="w-6 h-6 mr-3 inline-flex"></i>
                ${i18n.t('button.register')}
              </a>
            </div>
            
            <div class="text-center">
              <p class="text-gray-500 mb-4 text-sm">${i18n.t('app.try_offline')}</p>
              <a href="/offline-pong" data-link class="game-btn py-3 px-6 bg-purple-700 hover:bg-purple-600 inline-flex items-center">
                <i data-feather="monitor" class="w-5 h-5 mr-2"></i>
                ${i18n.t('offline.title')}
              </a>
            </div>
          </div>
          
          <div class="mt-14 relative z-10">
            <div class="grid grid-cols-2 gap-6 text-center">
              <div class="game-section p-5">
                <i data-feather="users" class="w-10 h-10 mx-auto mb-3 text-indigo-400 feature-icon"></i>
                <p class="text-gray-300 feature-text">${i18n.t('feature.multiplayer')}</p>
              </div>
              <div class="game-section p-5">
                <i data-feather="shield" class="w-10 h-10 mx-auto mb-3 text-indigo-400 feature-icon"></i>
                <p class="text-gray-300 feature-text">${i18n.t('feature.secure')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },
  init: (): void => {
    i18n.ensureLocaleIntegrity();
    LanguageToggle.init();
    if (window.feather) {
      window.feather.replace();
    }
  }
};

export default Home; 