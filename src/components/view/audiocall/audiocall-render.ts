import NewElement from '../../controller/newcomponent';
import '../../../styles/pages/_audiocall.scss';
import CustomStorage from '../../controller/storage';

class AudiocallGame {
  NewElement: NewElement;

  gameWrapper: HTMLElement;

  customStorage: CustomStorage;

  constructor() {
    this.NewElement = new NewElement();
    this.gameWrapper = this.NewElement.createNewElement('div', ['audiocall-wrapper']);
    this.customStorage = new CustomStorage();
  }

  renderStartScreen(): void {
    const gameStartScreen = this.NewElement.createNewElement('div', ['audiocall__start-screen']);
    const gameTitle = this.NewElement.createNewElement('div', ['audiocall__title'], '<h2>Аудиовызов</h2>');
    const gameSubtitle = this.NewElement.createNewElement('div', ['audiocall__subtitle'], '<span>Такая тренировка улучшает твое восприятие речи на слух</span>');
    const gameLevel = this.NewElement.createNewElement('div', ['audiocall__level']);
    const gameLevelTitle = this.NewElement.createNewElement('div', ['audiocall__level-title'], '<span>Выберите сложность</span>');
    const gameLevelBtns = this.NewElement.createNewElement('div', ['audiocall__level-btns']);
    const gameStartBtn = this.NewElement.createNewElement('button', ['audiocall__start-btn'], 'Начать игру');
    this.NewElement.setAttributes(gameStartBtn, { id: 'start-btn', type: 'button', disabled: 'true' });
    const levels = ['1', '2', '3', '4', '5', '6'];
    levels.forEach((item) => {
      const node = this.NewElement.createNewElement('div', ['audiocall__level-btn'], `${item}`);
      this.NewElement.setAttributes(node, { id: 'level-btn' });
      node.dataset.level = String(Number(item) - 1);
      node.addEventListener('click', () => {
        this.customStorage.setStorage('audiocallLevel', node.dataset.level);
        node.classList.toggle('active');
        gameStartBtn.toggleAttribute('disabled');
      });
      gameLevelBtns.appendChild(node);
    });
    this.NewElement.insertChilds(gameLevel, [gameLevelTitle, gameLevelBtns]);

    this.NewElement.insertChilds(gameStartScreen, [
      gameTitle, gameSubtitle, gameLevel, gameStartBtn]);
    this.gameWrapper.appendChild(gameStartScreen);

    const main = document.querySelector('.main');
    main.innerHTML = '';
    main.appendChild(this.gameWrapper);
  }

  renderGame(): void {
    const playField = this.NewElement.createNewElement('div', ['play-field']);
    const soundSection = this.NewElement.createNewElement('div', ['sound-section']);
    const soundImg = this.NewElement.createNewElement('img', ['sound-img']);
    this.NewElement.setAttributes(soundImg, { id: 'sound-img', src: '../../../assets/svg/audio.svg', alt: 'audio' });
    const audio = this.NewElement.createNewElement('audio', ['audio']);
    this.NewElement.setAttributes(audio, { id: 'audio', src: '' }); // add src
    this.NewElement.insertChilds(soundSection, [soundImg, audio]);

    const answersSection = this.NewElement.createNewElement('div', ['answers-wrapper']);
    const ans1 = this.NewElement.createNewElement('button', ['answer-btn', 'btn'], 'ANSWER');
    const ans2 = this.NewElement.createNewElement('button', ['answer-btn', 'btn'], 'ANSWER');
    const ans3 = this.NewElement.createNewElement('button', ['answer-btn', 'btn'], 'ANSWER');
    const ans4 = this.NewElement.createNewElement('button', ['answer-btn', 'btn'], 'ANSWER');
    const ans5 = this.NewElement.createNewElement('button', ['answer-btn', 'btn'], 'ANSWER');
    this.NewElement.insertChilds(answersSection, [ans1, ans2, ans3, ans4, ans5]);

    const nextBtn = this.NewElement.createNewElement('button', ['audiocall__start-btn', 'btn'], 'Пропустить →');
    this.NewElement.setAttributes(nextBtn, { id: 'next-btn', type: 'button' });

    this.NewElement.insertChilds(playField, [soundSection, answersSection, nextBtn]);

    this.gameWrapper.innerHTML = '';
    this.gameWrapper.appendChild(playField);
  }

  listen(): void {
    const startGame = document.getElementById('start-btn');
    startGame.addEventListener('click', (event) => {
      console.log(event.target);
      this.renderGame();
    });
  }

  startAudiocall() {
    const enterGame = document.querySelector('.nav__link');

    enterGame.addEventListener('click', () => {
      this.renderStartScreen();
      this.listen();
    });
  }
}

export default AudiocallGame;
