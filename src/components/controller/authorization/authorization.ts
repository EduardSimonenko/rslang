/* eslint-disable linebreak-style */
import { MethodEnum, UrlFolderEnum } from '../../../types/loadServerData/enum';
import Loader from '../load';
import CustomStorage from '../storage';

class Authorization extends Loader {
  emailInput = document.getElementById('email') as HTMLInputElement;

  nameInput = document.getElementById('name') as HTMLInputElement;

  passwordInput = document.getElementById('password') as HTMLInputElement;

  storage: CustomStorage;

  message: HTMLElement;

  constructor() {
    super();
    this.storage = new CustomStorage();
    this.message = document.getElementById('login-error');
  }

  async createNewUser(): Promise<void> {
    // console.log('create new user');
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

  async logIn(): Promise<void> {
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

    if (result !== undefined) {
      const {
        name, userId, token, refreshToken,
      }: Record<string, string> = await result.json();

      this.storage.setStorage('name', name);
      this.storage.setStorage('userId', userId);
      this.storage.setStorage('token', token);
      this.storage.setStorage('refreshToken', refreshToken);

      this.message.innerText = 'Вы вошли в систему';
      this.message.style.color = 'green';
    } else {
      this.message.style.color = 'red';
      this.message.innerText = 'Неверные учетные данные';
    }
  }

  async refreshToken(): Promise<void> {
    const userId = this.storage.getStorage('userId');
    const result = await super.load(
      {
        method: MethodEnum.get,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: `Bearer ${this.storage.getStorage('refreshToken')}`,
        },
      },
      [UrlFolderEnum.users, userId, 'tokens'],
    ) as Response;

    if (result !== undefined) {
      const {
        token, refreshToken,
      }: Record<string, string> = await result.json();

      this.storage.setStorage('token', token);
      this.storage.setStorage('refreshToken', refreshToken);
    }
  }

  async getUserById(): Promise<Record<string, string>> {
    const userId = this.storage.getStorage('userId');
    const result = await super.load(
      {
        method: MethodEnum.get,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: `Bearer ${this.storage.getStorage('token')}`,
        },
      },
      [UrlFolderEnum.users, userId],
    ) as Response;
    const { name, email, id }: Record<string, string> = await result.json();
    // console.log({ name, email, id });
    return { name, email, id };
  }

  logOut(): void {
    ['name', 'userId', 'token', 'refreshToken'].forEach((item) => localStorage.removeItem(item));
    window.location.reload();
    // console.log('Вы вышли из аккаунта');
  }

  clear(): void {
    this.emailInput.value = '';
    this.nameInput.value = '';
    this.passwordInput.value = '';
  }

  listen(): void {
    const registrationBtn = document.getElementById('registration-btn');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    registrationBtn.addEventListener('click', (event) => {
      event.preventDefault();
      this.createNewUser();
    });
    loginBtn.addEventListener('click', (event) => {
      event.preventDefault();
      this.logIn();
    });
    logoutBtn.addEventListener('click', (event) => {
      event.preventDefault();
      this.logOut();
    });
    cancelBtn.addEventListener('click', (event) => {
      event.preventDefault();
      this.clear();
    });
  }
}

export default Authorization;
