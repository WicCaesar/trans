import { Translations, LocaleTranslations } from './types/i18n.types.js';
import ptBR from './locales/pt-BR.js';
import enUS from './locales/en-US.js';

class I18n {
  private translations: LocaleTranslations;
  private currentLocale: string;
  private defaultLocale: string;
  private supportedLocales: string[];
  
  constructor() {
    this.translations = {
      'pt-BR': ptBR,
      'en-US': enUS
    };
    this.defaultLocale = 'pt-BR';
    this.supportedLocales = ['pt-BR', 'en-US'];
    
    const storedLocale = localStorage.getItem('locale');
    if (storedLocale && this.supportedLocales.includes(storedLocale)) {
      this.currentLocale = storedLocale;
    } else {
      this.currentLocale = this.defaultLocale;
      localStorage.setItem('locale', this.defaultLocale);
    }
  }
  
  public t(key: string, params: Record<string, string | number> = {}): string {
    let translation = this.getTranslation(key);
    
    if (Object.keys(params).length > 0) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{${param}}`, String(params[param]));
      });
    }

    return translation;
  }
  
  private getTranslation(key: string): string {
    if (this.translations[this.currentLocale] && this.translations[this.currentLocale][key]) {
      return this.translations[this.currentLocale][key];
    }
    
    if (this.translations[this.defaultLocale] && this.translations[this.defaultLocale][key]) {
      return this.translations[this.defaultLocale][key];
    }
    
    return key;
  }
  
  public setLocale(locale: string): boolean {
    if (this.supportedLocales.includes(locale)) {
      const oldLocale = this.currentLocale;
      this.currentLocale = locale;
      
      localStorage.setItem('locale', locale);
      
      if (oldLocale !== locale) {
        document.dispatchEvent(new CustomEvent('localeChanged', { 
          detail: { oldLocale, newLocale: locale } 
        }));
      }
      
      return true;
    }
    
    console.warn('Attempted to set unsupported locale:', locale);
    return false;
  }

  public toggleLocale(): boolean {
    const currentIndex = this.supportedLocales.indexOf(this.currentLocale);
    const nextIndex = (currentIndex + 1) % this.supportedLocales.length;
    const nextLocale = this.supportedLocales[nextIndex];
    
    return this.setLocale(nextLocale);
  }
  
  public getLocale(): string {
    return this.currentLocale;
  }
  
  public getLocaleDisplayName(locale: string | null = null): string {
    const localeToUse = locale || this.currentLocale;
    
    switch (localeToUse) {
      case 'en-US':
        return 'English';
      case 'pt-BR':
        return 'Português';
      default:
        return localeToUse;
    }
  }
  
  public addTranslations(locale: string, translations: Translations): void {
    if (!this.translations[locale]) {
      this.translations[locale] = {};
    }
    
    Object.assign(this.translations[locale], translations);
    
    if (!this.supportedLocales.includes(locale)) {
      this.supportedLocales.push(locale);
    }
  }
  
  public ensureLocaleIntegrity(): void {
    const storedLocale = localStorage.getItem('locale');
    
    if (!storedLocale || !this.supportedLocales.includes(storedLocale)) {
      console.warn('Locale integrity check failed. Resetting to default:', this.defaultLocale);
      this.currentLocale = this.defaultLocale;
      localStorage.setItem('locale', this.defaultLocale);
    } else if (storedLocale !== this.currentLocale) {
      console.log('Syncing current locale with localStorage:', storedLocale);
      this.currentLocale = storedLocale;
    }
  }
  
  public forceReinitialize(): void {
    const storedLocale = localStorage.getItem('locale');
    console.log('Force reinitializing i18n. Stored locale:', storedLocale);
    
    if (storedLocale && this.supportedLocales.includes(storedLocale)) {
      this.currentLocale = storedLocale;
    } else {
      this.currentLocale = this.defaultLocale;
      localStorage.setItem('locale', this.defaultLocale);
    }
    
    console.log('I18n reinitialized with locale:', this.currentLocale);
  }
}

const i18n = new I18n();

export default i18n;