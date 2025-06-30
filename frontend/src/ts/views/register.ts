import i18n from '../i18n.js';
import { authService } from '../services/index.js';
import LanguageToggle from '../components/language-toggle.js';
import { RegisterModule } from '../types/view-modules.types.js';

const Register: RegisterModule = {
  component: async (): Promise<string> => {
    return `
      <div class="max-w-md mx-auto game-bg rounded-xl p-8 my-8 relative">
        <div class="absolute top-4 right-4 z-10">
          ${LanguageToggle.component()}
        </div>
        
        <div class="text-center mb-8">
          <h2 class="text-3xl game-title mb-3">${i18n.t('register.title')}</h2>
          <p class="text-gray-400 text-sm">${i18n.t('register.subtitle')}</p>
        </div>
        
        <form id="register-form" class="space-y-6">
          <div>
            <label for="username" class="block text-sm font-medium text-indigo-300 mb-1">${i18n.t('label.username')}</label>
            <div class="relative">
              <input type="text" id="username" name="username" required 
                    class="game-input pl-12" placeholder="${i18n.t('placeholder.username')}">
              <i data-feather="user" class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-400"></i>
              <p id="username-error" class="hidden text-xs text-red-400 mt-1"></p>
            </div>
          </div>
          
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
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-indigo-300 mb-1">${i18n.t('label.confirmPassword')}</label>
            <div class="relative">
              <input type="password" id="confirmPassword" name="confirmPassword" required 
                    class="game-input pl-12" placeholder="${i18n.t('placeholder.confirmPassword')}">
              <i data-feather="shield" class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-400"></i>
              <p id="confirmPassword-error" class="hidden text-xs text-red-400 mt-1"></p>
            </div>
          </div>
          
          <div class="mt-4">
            <label class="flex items-center cursor-pointer">
              <div class="relative">
                <input type="checkbox" id="enable2fa" class="sr-only">
                <div class="block bg-gray-600 w-14 h-8 rounded-full"></div>
                <div class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
              </div>
              <div class="ml-3 text-indigo-300 text-sm font-medium">
                ${i18n.t('register.enable2fa')}
                <i data-feather="shield" class="inline ml-1 w-4 h-4 text-indigo-400"></i>
              </div>
            </label>
          </div>
          
          <div class="mt-8">
            <button type="submit" class="w-full game-btn py-4 text-lg">
              ${i18n.t('button.register')}
              <i data-feather="arrow-right" class="inline ml-2 w-5 h-5"></i>
            </button>
          </div>
          
          <div id="register-error" class="error-message hidden text-center mt-4 py-2 px-3 bg-red-900/50 border border-red-700 rounded-md text-red-300"></div>
          <div id="register-success" class="success-message hidden text-center mt-4 py-2 px-3 bg-green-900/50 border border-green-700 rounded-md text-green-300"></div>
        </form>
        
        <div class="text-center mt-6">
          <p class="text-gray-400">
            ${i18n.t('register.haveAccount')} 
            <a href="/login" data-link class="game-link">${i18n.t('button.login')}</a>
          </p>
        </div>
      </div>
    `;
  },
  init: (): void => {
    i18n.ensureLocaleIntegrity();
    LanguageToggle.init();
    const form = document.getElementById('register-form') as HTMLFormElement;
    
    const enable2faCheckbox = document.getElementById('enable2fa') as HTMLInputElement;
    if (enable2faCheckbox) {
      enable2faCheckbox.addEventListener('change', function() {
        const dot = this.parentElement?.querySelector('.dot');
        if (dot) {
          if (this.checked) {
            dot.classList.add('transform', 'translate-x-6');
          } else {
            dot.classList.remove('transform', 'translate-x-6');
          }
        }
      });
    }
    
    const usernameInput = document.getElementById('username') as HTMLInputElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement;
    
    const validateUsername = (username: string): boolean => {
      const usernameError = document.getElementById('username-error');
      
      if (!username) {
        if (usernameError) {
          usernameError.textContent = i18n.t('validation.username.required');
          usernameError.classList.remove('hidden');
        }
        usernameInput.classList.add('border-red-500');
        return false;
      } else if (username.length < 3) {
        if (usernameError) {
          usernameError.textContent = i18n.t('validation.username.tooShort');
          usernameError.classList.remove('hidden');
        }
        usernameInput.classList.add('border-red-500');
        return false;
      }
      
      if (usernameError) {
        usernameError.classList.add('hidden');
      }
      usernameInput.classList.remove('border-red-500');
      return true;
    };
    
    const validateEmail = (email: string): boolean => {
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
    
    const validateConfirmPassword = (confirmPassword: string, password: string): boolean => {
      const confirmPasswordError = document.getElementById('confirmPassword-error');
      
      if (!confirmPassword) {
        if (confirmPasswordError) {
          confirmPasswordError.textContent = i18n.t('validation.confirmPassword.required');
          confirmPasswordError.classList.remove('hidden');
        }
        confirmPasswordInput.classList.add('border-red-500');
        return false;
      } else if (confirmPassword !== password) {
        if (confirmPasswordError) {
          confirmPasswordError.textContent = i18n.t('validation.confirmPassword.notMatch');
          confirmPasswordError.classList.remove('hidden');
        }
        confirmPasswordInput.classList.add('border-red-500');
        return false;
      }
      
      if (confirmPasswordError) {
        confirmPasswordError.classList.add('hidden');
      }
      confirmPasswordInput.classList.remove('border-red-500');
      return true;
    };
    
    usernameInput.addEventListener('blur', () => {
      validateUsername(usernameInput.value.trim());
    });
    
    emailInput.addEventListener('blur', () => {
      validateEmail(emailInput.value.trim().toLowerCase());
    });
    
    passwordInput.addEventListener('blur', () => {
      validatePassword(passwordInput.value);
      if (confirmPasswordInput.value) {
        validateConfirmPassword(confirmPasswordInput.value, passwordInput.value);
      }
    });
    
    confirmPasswordInput.addEventListener('blur', () => {
      validateConfirmPassword(confirmPasswordInput.value, passwordInput.value);
    });
    
    usernameInput.addEventListener('input', () => {
      const usernameError = document.getElementById('username-error');
      if (usernameError) {
        usernameError.classList.add('hidden');
      }
      usernameInput.classList.remove('border-red-500');
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
    
    confirmPasswordInput.addEventListener('input', () => {
      const confirmPasswordError = document.getElementById('confirmPassword-error');
      if (confirmPasswordError) {
        confirmPasswordError.classList.add('hidden');
      }
      confirmPasswordInput.classList.remove('border-red-500');
    });
    
    const showRegisterError = (message: string): void => {
      const errorElement = document.getElementById('register-error');
      if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        
        errorElement.classList.add('animate-pulse');
        setTimeout(() => {
          errorElement.classList.remove('animate-pulse');
        }, 1000);
      }
    };
    
    const showRegisterSuccess = (message: string): void => {
      const successElement = document.getElementById('register-success');
      if (successElement) {
        successElement.textContent = message;
        successElement.classList.remove('hidden');
        
        successElement.classList.add('animate-pulse');
        setTimeout(() => {
          successElement.classList.remove('animate-pulse');
        }, 1000);
      }
    };
    
    form.addEventListener('submit', async (e: Event) => {
      e.preventDefault();
      
      document.querySelectorAll('.error-message').forEach(el => {
        el.classList.add('hidden');
      });
      
      const enable2faInput = document.getElementById('enable2fa') as HTMLInputElement;
      
      const username = usernameInput.value.trim();
      const email = emailInput.value.trim().toLowerCase();
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;
      const enable2fa = enable2faInput ? enable2faInput.checked : false;
      
      const isUsernameValid = validateUsername(username);
      const isEmailValid = validateEmail(email);
      const isPasswordValid = validatePassword(password);
      const isConfirmPasswordValid = validateConfirmPassword(confirmPassword, password);
      
      if (!isUsernameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
        showRegisterError(i18n.t('register.error.validateFields'));
        return;
      }
      
      try {
        const userData = {
          username: username,
          email: email,
          password: password,
          confirmPassword: confirmPassword,
          twoFactorEnabled: enable2fa
        };
        
        const registerBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        registerBtn.disabled = true;
        registerBtn.innerHTML = `<span class="inline-flex items-center">${i18n.t('button.submit')} <div class="ml-2 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div></span>`;
        
        const response = await authService.register(userData);
        
        showRegisterSuccess(i18n.t('register.success'));
        
        setTimeout(() => {
          window.router.navigateTo('/login');
        }, 2000);
        
      } catch (error: any) {
        let errorMessage = i18n.t('error.generic');
        
        if (error.response) {
          const statusCode = error.response.status;
          
          switch (statusCode) {
            case 400:
              errorMessage = error.response.data?.message || i18n.t('register.error.invalidData');
              break;
            case 409:
              errorMessage = i18n.t('register.error.userExists');
              break;
            case 422:
              errorMessage = i18n.t('register.error.validationFailed');
              break;
            default:
              errorMessage = error.response.data?.message || i18n.t('error.generic');
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        showRegisterError(errorMessage);
        
        const registerBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        registerBtn.disabled = false;
        registerBtn.innerHTML = `${i18n.t('button.register')} <i data-feather="arrow-right" class="inline ml-2 w-5 h-5"></i>`;
        if (window.feather) {
          window.feather.replace();
        }
      }
    });
    
    if (window.feather) {
      window.feather.replace();
    }
  }
};

export default Register; 