import { AuthorizeUserWords, WordStructure } from '../../../types/loadServerData/interfaces';
import { PageElements } from '../../../types/textbook/interfaces';
import { RemoveElements, ResponseData } from '../../../types/textbook/type';
import NewElement from '../../controller/newcomponent';
import ControllerTextbook from '../../controller/textbook/controller';
import baseUrl from '../../model/baseUrl';
import TextbookPagination from './textbookPagination';
import TextbookUsers from './textbookUsers';
import textbookLevel from '../../../mocks/textbookLevel.json';

class TextbookWordsSection {
  private body: HTMLBodyElement;

  private wrapper: HTMLElement;

  private cleanPage: RemoveElements;

  private newElement: NewElement;

  private cotroller: ControllerTextbook;

  private containerWords: HTMLElement;

  private pagination: TextbookPagination;

  private activeUser: TextbookUsers;

  private wrapperPagination: HTMLElement;

  private hardWord: HTMLElement;

  private currentGroup: string;

  private allLevel: number;

  private isLogin: string | null;

  constructor(partPage: PageElements) {
    this.body = partPage.body;
    this.wrapper = partPage.wrapper;
    this.cleanPage = partPage.clean;
    this.newElement = new NewElement();
    this.cotroller = new ControllerTextbook();
    this.pagination = new TextbookPagination();
    this.activeUser = new TextbookUsers(partPage.isLogin);
    this.containerWords = this.newElement.createNewElement('div', ['container__words']);
    this.wrapperPagination = this.newElement.createNewElement('div', ['wrapper__pag']);
    this.hardWord = this.newElement.createNewElement('h1', ['title__section'], 'Сложные слова!');
    this.currentGroup = partPage.group;
    this.allLevel = 6;
    this.isLogin = partPage.isLogin;
  }

  public renderPageWithWords(words: WordStructure[], groupHard?: boolean): void {
    this.cleanPage();
    const menu: HTMLElement = this.newElement.createNewElement('div', ['menu'], 'Here will be menu!');

    this.newElement.insertChilds(this.wrapperPagination, [this.pagination.renderPaginationMenu()]);

    this.newElement.insertChilds(
      this.wrapper,
      [menu,
        this.renderGroupTextbook(),
        this.hardWord,
        this.wrapperPagination,
        this.containerWords,
      ],
    );
    this.wrapperPagination.style.display = 'none';

    this.listenBtnPagination(this.wrapperPagination);
    this.renderSectionTextbook(words, groupHard);
  }

