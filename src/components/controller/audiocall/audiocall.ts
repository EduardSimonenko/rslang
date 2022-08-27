/* eslint-disable max-len */
// import AudiocallGame from '../../view/audiocall/audiocall-render';
import { MethodEnum, UrlFolderEnum } from '../../../types/loadServerData/enum';
import { WordStructure } from '../../../types/loadServerData/interfaces';
import { shuffle, getRandomInt } from '../../utils/utils';
import Loader from '../load';
import NewElement from '../newcomponent';
import CustomStorage from '../storage';

class Audiocall extends Loader {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  words: any[];

  level: string;

  storage: CustomStorage;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  correctAnswers: any[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wrongAnswers: any[];

  counter: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supportWords: any[];

  correctAnswer: Record<string, string>;

  NewElement: NewElement;
  // получать слова, левел в локалсторэдж от 0 до 5

  constructor() {
    super();
    this.counter = 0;
    this.words = [];
    this.supportWords = [];
    this.correctAnswer = {};
    this.correctAnswers = [];
    this.wrongAnswers = [];
    this.level = localStorage.getItem('audiocallLevel');
    this.storage = new CustomStorage();
    this.NewElement = new NewElement();
  }

  async getWords(level: number): Promise<WordStructure[]> {
    // console.log('getwords');
    // const level = this.storage.getStorage('audiocallLevel');
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

  async buildGameLogic(index: number) {
    // console.log('counter', this.counter);
    // console.log('index', index);

    if (index === 0) {
      this.words = shuffle(await this.getWords(+this.level));
      const supportArray1 = await this.getWords(getRandomInt(0, 5));
      const supportArray2 = await this.getWords(getRandomInt(0, 5));
      // eslint-disable-next-line max-len
      this.supportWords = shuffle(supportArray1.concat(supportArray2)).map((item) => item.wordTranslate);
      console.log(this.supportWords);
    // eslint-disable-next-line no-alert
    } else if (index === 20) {
      console.log({ correct: this.correctAnswers, wrong: this.wrongAnswers });
      // console.log('wrong', this.wrongAnswers);
      const audiocallWrapper = document.querySelector('.audiocall-wrapper');
      audiocallWrapper.innerHTML = '';
      audiocallWrapper.appendChild(this.showResults());
      // audiocallWrapper.appendChild(this.showResults(this.wrongAnswers, 'Ошибки'));
      return;
    }

    const audio = document.getElementById('audio') as HTMLAudioElement;
    // const img = document.getElementById('sound-img') as HTMLImageElement;
    const answerBtns = Array.from(document.getElementsByClassName('answer-btn')) as HTMLButtonElement[];

    // img.src = `https://rslang2022q1-learnwords.herokuapp.com/${words[0].image}`;
    audio.src = `https://rslang2022q1-learnwords.herokuapp.com/${this.words[index].audio}`;
    audio.play();
    this.correctAnswer = this.words[index];
    console.log('correct answer', this.correctAnswer);
    this.supportWords = shuffle(this.supportWords);
    const answers = shuffle([this.words[index].wordTranslate, ...this.supportWords.slice(0, 4)]);
    for (let i = 0; i < answerBtns.length; i += 1) {
      answerBtns[i].innerText = answers[i];
    }
    // console.log('слово', this.words[index].word, this.words[index].wordTranslate);
    // console.log('answers', answers);
    this.counter += 1;
  }

  showAnswers(results: WordStructure[], title: string) {
    const answers = this.NewElement.createNewElement('div', ['results-items'], `<span>${title}: ${results.length}</span>`);
    for (let i = 0; i < results.length; i += 1) {
      const answer = this.NewElement.createNewElement('div', ['results-item']);
      const soundImg = this.NewElement.createNewElement('img', ['results-item__img']) as HTMLImageElement;
      soundImg.src = '../../../assets/svg/audio.svg';
      const audio = this.NewElement.createNewElement('div', ['results-item__audio']) as HTMLAudioElement;
      audio.src = `https://rslang2022q1-learnwords.herokuapp.com/${results[i].audio}`;
      const word = this.NewElement.createNewElement('div', ['results-item__word'], `<span>${results[i].word}-${results[i].wordTranslate}</span>`);
      this.NewElement.insertChilds(answer, [soundImg, audio, word]);
      answers.appendChild(answer);
    }
    return answers;
  }

  showResults() {
    const resultsWrapper = this.NewElement.createNewElement('div', ['results-wrapper']);
    const resultsTitle = this.NewElement.createNewElement('div', ['results-title'], '<span>Результаты</span>');
    // const answers = this.NewElement.createNewElement('div', ['results-items'], `<span>${title}: ${results.length}</span>`);
    // for (let i = 0; i < results.length; i += 1) {
    //   const answer = this.NewElement.createNewElement('div', ['results-item']);
    //   const soundImg = this.NewElement.createNewElement('img', ['results-item__img']) as HTMLImageElement;
    //   soundImg.src = '../../../assets/svg/audio.svg';
    //   const audio = this.NewElement.createNewElement('div', ['results-item__audio']) as HTMLAudioElement;
    //   audio.src = `https://rslang2022q1-learnwords.herokuapp.com/${results[i].audio}`;
    //   const word = this.NewElement.createNewElement('div', ['results-item__word'], `<span>${results[i].word}-${results[i].wordTranslate}</span>`);
    //   this.NewElement.insertChilds(answer, [soundImg, audio, word]);
    //   answers.appendChild(answer);
    // }
    this.NewElement.insertChilds(resultsWrapper, [resultsTitle, this.showAnswers(this.correctAnswers, 'Знаю'), this.showAnswers(this.wrongAnswers, 'Ошибки')]);
    return resultsWrapper;
  }

  async listen(): Promise<void> {
    document.addEventListener('click', (event) => {
      event.preventDefault();
      const target = event.target as HTMLElement;
      console.log(event.target);

      if (target.id === 'start-btn') {
        // console.log(target.id);
        this.buildGameLogic(0);
      }

      if (target.id === 'next-btn') {
        // console.log('counter', this.counter);
        this.wrongAnswers.push(this.correctAnswer);
        this.buildGameLogic(this.counter);
        console.log('correct', this.correctAnswers);
        console.log('wrong', this.wrongAnswers);
      }

      if (target.id === 'answer-btn') {
        if (target.innerText === this.correctAnswer.wordTranslate) {
          this.correctAnswers.push(this.correctAnswer);
        } else {
          this.wrongAnswers.push(this.correctAnswer);
        }

        this.buildGameLogic(this.counter);
        console.log('correct', this.correctAnswers);
        console.log('wrong', this.wrongAnswers);
      }
    });
  }

  async start(): Promise<void> {
    this.listen();
  }
}

export default Audiocall;
