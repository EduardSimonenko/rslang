import CustomStorage from '../controller/storage';
import AppView from '../view/appView';
import Page from '../view/pageView/mainPageView';
import TextbookTitlePage from '../view/textbook/textbookTitlePage';

export default class App {
  static async start(): Promise<void> {
    const textbook = new TextbookTitlePage();
    const page = CustomStorage.getStorage('page');
    AppView.startAudiocall();

    window.addEventListener('DOMContentLoaded', () => {
      switch (page) {
        case 'textbookTitle':
          textbook.renderPageTextBook(Page.renderHeader(), Page.renderFooter());
          break;

        default:
          Page.renderMainPage();
          break;
      }
    });
  }
}
