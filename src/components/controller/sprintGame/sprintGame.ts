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

  pointsMultiplier: number;

  group: string;

  page: string;

  constructor(group: string, page?: string) {
    this.words = [];
    this.wrongWords = [];
    this.score = 0;
    this.wordsCounter = 0;
    this.countOfCorrectAnswer = 0;
    this.group = group;
    this.page = page;
    this.pointsMultiplier = 1;
  }

  private correctAudio = new Audio('./assets/sounds/true_sounds.mp3');

  private wrongAudio = new Audio('./assets/sounds/wrong_sounds.mp3');

  async renderPage() {
    document.querySelector('body').innerHTML = '';
    await this.createArraysForGame();
    const cardInfo = this.getCurrentWordInfo();
    SprintPage.renderSprintPage(cardInfo, this.score);
    this.wordsCounter += 1;
    this.timer();
    this.listen();
  }

  private async createArraysForGame() {
    if (!this.page) {
      this.page = getRandomInt(0, 20).toString();
    }
    const response = await Api.getAllWords(this.group, this.page);
    this.words = shuffle(response);

    const randomGroup = getRandomInt(0, 5).toString();
    const randomPage = getRandomInt(0, 20).toString();
    const secondResponse = await Api.getAllWords(randomGroup, randomPage);
    this.wrongWords = shuffle(secondResponse);
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

  private async updateWords() {
    this.wordsCounter = 0;
    if (this.page === '19') {
      this.page = '0';
    } else {
      this.page = (+this.page + 1).toString();
    }
    await this.createArraysForGame();
  }

  private renderNewCard() {
    if (this.wordsCounter > 19) {
      this.updateWords();
    }
    const cardInfo = this.getCurrentWordInfo();
    SprintPage.renderCard(cardInfo, this.score);
    this.wordsCounter += 1;
    this.listen();
  }

  private addModifier(modifier: string) {
    const card = document.querySelector('.sprint-game__card');
    card.classList.add(`sprint-game__card_${modifier}`);
    setTimeout(() => {
      card.classList.remove(`sprint-game__card_${modifier}`);
    }, 300);
  }

  private timer() {
    const timerShow = document.querySelector('.timer');
    const timer = setInterval(() => {
      if (+timerShow.innerHTML <= 0) {
        clearInterval(timer);
        alert('Время закончилось');
      } else {
        timerShow.innerHTML = (+timerShow.innerHTML - 1).toString();
      }
    }, 1000);
  }

  private async updateStatistics(isTrueAnswer: boolean) {
    if (this.countOfCorrectAnswer === 3 && isTrueAnswer) {
      this.countOfCorrectAnswer = -1;
      this.pointsMultiplier += 1;
    }

    if (isTrueAnswer) {
      this.addModifier('correct');
      this.countOfCorrectAnswer += 1;
      this.correctAudio.currentTime = 0;
      this.correctAudio.play();
      this.score += 10 * this.pointsMultiplier;
    } else {
      if (this.countOfCorrectAnswer > 0) {
        this.countOfCorrectAnswer -= 1;
      }
      this.addModifier('wrong');
      this.wrongAudio.currentTime = 0;
      this.wrongAudio.play();
      this.pointsMultiplier = 1;
    }
  }

  listen() {
    const cardButtons = document.querySelector('.card__buttons');

    cardButtons.addEventListener('click', async (event) => {
      event.preventDefault();
      const target = event.target as HTMLLinkElement;
      const buttonAnswer = target.dataset.answer;
      if (!buttonAnswer) return;
      if (this.currentWord.answer === buttonAnswer) {
        this.updateStatistics(true);
      } else {
        this.updateStatistics(false);
      }
      setTimeout(() => this.renderNewCard(), 300);
    });
  }
}

export default SprintGame;
