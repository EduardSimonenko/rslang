import CustomStorage from '../controller/storage';
import { replaceHashHistory } from '../utils/createUrlPath';
import getGroupAndPage from '../utils/getGroupAndPage';
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

  private static changeState(): void {
    window.addEventListener('popstate', (e: PopStateEvent) => {
      if (e.state) {
        CustomStorage.setStorage('page', e.state);
      } else {
        const hash = window.location.href.split('#')[1];
        CustomStorage.setStorage('page', hash);
        replaceHashHistory(hash);
      }
      this.renderPage();
    });
  }

  private static renderPage(): void {
    let pagePath: string = CustomStorage.getStorage('page');
    let group: string;
    let currentPage;
    let page: string;

    if (pagePath && pagePath.includes('?')) {
      [group, page, pagePath] = getGroupAndPage(pagePath) as string[];
    }

    switch (pagePath) {
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

      case 'game/audio-call/play':
        currentPage = new TextbookWordsSection(group, page);
        break;

      case 'game/sprint/play':
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
}
