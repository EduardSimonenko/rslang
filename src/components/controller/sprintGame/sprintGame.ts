import { WordStructure } from '../../../types/loadServerData/interfaces';
import Api from '../textbook/controller';
import SprintPage from '../../view/sprintView/sprintPageRender';

class SprintGame {
  static words: WordStructure[];

  static correctAnswers: WordStructure[];

  static wrongAnswers: WordStructure[];

  static score: number;

  group: string;

  page: string;

  constructor(group: string, page: string) {
    this.group = group;
    this.page = page;
  }

  static async startSprintGame() {
    document.querySelector('body').innerHTML = '';
    const response = await Api.getAllWords('5', '20') as Response;
    this.words = await response.json();
    SprintPage.renderSprintPage(2, this.words[0]);
  }

  static async getWordsForGame() {
    const response = await Api.getAllWords('5', '20') as Response;
    this.words = await response.json();
  }
}

export default SprintGame;
