import CustomStorage from '../controller/storage';
import Page from '../view/pageView/mainPageView';
import TextbookTitlePage from '../view/textbook/textbookTitlePage';

export default class App {
  static async start(): Promise<void> {
    const textbook = new TextbookTitlePage();
    const page = CustomStorage.getStorage('page');

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
