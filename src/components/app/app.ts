import Page from '../view/pageView/mainPageView';

export default class App {
  static async start(): Promise<void> {
    Page.renderMainPage();
  }
}