  private renderSectionTextbook(words: WordStructure[], groupHard?: boolean): void {
    if (groupHard) {
      this.wrapperPagination.style.display = 'none';
      this.hardWord.style.display = 'block';
    } else {
      this.wrapperPagination.style.display = 'flex';
      this.hardWord.style.display = 'none';
    }

    this.cleanSectionWords();
    words.forEach((word) => {
      const card: HTMLElement = this.newElement.createNewElement('div', ['card']);
      const img: HTMLElement = this.newElement.createNewElement('img', ['card__img']);
      const containerText: HTMLElement = this.newElement.createNewElement('div', ['card__text']);
      const wordEng: HTMLElement = this.newElement.createNewElement('h2', ['card__word'], word.word);
      const transcription: HTMLElement = this.newElement.createNewElement(
        'p',
        ['card__transcription'],
        word.transcription,
      );
      const translateWord: HTMLElement = this.newElement.createNewElement(
        'div',
        ['card__translate'],
        word.wordTranslate,
      );
      const textMeaning: HTMLElement = this.newElement.createNewElement(
        'p',
        ['card__mean'],
        word.textMeaning,
      );
      const textMeaningTranslate: HTMLElement = this.newElement.createNewElement(
        'p',
        ['card__translate'],
        word.textMeaningTranslate,
      );
      const textExample: HTMLElement = this.newElement.createNewElement(
        'p',
        ['card__example'],
        word.textExample,
      );
      const textExampleTranslate: HTMLElement = this.newElement.createNewElement(
        'p',
        ['card__translate'],
        word.textExampleTranslate,
      );
      const containerWord: HTMLElement = this.newElement.createNewElement('div', ['container__word']);
      const containerMean: HTMLElement = this.newElement.createNewElement('div', ['container__mean']);
      const containerExample: HTMLElement = this.newElement.createNewElement('div', ['container__example']);

      this.newElement.setAttributes(img, {
        src: `${baseUrl}/${word.image}`, width: '250', height: '250', alt: 'image word',
      });

      this.newElement.insertChilds(containerWord, [wordEng, transcription, translateWord]);
      this.newElement.insertChilds(containerMean, [textMeaning, textMeaningTranslate]);
      this.newElement.insertChilds(containerExample, [textExample, textExampleTranslate]);

      if (this.isLogin) {
        this.newElement.setAttributes(card, { id: word._id });
        this.activeUser.markWordsUser(card, word);
        this.newElement.insertChilds(
          containerText,
          [containerWord, containerMean, containerExample,
            this.activeUser.renderControlBtn(this.currentGroup)],
        );
      } else {
        this.newElement.setAttributes(card, { id: word.id });
        this.newElement.insertChilds(
          containerText,
          [containerWord, containerMean, containerExample],
        );
      }

      this.newElement.insertChilds(
        card,
        [img, containerText, this.renderAudioIcons(word)],
      );

      this.newElement.insertChilds(this.containerWords, [card]);
    });
  }

  private renderAudioIcons(word: WordStructure): HTMLElement {
    const containerVoice: HTMLElement = this.newElement.createNewElement('div', ['container__voice']);
    const imgVoicePlay: HTMLElement = this.newElement.createNewElement('img', ['card__voice']);
    const imgVoiceStop: HTMLElement = this.newElement.createNewElement('img', ['card__voice', 'disable']);

    this.newElement.setAttributes(imgVoicePlay, {
      src: textbookLevel.play, width: '30', height: '30', alt: 'image voice',
    });
    this.newElement.setAttributes(imgVoiceStop, {
      src: textbookLevel.stop, width: '25', height: '25', alt: 'image voice',
    });

    this.newElement.insertChilds(
      containerVoice,
      [imgVoicePlay, imgVoiceStop, this.renderAudio(word)],
    );

    this.listenerAudio(containerVoice);
    return containerVoice;
  }

  private renderAudio(word: WordStructure): HTMLElement {
    const containerAudio: HTMLElement = this.newElement.createNewElement('div', ['container__audio']);
    const audio1: HTMLElement = this.newElement.createNewElement('audio', ['card__audio']);
    const audio2: HTMLElement = this.newElement.createNewElement('audio', ['card__audio']);
    const audio3: HTMLElement = this.newElement.createNewElement('audio', ['card__audio']);
    this.newElement.setAttributes(audio1, { src: `${baseUrl}/${word.audio}` });
    this.newElement.setAttributes(audio2, { src: `${baseUrl}/${word.audioMeaning}` });
    this.newElement.setAttributes(audio3, { src: `${baseUrl}/${word.audioExample}` });

    this.newElement.insertChilds(containerAudio, [audio1, audio2, audio3]);
    return containerAudio;
  }

  private renderGroupTextbook(): HTMLElement {
    const containerGroup: HTMLElement = this.newElement.createNewElement('div', ['container__group']);
    const imgTextbookLevel: Record<string, string> = textbookLevel;
    let heightLevel = 60;
    let chooseGroup: string[];

    if (this.isLogin) {
      this.allLevel = 7;
    }

    for (let i = 0; i < this.allLevel; i += 1) {
      const level: HTMLElement = this.newElement.createNewElement('img', ['img__book']);
      if (i === +this.currentGroup) {
        chooseGroup = ['btn__group', 'btn__shadow'];
      } else {
        chooseGroup = ['btn__group'];
      }
      const btnBook: HTMLElement = this.newElement.createNewElement('button', chooseGroup);

      this.newElement.setAttributes(
        level,
        {
          src: imgTextbookLevel[`book${i}`],
          'data-book': `${i}`,
          width: '60',
          height: `${heightLevel}`,
          alt: `book level ${i + 1}`,
        },
      );
      this.newElement.insertChilds(btnBook, [level]);
      this.newElement.insertChilds(containerGroup, [btnBook]);
      heightLevel += 5;
    }
    this.listener(containerGroup);

    return containerGroup;
  }

