import CustomStorage from '../controller/storage';
import Page from '../view/pageView/mainPageView';
import TextbookTitlePage from '../view/textbook/textbookTitlePage';
import TextbookWordsSection from '../view/textbook/textbookWordsSection';

export default class App {
  static start(): void {
    window.addEventListener('DOMContentLoaded', () => {
      const savePage: string = CustomStorage.getStorage('page');

      if (!savePage) {
        window.history.replaceState('main', 'словарь', '#main');
      } else {
        window.history.replaceState(savePage, 'словарь', `#${savePage}`);
      }
      this.renderPage();
      this.changeState();
    });
  }

  static changeState(): void {
    window.addEventListener('popstate', (e: PopStateEvent) => {
      if (e.state) {
        CustomStorage.setStorage('page', e.state);
      } else {
        const hash = window.location.href.split('#')[1];
        CustomStorage.setStorage('page', hash);
        this.history(hash);
      }
      this.renderPage();
    });
  }

  static renderPage(): void {
    let pageStorage: string = CustomStorage.getStorage('page');
    let group: string;
    let currentPage;
    let page: string;

    if (pageStorage && pageStorage.includes('?')) {
      [pageStorage, group] = pageStorage.split('?');
      [page] = group.match(/\d+$/);
      [group] = group.match(/\d/);
    }

    switch (pageStorage) {
      case 'textbook':
        currentPage = new TextbookTitlePage();
        break;

      case 'textbook/words':
        currentPage = new TextbookWordsSection(group, page);
        break;

      case 'game/sprint':
        currentPage = new TextbookWordsSection(group, page);
        break;

      case 'game/audio-call':
        currentPage = new TextbookWordsSection(group, page);
        break;

      case 'statistics':

        break;

      default:
        currentPage = Page;
        break;
    }

    currentPage.renderPage();
  }

  static history(hash: string): void {
    window.history.replaceState(hash, 'словарь');
  }
}
