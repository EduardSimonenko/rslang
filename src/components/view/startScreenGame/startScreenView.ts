import CreateDomElements from '../../controller/newElement';
import SprintGame from '../../controller/sprintGame/sprintGame';

class StartScreen {
  gameWrapper: HTMLElement;

  level: string;

  private body = document.querySelector('body') as HTMLBodyElement;

  constructor() {
    this.gameWrapper = CreateDomElements.createNewElement('div', ['sprint-game-wrapper']);
    this.level = '0';
  }

  renderPage(): void {
    this.body.innerHTML = '';
    const gameClose = CreateDomElements.createNewElement('a', ['sprint-game__close-btn']) as HTMLLinkElement;
    const gameCloseImg = CreateDomElements.createNewElement('img', ['sprint-game__close-btn_img']);
    CreateDomElements.setAttributes(gameCloseImg, { src: '../../../assets/svg/close.svg', alt: 'close' });
    gameClose.href = '#main';
    gameCloseImg.setAttribute('id', 'close-game');
    gameClose.appendChild(gameCloseImg);

    const gameStartScreen = CreateDomElements.createNewElement('div', ['sprint-game__start-screen']);
    const gameTitle = CreateDomElements.createNewElement('div', ['sprint-game__title'], '<h2>Спринт</h2>');
    const gameSubtitle = CreateDomElements.createNewElement('div', ['sprint-game__subtitle'], '<span>Пару таких тренировок и можешь переезжать в Америку!</span>');
    const gameLevel = CreateDomElements.createNewElement('div', ['sprint-game__level']);
    const gameLevelTitle = CreateDomElements.createNewElement('div', ['sprint-game__level-title'], '<span>Выберите сложность</span>');
    const gameLevelBtns = CreateDomElements.createNewElement('div', ['sprint-game__level-btns']);
    const gameStartBtn = CreateDomElements.createNewElement('button', ['sprint-game__start-btn', 'btn'], 'Начать игру');
    CreateDomElements.setAttributes(gameStartBtn, { id: 'start-btn', type: 'button', disabled: 'true' });

    const levels = ['1', '2', '3', '4', '5', '6'];
    levels.forEach((item) => {
      const node = CreateDomElements.createNewElement('button', ['sprint-game__level-btn'], `${item}`);
      CreateDomElements.setAttributes(node, { id: 'level-btn' });
      node.dataset.level = String(Number(item) - 1);
      gameLevelBtns.appendChild(node);
    });

    CreateDomElements.insertChilds(gameLevel, [gameLevelTitle, gameLevelBtns]);
    CreateDomElements.insertChilds(gameStartScreen, [gameClose,
      gameTitle, gameSubtitle, gameLevel, gameStartBtn]);
    CreateDomElements.insertChilds(this.gameWrapper, [gameStartScreen]);
    CreateDomElements.insertChilds(this.body, [this.gameWrapper]);

    this.listen();
  }

  listen(): void {
    this.gameWrapper.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.id === 'start-btn') {
        const sprintGame = new SprintGame(this.level);
        sprintGame.renderPage();
      }

      if (target.id === 'level-btn') {
        const levelBtns = Array.from(document.querySelectorAll('.sprint-game__level-btn')) as HTMLButtonElement[];
        levelBtns.forEach((item) => item.toggleAttribute('disabled'));
        this.level = target.dataset.level;
        target.classList.toggle('active');
        target.removeAttribute('disabled');
        document.getElementById('start-btn').toggleAttribute('disabled');
      }
    });
  }
}

export default StartScreen;