  private listener(books: HTMLElement): void {
    books.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLImageElement;
      const book = target.dataset.book as string;
      this.currentGroup = book;
      this.chooseLevel(target);
      this.getWordsChooseGroup(book);
      this.startNumPage();
    });
  }

  private async getWordsChooseGroup(group: string, page = '0'): Promise<void> {
    let response: Response;
    let data: ResponseData;
    const hardGroup = '6';

    if (this.isLogin && group === hardGroup) {
      response = (await this.cotroller.getDifficultWords()) as Response;
      data = await response.json() as AuthorizeUserWords[];
      this.renderSectionTextbook(data[0].paginatedResults, true);
    } else if (this.isLogin) {
      response = (await this.cotroller.getWordsLoginUser(group, page)) as Response;
      data = await response.json() as AuthorizeUserWords[];
      this.renderSectionTextbook(data[0].paginatedResults);
    } else {
      response = (await this.cotroller.getWordsUnloginUser(group, page)) as Response;
      data = await response.json() as WordStructure[];
      this.renderSectionTextbook(data);
    }
    this.currentGroup = group;
  }

  private chooseLevel(book: HTMLImageElement): void {
    const btns = document.querySelectorAll('.btn__group') as NodeListOf<Element>;
    btns.forEach((btn) => btn.classList.remove('btn__shadow'));
    book.parentElement.classList.add('btn__shadow');
  }

  private cleanSectionWords(): void {
    while (this.containerWords.firstElementChild) {
      this.containerWords.firstElementChild.remove();
    }
  }

  private listenerAudio(imgAudio: HTMLElement): void {
    imgAudio.addEventListener('click', (e: Event) => {
      const audio = (e.target as HTMLImageElement).parentElement as HTMLDivElement;
      this.playaudio(audio);
    });
  }

  private playaudio(audio: HTMLDivElement): void {
    const allAudio = audio.querySelectorAll('.card__audio') as NodeListOf<Element>;
    const imgAudio = audio.querySelectorAll('.card__voice') as NodeListOf<Element>;
    const milliseconds = 1000;
    const delaySecondAudio = 1500;
    const delayThirdAudio = 200;
    let durationPreAudio = 0;

    allAudio.forEach((voice: HTMLAudioElement, index) => {
      setTimeout(() => voice.play(), durationPreAudio);
      if (index === 1) {
        durationPreAudio = voice.duration * milliseconds + delaySecondAudio;
      } else {
        durationPreAudio = voice.duration * milliseconds + delayThirdAudio;
      }
      if (index === 2) {
        voice.addEventListener('ended', () => {
          imgAudio.forEach((img) => img.classList.toggle('disable'));
        }, { once: true });
      }
    });
    imgAudio.forEach((img) => img.classList.toggle('disable'));
  }

  private listenBtnPagination(btns: HTMLElement): void {
    btns.addEventListener('click', (e: Event) => {
      const target = (e.target as HTMLButtonElement);
      const page = target.dataset.page as string;

      this.pagination.changeNumPagination(page);
      this.getWordsChooseGroup(this.currentGroup, this.pagination.chooseNumPage);
    });
  }

  private startNumPage(): void {
    const btnPag = document.querySelectorAll('.btn__pag');
    btnPag.forEach((b, index) => {
      if (index === 1) {
        b.classList.add('btn__choose');
      } else {
        b.classList.remove('btn__choose');
      }
    });
  }
}

export default TextbookWordsSection;
