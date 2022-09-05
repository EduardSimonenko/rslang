import { StatisticsData } from '../../../types/statistics/interfaces';
import CreateDomElements from '../../controller/newElement';
import Api from '../../controller/textbook/controller';
import cleanPage from '../../utils/cleanPage';
import percentOfCorrectAnswers from '../../utils/percentCount';
import getUserData from '../../utils/userLogin';
import Page from '../pageView/mainPageView';

class Statistics {
  public async renderPage(): Promise<void> {
    const get = await Api.getStatistics(getUserData()) as StatisticsData;
    this.renderPagee(get);
  }

  public renderPagee(stat: StatisticsData) {
    cleanPage();

    const body = document.querySelector('.body') as HTMLBodyElement;
    const wrapper: HTMLElement = CreateDomElements.createNewElement('div', ['wrapper-textbook']);
    const statGames = CreateDomElements.createNewElement('div', ['container__stat']);
    const title = CreateDomElements.createNewElement('h1', ['games__title'], 'Сегодня');
    const header = Page.renderHeader();
    const footer = Page.renderFooter();
    const fieldGames = this.renderStatGames(stat);
    const fieldWords = this.renderFieldWords(stat);

    CreateDomElements.insertChilds(statGames, [title, fieldGames, fieldWords]);
    CreateDomElements.insertChilds(wrapper, [statGames]);
    CreateDomElements.insertChilds(body, [header, wrapper, footer]);
  }

  private renderStatGames(stat: StatisticsData): HTMLElement {
    const allGames = 2;
    const containerGames = CreateDomElements.createNewElement('div', ['container__games']);
    let nameGame = 'sprint';
    let ruNameGame = 'Спринт';

    for (let i = 0; i < allGames; i += 1) {
      const containerGame = CreateDomElements.createNewElement('div', [`container__game-${nameGame}`]);
      const game: HTMLElement = CreateDomElements.createNewElement('div', [`game__${nameGame}`]);
      const gameImg: HTMLElement = CreateDomElements.createNewElement('img', [`game__img-${nameGame}`]);
      const gameText: HTMLElement = CreateDomElements.createNewElement('p', [`game__text-${nameGame}`], ruNameGame);
      const fieldsStatGame = this.renderFieldGame(stat, nameGame);

      CreateDomElements.setAttributes(gameImg, {
        src: `../../../assets/svg/${nameGame}.svg`,
        width: '70px',
        height: '100px',
      });
      CreateDomElements.setAttributes(game, { 'data-name': `${nameGame}` });
      CreateDomElements.insertChilds(game, [gameText, gameImg]);
      CreateDomElements.insertChilds(containerGame, [game, fieldsStatGame]);
      CreateDomElements.insertChilds(containerGames, [containerGame]);

      nameGame = 'audiocall';
      ruNameGame = 'Аудио Вызов';
    }

    return containerGames;
  }

  private renderFieldGame(stat: StatisticsData, nameGame: string): HTMLElement {
    const containerFields: HTMLElement = CreateDomElements.createNewElement('div', ['container__fields']);
    const allField = 3;
    const fieldStatGame: string[] = ['Новыx слов', 'Правильных ответов', 'Серия правильных ответов'];
    let result: number[];
    if (nameGame === 'sprint') {
      result = [
        stat.optional.sprint.newWords,
        stat.optional.sprint.correctAnswers,
        stat.optional.sprint.seriesCorrectAnswers,
      ];
    } else {
      result = [
        stat.optional.audioCall.newWords,
        stat.optional.audioCall.correctAnswers,
        stat.optional.audioCall.seriesCorrectAnswers,
      ];
    }

    for (let i = 0; i < allField; i += 1) {
      const field: HTMLElement = CreateDomElements.createNewElement('div', ['field__stat']);
      const count: HTMLElement = CreateDomElements.createNewElement('p', ['field__count'], `${result[i]}`);
      const text: HTMLElement = CreateDomElements.createNewElement('span', ['field__text'], fieldStatGame[i]);

      CreateDomElements.insertChilds(field, [count, text]);
      CreateDomElements.insertChilds(containerFields, [field]);
    }
    return containerFields;
  }

  private renderFieldWords(stat: StatisticsData): HTMLElement {
    const allField = 2;
    const fieldStatGame: string[] = ['<b>слов</b><br>изучено за день', 'новых слов'];
    const containerStatWords: HTMLElement = CreateDomElements.createNewElement('div', ['container__words-stat']);
    const fieldPercentWords: HTMLElement = CreateDomElements.createNewElement('div', ['field__Percent']);
    const fieldPercentText: HTMLElement = CreateDomElements.createNewElement(
      'p',
      ['field__Percent-text'],
      'Процент правильных ответов',
    );
    const result: number[] = this.countStat(stat);
    const percent: number = percentOfCorrectAnswers(
      [stat.optional.sprint.allWords, stat.optional.audioCall.allWords],
      [stat.optional.sprint.correctAnswers, stat.optional.audioCall.correctAnswers],
    );
    const circle: HTMLElement = CreateDomElements.createNewElement(
      'div',
      ['field__percent', 'animate'],
      `${percent}%`,
    );
    circle.style.setProperty('--p', `${percent}`);

    for (let i = 0; i < allField; i += 1) {
      const field: HTMLElement = CreateDomElements.createNewElement('div', ['field__stat-words']);
      const count: HTMLElement = CreateDomElements.createNewElement('p', ['field__count'], `${result[i]}`);
      const text: HTMLElement = CreateDomElements.createNewElement('span', ['field__text'], fieldStatGame[i]);

      CreateDomElements.insertChilds(field, [count, text]);
      CreateDomElements.insertChilds(containerStatWords, [field]);
    }
    CreateDomElements.insertChilds(fieldPercentWords, [fieldPercentText, circle]);
    CreateDomElements.insertChilds(containerStatWords, [fieldPercentWords]);
    return containerStatWords;
  }

  private countStat(stat: StatisticsData): number[] {
    const allNewWords: number = stat.optional.sprint.newWords + stat.optional.audioCall.newWords;
    const allLearnedWords = stat.learnedWords;
    return [allLearnedWords, allNewWords];
  }
}

export default Statistics;
