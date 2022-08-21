import { MethodEnum } from '../../../types/loadServerData/enum';
import { BtndifficultyEnum, BtnUserControlEnum, WordProgressEnum } from '../../../types/textbook/enum';
import NewElement from '../../controller/newcomponent';
import ControllerTextbook from '../../controller/textbook/controller';

class TextbookUsers {
  private newElement: NewElement;

  private cotroller: ControllerTextbook;

  constructor() {
    this.newElement = new NewElement();
    this.cotroller = new ControllerTextbook();
  }

  public renderControlBtn(): HTMLElement {
    if (localStorage.getItem('token')) {
      const containerBtnUser: HTMLElement = this.newElement.createNewElement('div', ['container__user']);
      const btnHard: HTMLElement = this.newElement.createNewElement('button', ['btn__user'], 'Сложное');
      const btnDone: HTMLElement = this.newElement.createNewElement('button', ['btn__user'], 'Изучено');

      this.newElement.setAttributes(btnDone, { 'data-control': 'done' });
      this.newElement.setAttributes(btnHard, { 'data-control': 'hard' });

      this.newElement.insertChilds(containerBtnUser, [btnHard, btnDone]);
      this.listenBtnUser(containerBtnUser);
      return containerBtnUser;
    }
  }

  private listenBtnUser(btns: HTMLElement) {
    btns.addEventListener('click', (e: Event) => {
      const target = (e.target as HTMLButtonElement);
      const btn: string = target.dataset.control;
      const word = target.closest('.card') as HTMLDivElement;
      this.setWordForUser(btn, word);
    });
  }

  private async setWordForUser(btn: string, word: HTMLDivElement): Promise<void> {
    let method: string = MethodEnum.post;
    let difficulty: string = BtndifficultyEnum.easy;
    const wordId = word.getAttribute('id');

    try {
      const checkWord = await this.cotroller.GetAndDeleteWordUser({
        wordId,
        request: MethodEnum.get,
      }) as Response;

      if (checkWord.ok) {
        method = MethodEnum.put;
        ({ difficulty } = await checkWord.json());
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error(error);
    }

    switch (btn) {
      case BtnUserControlEnum.done:
        await this.cotroller.CreateAndUpdateUserWord(
          {
            difficulty: BtndifficultyEnum.easy,
            progress: WordProgressEnum.end,
            wordId,
            request: method,
          },
        ) as Response;

        if (difficulty === 'hard') {
          word.classList.remove('card__hard');
        }
        word.classList.add('card__done');
        break;

      case BtnUserControlEnum.hard:
        await this.cotroller.CreateAndUpdateUserWord(
          {
            difficulty: BtndifficultyEnum.hard,
            progress: WordProgressEnum.start,
            wordId,
            request: method,
          },
        ) as Response;

        word.classList.add('card__hard');
        break;

      default:
        break;
    }
  }
}

export default TextbookUsers;
