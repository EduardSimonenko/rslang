import TextbookTitlePage from '../view/textbook/textbookTitlePage';

export class App {
  private textbook;

  constructor() {
    this.textbook = new TextbookTitlePage();
  }

  public async start(): Promise<void> {
    this.textbook.renderPageTextBook();
  }
}

export default App;
