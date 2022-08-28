import { MethodEnum, UrlFolderEnum } from '../../../types/loadServerData/enum';
import Loader from '../load';
import CustomStorage from '../storage';

class Authorization extends Loader {
  static message: HTMLElement;

  static emailInput: HTMLInputElement;

  static passwordInput: HTMLInputElement;

  static nameInput: HTMLInputElement;

  constructor() {
    super();
    Authorization.message = document.getElementById('login-error');
    Authorization.emailInput = document.getElementById('email') as HTMLInputElement;
    Authorization.nameInput = document.getElementById('name') as HTMLInputElement;
    Authorization.passwordInput = document.getElementById('password') as HTMLInputElement;
  }

  static async createNewUser(): Promise<void> {
    super.load(
      {
        method: MethodEnum.post,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: `${this.emailInput.value}`,
          name: `${this.nameInput.value}`,
          password: `${this.passwordInput.value}`,
        }),
      },
      [UrlFolderEnum.users],
    );
  }

  static async logIn(): Promise<void> {
    const result = await super.load(
      {
        method: MethodEnum.post,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: `${this.emailInput.value}`,
          password: `${this.passwordInput.value}`,
        }),
      },
      [UrlFolderEnum.signin],
    ) as Response;

    if (result.ok) {
      const {
        name, userId, token, refreshToken,
      }: Record<string, string> = await result.json();

      CustomStorage.setStorage('name', name);
      CustomStorage.setStorage('userId', userId);
      CustomStorage.setStorage('token', token);
      CustomStorage.setStorage('refreshToken', refreshToken);

      this.message.innerText = 'Вы вошли в систему';
      this.message.style.color = 'green';
    } else {
      this.message.style.color = 'red';
      this.message.innerText = 'Неверные учетные данные';
    }
  }

  static async refreshToken(): Promise<void> {
    const userId = CustomStorage.getStorage('userId');
    const result = await super.load(
      {
        method: MethodEnum.get,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: `Bearer ${CustomStorage.getStorage('refreshToken')}`,
        },
      },
      [UrlFolderEnum.users, userId, 'tokens'],
    ) as Response;

    if (result !== undefined) {
      const {
        token, refreshToken,
      }: Record<string, string> = await result.json();

      CustomStorage.setStorage('token', token);
      CustomStorage.setStorage('refreshToken', refreshToken);
    }
  }

  static async getUserById(): Promise<Record<string, string>> {
    const userId = CustomStorage.getStorage('userId');
    const result = await super.load(
      {
        method: MethodEnum.get,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: `Bearer ${CustomStorage.getStorage('token')}`,
        },
      },
      [UrlFolderEnum.users, userId],
    ) as Response;
    const { name, email, id }: Record<string, string> = await result.json();
    return { name, email, id };
  }

  private logOut(): void {
    ['name', 'userId', 'token', 'refreshToken'].forEach((item) => localStorage.removeItem(item));
    window.location.reload();
  }

  static clear(): void {
    this.emailInput.value = '';
    this.nameInput.value = '';
    this.passwordInput.value = '';
  }

  public listen(): void {
    const registrationBtn = document.getElementById('registration-btn');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    registrationBtn.addEventListener('click', (event) => {
      event.preventDefault();
      Authorization.createNewUser();
    });
    loginBtn.addEventListener('click', (event) => {
      event.preventDefault();
      Authorization.logIn();
    });
    logoutBtn.addEventListener('click', (event) => {
      event.preventDefault();
      this.logOut();
    });
    cancelBtn.addEventListener('click', (event) => {
      event.preventDefault();
      Authorization.clear();
    });
  }
}

export default Authorization;
