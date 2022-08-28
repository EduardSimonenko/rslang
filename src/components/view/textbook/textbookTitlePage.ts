import { AuthorizeUserWords, WordStructure } from '../../../types/loadServerData/interfaces';
import { ResponseData } from '../../../types/textbook/type';
import CustomStorage from '../../controller/storage';
import ControllerTextbook from '../../controller/textbook/controller';
import TextbookWordsSection from './textbookWordsSection';
import textbookLevel from '../../../mocks/textbook.json';
import CreateDomElements from '../../controller/newElement';

class TextbookTitlePage {
  private body;

  private cotroller: ControllerTextbook;

  private wrapper: HTMLElement;

  private customStorage: CustomStorage;

  private isLogin: string | null;

  private allLevelWithLogin: number;

  private header: HTMLElement;

  private footer: HTMLElement;

  constructor() {
    this.customStorage = new CustomStorage();
    this.body = document.querySelector('.body') as HTMLBodyElement;
    this.cotroller = new ControllerTextbook();
    this.wrapper = CreateDomElements.createNewElement('div', ['wrapper-textbook']);
    this.isLogin = this.customStorage.getStorage('token');
    this.allLevelWithLogin = 7;
    this.header = CreateDomElements.createNewElement('div', ['header']);
    this.footer = CreateDomElements.createNewElement('div', ['footer']);
  }

  public renderPageTextBook(header: HTMLElement, footer: HTMLElement): void {
    this.header = header;
    this.footer = footer;
    if (this.body.firstElementChild) {
      this.cleanPage();
    }
    const wrapperTitle: HTMLElement = CreateDomElements.createNewElement('div', ['wrapper-title']);
    const containerBook: HTMLElement = CreateDomElements.createNewElement('div', ['container__book']);
    const lineBook1: HTMLElement = CreateDomElements.createNewElement('div', ['line__book']);
    const lineBook2: HTMLElement = CreateDomElements.createNewElement('div', ['line__book']);
    const lineBook3: HTMLElement = CreateDomElements.createNewElement('div', ['line__book']);
    const title: HTMLElement = CreateDomElements.createNewElement('h1', ['title__book'], 'Учебник');
    const imgTextbookLevel: Record<string, string> = textbookLevel;

    CreateDomElements.insertChilds(
      wrapperTitle,
      [this.header, this.wrapper, this.footer],
    );
    CreateDomElements.insertChilds(this.body, [wrapperTitle]);
    CreateDomElements.insertChilds(this.wrapper, [title, containerBook]);

    for (let i = 0; i < this.allLevelWithLogin; i += 1) {
      const level: HTMLElement = CreateDomElements.createNewElement('img', ['img__book']);
      let btnBook: HTMLElement;
      if (i === (this.allLevelWithLogin - 1) && !this.customStorage.getStorage('token')) {
        btnBook = CreateDomElements.createNewElement('button', ['btn__book', 'btn__book-visability']);
      } else {
        btnBook = CreateDomElements.createNewElement('button', ['btn__book']);
      }

      CreateDomElements.setAttributes(
        level,
        {
          src: imgTextbookLevel[`book${i}`],
          'data-book': `${i}`,
          width: '120',
          height: '130',
          alt: `book level ${i + 1}`,
        },
      );
      CreateDomElements.insertChilds(btnBook, [level]);

      if (i < 3) {
        CreateDomElements.insertChilds(lineBook1, [btnBook]);
      } else if (i === 6) {
        CreateDomElements.insertChilds(lineBook2, [btnBook]);
      } else {
        CreateDomElements.insertChilds(lineBook3, [btnBook]);
      }
    }

    CreateDomElements.insertChilds(containerBook, [lineBook1, lineBook2, lineBook3]);

    this.listener(containerBook);
  }

  private listener(books: HTMLElement): void {
    books.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLImageElement;
      if (!target.classList.contains('img__book')) return;
      const book = target.dataset.book as string;

      this.getLevelBooks(book);
    });
  }

  private async getLevelBooks(group: string, page = '0'): Promise<void> {
    const sectionPage: TextbookWordsSection = new TextbookWordsSection(
      {
        clean: this.cleanPage,
        group,
        isLogin: this.isLogin,
      },
    );
    let response: Response;
    let data: ResponseData;

    if (this.isLogin && group === '6') {
      response = (await this.cotroller.getDifficultWords()) as Response;
      data = await response.json() as AuthorizeUserWords[];
      sectionPage.renderPageWithWords(
        data[0].paginatedResults,
        { header: this.header, footer: this.footer },
        true,
      );
    } else if (this.isLogin) {
      response = (await this.cotroller.getWordsLoginUser(group, page)) as Response;
      data = await response.json() as AuthorizeUserWords[];
      sectionPage.renderPageWithWords(
        data[0].paginatedResults,
        { header: this.header, footer: this.footer },
      );
    } else {
      response = (await this.cotroller.getWordsUnloginUser(group, page)) as Response;
      data = await response.json() as WordStructure[];
      sectionPage.renderPageWithWords(data, { header: this.header, footer: this.footer });
    }
  }

  private cleanPage(): void {
    while (this.body.firstElementChild) {
      this.body.firstElementChild.remove();
    }
  }
}

export default TextbookTitlePage;
