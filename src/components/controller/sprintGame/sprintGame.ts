import { AuthorizeUserWords, WordStructure } from '../../../types/loadServerData/interfaces';
import Api from '../textbook/controller';
import SprintPage from '../../view/sprintView/sprintPageRender';
import { getRandomInt, shuffle } from '../../utils/utils';
import IwordInfo from '../../../types/sprintGame/IwordInfo';
import Audiocall from '../audiocall/audiocall';
import getUserData from '../../utils/userLogin';
import makeNewStat from '../../utils/sendStatistics';
import { GameName } from '../../../types/statistics/interfaces';
import CustomStorage from '../storage';

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

  bestStreak: number;

  currentStreak: number;

  constructor(group: string, page?: string) {
    this.words = [];
    this.wrongWords = [];
    this.correctAnswers = [];
    this.wrongAnswers = [];
    this.score = 0;
    this.wordsCounter = 0;
    this.countOfCorrectAnswer = 0;
    this.group = group;
    this.page = page;
    this.pointsMultiplier = 1;
    this.bestStreak = 0;
    this.currentStreak = 0;
  }

  private correctAudio = new Audio('./assets/audio/correct.mp3');

  private wrongAudio = new Audio('./assets/audio/wrong.mp3');

  private audioCall = new Audiocall();

  async renderPage() {
    document.querySelector('body').innerHTML = '';
    await this.createArraysForGame();
    const cardInfo = this.getCurrentWordInfo();
    SprintPage.renderStartScreen();
    setTimeout(() => {
      SprintPage.renderSprintPage(cardInfo, this.score);
      this.keydownListen();
      this.wordsCounter += 1;
      this.timer();
      this.listen();
    }, 4000);
  }

  private async createArraysForGame() {
    if (!this.page) {
      this.page = getRandomInt(0, 20).toString();
    }

    if (CustomStorage.getStorage('token')) {
      const response = await Api.getWordsWithOption(
        this.group,
        this.page,
        getUserData(),
      ) as AuthorizeUserWords[];
      this.words = shuffle(response[0].paginatedResults);
    } else {
      const unLoginResponse = await Audiocall.getWords(+this.group, +this.page);
      this.words = shuffle(unLoginResponse);
    }

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
    let countForCorrectAnswer = 0;
    let strPointsForCorrectAnswer = '';
    if (this.pointsMultiplier > 1) {
      countForCorrectAnswer = this.pointsMultiplier * 10;
    }
    strPointsForCorrectAnswer = countForCorrectAnswer ? `+ ${countForCorrectAnswer} очков за слово!` : '';
    SprintPage.renderCard(cardInfo, this.score, strPointsForCorrectAnswer);
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
    const timer = setInterval(async () => {
      if (+timerShow.innerHTML <= 0) {
        clearInterval(timer);
        document.removeEventListener('keydown', this.keydownListener);
        SprintPage.renderStatistics(this.score, this.wrongAnswers, this.correctAnswers);
        if (CustomStorage.getStorage('token')) {
          this.audioCall.sendOptions(this.correctAnswers, this.wrongAnswers);
          this.audioCall.sendOptions(this.wrongAnswers, this.wrongAnswers);
          setTimeout(async () => {
            const statistics = await makeNewStat(
              this.correctAnswers,
              this.wrongAnswers,
              GameName.sprint,
              this.bestStreak,
            );
            await Api.updateStatistics(getUserData(), statistics);
          }, 0);
        }
      } else {
        timerShow.innerHTML = (+timerShow.innerHTML - 1).toString();
      }
    }, 1000);
  }

  private async updateStatistics(isTrueAnswer: boolean) {
    const word = this.words[this.wordsCounter];
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
      this.correctAnswers.push(word);
      this.currentStreak += 1;
    } else {
      if (this.countOfCorrectAnswer > 0) {
        this.countOfCorrectAnswer -= 1;
      }
      this.addModifier('wrong');
      this.wrongAudio.currentTime = 0;
      this.wrongAudio.play();
      this.pointsMultiplier = 1;
      this.wrongAnswers.push(word);
      this.currentStreak = 0;
    }

    if (this.currentStreak > this.bestStreak) {
      this.bestStreak = this.currentStreak;
    }
  }

  private keydownListener(event: KeyboardEvent) {
    const rightButtton = document.querySelector('.card__button_correct');
    const leftButton = document.querySelector('.card__button_wrong');
    event.preventDefault();
    const click = new Event('click');
    if (event.code === 'ArrowRight') {
      rightButtton.dispatchEvent(click);
    }
    if (event.code === 'ArrowLeft') {
      leftButton.dispatchEvent(click);
    }
  }

  private keydownListen() {
    document.addEventListener('keydown', this.keydownListener);
  }

  listen() {
    const rightButtton = document.querySelector('.card__button_correct');
    const leftButton = document.querySelector('.card__button_wrong');

    const answerListener = (event: Event) => {
      event.preventDefault();
      const target = event.target as HTMLLinkElement;
      const buttonAnswer = target.dataset.answer;
      if (this.currentWord.answer === buttonAnswer) {
        this.updateStatistics(true);
      } else {
        this.updateStatistics(false);
      }
      setTimeout(() => this.renderNewCard(), 0);
    };

    rightButtton.addEventListener('click', answerListener);

    leftButton.addEventListener('click', answerListener);
  }
}

export default SprintGame;
