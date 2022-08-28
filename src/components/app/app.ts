// import { DataWords } from '../../types/loadServerData/interfaces';
// import { Controller } from '../controller/controller';
import Page from '../view/pageView/mainPageView';

export default class App {
  // private controller: Controller;


  // constructor() {
  //   this.controller = new Controller();
  // }

  static async start(): Promise<void> {
    Page.renderMainPage();
  }
}
