import { StateTextbook } from '../../types/textbook/interfaces';
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

      case 'game/sprint':
        currentPage = new TextbookWordsSection(this.chooseGroup, curPage);
        break;

      case 'game/audio-call':
        currentPage = new TextbookWordsSection(this.chooseGroup, curPage);
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
    if (currentPage instanceof TextbookWordsSection) {
      this.gameLaunchToTextbook();
    }
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

  static gameLaunchToTextbook(): void {
    const games = document.querySelectorAll('.play');
    games.forEach((game) => {
      game.addEventListener('click', (e: MouseEvent) => {
        const { name } = (e.target as HTMLParagraphElement).dataset;
        const words: StateTextbook = JSON.parse(CustomStorage.getStorage('textbookWords'));
        CustomStorage.setStorage('page', `${name}?group=${words.group}&page=${words.page}`);
        window.history.pushState(
          `${name}?group=${words.group}&page=${words.page}`,
          'словарь',
          `../#${name}?group=${words.group}&page=${words.page}`,
        );
        this.renderPage();
      });
    });
  }
}
