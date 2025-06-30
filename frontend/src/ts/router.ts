import { Route, RouterParams } from './types/router.types.js';

class Router {
  private routes: Route[];
  public currentView: Route | null;
  private protectedRoutes: string[];
  
  constructor(routes: Route[]) {
    this.routes = routes;
    this.currentView = null;
    this.protectedRoutes = ['/dashboard', '/settings'];
    
    window.addEventListener('popstate', () => this.handleRouteChange());

    document.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('[data-link]')) {
        e.preventDefault();
        const link = target as HTMLAnchorElement;
        this.navigateTo(link.href);
      }
    });
    
    console.log('Router initialized with', routes.length, 'routes');
  }
  
  private getAuthToken(): string | null {
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
  }
  
  public handleRouteChange(): void {
    const path = window.location.pathname;
    console.log('Router handling path:', path);
    
    if (this.isProtectedRoute(path)) {
      const token = this.getAuthToken();
      if (!token) {
        console.log('Access to protected route denied, redirecting to login');
        window.history.pushState(null, '', '/login');
        const loginView = this.getView('/login');
        if (loginView) {
          this.renderView(loginView);
        }
        return;
      }
    }
    
    const view = this.getView(path);
    if (!view) {
      console.error('No view found for path:', path);
      return;
    }
    console.log('Found view for path:', path);
    this.renderView(view);
  }
  
  private isProtectedRoute(path: string): boolean {
    if (this.protectedRoutes.includes(path)) {
      return true;
    }
    
    for (const route of this.protectedRoutes) {
      if (path.startsWith(route + '/')) {
        return true;
      }
    }
    
    return false;
  }
  
  private getView(path: string): Route | null {
    let view = this.routes.find(route => route.path === path);
    
    if (!view) {
      for (const route of this.routes) {
        if (route.path.includes(':')) {
          const routeRegex = this.pathToRegex(route.path);
          if (path.match(routeRegex)) {
            view = route;
            break;
          }
        }
      }
    }
    
    return view || this.routes.find(route => route.path === '*') || null;
  }
  
  private pathToRegex(path: string): RegExp {
    return new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "([^/]+)") + "$");
  }
  
  public getParams(path: string): RouterParams {
    const url = window.location.pathname;
    const matches = url.match(this.pathToRegex(path));
    
    if (!matches) return {};
    
    const keys = path.match(/:\w+/g) || [];
    const values = matches.slice(1);
    
    return keys.reduce((params: RouterParams, key: string, i: number) => {
      params[key.replace(':', '')] = values[i];
      return params;
    }, {});
  }
   public async renderView(view: Route): Promise<void> {
    const app = document.getElementById('app');
    
    if (!app) {
      console.error('App element not found');
      return;
    }

    if (this.currentView) {
      app.classList.add('fade-out');
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    try {
      const viewContent = await view.component();
      
      app.innerHTML = viewContent;
      app.classList.remove('fade-out');
      app.classList.add('fade-in');
      
      if (view.init) {
        view.init();
      }
      
      this.currentView = view;
      
      if (window.feather) {
        window.feather.replace();
      }
      
      setTimeout(() => {
        app.classList.remove('fade-in');
      }, 500);
      
    } catch (error) {
      console.error('Erro ao renderizar a view:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      app.innerHTML = `<div class="text-center p-8"><h2 class="text-2xl text-red-500">Erro ao carregar a página</h2><p class="mt-4">${errorMessage}</p></div>`;
    }
  }
  
  public navigateTo(url: string): void {
    window.history.pushState(null, '', url);
    this.handleRouteChange();
  }
}

declare global {
  interface Window {
    feather?: {
      replace: () => void;
    };
  }
}

export default Router; 