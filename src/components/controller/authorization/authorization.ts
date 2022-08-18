/* eslint-disable linebreak-style */
import { MethodEnum, UrlFolderEnum } from '../../../types/loadServerData/enum';
import Loader from '../load';

class Authorization extends Loader {
  emailInput = document.getElementById('email') as HTMLInputElement;

  nameInput = document.getElementById('name') as HTMLInputElement;

  passwordInput = document.getElementById('password') as HTMLInputElement;

  async createNewUser() {
    console.log('create new user');

    super.load(
      {
        method: MethodEnum.post,
        headers: {
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

  listen() {
    const loginBtn = document.getElementById('login-btn');
    loginBtn.addEventListener('click', (event) => {
      event.preventDefault();
      this.createNewUser();
    });
  }
}

export default Authorization;
