import { WordStructure } from '../../../types/loadServerData/interfaces';
import {
  BtndifficultyEnum, BtnUserControlEnum, GroupWordsEnum,
} from '../../../types/textbook/enum';
import CreateDomElements from '../../controller/newElement';
import Api from '../../controller/textbook/controller';

class TextbookUsers {
  private isLogin: string | null;

  private hardGroup: string;

  private prePage :string;

  constructor(isLogin: string | null) {
    this.isLogin = isLogin;
    this.hardGroup = '6';
    this.prePage = '0';
  }

  public renderControlBtn(group: string): HTMLElement {
    const containerBtnUser: HTMLElement = CreateDomElements.createNewElement('div', ['container__user']);
    const btnDone: HTMLElement = CreateDomElements.createNewElement('button', ['btn__user'], 'Изучено');
    let btnHard: HTMLElement;

    if (group === this.hardGroup) {
      btnHard = CreateDomElements.createNewElement('button', ['btn__user'], 'Удалить');
    } else {
      btnHard = CreateDomElements.createNewElement('button', ['btn__user'], 'Сложное');
    }

    CreateDomElements.setAttributes(btnDone, { 'data-control': 'done' });
    CreateDomElements.setAttributes(btnHard, { 'data-control': 'hard' });

    CreateDomElements.insertChilds(containerBtnUser, [btnHard, btnDone]);
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
        await Api.updateUserWord(
          wordId,
          {
            difficulty: BtndifficultyEnum.normal,
            optional: { isLearned: true },

          },
        ) as Response;
        word.remove();
        break;

      case BtnUserControlEnum.hard:
        await Api.deleteWordUser(wordId) as Response;
        word.remove();
        break;

      default:
        break;
    }
  }

  private async setWordForUser(button: HTMLButtonElement, word: HTMLDivElement): Promise<void> {
    const wordId: string = word.getAttribute('id');
    const btn: string = button.dataset.control;
    try {
      const checkWord = await Api.getWordUser(wordId) as Response;

      if (checkWord.ok) {
        this.updateWordForUser(btn, wordId, word);

        const { optional } = await checkWord.json();

        if (optional.isLearned === true && btn !== 'hard') {
          this.unmarkDoneWord(word);
          return;
        }
        return;
      }
    } catch (error) {
      console.error(error);
    }

    switch (btn) {
      case BtnUserControlEnum.done:
        await Api.createUserWord(
          wordId,
          {
            difficulty: BtndifficultyEnum.normal,
            optional: { isLearned: true },
          },
        ) as Response;
        word.classList.remove('card__hard');
        word.classList.add('card__done');
        break;

      case BtnUserControlEnum.hard:
        await Api.createUserWord(
          wordId,
          {
            difficulty: BtndifficultyEnum.hard,
            optional: { isLearned: false },

          },
        ) as Response;
        word.classList.remove('card__done');
        word.classList.add('card__hard');
        break;

      default:
        break;
    }
  }

  private async updateWordForUser(
    btn: string,
    wordId: string,
    word: HTMLDivElement,
  ): Promise<void> {
    switch (btn) {
      case BtnUserControlEnum.done:
        await Api.updateUserWord(
          wordId,
          {
            difficulty: BtndifficultyEnum.normal,
            optional: { isLearned: true },

          },
        ) as Response;
        word.classList.remove('card__hard');
        word.classList.add('card__done');
        break;

      case BtnUserControlEnum.hard:
        await Api.updateUserWord(
          wordId,
          {
            difficulty: BtndifficultyEnum.hard,
            optional: { isLearned: false },

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
    await Api.deleteWordUser(wordId) as Response;

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
