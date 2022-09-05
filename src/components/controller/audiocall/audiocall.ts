import { MethodEnum, UrlFolderEnum } from '../../../types/loadServerData/enum';
import { AuthorizeUserWords, UserWordStructure, WordStructure } from '../../../types/loadServerData/interfaces';
import { GameName } from '../../../types/statistics/interfaces';
import baseUrl from '../../model/baseUrl';
import { filterHardWords } from '../../model/filtersWords';
import cleanPage from '../../utils/cleanPage';
import getGroupAndPage from '../../utils/getGroupAndPage';
import makeNewStat from '../../utils/sendStatistics';
import getUserData from '../../utils/userLogin';
import { shuffle, getRandomInt } from '../../utils/utils';
import AudiocallRender from '../../view/audiocall/audiocall-render';
import Loader from '../load';
import CreateDomElements from '../newElement';
import CustomStorage from '../storage';
import Api from '../textbook/controller';

class Audiocall extends AudiocallRender {
  words: WordStructure[];

  correctAnswers: WordStructure[];

  wrongAnswers: WordStructure[];

  index: number;

  supportWords: string[];

  correctAnswer: WordStructure;

  isLogin: boolean;

  render: AudiocallRender;

  bestSeriesCount: number;

  seriesCount: number;

  constructor() {
    super();
    this.index = 0;
    this.bestSeriesCount = 0;
    this.seriesCount = 0;
    this.words = [];
    this.supportWords = [];
    this.correctAnswer = {} as WordStructure;
    this.correctAnswers = [];
    this.wrongAnswers = [];
    this.isLogin = Boolean(CustomStorage.getStorage('token'));
    this.render = new AudiocallRender();
  }

