import { BtnPaginationEnum } from '../../../types/textbook/enum';
import CreateDomElements from '../../controller/newElement';

class TextbookPagination {
  private btnsPagination: number;

  private startNumPagination: string[];

  private selectPage: boolean;

  public chooseNumPage: string;

  private firstPageOfGroup: string;

  private lastPageOfGroup: string;

  private averagePageOfGroup: number;

  constructor() {
    this.btnsPagination = 9;
    this.startNumPagination = ['2', '3', '4', '5'];
    this.selectPage = false;
    this.chooseNumPage = '0';
    this.firstPageOfGroup = '0';
    this.lastPageOfGroup = '29';
    this.averagePageOfGroup = 15;
  }

  public renderPaginationMenu(
    historyPage?: string,
    choosePage: boolean = this.selectPage,
  ): HTMLElement {
    if (historyPage && +historyPage > 5 && +historyPage < 26) {
      this.startNumPagination = [`${+historyPage - 1}`,
        historyPage, `${+historyPage + 1}`, `${+historyPage + 2}`];
      this.chooseNumPage = historyPage;
      this.selectPage = true;
    } else if (historyPage) {
      this.chooseNumPage = historyPage;
      this.selectPage = true;
    }

    let elementBtn = '';
    let num = 0;
    let startOrEndNum = 6;
    let addClass: string[];

    const curPage = `${+this.chooseNumPage + 1}`;
    const container: HTMLElement = CreateDomElements.createNewElement('div', ['container__pag']);

    if ((+this.startNumPagination[0]) > this.averagePageOfGroup) {
      startOrEndNum = 2;
    }

    for (let i = 0; i < this.btnsPagination; i += 1) {
      switch (i) {
        case 0:
          elementBtn = BtnPaginationEnum.prev;
          break;
        case 1:
          elementBtn = BtnPaginationEnum.start;
          break;
        case startOrEndNum:
          elementBtn = BtnPaginationEnum.random;
          break;
        case this.btnsPagination - 2:
          elementBtn = BtnPaginationEnum.end;
          break;
        case this.btnsPagination - 1:
          elementBtn = BtnPaginationEnum.next;
          break;
        default:
          elementBtn = this.startNumPagination[num];
          num += 1;
          break;
      }

      if (elementBtn === curPage && this.selectPage) {
        addClass = ['btn__pag', 'btn__pag-style', 'btn__choose'];
      } else if (i === 1 && !this.selectPage) {
        addClass = ['btn__pag', 'btn__pag-style', 'btn__choose'];
      } else {
        addClass = ['btn__pag', 'btn__pag-style'];
      }
      const btnPagination: HTMLElement = CreateDomElements.createNewElement('button', addClass, elementBtn);
      CreateDomElements.setAttributes(btnPagination, { 'data-page': `${elementBtn}` });

      CreateDomElements.insertChilds(container, [btnPagination]);
    }

    if (choosePage) {
      const containerPag = document.querySelector('.wrapper__pag') as HTMLElement;
      while (containerPag.firstElementChild) {
        containerPag.firstElementChild.remove();
      }
      CreateDomElements.insertChilds(containerPag, [container]);
      return;
    }

    return container;
  }

  public changeNumPagination(btn: string): void {
    switch (btn) {
      case BtnPaginationEnum.next:
        this.controlBtnNext();
        break;

      case BtnPaginationEnum.random:
        this.controlBtnRandom();
        break;

      case BtnPaginationEnum.prev:
        this.controlBtnPrevious();
        break;

      case BtnPaginationEnum.end:
        this.startNumPagination = ['26', '27', '28', '29'];
        this.chooseNumPage = this.lastPageOfGroup;
        break;

      case BtnPaginationEnum.start:
        this.startNumPagination = ['2', '3', '4', '5'];
        this.chooseNumPage = this.firstPageOfGroup;
        break;

      default:
        this.chooseNumPage = `${+btn - 1}`;
        break;
    }
    this.selectPage = true;
    this.renderPaginationMenu();
    this.selectPage = false;
  }

  private controlBtnNext(): void {
    if (this.chooseNumPage === this.lastPageOfGroup) {
      return;
    }
    if (this.startNumPagination.includes(this.lastPageOfGroup)
      || this.chooseNumPage === this.firstPageOfGroup) {
      this.chooseNumPage = `${+this.chooseNumPage + 1}`;
    } else {
      this.startNumPagination = this.startNumPagination.map((el) => `${+el + 1}`);
      this.chooseNumPage = `${+this.chooseNumPage + 1}`;
    }
  }

  private controlBtnRandom(): void {
    if (+(this.startNumPagination[0]) > this.averagePageOfGroup) {
      this.startNumPagination = this.startNumPagination.map((el) => `${+el - 3}`);
      [,this.chooseNumPage, , ,] = this.startNumPagination;
    } else {
      this.startNumPagination = this.startNumPagination.map((el) => `${+el + 3}`);
      [,this.chooseNumPage, , ,] = this.startNumPagination;
    }
  }

  private controlBtnPrevious(): void {
    if (this.chooseNumPage === this.firstPageOfGroup) {
      return;
    }
    if (this.startNumPagination.includes('2') || this.chooseNumPage === this.lastPageOfGroup) {
      this.chooseNumPage = `${+this.chooseNumPage - 1}`;
    } else {
      this.startNumPagination = this.startNumPagination.map((el) => `${+el - 1}`);
      this.chooseNumPage = `${+this.chooseNumPage - 1}`;
    }
  }
}

export default TextbookPagination;
