import NewElement from '../../controller/newcomponent';

class TextbookPagination {
  private newElement: NewElement;

  private btnsPagination: number;

  private initNumPagination: string[];

  private selectPage: boolean;

  public chooseNumPage: string;

  constructor() {
    this.newElement = new NewElement();
    this.btnsPagination = 9;
    this.initNumPagination = ['2', '3', '4', '5'];
    this.selectPage = false;
    this.chooseNumPage = '0';
  }

  public renderPaginationMenu(choosePage: boolean = this.selectPage): HTMLElement {
    let elementBtn = '';
    let num = 0;
    let startOrEndNum = 6;
    let addClass: string[];

    const curPage = `${+this.chooseNumPage + 1}`;
    const container: HTMLElement = this.newElement.createNewElement('div', ['container__pag']);

    if (+(this.initNumPagination[0]) > 15) {
      startOrEndNum = 2;
    }

    for (let i = 0; i < this.btnsPagination; i += 1) {
      switch (i) {
        case 0:
          elementBtn = '◄';
          break;
        case 1:
          elementBtn = '1';
          break;
        case startOrEndNum:
          elementBtn = '…';
          break;
        case this.btnsPagination - 2:
          elementBtn = '30';
          break;
        case this.btnsPagination - 1:
          elementBtn = '►';
          break;
        default:
          elementBtn = this.initNumPagination[num];
          num += 1;
          break;
      }

      if (elementBtn === curPage && choosePage) {
        addClass = ['btn__pag', 'btn__choose'];
      } else if (i === 1 && !choosePage) {
        addClass = ['btn__pag', 'btn__choose'];
      } else {
        addClass = ['btn__pag'];
      }
      const btnPagination: HTMLElement = this.newElement.createNewElement('button', addClass, elementBtn);
      this.newElement.setAttributes(btnPagination, { 'data-page': `${elementBtn}` });

      this.newElement.insertChilds(container, [btnPagination]);
    }

    if (choosePage) {
      const containerPag = document.querySelector('.wrapper__pag') as HTMLElement;
      while (containerPag.firstElementChild) {
        containerPag.firstElementChild.remove();
      }
      this.newElement.insertChilds(containerPag, [container]);
      return;
    }

    return container;
  }

  public changeNumPagination(btn: string): void {
    switch (btn) {
      case '►':
        if (this.chooseNumPage === '29') {
          return;
        }
        if (this.initNumPagination.includes('29') || this.chooseNumPage === '0') {
          this.chooseNumPage = `${+this.chooseNumPage + 1}`;
        } else {
          this.initNumPagination = this.initNumPagination.map((el) => `${+el + 1}`);
          this.chooseNumPage = `${+this.chooseNumPage + 1}`;
        }
        break;

      case '…':
        if (+(this.initNumPagination[0]) > 15) {
          this.initNumPagination = this.initNumPagination.map((el) => `${+el - 3}`);
          [,this.chooseNumPage, , ,] = this.initNumPagination;
        } else {
          this.initNumPagination = this.initNumPagination.map((el) => `${+el + 3}`);
          [,this.chooseNumPage, , ,] = this.initNumPagination;
        }
        break;

      case '◄':
        if (this.chooseNumPage === '0') {
          return;
        }
        if (this.initNumPagination.includes('2') || this.chooseNumPage === '29') {
          this.chooseNumPage = `${+this.chooseNumPage - 1}`;
        } else {
          this.initNumPagination = this.initNumPagination.map((el) => `${+el - 1}`);
          this.chooseNumPage = `${+this.chooseNumPage - 1}`;
        }
        break;

      case '30':
        this.initNumPagination = ['26', '27', '28', '29'];
        this.chooseNumPage = '29';
        break;

      case '1':
        this.initNumPagination = ['2', '3', '4', '5'];
        this.chooseNumPage = '0';
        break;

      default:
        this.chooseNumPage = `${+btn - 1}`;
        break;
    }
    this.selectPage = true;
    this.renderPaginationMenu(this.selectPage);
    this.selectPage = false;
  }
}

export default TextbookPagination;
