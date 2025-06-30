import i18n from '../i18n.js';
import { authService, userService } from '../services/index.js';
import LanguageToggle from '../components/language-toggle.js';
import { SettingsModule } from '../types/view-modules.types.js';

const Settings: SettingsModule = {
  component: async (): Promise<string> => {
    return `
      <div class="game-bg p-6 my-8 relative card-hover">
        <div class="flex justify-between items-center mb-8">
          <div class="flex items-center">
            <button id="back-to-dashboard" class="game-btn flex items-center py-2 px-3 mr-4 bg-gray-800 hover:bg-gray-700">
              <i data-feather="arrow-left" class="w-5 h-5"></i>
            </button>
            <h2 class="text-2xl font-medium text-indigo-300 neon-text">${i18n.t('settings.title')}</h2>
          </div>
          <div class="flex items-center gap-4">
            <div class="language-toggle-container">
              ${LanguageToggle.component()}
            </div>
          </div>
        </div>
        
        <div class="glass-effect p-6 rounded-xl gradient-border mb-8">
          <div class="flex items-center mb-6">
            <i data-feather="user" class="w-8 h-8 text-indigo-400 mr-3"></i>
            <h4 class="text-xl font-medium text-indigo-300">${i18n.t('settings.profile')}</h4>
          </div>
          
          <form id="profile-form" class="space-y-6">
            <div class="space-y-2">
              <label for="nickname" class="block text-gray-300">${i18n.t('settings.nickname')}</label>
              <input 
                type="text" 
                id="nickname" 
                class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 text-gray-200"
                placeholder="${i18n.t('settings.nickname_placeholder')}"
              >
            </div>
            
            <div class="space-y-2">
              <label for="email" class="block text-gray-300">${i18n.t('settings.email')}</label>
              <input 
                type="email" 
                id="email" 
                class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 text-gray-200"
                placeholder="${i18n.t('settings.email_placeholder')}"
              >
            </div>
            
            <div class="space-y-2">
              <label for="password" class="block text-gray-300">${i18n.t('settings.password')}</label>
              <input 
                type="password" 
                id="password" 
                class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 text-gray-200"
                placeholder="${i18n.t('settings.password_placeholder')}"
              >
              <p class="text-gray-400 text-sm mt-1">${i18n.t('settings.password_info')}</p>
            </div>
            
            <div class="space-y-2">
              <label for="profile-image" class="block text-gray-300">${i18n.t('settings.profile_image')}</label>
              <input 
                type="url" 
                id="profile-image" 
                class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 text-gray-200"
                placeholder="${i18n.t('settings.profile_image_placeholder')}"
              >
              <p class="text-gray-400 text-sm mt-1">${i18n.t('settings.profile_image_info')}</p>
            </div>
            
            <div class="pt-4">
              <button type="submit" class="game-btn py-2 px-6 w-full">
                ${i18n.t('button.save')}
              </button>
            </div>
          </form>
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
      window.location.href = '/login';
      return;
    }
    
    if (window.feather) {
      window.feather.replace();
    }
    
    const backButton = document.getElementById('back-to-dashboard');
    if (backButton) {
      backButton.addEventListener('click', () => {
        window.location.href = '/dashboard';
      });
    }
    
    try {
      const userProfile = await userService.getUserProfile() as any;
      
      const nicknameInput = document.getElementById('nickname') as HTMLInputElement;
      const emailInput = document.getElementById('email') as HTMLInputElement;
      const profileImageInput = document.getElementById('profile-image') as HTMLInputElement;
      
      if (nicknameInput) {
        nicknameInput.value = userProfile.nickName || '';
      }
      
      if (emailInput) {
        emailInput.value = userProfile.email || '';
      }
      
      if (profileImageInput) {
        profileImageInput.value = userProfile.foto || '';
      }
      
      const profileForm = document.getElementById('profile-form');
      if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          
          const nickname = (document.getElementById('nickname') as HTMLInputElement).value.trim();
          const email = (document.getElementById('email') as HTMLInputElement).value.trim();
          const password = (document.getElementById('password') as HTMLInputElement).value.trim();
          
          if (!nickname) {
            alert(i18n.t('settings.error_nickname'));
            return;
          }
          
          if (!email) {
            alert(i18n.t('settings.error_email'));
            return;
          }
          
          const updateData: Record<string, string> = {
            username: nickname,
            email: email
          };
          
          if (password) {
            updateData.password = password;
          }
          
          const profileImage = (document.getElementById('profile-image') as HTMLInputElement).value.trim();
          if (profileImage) {
            updateData.foto = profileImage;
          }
          
          try {
            const updateResponse = await authService.updateProfile(updateData);
            
            alert(i18n.t('settings.success'));
          } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            alert(i18n.t('settings.error_update'));
          }
        });
      }
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
      alert(i18n.t('settings.error_load'));
    }
  }
};

export default Settings; 