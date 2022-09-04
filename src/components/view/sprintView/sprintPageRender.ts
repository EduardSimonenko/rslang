import CreateDomElements from '../../controller/newElement';
import IwordInfo from '../../../types/sprintGame/IwordInfo';
import { WordStructure } from '../../../types/loadServerData/interfaces';
import baseUrl from '../../model/baseUrl';

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

  static renderCard(wordInfo: IwordInfo, score: number, countForCorrectAnswer?: string) {
    this.wordCard.innerHTML = '';
    this.scoreBlock.innerHTML = score.toString();
    const cardCirclesBlock = CreateDomElements.createNewElement('div', ['card__circles-block']);
    const pointsForCorrectAnswer = CreateDomElements.createNewElement('div', ['card__points'], countForCorrectAnswer);
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
      [cardCirclesBlock, pointsForCorrectAnswer, cardImageBlock, word, translation, cardButtons],
    );
    CreateDomElements.insertChilds(this.sprintGameBlock, [this.scoreBlock, this.wordCard]);
  }

  static renderStatistics(
    score: number,
    wrongAnswers: WordStructure[],
    correctAnswers: WordStructure[],
  ) {
    this.sprintGameBlock.innerHTML = '';
    const resultBlock = CreateDomElements.createNewElement('div', ['result']);
    const resultHeader = CreateDomElements.createNewElement('h2', ['result__header'], `Твой результат: ${score} очков!`);
    const showAnswerLink = CreateDomElements.createNewElement('button', ['result__button', 'result__button_active'], 'Нажми, чтобы взглянуть на свой результат!');
    const motivationalMessage = CreateDomElements.createNewElement('div', ['result__motivational'], 'Ты большой молодец! Старайся и у тебя обязательно все получится!');
    const resultWords = CreateDomElements.createNewElement('div', ['result__words']);
    const correctWords = CreateDomElements.createNewElement('div', ['result__correct-words'], 'Правильные ответы: ');
    const wrongWords = CreateDomElements.createNewElement('div', ['result__wrong-words'], 'Неправильные ответы: ');
    const startSprintGameLink = CreateDomElements.createNewElement('a', ['result__sprint-link', 'btn'], 'Cыграть снова!') as HTMLLinkElement;

    startSprintGameLink.href = '#game/sprint';

    wrongAnswers.forEach((el) => {
      const wrongWord = this.createWordBlock(el);
      CreateDomElements.insertChilds(wrongWords, [wrongWord]);
    });

    correctAnswers.forEach((el) => {
      const correctWord = this.createWordBlock(el);
      CreateDomElements.insertChilds(correctWords, [correctWord]);
    });

    CreateDomElements.insertChilds(resultWords, [correctWords, wrongWords]);
    CreateDomElements.insertChilds(
      resultBlock,
      [resultHeader, showAnswerLink, resultWords, motivationalMessage, startSprintGameLink],
    );

    CreateDomElements.insertChilds(this.sprintGameBlock, [resultBlock]);

    showAnswerLink.addEventListener('click', () => {
      resultWords.classList.add('result__words_active');
      showAnswerLink.classList.remove('result__button_active');
    });
  }

  private static createWordBlock(word: WordStructure) {
    const someWord = CreateDomElements.createNewElement('div', ['word']);
    const name = CreateDomElements.createNewElement('div', ['word__name'], `${word.word}  —  `);
    const translation = CreateDomElements.createNewElement('div', ['word__translation'], word.wordTranslate);
    const audioBlock = CreateDomElements.createNewElement('img', ['word__sound']) as HTMLImageElement;
    audioBlock.src = './assets/images/voice.png';
    const wordAudio = new Audio(`${baseUrl}/${word.audio}`);

    audioBlock.addEventListener('click', () => {
      wordAudio.play();
    });

    CreateDomElements.insertChilds(someWord, [audioBlock, name, translation]);

    return someWord;
  }
}

export default SprintPage;
