// import TextbookTitlePage from '../view/textbook/textbookTitlePage';

// export class App {
//   private textbook;

//   constructor() {
//     this.textbook = new TextbookTitlePage();
//   }

//   public async start(): Promise<void> {
//     this.textbook.renderPageTextBook();
//   }
// }
import Page from '../view/pageView/mainPageView';

export default class App {
  static async start(): Promise<void> {
    Page.renderMainPage();
  }
}
