import CreateDomElements from '../../controller/newElement';
// import '../../../styles/pages/_audiocall.scss';
import CustomStorage from '../../controller/storage';

class AudiocallGame {
  NewElement: CreateDomElements;

  gameWrapper: HTMLElement;

  customStorage: CustomStorage;

  correctAudio: HTMLAudioElement;

  wrongAudio: HTMLAudioElement;

  constructor() {
    // this.NewElement = new CreateDomElements();
    this.gameWrapper = CreateDomElements.createNewElement('div', ['audiocall-wrapper']);
    this.correctAudio = CreateDomElements.createNewElement('audio', ['audio']) as HTMLAudioElement;
    CreateDomElements.setAttributes(this.correctAudio, { src: '../../../assets/audio/correct.mp3', id: 'correct-audio' });
    // this.correctAudio.setAttribute('src', '../../../assets/audio/correct.mp3');
    this.wrongAudio = CreateDomElements.createNewElement('audio', ['audio']) as HTMLAudioElement;
    CreateDomElements.setAttributes(this.wrongAudio, { src: '../../../assets/audio/wrong.mp3', id: 'wrong-audio' });
    // this.wrongAudio.setAttribute('src', '../../../assets/audio/wrong.mp3');
    // CreateDomElements.insertChilds(this.gameWrapper, [this.correctAudio, this.wrongAudio]);
    // this.customStorage = new CustomStorage();
  }

  renderStartScreen(): void {
    // const gameWrapper = CreateDomElements.createNewElement('div', ['audiocall-wrapper']);
    const gameClose = CreateDomElements.createNewElement('div', ['audiocall__close-btn']);
    const gameCloseImg = CreateDomElements.createNewElement('img', ['audiocall__close-btn_img']);
    CreateDomElements.setAttributes(gameCloseImg, { src: '../../../assets/svg/close.svg', alt: 'close' });
    gameCloseImg.setAttribute('id', 'close-game');
    gameClose.appendChild(gameCloseImg);

    const gameStartScreen = CreateDomElements.createNewElement('div', ['audiocall__start-screen']);
    const gameTitle = CreateDomElements.createNewElement('div', ['audiocall__title'], '<h2>Аудиовызов</h2>');
    const gameSubtitle = CreateDomElements.createNewElement('div', ['audiocall__subtitle'], '<span>Такая тренировка улучшает твое восприятие речи на слух</span>');
    const gameLevel = CreateDomElements.createNewElement('div', ['audiocall__level']);
    const gameLevelTitle = CreateDomElements.createNewElement('div', ['audiocall__level-title'], '<span>Выберите сложность</span>');
    const gameLevelBtns = CreateDomElements.createNewElement('div', ['audiocall__level-btns']);
    const gameStartBtn = CreateDomElements.createNewElement('button', ['audiocall__start-btn', 'btn'], 'Начать игру');
    CreateDomElements.setAttributes(gameStartBtn, { id: 'start-btn', type: 'button', disabled: 'true' });
    const levels = ['1', '2', '3', '4', '5', '6'];
    levels.forEach((item) => {
      const node = CreateDomElements.createNewElement('button', ['audiocall__level-btn'], `${item}`);
      CreateDomElements.setAttributes(node, { id: 'level-btn' });
      node.dataset.level = String(Number(item) - 1);
      // node.addEventListener('click', () => {
      //   CustomStorage.setStorage('audiocallLevel', node.dataset.level);
      //   node.classList.toggle('active');
      //   gameStartBtn.toggleAttribute('disabled');
      // });
      gameLevelBtns.appendChild(node);
    });
    CreateDomElements.insertChilds(gameLevel, [gameLevelTitle, gameLevelBtns]);

    CreateDomElements.insertChilds(gameStartScreen, [gameClose,
      gameTitle, gameSubtitle, gameLevel, gameStartBtn]);
    this.gameWrapper.appendChild(gameStartScreen);

    // const main = document.querySelector('.main');
    // main.innerHTML = '';
    document.body.appendChild(this.gameWrapper);
    document.body.style.overflowY = 'hidden';
  }

