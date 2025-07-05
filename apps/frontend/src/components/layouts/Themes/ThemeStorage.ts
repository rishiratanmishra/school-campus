// In-memory storage fallback for environments where localStorage isn't available
export class ThemeStorage {
  private static instance: ThemeStorage;
  private storage = new Map<string, string>();

  static getInstance(): ThemeStorage {
    if (!ThemeStorage.instance) {
      ThemeStorage.instance = new ThemeStorage();
    }
    return ThemeStorage.instance;
  }

  getItem(key: string): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.warn('localStorage not available, using memory storage');
      }
    }
    return this.storage.get(key) || null;
  }

  setItem(key: string, value: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(key, value);
        return;
      } catch (error) {
        console.warn('localStorage not available, using memory storage');
      }
    }
    this.storage.set(key, value);
  }
}

export const themeStorage = ThemeStorage.getInstance();
export const LOCAL_STORAGE_DARK_KEY = 'theme-dark-mode';
export const LOCAL_STORAGE_THEME_KEY = 'theme-selection';