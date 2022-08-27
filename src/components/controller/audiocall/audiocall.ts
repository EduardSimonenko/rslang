import { MethodEnum, UrlFolderEnum } from '../../../types/loadServerData/enum';
import { WordStructure } from '../../../types/loadServerData/interfaces';
import { shuffle, getRandomInt } from '../../utils/utils';
import Loader from '../load';
import NewElement from '../newcomponent';
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

  NewElement: NewElement;

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
    this.NewElement = new NewElement();
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
        .map((item) => item.wordTranslate);
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
    const answers = this.NewElement.createNewElement('div', ['results-items'], `<span>${title}: ${results.length}</span>`);
    for (let i = 0; i < results.length; i += 1) {
      const answer = this.NewElement.createNewElement('div', ['results-item']);
      const soundImg = this.NewElement.createNewElement('img', ['results-item__img']) as HTMLImageElement;
      soundImg.src = '../../../assets/svg/audio.svg';
      const audio = this.NewElement.createNewElement('audio', ['results-item__audio']) as HTMLAudioElement;
      audio.src = `https://rslang2022q1-learnwords.herokuapp.com/${results[i].audio}`;
      const word = this.NewElement.createNewElement('div', ['results-item__word'], `<span>${results[i].word}-${results[i].wordTranslate}</span>`);
      this.NewElement.insertChilds(answer, [soundImg, audio, word]);
      answers.appendChild(answer);
    }
    return answers;
  }

  showResults(): HTMLElement {
    const resultsWrapper = this.NewElement.createNewElement('div', ['results-wrapper']);
    const resultsTitle = this.NewElement.createNewElement('div', ['results-title'], '<span>Результаты</span>');
    this.NewElement.insertChilds(resultsWrapper, [resultsTitle, this.showAnswers(this.correctAnswers, 'Знаю'), this.showAnswers(this.wrongAnswers, 'Ошибки')]);
    return resultsWrapper;
  }

  async listen(): Promise<void> {
    document.addEventListener('click', (event) => {
      event.preventDefault();
      const target = event.target as HTMLElement;
      console.log(event.target);

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
    });
  }

  async start(): Promise<void> {
    this.listen();
  }
}

export default Audiocall;
