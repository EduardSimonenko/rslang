import Audiocall from '../controller/audiocall/audiocall';
import Authorization from '../controller/authorization/authorization';
import AuthForm from './authorization/auth-render';

class AppView {
  authForm: AuthForm;

  constructor() {
    this.authForm = new AuthForm();
  }

  startAuth(): void {
    this.authForm.render();
    const authorization = new Authorization();
    authorization.listen();
  }

  static startAudiocall(): void {
    const audiocall = new Audiocall();
    audiocall.start();
  }
}

export default AppView;
