import { StorageData } from '../../types/textbook/type';

class CustomStorage {
  static getStorage(key: string): string {
    const value = localStorage.getItem(key);
    return value;
  }

  static setStorage(key: string, value: StorageData) {
    if (typeof value !== 'string') {
      const valueJson = JSON.stringify(value);
      localStorage.setItem(key, valueJson);
    } else {
      localStorage.setItem(key, value);
    }
  }

  static clearDataStorage(key: string): void {
    localStorage.removeItem(key);
  }
}

export default CustomStorage;
