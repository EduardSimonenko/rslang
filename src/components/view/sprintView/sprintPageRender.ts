import CreateDomElements from '../../controller/newElement';
import IwordInfo from '../../../types/sprintGame/IwordInfo';

class SprintPage {
  private static sprintGameBlock = CreateDomElements.createNewElement('section', ['sprint-game']);

  private static body = document.querySelector('.body') as HTMLElement;

  private static wordCard = CreateDomElements.createNewElement('div', ['sprint-game__card']);

  private static scoreBlock = CreateDomElements.createNewElement('p', ['sprint-game__score']);

  static renderSprintPage(wordInfo: IwordInfo, score: number) {
    this.sprintGameBlock.innerHTML = '';
    this.renderTimer();
    this.renderCard(wordInfo, score);
    CreateDomElements.insertChilds(this.body, [this.sprintGameBlock]);
  }

  static renderTimer() {
    const timer = CreateDomElements.createNewElement('div', ['timer'], '60');
    CreateDomElements.insertChilds(this.sprintGameBlock, [timer]);
  }

  static renderCard(wordInfo: IwordInfo, score: number) {
    this.wordCard.innerHTML = '';
    this.scoreBlock.innerHTML = score.toString();
    const cardCirclesBlock = CreateDomElements.createNewElement('div', ['card__circles-block']);
    const cardImageBlock = CreateDomElements.createNewElement('div', ['card__image-block']);
    const cardImage = CreateDomElements.createNewElement('img', ['card__image']) as HTMLImageElement;
    const word = CreateDomElements.createNewElement('h3', ['word'], wordInfo.name);
    const translation = CreateDomElements.createNewElement('h4', ['word-translation'], wordInfo.wordTranslate);
    const cardButtons = CreateDomElements.createNewElement('div', ['card__buttons']);
    const cardButtonWrong = CreateDomElements.createNewElement('button', ['card__button', 'card__button_wrong'], 'НЕВЕРНО');
    const cardButtonCorrect = CreateDomElements.createNewElement('button', ['card__button', 'card__button_correct'], 'ВЕРНО');

    cardImage.alt = 'Just a parrot';
    cardImage.src = './assets/images/sprint-image.svg';

    CreateDomElements.setAttributes(cardButtonCorrect, { 'data-answer': 'true' });
    CreateDomElements.setAttributes(cardButtonWrong, { 'data-answer': 'false' });

    CreateDomElements.insertChilds(cardButtons, [cardButtonWrong, cardButtonCorrect]);
    CreateDomElements.insertChilds(cardImageBlock, [cardImage]);

    const correctAnswerMaxCount = 3;

    for (let i = 0; i < correctAnswerMaxCount; i += 1) {
      const cardCircle = CreateDomElements.createNewElement('div', ['card__circle']);
      if (i < wordInfo.countOfCorrectAnswer) {
        cardCircle.classList.add('card__circle_correct');
      }
      CreateDomElements.insertChilds(cardCirclesBlock, [cardCircle]);
    }

    CreateDomElements.insertChilds(
      this.wordCard,
      [cardCirclesBlock, cardImageBlock, word, translation, cardButtons],
    );
    CreateDomElements.insertChilds(this.sprintGameBlock, [this.scoreBlock, this.wordCard]);
  }
}

export default SprintPage;
