// import { DataWords } from '../../types/loadServerData/interfaces';
// import { Controller } from '../controller/controller';
import Audiocall from '../controller/audiocall/audiocall';
import AudiocallGame from '../view/audiocall/audiocall-render';
import Page from '../view/pageView/mainPageView';

export default class App {
  // private controller: Controller;

  // constructor() {
  //   this.controller = new Controller();
  // }

  static async start(): Promise<void> {
    Page.renderMainPage();

    const audiocallGame = new AudiocallGame();
    audiocallGame.startAudiocall();

    const audiocall = new Audiocall();
    audiocall.setLevel();
  }
}
