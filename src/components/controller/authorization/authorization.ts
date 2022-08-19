/* eslint-disable linebreak-style */
import { MethodEnum, UrlFolderEnum } from '../../../types/loadServerData/enum';
import Loader from '../load';

class Authorization extends Loader {
  emailInput = document.getElementById('email') as HTMLInputElement;

  nameInput = document.getElementById('name') as HTMLInputElement;

  passwordInput = document.getElementById('password') as HTMLInputElement;

  async createNewUser(): Promise<void> {
    console.log('create new user');
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
    console.log('login user');

    try {
      const result = await fetch('https://rslang2022q1-learnwords.herokuapp.com/signin', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: `${this.emailInput.value}`,
          password: `${this.passwordInput.value}`,
        }),
      });

      const {
        name, userId, token, refreshToken,
      }: Record<string, string> = await result.json();
      localStorage.setItem('name', name);
      localStorage.setItem('userId', userId);
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      // eslint-disable-next-line no-alert
      alert('успешный вход');
    } catch (e) {
      console.log(e);
    }
  }

  logOut(): void {
    ['name', 'userId', 'token', 'refreshToken'].forEach((item) => localStorage.removeItem(item));
    window.location.reload();
    console.log('Вы вышли из аккаунта');
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
