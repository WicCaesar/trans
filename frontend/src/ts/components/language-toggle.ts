import i18n from '../i18n';
import { LanguageToggleModule } from '../types/component.types.js';

const LanguageToggle: LanguageToggleModule = {
  component: (): string => {
    const currentLocale = i18n.getLocale();
    const localeName = currentLocale === 'pt-BR' ? i18n.t('language.en') : i18n.t('language.pt');
        
    return `
      <div class="language-toggle z-10">
        <button id="language-toggle-btn" class="text-sm px-3 py-2 bg-gray-900 hover:bg-gray-800 text-indigo-300 hover:text-indigo-200 rounded-lg flex items-center transition-all duration-300 border border-indigo-900 hover:border-indigo-700 hover:shadow-glow" title="${i18n.t('language.switch')}">
          <span class="flag-icon mr-2">${currentLocale === 'pt-BR' ? '🇺🇸' : '🇧🇷'}</span>
          <span class="language-name">${localeName}</span>
        </button>
      </div>
    `;
  },
  
  init: (): void => {
    const initializeToggle = () => {
      const toggleBtns = document.querySelectorAll('#language-toggle-btn');
            
      toggleBtns.forEach(toggleBtn => {
        if (toggleBtn) {
          const newBtn = toggleBtn.cloneNode(true);
          toggleBtn.parentNode?.replaceChild(newBtn, toggleBtn);
          
          newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Language toggle button clicked, current locale:', i18n.getLocale());
            const success = i18n.toggleLocale();
            console.log('Toggle locale result:', success, 'new locale:', i18n.getLocale());
          });
        }
      });
    };

    document.addEventListener('localeChanged', () => {
      setTimeout(() => {
        const toggleBtns = document.querySelectorAll('#language-toggle-btn');
        const currentLocale = i18n.getLocale();
        const localeName = currentLocale === 'pt-BR' ? i18n.t('language.en') : i18n.t('language.pt');
        
        toggleBtns.forEach(btn => {
          const flagIcon = btn.querySelector('.flag-icon');
          const languageName = btn.querySelector('.language-name');
          
          if (flagIcon) {
            flagIcon.textContent = currentLocale === 'pt-BR' ? '🇺🇸' : '🇧🇷';
          }
          
          if (languageName) {
            languageName.textContent = localeName;
          }
        });
      }, 100);
    });

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeToggle);
    } else {
      setTimeout(initializeToggle, 50);
    }
  }
};

export default LanguageToggle; 