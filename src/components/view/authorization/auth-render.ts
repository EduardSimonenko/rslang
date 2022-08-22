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
    const loginWrapper = this.NewElement.createNewElement('div', ['login-wrapper']);
    const loginForm = this.NewElement.createNewElement('form', ['login-form']);
    const closeBtn = this.NewElement.createNewElement('div', ['login-form__close-btn']);
    const closeBtnImg = this.NewElement.createNewElement('img', ['close-btn-img']);
    this.NewElement.setAttributes(closeBtnImg, { src: '../../../assets/svg/close.svg', alt: 'close' });
    this.NewElement.insertChilds(closeBtn, [closeBtnImg]);
    const loginTitle = this.NewElement.createNewElement('div', ['login-form-title'], '<h2>Изучать слова удобнее, если у вас есть профиль</h2>');
    const loginSubtitle = this.NewElement.createNewElement('div', ['login-form-title'], 'Вы получите доступ к долгосрочному хранению статистики, а также сможете формировать собственный словарь.');
    const loginFormFields = this.NewElement.createNewElement('div', ['login-form-fields']);
    const emailInput = this.NewElement.createNewElement('input', ['login-form__input']);
    this.NewElement.setAttributes(emailInput, {
      id: 'email', type: 'email', placeholder: 'E-mail', required: '',
    });
    const nameInput = this.NewElement.createNewElement('input', ['login-form__input', 'hidden']);
    this.NewElement.setAttributes(nameInput, {
      id: 'name', type: 'text', placeholder: 'Имя',
    });
    const passwordInput = this.NewElement.createNewElement('input', ['login-form__input']);
    this.NewElement.setAttributes(passwordInput, {
      id: 'password', type: 'password', placeholder: 'Пароль', required: '',
    });
    this.NewElement.insertChilds(loginFormFields, [emailInput, nameInput, passwordInput]);
    const loginFormError = this.NewElement.createNewElement('div', ['login-form-error']);
    const registrationBtn = this.NewElement.createNewElement('button', ['btn', 'registration-btn', 'hidden'], 'Регистрация');
    this.NewElement.setAttributes(registrationBtn, { id: 'registration-btn', type: 'submit' });
    const loginBtn = this.NewElement.createNewElement('button', ['btn', 'login-btn'], 'Войти');
    this.NewElement.setAttributes(loginBtn, { id: 'login-btn', type: 'submit' });
    const cancelBtn = this.NewElement.createNewElement('button', ['btn', 'cancel-btn'], 'Отменить');
    this.NewElement.setAttributes(cancelBtn, { id: 'cancel-btn', type: 'button' });
    const logoutBtn = this.NewElement.createNewElement('button', ['btn', 'logout-btn', 'hidden'], 'Выйти из аккаунта');
    this.NewElement.setAttributes(logoutBtn, { id: 'logout-btn', type: 'button' });
    const loginAuthChange = this.NewElement.createNewElement('div', ['login-form-registration'], 'Нет аккаунта? | Регистрация');
    this.NewElement.insertChilds(loginForm, [closeBtn, loginTitle, loginSubtitle, loginFormFields, loginFormError, registrationBtn, loginBtn, cancelBtn, logoutBtn, loginAuthChange]);
    loginWrapper.appendChild(loginForm);
    document.body.appendChild(loginWrapper);

    closeBtnImg.addEventListener('click', () => {
      document.body.removeChild(loginWrapper);
    });
    loginAuthChange.addEventListener('click', () => {
      nameInput.classList.toggle('hidden');
      loginBtn.classList.toggle('hidden');
      registrationBtn.classList.toggle('hidden');
      if (loginAuthChange.innerHTML === 'Нет аккаунта? | Регистрация') {
        loginAuthChange.innerHTML = 'Есть аккаунт? | Войти';
      } else {
        loginAuthChange.innerHTML = 'Нет аккаунта? | Регистрация';
      }
    });
  }
}

export default AuthForm;
