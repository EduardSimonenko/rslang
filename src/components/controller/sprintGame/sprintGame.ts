import { WordStructure } from '../../../types/loadServerData/interfaces';
import Api from '../textbook/controller';
import SprintPage from '../../view/sprintView/sprintPageRender';
import { getRandomInt, shuffle } from '../../utils/utils';
import IwordInfo from '../../../types/sprintGame/IwordInfo';

class SprintGame {
  words: WordStructure[];

  wrongWords: WordStructure[];

  wordsCounter: number;

  currentWord: IwordInfo;

  correctAnswers: WordStructure[];

  wrongAnswers: WordStructure[];

  score: number;

  countOfCorrectAnswer: number;

  group: string;

  page: string;

  constructor(group: string, page: string) {
    this.words = [];
    this.wrongWords = [];
    this.score = 0;
    this.wordsCounter = 0;
    this.countOfCorrectAnswer = 0;
    this.group = group;
    this.page = page;
  }

  async startSprintGame() {
    document.querySelector('body').innerHTML = '';
    await this.createArraysForGame();
    this.buildGameLogic();
  }

  buildGameLogic() {
    this.renderNewCard();
  }

  private async createArraysForGame() {
    const response = await Api.getAllWords(this.group, this.page) as Response;
    this.words = shuffle(await response.json());

    const randomGroup = getRandomInt(0, 5).toString();
    const randomPage = getRandomInt(0, 20).toString();
    const secondResponse = await Api.getAllWords(randomGroup, randomPage) as Response;
    this.wrongWords = shuffle(await secondResponse.json());
  }

  private getCurrentWordInfo() {
    const correctWord = this.words[this.wordsCounter];
    const wrongWord = this.wrongWords[this.wordsCounter];

    const randomInt = getRandomInt(0, 1);

    const wordInfo = {
      name: correctWord.word,
      countOfCorrectAnswer: this.countOfCorrectAnswer,
    } as IwordInfo;

    if (randomInt === 0) {
      wordInfo.answer = 'true';
      wordInfo.wordTranslate = correctWord.wordTranslate;
    } else {
      wordInfo.answer = 'false';
      wordInfo.wordTranslate = wrongWord.wordTranslate;
    }

    this.currentWord = wordInfo;

    return wordInfo;
  }

  private renderNewCard() {
    const cardInfo = this.getCurrentWordInfo();
    SprintPage.renderSprintPage(cardInfo);
    this.wordsCounter += 1;
    this.listen();
  }

  listen() {
    const cardButtons = document.querySelector('.card__buttons');

    cardButtons.addEventListener('click', async (event) => {
      event.preventDefault();
      const target = event.target as HTMLLinkElement;
      const buttonAnswer = target.dataset.answer;
      if (!buttonAnswer) return;
      if (this.currentWord.answer === buttonAnswer) {
        this.countOfCorrectAnswer += 1;
        console.log('Вы правы');
      } else {
        this.countOfCorrectAnswer -= 1;
        console.log('Учи англ, сука');
      }

      this.renderNewCard();
    });
  }
}

export default SprintGame;
