import { MethodEnum, UrlFolderEnum } from '../../../types/loadServerData/enum';
import { AuthorizeUserWords, WordStructure } from '../../../types/loadServerData/interfaces';
import baseUrl from '../../model/baseUrl';
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

  counter: number;

  supportWords: string[];

  correctAnswer: WordStructure;

  constructor() {
    super();
    this.counter = 0;
    this.words = [];
    this.supportWords = [];
    this.correctAnswer = {} as WordStructure;
    this.correctAnswers = [];
    this.wrongAnswers = [];
  }

  async getWords(group: number, page: number): Promise<WordStructure[]> {
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

  async getUserWordsWithOpt(group: number, page: number) {
    const response = await Api.getWordsWithOption(String(group), String(page));

    const wordArr: AuthorizeUserWords[] = await response.json();
    const textbookWords = wordArr[0].paginatedResults; // array

    const unmarkedWords = textbookWords.filter((word: WordStructure) => !word.userWord);
    const normalWords = textbookWords.filter((word: WordStructure) => word.userWord)
      .filter((item: WordStructure) => item.userWord.difficulty === 'normal' && !item.userWord.optional.isLearned);
    console.log('normalwords', normalWords);
    const hardWords = textbookWords.filter((word: WordStructure) => word.userWord)
      .filter((item: WordStructure) => item.userWord.difficulty === 'hard');

    const words = [...unmarkedWords, ...normalWords, ...hardWords];
    return words;
  }

  async addMoreWords(group: number, page: number) {
    while (this.words.length < 20 && page > 0) {
    // eslint-disable-next-line no-await-in-loop, no-param-reassign
      this.words = this.words.concat(await this.getUserWordsWithOpt(group, page -= 1))
        .slice(0, 20);
    }
  }

  async buildSupportWords(): Promise<void> {
    const supportArray1 = await this.getWords(getRandomInt(0, 5), getRandomInt(0, 29));
    const supportArray2 = await this.getWords(getRandomInt(0, 5), getRandomInt(0, 29));
    this.supportWords = shuffle(supportArray1.concat(supportArray2))
      .map((item: WordStructure) => item.wordTranslate);
  }

  async buildAllWords(index: number, group?: number, page?: number) {
    if (index === 0 && localStorage.getItem('textbookWords') && CustomStorage.getStorage('token')) {
      const args = JSON.parse(localStorage.getItem('textbookWords'));
      this.words = await this.getUserWordsWithOpt(args.group, args.page);
      if (this.words.length < 20) {
        await this.addMoreWords(args.group, args.page);
      }
    } else if (index === 0 && localStorage.getItem('textbookWords')) {
      const args = JSON.parse(localStorage.getItem('textbookWords'));
      this.words = shuffle(await this.getWords(args.group, args.page));
    } else {
      this.words = shuffle(await this.getWords(group, page));
    }
    await this.buildSupportWords();
  }

  async buildGameLogic(index: number): Promise<void> {
    if (index === 0) {
      await this.buildAllWords(index, +localStorage.getItem('audiocallLevel'), getRandomInt(0, 29));
      console.log('this.words', this.words);
    }
    if (index === this.words.length) {
      this.showResults();
      this.sendOptions(this.correctAnswers);
      return;
    }

    this.correctAnswer = this.words[index];
    const audio = document.getElementById('audio') as HTMLAudioElement;
    const wordImg = document.getElementById('word-img') as HTMLImageElement;
    const nextBtn = document.getElementById('next-btn') as HTMLButtonElement;
    wordImg.classList.add('hidden');
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
      answerBtns[i].removeAttribute('disabled');
    }
    nextBtn.removeAttribute('disabled');
    word.innerText = `${this.correctAnswer.word} - ${this.correctAnswer.transcription} - ${this.correctAnswer.wordTranslate}`;
    wordImg.src = `${baseUrl}/${this.correctAnswer.image}`;
    audio.src = `${baseUrl}/${this.correctAnswer.audio}`;
    audio.play();
    this.counter += 1;
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
    const gameWrapper = document.querySelector('.audiocall-wrapper');
    gameWrapper.innerHTML = '';
    const resultsContainer = CreateDomElements.createNewElement('div', ['results-container']);
    const resultsWrapper = CreateDomElements.createNewElement('div', ['results-wrapper']);
    const resultsTitle = CreateDomElements.createNewElement('div', ['results-title'], '<span>Результаты</span>');
    const resultsBtn = CreateDomElements.createNewElement('button', ['results-btn', 'btn'], 'Завершить игру');
    CreateDomElements.setAttributes(resultsBtn, { id: 'results-btn', type: 'button' });
    CreateDomElements.insertChilds(resultsWrapper, [this.buildAnswers(this.correctAnswers, 'Знаю'), this.buildAnswers(this.wrongAnswers, 'Ошибки')]);
    CreateDomElements.insertChilds(resultsContainer, [resultsTitle, resultsWrapper, resultsBtn]);
    gameWrapper.appendChild(resultsContainer);
  }

  async sendOptions(words: WordStructure[]) {
    // this.correctAnswers.forEach((word: WordStructure) => {
    //   Api.updateUserWord(word._id, { difficulty: 'normal', optional: { isLearned: true } });
    // });
    // const correctHardWords = this.correctAnswers.filter((word: WordStructure) => word.userWord)
    // .filter((item: WordStructure) => item.userWord.difficulty === 'hard');
    // correctHardWords.forEach((word: WordStructure) => {

    words.forEach((word: WordStructure) => {
      const id = word._id ? word._id : word.id;
      if (!word.userWord) {
        // eslint-disable-next-line max-len
        Api.createUserWord(id, { difficulty: 'normal', optional: { isLearned: false, learnStep: 1, startLearningAt: Date.now() } });
      } else {
        // const id = word._id ? word._id : word.id;
        // const method = word.userWord ? Api.updateUserWord : Api.createUserWord;
        let difficultyValue = word.userWord.difficulty ? word.userWord.difficulty : 'normal';
        let step = word.userWord.optional.learnStep ? word.userWord.optional.learnStep : 0;
        // eslint-disable-next-line max-len
        let isLearnedValue = word.userWord.optional.isLearned ? word.userWord.optional.isLearned : false;
        if ((step >= 2 && difficultyValue === 'normal') || (step >= 4 && difficultyValue === 'hard')) { isLearnedValue = true; difficultyValue = 'normal'; }
        // eslint-disable-next-line max-len
        const date = word.userWord.optional.startLearningAt ? word.userWord.optional.startLearningAt : Date.now();
        // eslint-disable-next-line max-len
        Api.updateUserWord(id, { difficulty: difficultyValue, optional: { isLearned: isLearnedValue, learnStep: step += 1, startLearningAt: date } });
      }
    });
    console.log('words', words);
    // const correctUnmarkedWords = this.correctAnswers
    //   .filter((word: WordStructure) => !word.userWord);
    // console.log('correctUnmarkedWords', correctUnmarkedWords);
    // const correctNormalWords = this.correctAnswers.filter((word: WordStructure) => word.userWord)
    // eslint-disable-next-line max-len
    //   .filter((item: WordStructure) => item.userWord.difficulty === 'normal' && !item.userWord.optional.isLearned);
    // console.log('correctNormalWords', correctNormalWords);
  }

  quitGame(): void {
    const gameWrapper = document.querySelector('.audiocall-wrapper');
    gameWrapper.innerHTML = '';
    document.body.removeChild(gameWrapper);
    document.body.style.overflowY = '';
    this.counter = 0;
    this.words = [];
    this.supportWords = [];
    this.correctAnswer = {} as WordStructure;
    this.correctAnswers = [];
    this.wrongAnswers = [];
  }

  renderPage(): void {
    super.renderGame();
    this.buildGameLogic(0);
  }

  async listen(): Promise<void> {
    document.addEventListener('click', async (event) => {
      event.preventDefault();
      const target = event.target as HTMLElement;
      // console.log(event.target);

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
        this.renderPage();
      }

      if (target.getAttribute('data-page') === 'audioCall') { // refactor
        if (CustomStorage.getStorage('textbookWords')) {
          super.renderStartScreen();
          document.getElementById('level-btn').click();
          document.getElementById('start-btn').click();
          localStorage.removeItem('audiocallLevel');
        } else super.renderStartScreen();
      }

      if (target.id === 'next-btn') { // refactor
        const answerBtns = Array.from(document.querySelectorAll('.answer-btn')) as HTMLButtonElement[];
        answerBtns.forEach((item) => item.setAttribute('disabled', ''));
        answerBtns.forEach((item) => {
          if (item.innerText === this.correctAnswer.wordTranslate) {
            const correctAnswer = item;
            correctAnswer.style.backgroundColor = '#7FB77E';
          }
        });
        if (target.innerText === '→' && target.style.backgroundColor !== 'rgb(255, 74, 74)') { // сл слово после ответа
          this.buildGameLogic(this.counter);
          target.innerText = 'Пропустить →';
          answerBtns.forEach((item) => item.removeAttribute('disabled'));
        } else if (target.innerText === 'Пропустить →') { // пропустить слово
          (document.getElementById('wrong-audio') as HTMLAudioElement).play();
          target.innerText = '→';
          target.style.backgroundColor = 'rgb(255, 74, 74)';
          const wordImg = document.getElementById('word-img') as HTMLImageElement;
          const word = document.getElementById('word');
          wordImg.classList.remove('hidden');
          word.classList.remove('hidden');
          this.wrongAnswers.push(this.correctAnswer);
        } else if (target.innerText === '→' && target.style.backgroundColor === 'rgb(255, 74, 74)') { // сл слово после пропустить
          target.style.backgroundColor = '';
          target.innerText = 'Пропустить →';
          this.buildGameLogic(this.counter);
          answerBtns.forEach((item) => item.removeAttribute('disabled'));
        }
      } //

      if (target.id === 'answer-btn') { // refactor
        const answerBtns = Array.from(document.querySelectorAll('.answer-btn')) as HTMLButtonElement[];
        answerBtns.forEach((item) => item.setAttribute('disabled', ''));
        if (target.innerText === this.correctAnswer.wordTranslate) {
          (document.getElementById('correct-audio') as HTMLAudioElement).play();
          target.removeAttribute('disabled');
          this.correctAnswers.push(this.correctAnswer);
          target.style.backgroundColor = '#7FB77E';
        } else {
          answerBtns.forEach((item) => {
            if (item.innerText === this.correctAnswer.wordTranslate) {
              (document.getElementById('wrong-audio') as HTMLAudioElement).play();
              const correctAnswer = item;
              correctAnswer.style.backgroundColor = '#7FB77E';
            }
          });
          target.removeAttribute('disabled');
          this.wrongAnswers.push(this.correctAnswer);
          target.style.backgroundColor = '#FF4A4A';
        }
        const nextBtn = document.getElementById('next-btn') as HTMLButtonElement;
        nextBtn.innerText = '→';
        const wordImg = document.getElementById('word-img') as HTMLImageElement;
        const word = document.getElementById('word');
        wordImg.classList.remove('hidden');
        word.classList.remove('hidden');
      }

      if (target.classList.contains('results-item__img')) {
        (target.nextSibling as HTMLAudioElement).play();
      }
    }); //

    document.addEventListener('keydown', (event) => {
      // event.preventDefault();
      if (document.querySelector('.play-field')) {
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
            event.preventDefault();
            (document.getElementById('next-btn') as HTMLButtonElement).click();
            break;
          default:
            break;
        }
      }
    });
  }

  start(): void {
    this.listen();
  }
}

export default Audiocall;
