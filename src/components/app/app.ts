import { DataWords } from '../../types/loadServerData/interfaces';
import Authorization from '../controller/authorization/authorization';
import Controller from '../controller/controller';
import AppView from '../view/appView';

export class App {
  private controller: Controller;

  constructor() {
    this.controller = new Controller();
  }

  public async start(): Promise<void> {
    const response = (await this.controller.testquery('5e9f5ee35eb9e72bc21af4dd')) as Response;
    (await response.json()) as DataWords;

    const appView = new AppView();
    appView.drawAuthForm();
    const authorization = new Authorization();
    authorization.listen();
  }
}

export default App;
