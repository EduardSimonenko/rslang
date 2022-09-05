import CreateDomElements from '../../controller/newElement';

class AuthForm {
  public render(): void {
    const loginWrapper = CreateDomElements.createNewElement('div', ['login-wrapper']);
    const loginForm = CreateDomElements.createNewElement('form', ['login-form']);
    const closeBtn = CreateDomElements.createNewElement('div', ['login-form__close-btn']);
    const closeBtnImg = CreateDomElements.createNewElement('img', ['close-btn-img']);
    CreateDomElements.setAttributes(closeBtnImg, { src: '../../../assets/svg/close.svg', alt: 'close', id: 'close-btn-img' });
    CreateDomElements.insertChilds(closeBtn, [closeBtnImg]);
    const loginTitle = CreateDomElements.createNewElement('div', ['login-form-title'], '<h2>Изучать слова удобнее, если у вас есть профиль</h2>');
    const loginSubtitle = CreateDomElements.createNewElement('div', ['login-form-subtitle'], 'Вы получите доступ к долгосрочному хранению статистики, а также сможете формировать собственный словарь.');
    const loginFormFields = CreateDomElements.createNewElement('div', ['login-form-fields']);
    const emailInput = CreateDomElements.createNewElement('input', ['login-form__input']);
    CreateDomElements.setAttributes(emailInput, {
      id: 'email', type: 'email', placeholder: 'E-mail', required: '',
    });
    const nameInput = CreateDomElements.createNewElement('input', ['login-form__input', 'hidden']);
    CreateDomElements.setAttributes(nameInput, {
      id: 'name', type: 'text', placeholder: 'Имя',
    });
    const passwordInput = CreateDomElements.createNewElement('input', ['login-form__input']);
    CreateDomElements.setAttributes(passwordInput, {
      id: 'password', type: 'password', placeholder: 'Пароль', required: '', minlength: '8',
    });
    CreateDomElements.insertChilds(loginFormFields, [emailInput, nameInput, passwordInput]);
    const loginFormError = CreateDomElements.createNewElement('div', ['login-form-error']);
    CreateDomElements.setAttributes(loginFormError, { id: 'login-error' });
    const registrationBtn = CreateDomElements.createNewElement('button', ['btn', 'registration-btn', 'hidden'], 'Регистрация');
    CreateDomElements.setAttributes(registrationBtn, { id: 'registration-btn', type: 'submit' });
    const loginBtn = CreateDomElements.createNewElement('button', ['btn', 'login-btn'], 'Войти');
    CreateDomElements.setAttributes(loginBtn, { id: 'login-btn', type: 'submit' });
    const cancelBtn = CreateDomElements.createNewElement('button', ['btn', 'cancel-btn'], 'Отменить');
    CreateDomElements.setAttributes(cancelBtn, { id: 'cancel-btn', type: 'button' });
    const logoutBtn = CreateDomElements.createNewElement('button', ['btn', 'logout-btn', 'hidden'], 'Выйти из аккаунта');
    CreateDomElements.setAttributes(logoutBtn, { id: 'logout-btn', type: 'button' });
    const loginAuthChange = CreateDomElements.createNewElement('div', ['login-form-registration'], 'Нет аккаунта? | Регистрация');
    CreateDomElements.insertChilds(loginForm, [closeBtn, loginTitle, loginSubtitle, loginFormFields,
      loginFormError, registrationBtn, loginBtn, cancelBtn, logoutBtn, loginAuthChange]);
    loginWrapper.appendChild(loginForm);
    document.body.appendChild(loginWrapper);

    const isLogIn = Boolean(localStorage.getItem('token'));
    if (isLogIn) {
      [loginTitle, loginSubtitle, loginFormFields, loginBtn, cancelBtn, loginAuthChange].forEach((item) => item.classList.add('hidden'));
      logoutBtn.classList.remove('hidden');
    }

    closeBtnImg.addEventListener('click', () => {
      document.body.removeChild(loginWrapper);
    });
    loginAuthChange.addEventListener('click', () => {
      loginFormError.innerText = '';
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
