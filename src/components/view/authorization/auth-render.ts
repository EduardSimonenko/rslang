/* eslint-disable linebreak-style */
/* eslint-disable max-len */
import NewElement from '../../controller/newcomponent';
import '../../../styles/pages/_auth.scss';

class AuthForm {
  NewElement: NewElement;

  constructor() {
    this.NewElement = new NewElement();
  }

  render(): void {
    const authWrapper = this.NewElement.createNewElement('div', ['auth-wrapper']);
    const authHeader = this.NewElement.createNewElement('h2', ['auth-header'], 'Регистрация');

    const loginForm = this.NewElement.createNewElement('form', ['login-form']);
    const emailInput = this.NewElement.createNewElement('input', ['login-form__input']);
    this.NewElement.setAttributes(emailInput, { id: 'email', type: 'email', placeholder: 'E-mail' });
    const nameInput = this.NewElement.createNewElement('input', ['login-form__input']);
    this.NewElement.setAttributes(nameInput, { id: 'name', type: 'text', placeholder: 'Name' });
    const passwordInput = this.NewElement.createNewElement('input', ['login-form__input']);
    this.NewElement.setAttributes(passwordInput, { id: 'password', type: 'password', placeholder: 'Password' });
    const registrationBtn = this.NewElement.createNewElement('button', ['btn', 'registration-btn'], 'Регистрация');
    this.NewElement.setAttributes(registrationBtn, { id: 'registration-btn', type: 'submit' });
    const loginBtn = this.NewElement.createNewElement('button', ['btn', 'login-btn'], 'Войти(мэйл и пасс)');
    this.NewElement.setAttributes(loginBtn, { id: 'login-btn', type: 'submit' });
    const cancelBtn = this.NewElement.createNewElement('button', ['btn', 'cancel-btn'], 'Отменить');
    this.NewElement.setAttributes(cancelBtn, { id: 'cancel-btn', type: 'button' });
    const logoutBtn = this.NewElement.createNewElement('button', ['btn', 'logout-btn'], 'Выйти из аккаунта');
    this.NewElement.setAttributes(logoutBtn, { id: 'logout-btn', type: 'button' });
    this.NewElement.insertChilds(loginForm, [emailInput, nameInput, passwordInput, registrationBtn, loginBtn, cancelBtn, logoutBtn]);
    this.NewElement.insertChilds(authWrapper, [authHeader, loginForm]);

    document.body.appendChild(authWrapper);
  }
}

export default AuthForm;
