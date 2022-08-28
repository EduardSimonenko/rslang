import { MethodEnum, UrlFolderEnum } from '../../../types/loadServerData/enum';
import Loader from '../load';
import CustomStorage from '../storage';

class Authorization extends Loader {
  message: HTMLElement;

  emailInput: HTMLInputElement;

  passwordInput: HTMLInputElement;

  nameInput: HTMLInputElement;

  constructor() {
    super();
    this.message = document.getElementById('login-error');
    this.emailInput = document.getElementById('email') as HTMLInputElement;
    this.nameInput = document.getElementById('name') as HTMLInputElement;
    this.passwordInput = document.getElementById('password') as HTMLInputElement;
  }

  private async createNewUser(): Promise<void> {
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

  private async logIn(): Promise<void> {
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

    if (result) {
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

  private async refreshToken(): Promise<void> {
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

  private async getUserById(): Promise<Record<string, string>> {
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

  private clear(): void {
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
