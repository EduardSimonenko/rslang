import { MethodEnum, UrlFolderEnum } from '../../../types/loadServerData/enum';
import { WordStructure } from '../../../types/loadServerData/interfaces';
import { shuffle, getRandomInt } from '../../utils/utils';
import Loader from '../load';
import CreateDomElements from '../newElement';
import CustomStorage from '../storage';

class Audiocall extends Loader {
  words: WordStructure[];

  level: string;

  storage: CustomStorage;

  correctAnswers: WordStructure[];

  wrongAnswers: WordStructure[];

  counter: number;

  supportWords: string[];

  correctAnswer: WordStructure;

  NewElement: CreateDomElements;

  constructor() {
    super();
    this.counter = 0;
    this.words = [];
    this.supportWords = [];
    this.correctAnswer = {} as WordStructure;
    this.correctAnswers = [];
    this.wrongAnswers = [];
    this.level = localStorage.getItem('audiocallLevel');
    this.storage = new CustomStorage();
    this.NewElement = new CreateDomElements();
  }

  async getWords(level: number): Promise<WordStructure[]> {
    const randomPage = getRandomInt(0, 29);
    const result = await super.load(
      {
        method: MethodEnum.get,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
      [UrlFolderEnum.words],
      [`page=${randomPage}`, `group=${level}`],
    ) as Response;
    const words: WordStructure[] = await result.json();
    return words;
  }

  async buildGameLogic(index: number): Promise<void> {
    if (index === 0) {
      this.words = shuffle(await this.getWords(+this.level));
      const supportArray1 = await this.getWords(getRandomInt(0, 5));
      const supportArray2 = await this.getWords(getRandomInt(0, 5));
      this.supportWords = shuffle(supportArray1.concat(supportArray2))
        .map((item: WordStructure) => item.wordTranslate);
      console.log(this.supportWords);
    } else if (index === this.words.length) {
      // console.log({ correct: this.correctAnswers, wrong: this.wrongAnswers });
      const audiocallWrapper = document.querySelector('.audiocall-wrapper');
      audiocallWrapper.innerHTML = '';
      audiocallWrapper.appendChild(this.showResults());
      return;
    }

    this.correctAnswer = this.words[index];
    const audio = document.getElementById('audio') as HTMLAudioElement;
    const wordImg = document.getElementById('word-img') as HTMLImageElement;
    wordImg.classList.add('hidden');
    const word = document.getElementById('word');
    word.classList.add('hidden');
    word.innerText = `${this.correctAnswer.word} - ${this.correctAnswer.wordTranslate}`;
    wordImg.src = `https://rslang2022q1-learnwords.herokuapp.com/${this.correctAnswer.image}`;
    audio.src = `https://rslang2022q1-learnwords.herokuapp.com/${this.correctAnswer.audio}`;
    audio.play();

    const answerBtns = Array.from(document.getElementsByClassName('answer-btn')) as HTMLButtonElement[];
    this.supportWords = shuffle(this.supportWords);
    const answers: string[] = shuffle(
      [this.correctAnswer.wordTranslate, ...this.supportWords.slice(0, 4)],
    );
    for (let i = 0; i < answerBtns.length; i += 1) {
      answerBtns[i].style.backgroundColor = '';
      answerBtns[i].innerText = answers[i];
    }
    this.counter += 1;
  }

  showAnswers(results: WordStructure[], title: string): HTMLElement {
    const answers = CreateDomElements.createNewElement('div', ['results-items'], `<span>${title}: ${results.length}</span>`);
    for (let i = 0; i < results.length; i += 1) {
      const answer = CreateDomElements.createNewElement('div', ['results-item']);
      const soundImg = CreateDomElements.createNewElement('img', ['results-item__img']) as HTMLImageElement;
      soundImg.src = '../../../assets/svg/audio.svg';
      const audio = CreateDomElements.createNewElement('audio', ['results-item__audio']) as HTMLAudioElement;
      audio.src = `https://rslang2022q1-learnwords.herokuapp.com/${results[i].audio}`;
      const word = CreateDomElements.createNewElement('div', ['results-item__word'], `<span>${results[i].word}-${results[i].wordTranslate}</span>`);
      CreateDomElements.insertChilds(answer, [soundImg, audio, word]);
      answers.appendChild(answer);
    }
    return answers;
  }

  showResults(): HTMLElement {
    const resultsContainer = CreateDomElements.createNewElement('div', ['results-container']);
    const resultsWrapper = CreateDomElements.createNewElement('div', ['results-wrapper']);
    const resultsTitle = CreateDomElements.createNewElement('div', ['results-title'], '<span>Результаты</span>');
    const resultsBtn = CreateDomElements.createNewElement('button', ['results-btn', 'btn'], 'Завершить игру');
    CreateDomElements.setAttributes(resultsBtn, { id: 'results-btn', type: 'button' });
    CreateDomElements.insertChilds(resultsWrapper, [this.showAnswers(this.correctAnswers, 'Знаю'), this.showAnswers(this.wrongAnswers, 'Ошибки')]);
    CreateDomElements.insertChilds(resultsContainer, [resultsTitle, resultsWrapper, resultsBtn]);
    return resultsContainer;
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

  async listen(): Promise<void> {
    document.addEventListener('click', (event) => {
      event.preventDefault();
      const target = event.target as HTMLElement;
      console.log(event.target);

      if (target.id === 'close-game') {
        console.log('click');
        this.quitGame();
        // console.log('counter', this.counter);
        // console.log('words', this.words);
        // console.log('correctAnswer', this.correctAnswer);
        // console.log('correctAnswers', this.correctAnswers);
      }

      if (target.id === 'results-btn') {
        this.quitGame();
      }

      if (target.id === 'start-btn') {
        this.buildGameLogic(0);
      }

      if (target.id === 'next-btn') {
        if (target.innerText === '→' && target.style.backgroundColor !== 'rgb(255, 0, 0)') {
          this.buildGameLogic(this.counter);
          target.innerText = 'Пропустить →';
        } else if (target.innerText === 'Пропустить →') {
          target.innerText = '→';
          target.style.backgroundColor = 'rgb(255, 0, 0)';
          const wordImg = document.getElementById('word-img') as HTMLImageElement;
          const word = document.getElementById('word');
          wordImg.classList.remove('hidden');
          word.classList.remove('hidden');
          this.wrongAnswers.push(this.correctAnswer);
        } else if (target.innerText === '→' && target.style.backgroundColor === 'rgb(255, 0, 0)') {
          target.style.backgroundColor = '';
          target.innerText = 'Пропустить →';
          this.buildGameLogic(this.counter);
        }
        // console.log('wrong', this.wrongAnswers);
        // console.log('correct', this.correctAnswers);
      }

      if (target.id === 'answer-btn') {
        if (target.innerText === this.correctAnswer.wordTranslate) {
          this.correctAnswers.push(this.correctAnswer);
          target.style.backgroundColor = '#00ff00';
        } else {
          this.wrongAnswers.push(this.correctAnswer);
          target.style.backgroundColor = '#ff0000';
        }
        const nextBtn = document.getElementById('next-btn') as HTMLButtonElement;
        nextBtn.innerText = '→';
        const wordImg = document.getElementById('word-img') as HTMLImageElement;
        const word = document.getElementById('word');
        wordImg.classList.remove('hidden');
        word.classList.remove('hidden');
        // console.log('wrong', this.wrongAnswers);
        // console.log('correct', this.correctAnswers);
      }

      if (target.classList.contains('results-item__img')) {
        (target.nextSibling as HTMLAudioElement).play();
      }
    });

    document.addEventListener('keydown', (event) => {
      // event.preventDefault();
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
    });
  }

  async start(): Promise<void> {
    this.listen();
  }
}

export default Audiocall;
