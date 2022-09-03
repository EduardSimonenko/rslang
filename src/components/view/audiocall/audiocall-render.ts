import CreateDomElements from '../../controller/newElement';

class AudiocallRender {
  gameWrapper: HTMLElement;

  correctAudio: HTMLAudioElement;

  wrongAudio: HTMLAudioElement;

  constructor() {
    this.gameWrapper = CreateDomElements.createNewElement('div', ['audiocall-wrapper']);
    this.correctAudio = CreateDomElements.createNewElement('audio', ['audio']) as HTMLAudioElement;
    CreateDomElements.setAttributes(this.correctAudio, { src: '../../../assets/audio/correct.mp3', id: 'correct-audio' });
    this.wrongAudio = CreateDomElements.createNewElement('audio', ['audio']) as HTMLAudioElement;
    CreateDomElements.setAttributes(this.wrongAudio, { src: '../../../assets/audio/wrong.mp3', id: 'wrong-audio' });
  }

  renderStartScreen(): void {
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

    for (let level = 0; level <= 5; level += 1) {
      const node = CreateDomElements.createNewElement('button', ['audiocall__level-btn'], String(level + 1));
      CreateDomElements.setAttributes(node, { id: 'level-btn' });
      node.dataset.level = String(level);
      gameLevelBtns.appendChild(node);
    }

    CreateDomElements.insertChilds(gameLevel, [gameLevelTitle, gameLevelBtns]);
    CreateDomElements.insertChilds(gameStartScreen, [gameClose,
      gameTitle, gameSubtitle, gameLevel, gameStartBtn]);
    this.gameWrapper.appendChild(gameStartScreen);

    document.body.appendChild(this.gameWrapper);
    document.body.style.overflowY = 'hidden';
  }

  renderGame(): void {
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
    CreateDomElements.setAttributes(audio, { id: 'audio', src: '' });
    CreateDomElements.insertChilds(soundSection, [wordImg, soundImg, audio, word]);

    const answersSection = CreateDomElements.createNewElement('div', ['answers-wrapper']);
    for (let i = 0; i < 5; i += 1) {
      const answerBtn = CreateDomElements.createNewElement('button', ['answer-btn', 'btn'], 'Загрузка...');
      answerBtn.setAttribute('id', 'answer-btn');
      answerBtn.setAttribute('disabled', '');
      answerBtn.dataset.id = `${i}`;
      answerBtn.dataset.inner = '';
      answersSection.appendChild(answerBtn);
    }
    const nextBtn = CreateDomElements.createNewElement('button', ['audiocall__next-btn', 'btn'], 'Пропустить →');
    CreateDomElements.setAttributes(nextBtn, { id: 'next-btn', type: 'button', disabled: '' });
    nextBtn.dataset.inner = 'Пропустить →';

    CreateDomElements.insertChilds(playField, [gameClose, soundSection, answersSection, nextBtn]);

    this.gameWrapper.innerHTML = '';
    CreateDomElements.insertChilds(
      this.gameWrapper,
      [playField, this.correctAudio, this.wrongAudio],
    );
    document.body.style.overflowY = 'hidden';
  }
}

export default AudiocallRender;
