import { MethodEnum } from '../../../types/loadServerData/enum';
import { WordStructure } from '../../../types/loadServerData/interfaces';
import {
  BtndifficultyEnum, BtnUserControlEnum, GroupWordsEnum, WordProgressEnum,
} from '../../../types/textbook/enum';
import NewElement from '../../controller/newcomponent';
import ControllerTextbook from '../../controller/textbook/controller';

class TextbookUsers {
  private newElement: NewElement;

  private cotroller: ControllerTextbook;

  private isLogin: string | null;

  private hardGroup: string;

  private prePage :string;

  constructor(isLogin: string | null) {
    this.newElement = new NewElement();
    this.cotroller = new ControllerTextbook();
    this.isLogin = isLogin;
    this.hardGroup = '6';
    this.prePage = '0';
  }

  public renderControlBtn(group: string): HTMLElement {
    const containerBtnUser: HTMLElement = this.newElement.createNewElement('div', ['container__user']);
    const btnDone: HTMLElement = this.newElement.createNewElement('button', ['btn__user'], 'Изучено');
    let btnHard: HTMLElement;

    if (group === this.hardGroup) {
      btnHard = this.newElement.createNewElement('button', ['btn__user'], 'Удалить');
    } else {
      btnHard = this.newElement.createNewElement('button', ['btn__user'], 'Сложное');
    }

    this.newElement.setAttributes(btnDone, { 'data-control': 'done' });
    this.newElement.setAttributes(btnHard, { 'data-control': 'hard' });

    this.newElement.insertChilds(containerBtnUser, [btnHard, btnDone]);
    this.listenBtnUser(containerBtnUser, group);
    this.stylePageGroup(group, [btnHard, btnDone]);
    this.stylePageGroupPag(group);
    return containerBtnUser;
  }

  private listenBtnUser(btns: HTMLElement, group: string) {
    btns.addEventListener('click', (e: Event) => {
      const target = (e.target as HTMLButtonElement);
      const btn: string = target.dataset.control;
      const word = target.closest('.card') as HTMLDivElement;
      if (group === this.hardGroup) {
        this.setHardWordForUser(btn, word);
      } else {
        this.setWordForUser(target, word);
      }
    });
  }

  private async setHardWordForUser(btn: string, word: HTMLDivElement): Promise<void> {
    const wordId = word.getAttribute('id');

    switch (btn) {
      case BtnUserControlEnum.done:
        await this.cotroller.CreateOrUpdateUserWord(
          {
            difficulty: BtndifficultyEnum.easy,
            progress: WordProgressEnum.end,
            wordId,
            request: MethodEnum.put,
          },
        ) as Response;
        word.remove();
        break;

      case BtnUserControlEnum.hard:
        await this.cotroller.GetOrDeleteWordUser(
          {
            wordId,
            request: MethodEnum.delete,
          },
        ) as Response;
        word.remove();
        break;

      default:
        break;
    }
  }

  private async setWordForUser(button: HTMLButtonElement, word: HTMLDivElement): Promise<void> {
    let method: string = MethodEnum.post;
    let difficulty: string = BtndifficultyEnum.easy;
    const wordId = word.getAttribute('id');
    const btn: string = button.dataset.control;
    try {
      const checkWord = await this.cotroller.GetOrDeleteWordUser({
        wordId,
        request: MethodEnum.get,
      }) as Response;

      if (checkWord.ok) {
        method = MethodEnum.put;
        ({ difficulty } = await checkWord.json());
        if (difficulty === 'easy' && btn !== 'hard') {
          this.unmarkDoneWord(word);
          return;
        }
      }
    } catch (error) {
      console.error(error);
    }

    switch (btn) {
      case BtnUserControlEnum.done:
        await this.cotroller.CreateOrUpdateUserWord(
          {
            difficulty: BtndifficultyEnum.easy,
            progress: WordProgressEnum.end,
            wordId,
            request: method,
          },
        ) as Response;
        word.classList.remove('card__hard');
        word.classList.add('card__done');
        break;

      case BtnUserControlEnum.hard:
        await this.cotroller.CreateOrUpdateUserWord(
          {
            difficulty: BtndifficultyEnum.hard,
            progress: WordProgressEnum.start,
            wordId,
            request: method,
          },
        ) as Response;
        word.classList.remove('card__done');
        word.classList.add('card__hard');
        break;

      default:
        break;
    }
  }

