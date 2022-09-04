import CreateDomElements from '../../controller/newElement';
import IwordInfo from '../../../types/sprintGame/IwordInfo';

class SprintPage {
  private static body = document.querySelector('body') as HTMLBodyElement;

  static renderSprintPage(wordInfo: IwordInfo, score: number) {
    this.body.innerHTML = '';
    const sprintGameBlock = CreateDomElements.createNewElement('section', ['sprint-game']);
    const wordCard = CreateDomElements.createNewElement('div', ['sprint-game__card']);
    const scoreBlock = CreateDomElements.createNewElement('p', ['sprint-game__score'], score.toString());
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
      wordCard,
      [cardCirclesBlock, cardImageBlock, word, translation, cardButtons],
    );
    CreateDomElements.insertChilds(sprintGameBlock, [scoreBlock, wordCard]);
    CreateDomElements.insertChilds(this.body, [sprintGameBlock]);
  }
}

export default SprintPage;
