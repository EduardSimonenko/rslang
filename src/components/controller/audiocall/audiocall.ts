// import AudiocallGame from '../../view/audiocall/audiocall-render';
import { MethodEnum, UrlFolderEnum } from '../../../types/loadServerData/enum';
import { WordStructure } from '../../../types/loadServerData/interfaces';
import { shuffle, getRandomInt } from '../../utils/utils';
import Loader from '../load';
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
  // получать слова, левел в локалсторэдж от 0 до 5

  constructor() {
    super();
    this.counter = 0;
    this.words = [];
    this.supportWords = [];
    this.correctAnswers = [];
    this.wrongAnswers = [];
    this.level = localStorage.getItem('audiocallLevel');
    this.storage = new CustomStorage();
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

  async build(index: number) {
    // console.log('build');
    if (this.counter === 0) {
      this.words = shuffle(await this.getWords(+this.level));
      const supportArray1 = await this.getWords(getRandomInt(0, 5));
      const supportArray2 = await this.getWords(getRandomInt(0, 5));
      // eslint-disable-next-line max-len
      this.supportWords = shuffle(supportArray1.concat(supportArray2)).map((item) => item.wordTranslate);
      console.log(this.supportWords);
    // eslint-disable-next-line no-alert
    } else if (this.counter === 19) alert('результаты');

    const audio = document.getElementById('audio') as HTMLAudioElement;
    // const img = document.getElementById('sound-img') as HTMLImageElement;
    const answerBtns = Array.from(document.getElementsByClassName('answer-btn')) as HTMLButtonElement[];

    // img.src = `https://rslang2022q1-learnwords.herokuapp.com/${words[0].image}`;
    audio.src = `https://rslang2022q1-learnwords.herokuapp.com/${this.words[index].audio}`;
    setTimeout(() => audio.play(), 500);

    this.supportWords = shuffle(this.supportWords);
    const answers = shuffle([this.words[index].wordTranslate, ...this.supportWords.slice(0, 4)]);
    for (let i = 0; i < answerBtns.length; i += 1) {
      answerBtns[i].innerText = answers[i];
    }
    // console.log('слово', this.words[index].word, this.words[index].wordTranslate);
    // console.log('answers', answers);
    this.counter += 1;
  }

  async listen(): Promise<void> {
    document.addEventListener('click', (event) => {
      event.preventDefault();
      const target = event.target as HTMLElement;
      console.log(event.target);

      if (target.id === 'start-btn') {
        // console.log(target.id);
        this.build(0);
      }

      if (target.id === 'next-btn') {
        console.log('counter', this.counter);
        this.build(this.counter);
      }
    });
  }

  async start(): Promise<void> {
    this.listen();
  }
}

export default Audiocall;
