class CustomStorage {
  public getStorage(key: string): string {
    const value = localStorage.getItem(key);
    return value;
  }

  public setStorage(key: string, value: string) {
    if (typeof value !== 'string') {
      const valueJson = JSON.stringify(value);
      localStorage.setItem(key, valueJson);
    } else {
      localStorage.setItem(key, value);
    }
  }
}

export default CustomStorage;
