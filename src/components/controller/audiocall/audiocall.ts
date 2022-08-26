import AudiocallGame from '../../view/audiocall/audiocall-render';
import CustomStorage from '../storage';

class Audiocall extends AudiocallGame {
  customStorage: CustomStorage;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  words: any[];
  // получать слова, левел в локалсторэдж от 0 до 5

  constructor() {
    super();
    this.words = [];
  }

  setLevel() {
    const levelBtns = Array.from(document.getElementsByClassName('audiocall__level-btn')) as HTMLElement[];
    levelBtns.forEach((item) => {
      item.addEventListener('click', () => {
        console.log('click');
        this.customStorage.setStorage('audiocallLevel', item.dataset.level);
      });
    });
  }
}

export default Audiocall;