  renderGame(): void {
    // const gameWrapper = CreateDomElements.createNewElement('div', ['audiocall-wrapper']);
    const gameClose = CreateDomElements.createNewElement('div', ['audiocall__close-btn']);
    const gameCloseImg = CreateDomElements.createNewElement('img', ['audiocall__close-btn_img']);
    CreateDomElements.setAttributes(gameCloseImg, { src: '../../../assets/svg/close.svg', alt: 'close' });
    gameCloseImg.setAttribute('id', 'close-game');
    gameClose.appendChild(gameCloseImg);

    const playField = CreateDomElements.createNewElement('div', ['play-field']);
    const soundSection = CreateDomElements.createNewElement('div', ['sound-section']);
    const wordImg = CreateDomElements.createNewElement('img', ['word-img', 'hidden']);
    CreateDomElements.setAttributes(wordImg, { id: 'word-img', src: '', alt: 'word image' });
    const soundImg = CreateDomElements.createNewElement('img', ['sound-img']);
    CreateDomElements.setAttributes(soundImg, { id: 'sound-img', src: '../../../assets/svg/audio.svg', alt: 'audio image' });
    const audio = CreateDomElements.createNewElement('audio', ['audio']) as HTMLAudioElement;
    const word = CreateDomElements.createNewElement('span', ['word', 'hidden']);
    word.setAttribute('id', 'word');
    soundImg.addEventListener('click', () => audio.play());
    CreateDomElements.setAttributes(audio, { id: 'audio', src: '' }); // add src
    CreateDomElements.insertChilds(soundSection, [wordImg, soundImg, audio, word]);

    const answersSection = CreateDomElements.createNewElement('div', ['answers-wrapper']);
    for (let i = 0; i < 5; i += 1) {
      const answerBtn = CreateDomElements.createNewElement('button', ['answer-btn', 'btn'], 'Загрузка...');
      answerBtn.setAttribute('id', 'answer-btn');
      answerBtn.setAttribute('disabled', '');
      answerBtn.dataset.id = `${i}`;
      answersSection.appendChild(answerBtn);
    }
    const nextBtn = CreateDomElements.createNewElement('button', ['audiocall__next-btn', 'btn'], 'Пропустить →');
    CreateDomElements.setAttributes(nextBtn, { id: 'next-btn', type: 'button', disabled: '' });

    CreateDomElements.insertChilds(playField, [gameClose, soundSection, answersSection, nextBtn]);

    this.gameWrapper.innerHTML = '';
    CreateDomElements.insertChilds(
      this.gameWrapper,
      [playField, this.correctAudio, this.wrongAudio],
    );
    // this.gameWrapper.appendChild(playField);
    document.body.style.overflowY = 'hidden';
  }

  listen(): void {
    document.addEventListener('click', (event) => {
      event.preventDefault();
      const target = event.target as HTMLElement;
      if (target.id === 'start-btn') {
        this.renderGame();
      }
      // if (target.id === 'close-game') {
      //   console.log('click');
      //   this.gameWrapper.innerHTML = '';
      //   document.body.removeChild(this.gameWrapper);
      //   document.body.style.overflowY = '';
      // }
    });
    // const gameStartBtn = document.getElementById('start-btn');
    // gameStartBtn.addEventListener('click', (event) => {
    //   event.preventDefault();
    //   this.renderGame();
    // });

    // const gameClose = document.getElementById('close-game');
    // gameClose.addEventListener('click', () => {
    //   console.log('click');
    //   this.gameWrapper.innerHTML = '';
    //   document.body.removeChild(this.gameWrapper);
    //   document.body.style.overflowY = '';
    // });
  }

  start() {
    const enterGame = document.querySelector('[data-page="games"]');

    enterGame.addEventListener('click', () => {
      this.renderStartScreen();
      this.listen();
    });
  }
}

export default AudiocallGame;