  public markWordsUser(card: HTMLElement, word: WordStructure): void {
    if (word.userWord) {
      switch (word.userWord.difficulty) {
        case 'hard':
          card.classList.add('card__hard');
          break;

        default:
          card.classList.add('card__done');
          break;
      }
    }
  }

  private async unmarkDoneWord(word: HTMLDivElement): Promise<void> {
    const wordId = word.getAttribute('id');
    await this.cotroller.GetOrDeleteWordUser({
      wordId,
      request: MethodEnum.delete,
    }) as Response;

    word.classList.remove('card__done');
  }

  private stylePageGroup(group: string, word: HTMLElement[]): void {
    const wordColor: HTMLElement[] = word;

    switch (group) {
      case GroupWordsEnum.one:
        wordColor.forEach((btn) => btn.classList.add('card__group0'));
        break;
      case GroupWordsEnum.two:
        wordColor.forEach((btn) => btn.classList.add('card__group1'));
        break;
      case GroupWordsEnum.three:
        wordColor.forEach((btn) => btn.classList.add('card__group2'));
        break;
      case GroupWordsEnum.four:
        wordColor.forEach((btn) => btn.classList.add('card__group3'));
        break;
      case GroupWordsEnum.five:
        wordColor.forEach((btn) => btn.classList.add('card__group4'));
        break;
      case GroupWordsEnum.six:
        wordColor.forEach((btn) => btn.classList.add('card__group5'));
        break;
      default:
        wordColor.forEach((btn) => btn.classList.add('card__group6'));
        break;
    }
  }

  public stylePageGroupPag(group: string): void {
    const btnPag = document.querySelectorAll('.btn__pag-style') as NodeListOf<Element>;

    switch (group) {
      case GroupWordsEnum.one:
        btnPag.forEach((btn) => {
          this.stylePagination(btn, GroupWordsEnum.one);
        });
        this.prePage = GroupWordsEnum.one;
        break;
      case GroupWordsEnum.two:
        btnPag.forEach((btn) => {
          this.stylePagination(btn, GroupWordsEnum.two);
        });
        this.prePage = GroupWordsEnum.two;
        break;
      case GroupWordsEnum.three:
        btnPag.forEach((btn) => {
          this.stylePagination(btn, GroupWordsEnum.three);
        });
        this.prePage = GroupWordsEnum.three;
        break;
      case GroupWordsEnum.four:
        btnPag.forEach((btn) => {
          this.stylePagination(btn, GroupWordsEnum.four);
        });
        this.prePage = GroupWordsEnum.four;
        break;
      case GroupWordsEnum.five:
        btnPag.forEach((btn) => {
          this.stylePagination(btn, GroupWordsEnum.five);
        });
        this.prePage = GroupWordsEnum.five;
        break;
      case GroupWordsEnum.six:
        btnPag.forEach((btn) => {
          this.stylePagination(btn, GroupWordsEnum.six);
        });
        this.prePage = GroupWordsEnum.six;
        break;
      default:
        btnPag.forEach((btn) => {
          this.stylePagination(btn, GroupWordsEnum.seven);
        });
        this.prePage = GroupWordsEnum.seven;
        break;
    }
  }

  private stylePagination(btn: Element, curPage: string): void {
    btn.classList.remove(`card__group${this.prePage}`);
    btn.classList.add(`card__group${curPage}`);
  }
}

export default TextbookUsers;
