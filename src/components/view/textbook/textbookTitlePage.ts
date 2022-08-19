import { DataWords } from '../../../types/loadServerData/interfaces';
import NewElement from '../../controller/newcomponent';
import ControllerTextbook from '../../controller/textbook/controller';
import { allLevel, bookLevelImg } from '../../model/textbook';
import TextbookPageSection from './textbookPageSection';

class TextbookTitlePage {
  private body;

  private newElement: NewElement;

  private cotroller: ControllerTextbook;

  private wrapper: HTMLElement;

  constructor() {
    this.newElement = new NewElement();
    this.body = document.querySelector('.body') as HTMLBodyElement;
    this.cotroller = new ControllerTextbook();
    this.wrapper = this.newElement.createNewElement('div', ['wrapper']);
  }

  public renderPageTextBook(): void {
    const menu: HTMLElement = this.newElement.createNewElement('div', ['menu'], 'Here will be menu!');
    const containerBook: HTMLElement = this.newElement.createNewElement('div', ['container__book']);
    const lineBook1: HTMLElement = this.newElement.createNewElement('div', ['line__book']);
    const lineBook2: HTMLElement = this.newElement.createNewElement('div', ['line__book']);
    const lineBook3: HTMLElement = this.newElement.createNewElement('div', ['line__book']);
    const title: HTMLElement = this.newElement.createNewElement('h1', ['title__book'], 'CHOOSE LEVEL');

    this.newElement.insertChilds(this.body, [this.wrapper]);
    this.newElement.insertChilds(this.wrapper, [menu, title, containerBook]);

    for (let i = 0; i < allLevel; i += 1) {
      const level: HTMLElement = this.newElement.createNewElement('img', ['img__book']);
      const btnBook: HTMLElement = this.newElement.createNewElement('button', ['btn__book']);

      this.newElement.setAttributes(
        level,
        {
          src: bookLevelImg[i],
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
    const sectionPage: TextbookPageSection = new TextbookPageSection(
      this.body,
      this.wrapper,
      this.cleanPage,
      group,
    );
    const response = (await this.cotroller.getwords(group, page)) as Response;
    const data: DataWords[] = await response.json();
    sectionPage.renderPageWithWords(data);
  }

  private cleanPage(): void {
    while (this.wrapper.firstElementChild) {
      this.wrapper.firstElementChild.remove();
    }
  }
}

export default TextbookTitlePage;