  static async getWords(group: number, page: number): Promise<WordStructure[]> {
    const result = await Loader.load(
      {
        method: MethodEnum.get,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
      [UrlFolderEnum.words],

      [`page=${page}`, `group=${group}`],
    ) as Response;
    const words: WordStructure[] = await result.json();
    return words;
  }

  async getUserWordsWithOpt(group: number, page: number): Promise<WordStructure[]> {
    const wordArr = await Api
      .getWordsWithOption(String(group), String(page), getUserData()) as AuthorizeUserWords[];
    const textbookWords = wordArr[0].paginatedResults; // array
    const unmarkedWords = textbookWords.filter((word: WordStructure) => !word.userWord);
    const normalWords = textbookWords.filter((word: WordStructure) => word.userWord)
      .filter((item: WordStructure) => item.userWord.difficulty === 'normal' && !item.userWord.optional.isLearned);
    const hardWords = textbookWords.filter((word: WordStructure) => word.userWord)
      .filter((item: WordStructure) => item.userWord.difficulty === 'hard');
    const words = [...unmarkedWords, ...normalWords, ...hardWords];
    return words;
  }

  async addMoreWords(group: number, page: number): Promise<void> {
    while (this.words.length < 20 && page > 0) {
    // eslint-disable-next-line no-await-in-loop, no-param-reassign
      this.words = this.words.concat(await this.getUserWordsWithOpt(group, page -= 1)) // не бейте
        .slice(0, 20);
    }
  }

  async buildSupportWords(): Promise<void> {
    const supportArray1 = await Audiocall.getWords(getRandomInt(0, 5), getRandomInt(0, 29));
    const supportArray2 = await Audiocall.getWords(getRandomInt(0, 5), getRandomInt(0, 29));
    this.supportWords = shuffle(supportArray1.concat(supportArray2))
      .map((item: WordStructure) => item.wordTranslate);
  }

  async buildAllWords(index: number, group?: number, page?: number): Promise<void> {
    if (index === 0 && localStorage.getItem('page').includes('game/audio-call/play') && this.isLogin) {
      const args: string[] = getGroupAndPage(localStorage.getItem('page'));
      if (+args[0] < 6) {
        this.words = shuffle(await this.getUserWordsWithOpt(+args[0], +args[1]));
        if (this.words.length < 20) {
          await this.addMoreWords(+args[0], +args[1]);
        }
      } else {
        const hardUserWords = shuffle(await Api.getfilterWords(getUserData(), filterHardWords));
        this.words = hardUserWords[0].paginatedResults;
      }
    } else if (index === 0 && localStorage.getItem('page').includes('game/audio-call/play')) {
      const args: string[] = getGroupAndPage(localStorage.getItem('page'));
      this.words = shuffle(await Audiocall.getWords(+args[0], +args[1]));
    } else {
      this.words = shuffle(await Audiocall.getWords(group, page));
    }
    await this.buildSupportWords();
  }

  async buildGameLogic(index: number): Promise<void> {
    if (index === 0) {
      await this.buildAllWords(index, +localStorage.getItem('audiocallLevel'), getRandomInt(0, 29));
    } else if (index === this.words.length) {
      this.showResults();

      if (this.isLogin && this.words.length !== 0) {
        this.sendOptions(this.correctAnswers, this.wrongAnswers);
        this.sendOptions(this.wrongAnswers, this.wrongAnswers);
        const statistics = await makeNewStat(
          this.correctAnswers,
          this.wrongAnswers,
          GameName.audiocall,
          this.bestSeriesCount,
        );
        await Api.updateStatistics(getUserData(), statistics);
      }

      return;
    }

    if (this.words.length !== 0) {
      this.correctAnswer = this.words[index];
      const audio = document.getElementById('audio') as HTMLAudioElement;
      const wordImg = document.getElementById('word-img') as HTMLImageElement;
      wordImg.classList.add('hidden');
      const nextBtn = document.getElementById('next-btn') as HTMLButtonElement;
      const word = document.getElementById('word');
      word.classList.add('hidden');

      const answerBtns = Array.from(document.getElementsByClassName('answer-btn')) as HTMLButtonElement[];
      this.supportWords = shuffle(this.supportWords);
      const answers: string[] = shuffle(
        [this.correctAnswer.wordTranslate, ...this.supportWords.slice(0, 4)],
      );
      for (let i = 0; i < answerBtns.length; i += 1) {
        answerBtns[i].style.backgroundColor = '';
        answerBtns[i].innerText = answers[i];
        answerBtns[i].dataset.inner = answers[i];
        answerBtns[i].removeAttribute('disabled');
      }
      nextBtn.removeAttribute('disabled');
      word.innerText = `${this.correctAnswer.word} - ${this.correctAnswer.transcription} - ${this.correctAnswer.wordTranslate}`;
      wordImg.src = `${baseUrl}/${this.correctAnswer.image}`;
      audio.src = `${baseUrl}/${this.correctAnswer.audio}`;
      audio.play();
      this.index += 1;
    } else this.showResults();
  }

  selectLevel(target: HTMLElement): void {
    const levelBtns = Array.from(document.querySelectorAll('.audiocall__level-btn')) as HTMLButtonElement[];
    levelBtns.forEach((item) => item.toggleAttribute('disabled'));
    CustomStorage.setStorage('audiocallLevel', target.dataset.level);
    target.classList.toggle('active');
    target.removeAttribute('disabled');
    document.getElementById('start-btn').toggleAttribute('disabled');
  }

  buildAnswers(results: WordStructure[], title: string): HTMLElement {
    const answers = CreateDomElements.createNewElement('div', ['results-items'], `<span>${title}: ${results.length}</span>`);
    for (let i = 0; i < results.length; i += 1) {
      const answer = CreateDomElements.createNewElement('div', ['results-item']);
      const soundImg = CreateDomElements.createNewElement('img', ['results-item__img']) as HTMLImageElement;
      soundImg.src = '../../../assets/svg/audio.svg';
      const audio = CreateDomElements.createNewElement('audio', ['results-item__audio']) as HTMLAudioElement;
      audio.src = `${baseUrl}/${results[i].audio}`;
      const word = CreateDomElements.createNewElement('div', ['results-item__word'], `${results[i].word} - ${results[i].wordTranslate}`);
      CreateDomElements.insertChilds(answer, [soundImg, audio, word]);
      answers.appendChild(answer);
    }
    return answers;
  }

  showResults(): void {
    const prePage = CustomStorage.getStorage('prePage');
    const gameWrapper = document.querySelector('.audiocall-wrapper');
    gameWrapper.innerHTML = '';
    const resultsContainer = CreateDomElements.createNewElement('div', ['results-container']);
    const resultsWrapper = CreateDomElements.createNewElement('div', ['results-wrapper']);
    const resultsTitle = CreateDomElements.createNewElement('div', ['results-title'], '<span>Результаты</span>');
    const resultsBtn = CreateDomElements.createNewElement('a', ['results-btn', 'btn'], 'Завершить игру');
    CreateDomElements.setAttributes(resultsBtn, { id: 'results-btn', type: 'button', href: `#${prePage}` });
    if (this.correctAnswers.length === 0 && this.wrongAnswers.length === 0) {
      resultsWrapper.innerHTML = '<span>В рамках этого уровня на данной и предыдущих страницах все слова изучены</span>';
    } else {
      CreateDomElements.insertChilds(resultsWrapper, [this.buildAnswers(this.correctAnswers, 'Знаю'), this.buildAnswers(this.wrongAnswers, 'Ошибки')]);
    }
    CreateDomElements.insertChilds(resultsContainer, [resultsTitle, resultsWrapper, resultsBtn]);
    gameWrapper.appendChild(resultsContainer);
  }

  sendOptions(words: WordStructure[], comparedArray: WordStructure[]) {
    words.forEach(async (word: WordStructure) => {
      if (!word) return;
      const id = word._id ? word._id : word.id;
      let difficultyValue;
      let isWordLearned;
      let step;
      let updatedWord: UserWordStructure;
      let startLearningDate: string;

      if (!word.userWord) {
        await Api.createUserWord(id, { difficulty: 'normal', optional: { isLearned: false, learnStep: 0, startLearningAt: new Date().toLocaleDateString() } }, getUserData());
        const response = await Api.getWordUser(id, getUserData());
        updatedWord = await response.json() as UserWordStructure;
        difficultyValue = updatedWord.difficulty;
        step = updatedWord.optional.learnStep;
        isWordLearned = updatedWord.optional.isLearned;
        startLearningDate = new Date().toLocaleDateString();
      } else {
        difficultyValue = word.userWord.difficulty;
        isWordLearned = word.userWord.optional.isLearned;
        step = word.userWord.optional.learnStep;
        startLearningDate = word.userWord.optional.startLearningAt;
      }

      if ((step >= 2 && difficultyValue === 'normal') || (step >= 4 && difficultyValue === 'hard')) {
        isWordLearned = true; difficultyValue = 'normal';
      }

      if (words === comparedArray) {
        Api.updateUserWord(
          id,
          {
            difficulty: difficultyValue,
            optional: {
              isLearned: isWordLearned,
              learnStep: 0,
              startLearningAt: startLearningDate,
            },
          },
          getUserData(),
        );
      } else {
        Api.updateUserWord(
          id,
          {
            difficulty: difficultyValue,
            optional: {
              isLearned: isWordLearned,
              learnStep: step + 1,
              startLearningAt: startLearningDate,
            },
          },
          getUserData(),
        );
      }
    });
  }

  quitGame(): void {
    const gameWrapper: HTMLElement = document.querySelector('.audiocall-wrapper');
    gameWrapper.innerHTML = '';
    document.body.removeChild(gameWrapper);
    this.index = 0;
    this.words = [];
    this.supportWords = [];
    this.correctAnswer = {} as WordStructure;
    this.correctAnswers = [];
    this.wrongAnswers = [];
    localStorage.removeItem('audiocallLevel');
  }

  renderPage(): void {
    cleanPage();
    this.render.renderStartScreen();
    this.listen();
    if (localStorage.getItem('page').includes('game/audio-call/play')) {
      document.getElementById('level-btn').click();
      document.getElementById('start-btn').click();
      localStorage.removeItem('audiocallLevel');
    }
  }

  listen(): void {
    const gameWrapper = document.querySelector('.audiocall-wrapper');

    gameWrapper.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;

      if (target.id === 'close-game') {
        this.quitGame();
      }

      if (target.id === 'level-btn') {
        this.selectLevel(target);
      }

      if (target.id === 'results-btn') {
        this.quitGame();
      }

      if (target.id === 'start-btn') {
        this.render.renderGame();
        this.buildGameLogic(0);
      }

      if (target.id === 'next-btn') {
        const answerBtns = Array.from(document.querySelectorAll('.answer-btn')) as HTMLButtonElement[];
        answerBtns.forEach((item) => item.setAttribute('disabled', ''));
        answerBtns.forEach((item) => {
          if (item.dataset.inner === this.correctAnswer.wordTranslate) {
            const correctAnswer = item;
            correctAnswer.style.backgroundColor = '#7FB77E';
          }
        });

        if (target.dataset.inner === '→' && target.style.backgroundColor !== 'rgb(255, 74, 74)') { // сл слово после ответа
          this.buildGameLogic(this.index);
          target.innerText = 'Пропустить →';
          target.dataset.inner = 'Пропустить →';
          answerBtns.forEach((item) => item.removeAttribute('disabled'));
        } else if (target.dataset.inner === 'Пропустить →') { // пропустить слово
          (document.getElementById('wrong-audio') as HTMLAudioElement).play();
          target.innerText = '→';
          target.dataset.inner = '→';
          target.style.backgroundColor = 'rgb(255, 74, 74)';
          const wordImg = document.getElementById('word-img') as HTMLImageElement;
          const word = document.getElementById('word');
          wordImg.classList.remove('hidden');
          word.classList.remove('hidden');
          this.wrongAnswers.push(this.correctAnswer);
          this.seriesCount = 0;
        } else if (target.dataset.inner === '→' && target.style.backgroundColor === 'rgb(255, 74, 74)') { // сл слово после пропустить
          target.style.backgroundColor = '';
          target.innerText = 'Пропустить →';
          target.dataset.inner = 'Пропустить →';
          this.buildGameLogic(this.index);
          answerBtns.forEach((item) => item.removeAttribute('disabled'));
        }
      }

      if (target.id === 'answer-btn') {
        const answerBtns = Array.from(document.querySelectorAll('.answer-btn')) as HTMLButtonElement[];
        answerBtns.forEach((item) => item.setAttribute('disabled', ''));

        if (target.dataset.inner === this.correctAnswer.wordTranslate) {
          (document.getElementById('correct-audio') as HTMLAudioElement).play();
          target.removeAttribute('disabled');
          this.correctAnswers.push(this.correctAnswer);
          target.style.backgroundColor = '#7FB77E';

          this.seriesCount += 1;
          if (this.bestSeriesCount < this.seriesCount) {
            this.bestSeriesCount = this.seriesCount;
          }
        } else {
          answerBtns.forEach((item) => {
            if (item.dataset.inner === this.correctAnswer.wordTranslate) {
              (document.getElementById('wrong-audio') as HTMLAudioElement).play();
              const correctAnswer = item;
              correctAnswer.style.backgroundColor = '#7FB77E';
            }
          });
          target.removeAttribute('disabled');
          this.wrongAnswers.push(this.correctAnswer);
          target.style.backgroundColor = '#FF4A4A';
          this.seriesCount = 0;
        }
        const nextBtn = document.getElementById('next-btn') as HTMLButtonElement;
        nextBtn.innerText = '→';

        nextBtn.dataset.inner = '→';
        const wordImg = document.getElementById('word-img') as HTMLImageElement;
        const word = document.getElementById('word');
        wordImg.classList.remove('hidden');
        word.classList.remove('hidden');
      }

      if (target.classList.contains('results-item__img')) {
        (target.nextSibling as HTMLAudioElement).play();
      }
    });

    gameWrapper.addEventListener('keydown', (event: KeyboardEvent) => {
      event.preventDefault();
      switch (event.code) {
        case 'Digit1':
          (document.querySelector('[data-id="0"]') as HTMLButtonElement).click();
          break;
        case 'Digit2':
          (document.querySelector('[data-id="1"]') as HTMLButtonElement).click();
          break;
        case 'Digit3':
          (document.querySelector('[data-id="2"]') as HTMLButtonElement).click();
          break;
        case 'Digit4':
          (document.querySelector('[data-id="3"]') as HTMLButtonElement).click();
          break;
        case 'Digit5':
          (document.querySelector('[data-id="4"]') as HTMLButtonElement).click();
          break;
        case 'Space':

          (document.getElementById('next-btn') as HTMLButtonElement).click();
          break;
        default:
          break;
      }
    });
  }
}

export default Audiocall;
