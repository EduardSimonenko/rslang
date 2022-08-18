/* eslint-disable linebreak-style */
import AuthForm from './authorization/auth-render';

class AppView {
  authForm: AuthForm;

  constructor() {
    this.authForm = new AuthForm();
  }

  drawAuthForm() {
    this.authForm.render();
  }
}

export default AppView;
