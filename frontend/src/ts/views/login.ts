import i18n from '../i18n.js';
import { authService, cacheService } from '../services/index.js';
import LanguageToggle from '../components/language-toggle.js';
import { LoginCredentials } from '../types/user.types.js';
import { LoginModule } from '../types/view-modules.types.js';

const Login: LoginModule = {
  component: async (): Promise<string> => {
    const baseURL = `${window.location.protocol}//${window.location.hostname}:3000`;
    
    return `
      <div class="max-w-md mx-auto game-bg rounded-xl p-8 my-8 relative">
        <div class="absolute top-4 right-4 z-10">
          ${LanguageToggle.component()}
        </div>
        
        <div class="text-center mb-8">
          <h2 class="text-3xl game-title mb-3">${i18n.t('login.title')}</h2>
          <p class="text-gray-400 text-sm">${i18n.t('login.subtitle')}</p>
        </div>
        
        <form id="login-form" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-indigo-300 mb-1">${i18n.t('label.email')}</label>
            <div class="relative">
              <input type="email" id="email" name="email" required 
                    class="game-input pl-12" placeholder="${i18n.t('placeholder.email')}">
              <i data-feather="mail" class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-400"></i>
              <p id="email-error" class="hidden text-xs text-red-400 mt-1"></p>
            </div>
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-indigo-300 mb-1">${i18n.t('label.password')}</label>
            <div class="relative">
              <input type="password" id="password" name="password" required 
                    class="game-input pl-12" placeholder="${i18n.t('placeholder.password')}">
              <i data-feather="lock" class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-400"></i>
              <p id="password-error" class="hidden text-xs text-red-400 mt-1"></p>
            </div>
          </div>
          
          <div class="mt-8">
            <button type="submit" class="w-full game-btn py-4 text-lg">
              ${i18n.t('login.button.login')}
              <i data-feather="arrow-right" class="inline ml-2 w-5 h-5"></i>
            </button>
          </div>
          
          <div class="relative flex py-5 items-center">
            <div class="game-divider"></div>
            <span class="flex-shrink mx-4 text-gray-400 text-sm">${i18n.t('login.orLoginWith')}</span>
            <div class="game-divider"></div>
          </div>
          
          <div>
            <a href="${baseURL}/auth/google/login" class="flex items-center justify-center w-full py-3 px-4 border border-indigo-800 rounded-md shadow-sm bg-gray-800 text-sm font-medium text-gray-200 hover:bg-gray-700 transition-all duration-200 hover:shadow-glow">
              <svg viewBox="0 0 24 24" width="20" height="20" class="mr-2 fill-current text-gray-900" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
              ${i18n.t('login.button.google')}
            </a>
          </div>
          
          <div id="login-error" class="error-message hidden text-center mt-4 py-2 px-3 bg-red-900/50 border border-red-700 rounded-md text-red-300"></div>
        </form>
        
        <div class="text-center mt-6">
          <p class="text-gray-400">
            ${i18n.t('login.noAccount')} 
            <a href="/register" data-link class="game-link">${i18n.t('button.register')}</a>
          </p>
        </div>
      </div>
    `;
  },
  init: (): void => {
    i18n.ensureLocaleIntegrity();
    LanguageToggle.init();
    const form = document.getElementById('login-form') as HTMLFormElement;
    
    const setAuthCookie = (token: string, expirationDays: number = 7): void => {
      const d = new Date();
      d.setTime(d.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
      const expires = "expires=" + d.toUTCString();
      document.cookie = `auth_token=${token}; ${expires}; path=/`;
    };
    
    const validateEmail = (email: string): boolean => {
      const emailInput = document.getElementById('email') as HTMLInputElement;
      const emailError = document.getElementById('email-error');
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!email) {
        if (emailError) {
          emailError.textContent = i18n.t('validation.email.required');
          emailError.classList.remove('hidden');
        }
        emailInput.classList.add('border-red-500');
        return false;
      } else if (!emailRegex.test(email)) {
        if (emailError) {
          emailError.textContent = i18n.t('validation.email.invalid');
          emailError.classList.remove('hidden');
        }
        emailInput.classList.add('border-red-500');
        return false;
      }
      
      if (emailError) {
        emailError.classList.add('hidden');
      }
      emailInput.classList.remove('border-red-500');
      return true;
    };
    
    const validatePassword = (password: string): boolean => {
      const passwordInput = document.getElementById('password') as HTMLInputElement;
      const passwordError = document.getElementById('password-error');
      
      if (!password) {
        if (passwordError) {
          passwordError.textContent = i18n.t('validation.password.required');
          passwordError.classList.remove('hidden');
        }
        passwordInput.classList.add('border-red-500');
        return false;
      } else if (password.length < 6) {
        if (passwordError) {
          passwordError.textContent = i18n.t('validation.password.tooShort');
          passwordError.classList.remove('hidden');
        }
        passwordInput.classList.add('border-red-500');
        return false;
      }
      
      if (passwordError) {
        passwordError.classList.add('hidden');
      }
      passwordInput.classList.remove('border-red-500');
      return true;
    };
    
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    
    emailInput.addEventListener('blur', () => {
      validateEmail(emailInput.value.trim().toLowerCase());
    });
    
    passwordInput.addEventListener('blur', () => {
      validatePassword(passwordInput.value);
    });
    
    emailInput.addEventListener('input', () => {
      const emailError = document.getElementById('email-error');
      if (emailError) {
        emailError.classList.add('hidden');
      }
      emailInput.classList.remove('border-red-500');
    });
    
    passwordInput.addEventListener('input', () => {
      const passwordError = document.getElementById('password-error');
      if (passwordError) {
        passwordError.classList.add('hidden');
      }
      passwordInput.classList.remove('border-red-500');
    });
    
    const showLoginError = (message: string): void => {
      const errorElement = document.getElementById('login-error');
      if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        
        errorElement.classList.add('animate-pulse');
        setTimeout(() => {
          errorElement.classList.remove('animate-pulse');
        }, 1000);
      }
    };
    
    form.addEventListener('submit', async (e: Event) => {
      e.preventDefault();
      
      const errorElement = document.getElementById('login-error');
      if (errorElement) {
        errorElement.classList.add('hidden');
      }
      
      const email = emailInput.value.trim().toLowerCase();
      const password = passwordInput.value;
      
      const isEmailValid = validateEmail(email);
      const isPasswordValid = validatePassword(password);
      
      if (!isEmailValid || !isPasswordValid) {
        showLoginError(i18n.t('login.error.validateFields'));
        return;
      }
      
      try {
        const loginBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (loginBtn) {
          loginBtn.disabled = true;
          loginBtn.innerHTML = `<span class="inline-flex items-center">${i18n.t('login.button.loggingIn')} <div class="ml-2 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div></span>`;
        }
        
        const response = await authService.login({ email: email, password });
        console.log('Login response:', response);
        
        if (response.data && response.data.requires2FA) {
          console.log('2FA required, redirecting to verification screen');
          localStorage.setItem('pendingUserId', response.data.userId || '');
          window.router.navigateTo('/verify-2fa');
        } else if (response.requires2FA) {
          console.log('2FA required (top-level), redirecting to verification screen');
          localStorage.setItem('pendingUserId', response.userId || '');
          window.router.navigateTo('/verify-2fa');
        } else if (response.token || (response.data && response.data.token)) {
          const token = response.token || (response.data && response.data.token);
          setAuthCookie(token);
          
          cacheService.startPing();
          
          window.router.navigateTo('/dashboard');
        } else {
          console.error('Invalid login response format:', response);
          throw new Error(i18n.t('error.generic'));
        }
        
      } catch (error: any) {
        let errorMessage = i18n.t('login.error.generic');
        
        if (error.response) {
          const statusCode = error.response.status;
          
          switch (statusCode) {
            case 401:
              errorMessage = i18n.t('login.error.invalidCredentials');
              break;
            case 403:
              errorMessage = i18n.t('login.error.accountLocked');
              break;
            case 404:
              errorMessage = i18n.t('login.error.userNotFound');
              break;
            case 429:
              errorMessage = i18n.t('login.error.tooManyAttempts');
              break;
            default:
              errorMessage = error.response.data?.message || i18n.t('login.error.generic');
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        showLoginError(errorMessage);
        
        const loginBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (loginBtn) {
          loginBtn.disabled = false;
          loginBtn.innerHTML = `${i18n.t('login.button.login')} <i data-feather="arrow-right" class="inline ml-2 w-5 h-5"></i>`;
        }
        if (window.feather) {
          window.feather.replace();
        }
      }
    });
    
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    
    if (token) {
      setAuthCookie(token);
      
      cacheService.startPing();
      
      window.history.replaceState({}, document.title, '/dashboard');
      window.router.navigateTo('/dashboard');
      return;
    }
    
    const error = params.get('error');
    if (error) {
      let errorMessage = i18n.t(`login.error.${error}`);
      
      if (errorMessage === `login.error.${error}`) {
        errorMessage = i18n.t('login.error.generic');
      }
      
      showLoginError(errorMessage);
    }
    
    if (window.feather) {
      window.feather.replace();
    }
  }
};

export default Login; 