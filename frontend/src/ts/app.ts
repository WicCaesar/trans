import Router from './router.js';
import i18n from './i18n.js';
import Home from './views/home.js';
import Register from './views/register.js';
import Login from './views/login.js';
import TwoFactor from './views/two-factor.js';
import Dashboard from './views/dashboard.js';
import Settings from './views/settings.js';
import Pong from './views/pong.js';
import OfflinePong from './views/offline-pong.js';
import Tournament from './views/tournament.js';
import WaitingRoom from './views/waiting-room.js';
import { Route } from './types/index.js';

declare global {
  interface Window {
    router: Router;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.remove();
  }

  i18n.ensureLocaleIntegrity();
  i18n.forceReinitialize();

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

  const checkAuth = (path: string): boolean => {
    const protectedRoutes = ['/dashboard', '/settings', '/tournament', '/waiting-room'];
    
    if (protectedRoutes.includes(path)) {
      const token = getAuthToken();
      if (!token) {
        window.router.navigateTo('/login');
        return false;
      }
    }
    
    return true;
  };

  const routes: Route[] = [
    { path: '/', component: Home.component, init: Home.init },
    { path: '/register', component: Register.component, init: Register.init },
    { path: '/login', component: Login.component, init: Login.init },
    { path: '/verify-2fa', component: TwoFactor.component, init: TwoFactor.init },
    { path: '/dashboard', component: Dashboard.component, init: Dashboard.init },
    { path: '/settings', component: Settings.component, init: Settings.init },
    { path: '/pong/:id', component: Pong.component, init: Pong.init },
    { path: '/offline-pong', component: OfflinePong.component, init: OfflinePong.init },
    { path: '/tournament', component: Tournament.component, init: Tournament.init },
    { path: '/waiting-room', component: WaitingRoom.component, init: WaitingRoom.init },
    { path: '*', component: () => `<div class="text-center p-8"><h2 class="text-2xl">${i18n.t('error.404')}</h2></div>` }
  ];
  
  window.router = new Router(routes);
  
  const originalNavigateTo = window.router.navigateTo;
  window.router.navigateTo = function(url: string): void {
    const path = new URL(url, window.location.origin).pathname;
    if (checkAuth(path)) {
      originalNavigateTo.call(window.router, url);
    }
  };
  
  window.router.handleRouteChange();
  
  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.matches('[data-protected]')) {
      e.preventDefault();
      
      const token = getAuthToken();
      if (!token) {
        window.router.navigateTo('/login');
        return;
      }
      
      const link = target as HTMLAnchorElement;
      window.router.navigateTo(link.href);
    }
  });
  
  document.addEventListener('localeChanged', async (event) => {
    if (window.router && window.router.currentView) {
      i18n.ensureLocaleIntegrity();
      await window.router.renderView(window.router.currentView);
    }
  });
});