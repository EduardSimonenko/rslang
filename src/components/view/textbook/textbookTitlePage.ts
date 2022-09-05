import textbookLevel from '../../../mocks/textbook.json';
import cleanPage from '../../utils/cleanPage';
import CreateDomElements from '../../controller/newElement';
import CustomStorage from '../../controller/storage';
import Page from '../pageView/mainPageView';

class TextbookTitlePage {
  protected body;

  protected wrapper: HTMLElement;

  protected isLogin: string | null;

  private allLevelWithLogin: number;

  protected header: HTMLElement;

  protected footer: HTMLElement;

  constructor() {
    this.body = document.querySelector('.body') as HTMLBodyElement;
    this.wrapper = CreateDomElements.createNewElement('div', ['wrapper-textbook']);
    this.isLogin = CustomStorage.getStorage('token');
    this.allLevelWithLogin = 7;
    this.header = Page.renderHeader();
    this.footer = Page.renderFooter();
  }

  public renderPage(): void {
    if (this.body.firstElementChild) {
      cleanPage();
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
      if (i === (this.allLevelWithLogin - 1) && !CustomStorage.getStorage('token')) {
        btnBook = CreateDomElements.createNewElement('a', ['btn__book', 'btn__book-visability']);
      } else {
        btnBook = CreateDomElements.createNewElement('a', ['btn__book']);
      }
      CreateDomElements.setAttributes(btnBook, { href: `#textbook/words?group=${i}&page=0` });

      CreateDomElements.setAttributes(
        level,
        {
          src: imgTextbookLevel[`book${i}`],
          'data-book': `${i}`,
          'data-page': 'textbook/words',
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
  }
}

export default TextbookTitlePage;
