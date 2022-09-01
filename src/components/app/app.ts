import CustomStorage from '../controller/storage';
import AppView from '../view/appView';
import Page from '../view/pageView/mainPageView';
import TextbookTitlePage from '../view/textbook/textbookTitlePage';
import TextbookWordsSection from '../view/textbook/textbookWordsSection';

export default class App {
  static chooseGroup: string;

  static namePage: string;

  static start(): void {
    window.addEventListener('DOMContentLoaded', () => {
      this.chooseGroup = CustomStorage.getStorage('pageNumber');
      const savePage: string = CustomStorage.getStorage('page');

      if (!savePage) {
        window.history.replaceState('main', 'словарь', '#main');
      } else {
        window.history.replaceState(savePage, 'словарь', `#${savePage}`);
      }

      this.renderPage();
      this.listenState();
    });
  }

  static listenState(): void {
    window.addEventListener('popstate', (e: PopStateEvent) => {
      if (e.state) {
        CustomStorage.setStorage('page', e.state);
        this.renderPage();
      } else {
        this.history(this.namePage);
      }
    });
  }

  static renderPage(): void {
    let pageStorage: string = CustomStorage.getStorage('page');
    let group: string;
    let currentPage;
    let curPage: string;

    if (pageStorage && pageStorage.includes('?')) {
      [pageStorage, group] = pageStorage.split('?');
      [this.chooseGroup] = group.match(/\d/);
      [curPage] = group.match(/\d\d|\d$/);
    }

    switch (pageStorage) {
      case 'textbook':
        currentPage = new TextbookTitlePage();
        break;

      case 'textbook/words':
        currentPage = new TextbookWordsSection(this.chooseGroup, curPage);
        break;

      case 'game-sprint':

        break;

      case 'game-audio-call':

        break;

      case 'statistics':

        break;

      default:
        currentPage = Page;
        break;
    }
    currentPage.renderPage();
    this.listenLogIn();
    this.listenLink();
  }

  static listenLogIn(): void {
    const log = document.querySelector('.login__img');
    log.addEventListener('click', () => {
      const login: AppView = new AppView();
      login.startAuth();
    });
  }

  static history(namePage: string): void {
    window.history.replaceState(namePage, 'словарь');
  }

  static listenLink(): void {
    const links: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('a');
    links.forEach((el) => {
      el.addEventListener('click', (e: MouseEvent) => {
        const curTarget = e.currentTarget as HTMLLinkElement;
        const link: string = curTarget.href.split('#')[1];

        if (curTarget.getAttribute('target')) return;

        this.namePage = link;
        CustomStorage.setStorage('page', link);
        this.renderPage();
      });
    });
  }
}
