import { AuthorizeUserWords, WordStructure } from '../../../types/loadServerData/interfaces';
import { ResponseData } from '../../../types/textbook/type';
import NewElement from '../../controller/newcomponent';
import CustomStorage from '../../controller/storage';
import ControllerTextbook from '../../controller/textbook/controller';
import TextbookWordsSection from './textbookWordsSection';
import textbookLevel from '../../../mocks/textbook.json';

class TextbookTitlePage {
  private body;

  private newElement: NewElement;

  private cotroller: ControllerTextbook;

  private wrapper: HTMLElement;

  private customStorage: CustomStorage;

  private isLogin: string | null;

  private allLevelWithLogin: number;

  private header: HTMLElement;

  private footer: HTMLElement;

  constructor() {
    this.newElement = new NewElement();
    this.customStorage = new CustomStorage();
    this.body = document.querySelector('.body') as HTMLBodyElement;
    this.cotroller = new ControllerTextbook();
    this.wrapper = this.newElement.createNewElement('div', ['wrapper-textbook']);
    this.isLogin = this.customStorage.getStorage('token');
    this.allLevelWithLogin = 7;
    this.header = this.newElement.createNewElement('div', ['header']);
    this.footer = this.newElement.createNewElement('div', ['footer']);
  }

  public renderPageTextBook(header: HTMLElement, footer: HTMLElement): void {
    this.header = header;
    this.footer = footer;
    if (this.body.firstElementChild) {
      this.cleanPage();
    }
    const wrapperTitle: HTMLElement = this.newElement.createNewElement('div', ['wrapper-title']);
    const containerBook: HTMLElement = this.newElement.createNewElement('div', ['container__book']);
    const lineBook1: HTMLElement = this.newElement.createNewElement('div', ['line__book']);
    const lineBook2: HTMLElement = this.newElement.createNewElement('div', ['line__book']);
    const lineBook3: HTMLElement = this.newElement.createNewElement('div', ['line__book']);
    const title: HTMLElement = this.newElement.createNewElement('h1', ['title__book'], 'Учебник');
    const imgTextbookLevel: Record<string, string> = textbookLevel;

    this.newElement.insertChilds(
      wrapperTitle,
      [this.header, this.wrapper, this.footer],
    );
    this.newElement.insertChilds(this.body, [wrapperTitle]);
    this.newElement.insertChilds(this.wrapper, [title, containerBook]);

    for (let i = 0; i < this.allLevelWithLogin; i += 1) {
      const level: HTMLElement = this.newElement.createNewElement('img', ['img__book']);
      let btnBook: HTMLElement;
      if (i === (this.allLevelWithLogin - 1) && !this.customStorage.getStorage('token')) {
        btnBook = this.newElement.createNewElement('button', ['btn__book', 'btn__book-visability']);
      } else {
        btnBook = this.newElement.createNewElement('button', ['btn__book']);
      }

      this.newElement.setAttributes(
        level,
        {
          src: imgTextbookLevel[`book${i}`],
          'data-book': `${i}`,
          width: '120',
          height: '130',
          alt: `book level ${i + 1}`,
        },
      );
      this.newElement.insertChilds(btnBook, [level]);

      if (i < 3) {
        this.newElement.insertChilds(lineBook1, [btnBook]);
      } else if (i === 6) {
        this.newElement.insertChilds(lineBook2, [btnBook]);
      } else {
        this.newElement.insertChilds(lineBook3, [btnBook]);
      }
    }

    this.newElement.insertChilds(containerBook, [lineBook1, lineBook2, lineBook3]);

    this.listener(containerBook);
  }

  private listener(books: HTMLElement): void {
    books.addEventListener('click', (e: Event) => {
      const book = (e.target as HTMLImageElement).dataset.book as string;

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
