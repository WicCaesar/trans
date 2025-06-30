import i18n from '../i18n.js';
import { authService, cacheService } from '../services/index.js';
import LanguageToggle from '../components/language-toggle.js';
import Router from '../router.js';
import { TwoFactorModule } from '../types/view-modules.types.js';

declare global {
  interface Window {
    router: Router;
  }
}

const TwoFactor: TwoFactorModule = {
  component: async (): Promise<string> => {
    return `
      <div class="max-w-md mx-auto game-bg rounded-xl p-8 my-8 relative">
        <div class="absolute top-4 right-4 z-10">
          ${LanguageToggle.component()}
        </div>
      
        <div class="text-center mb-8">
          <h2 class="text-3xl game-title mb-3">${i18n.t('twoFactor.title')}</h2>
          <p class="text-gray-400 text-sm">${i18n.t('twoFactor.description')}</p>
        </div>
        
        <div class="text-center mb-6 game-section p-5">
          <i data-feather="shield" class="h-12 w-12 mx-auto mb-4 text-indigo-400"></i>
          <p class="text-gray-300">
            ${i18n.t('twoFactor.info')}
            <br>${i18n.t('twoFactor.instruction')}
          </p>
        </div>
        
        <form id="two-factor-form" class="space-y-6">
          <div>
            <label for="code" class="block text-sm font-medium text-indigo-300 mb-1">${i18n.t('label.verificationCode')}</label>
            <div class="relative">
              <input type="text" id="code" name="code" required 
                    class="game-input text-center text-2xl tracking-widest"
                    placeholder="${i18n.t('placeholder.verificationCode')}" minlength="6" maxlength="6">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i data-feather="key" class="h-5 w-5 text-indigo-400"></i>
              </div>
            </div>
          </div>
          
          <div class="mt-8">
            <button type="submit" class="w-full game-btn py-4 text-lg">
              ${i18n.t('button.verify')}
              <i data-feather="arrow-right" class="inline ml-2 w-5 h-5"></i>
            </button>
          </div>
          
          <div id="verification-error" class="error-message hidden text-center"></div>
        </form>
        
        <div class="text-center mt-6">
          <p class="text-gray-400">
            ${i18n.t('twoFactor.noCode')}
            <button id="resend-code" class="game-link">${i18n.t('button.resend')}</button>
          </p>
        </div>
      </div>
    `;
  },
  init: (): void => {
    // Verifica integridade do locale na inicialização da view
    i18n.ensureLocaleIntegrity();
    LanguageToggle.init();
    const form = document.getElementById('two-factor-form') as HTMLFormElement;
    const resendButton = document.getElementById('resend-code') as HTMLButtonElement;
    
    const pendingUserId = localStorage.getItem('pendingUserId');
    if (!pendingUserId) {
      window.router.navigateTo('/login');
      return;
    }
      
    const setAuthCookie = (token: string, expirationDays = 7): void => {
      const d = new Date();
      d.setTime(d.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
      const expires = "expires=" + d.toUTCString();
      document.cookie = `auth_token=${token}; ${expires}; path=/`;
    };
    
    const codeInput = document.getElementById('code') as HTMLInputElement;
    codeInput.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      target.value = target.value.replace(/[^0-9]/g, '').slice(0, 6);
    });
    
    form.addEventListener('submit', async (e: Event) => {
      e.preventDefault();
      
      const verificationError = document.getElementById('verification-error') as HTMLDivElement;
      verificationError.classList.add('hidden');
      
      const code = (document.getElementById('code') as HTMLInputElement).value.trim();
      
      if (!code || code.length !== 6) {
        verificationError.textContent = i18n.t('twoFactor.error.invalid');
        verificationError.classList.remove('hidden');
        return;
      }
      
      try {
        const verifyBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        verifyBtn.disabled = true;
        verifyBtn.innerHTML = `<span class="inline-flex items-center">${i18n.t('twoFactor.button.verifying')} <div class="ml-2 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div></span>`;
        
        const response = await authService.verify2FA(pendingUserId, code);
        
        if (response.token) {
          setAuthCookie(response.token);
          localStorage.removeItem('pendingUserId');
          
          cacheService.startPing();
          
          window.router.navigateTo('/dashboard');
        } else {
          throw new Error(i18n.t('error.generic'));
        }
        
      } catch (error) {
        verificationError.textContent = error instanceof Error ? error.message : i18n.t('error.generic');
        verificationError.classList.remove('hidden');
        
        const verifyBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        verifyBtn.disabled = false;
        verifyBtn.innerHTML = `${i18n.t('button.verify')} <i data-feather="arrow-right" class="inline ml-2 w-5 h-5"></i>`;
        if (window.feather) {
          window.feather.replace();
        }
      }
    });

    resendButton.addEventListener('click', async () => {
      try {
        resendButton.disabled = true;
        resendButton.innerHTML = `<span class="inline-flex items-center">${i18n.t('button.submit')} <div class="ml-2 animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-indigo-400"></div></span>`;
        
        await authService.login({ email: '', password: '', twoFactorCode: pendingUserId });
        
        const verificationError = document.getElementById('verification-error') as HTMLDivElement;
        verificationError.textContent = i18n.t('twoFactor.newCodeSent');
        verificationError.classList.remove('error-message');
        verificationError.classList.add('success-message');
        verificationError.classList.remove('hidden');
        
        setTimeout(() => {
          resendButton.disabled = false;
          resendButton.textContent = i18n.t('button.resend');
          
          setTimeout(() => {
            verificationError.classList.add('hidden');
            verificationError.classList.add('error-message');
            verificationError.classList.remove('success-message');
          }, 3000);
        }, 1000);
        
      } catch (error) {
        const verificationError = document.getElementById('verification-error') as HTMLDivElement;
        verificationError.textContent = error instanceof Error ? error.message : i18n.t('error.generic');
        verificationError.classList.remove('hidden');
        
        resendButton.disabled = false;
        resendButton.textContent = i18n.t('button.resend');
      }
    });
    
    if (window.feather) {
      window.feather.replace();
    }
  }
};

export default TwoFactor; 