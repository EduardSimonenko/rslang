import { AuthorizeUserWords, WordStructure } from '../../../types/loadServerData/interfaces';
import { ControlMenu, PageElements } from '../../../types/textbook/interfaces';
import { RemoveElements, ResponseData } from '../../../types/textbook/type';
import Api from '../../controller/textbook/controller';
import baseUrl from '../../model/baseUrl';
import TextbookPagination from './textbookPagination';
import TextbookUsers from './textbookUsers';
import textbookLevel from '../../../mocks/textbook.json';
import CreateDomElements from '../../controller/newElement';

class TextbookWordsSection {
  private body: HTMLBodyElement;

  private wrapper: HTMLElement;

  private cleanPage: RemoveElements;

  private containerWords: HTMLElement;

  private pagination: TextbookPagination;

  private activeUser: TextbookUsers;

  private wrapperPagination: HTMLElement;

  private hardWord: HTMLElement;

  private currentGroup: string;

  private allLevel: number;

  private isLogin: string | null;

  constructor(partPage: PageElements) {
    this.body = document.querySelector('.body') as HTMLBodyElement;
    this.cleanPage = partPage.clean;
    this.pagination = new TextbookPagination();
    this.activeUser = new TextbookUsers(partPage.isLogin);
    this.containerWords = CreateDomElements.createNewElement('div', ['container__words']);
    this.wrapperPagination = CreateDomElements.createNewElement('div', ['wrapper__pag']);
    this.wrapper = CreateDomElements.createNewElement('div', ['wrapper-textbook']);
    this.hardWord = CreateDomElements.createNewElement('h1', ['title__section'], 'Сложные слова!');
    this.currentGroup = partPage.group;
    this.allLevel = 6;
    this.isLogin = partPage.isLogin;
  }

  public renderPageWithWords(words: WordStructure[], menu: ControlMenu, groupHard?: boolean): void {
    this.cleanPage();

    CreateDomElements.insertChilds(
      this.wrapperPagination,
      [this.pagination.renderPaginationMenu()],
    );

    CreateDomElements.insertChilds(
      this.wrapper,
      [
        this.renderGroupTextbook(),
        this.hardWord,
        this.wrapperPagination,
        this.containerWords,
      ],
    );
    CreateDomElements.insertChilds(
      this.body,
      [menu.header, this.wrapper, menu.footer],
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
      const card: HTMLElement = CreateDomElements.createNewElement('div', ['card']);
      const img: HTMLElement = CreateDomElements.createNewElement('img', ['card__img']);
      const containerText: HTMLElement = CreateDomElements.createNewElement('div', ['card__text']);
      const wordEng: HTMLElement = CreateDomElements.createNewElement('h2', ['card__word'], word.word);
      const transcription: HTMLElement = CreateDomElements.createNewElement(
        'p',
        ['card__transcription'],
        word.transcription,
      );
      const translateWord: HTMLElement = CreateDomElements.createNewElement(
        'div',
        ['card__translate'],
        word.wordTranslate,
      );
      const textMeaning: HTMLElement = CreateDomElements.createNewElement(
        'p',
        ['card__mean'],
        word.textMeaning,
      );
      const textMeaningTranslate: HTMLElement = CreateDomElements.createNewElement(
        'p',
        ['card__translate'],
        word.textMeaningTranslate,
      );
      const textExample: HTMLElement = CreateDomElements.createNewElement(
        'p',
        ['card__example'],
        word.textExample,
      );
      const textExampleTranslate: HTMLElement = CreateDomElements.createNewElement(
        'p',
        ['card__translate'],
        word.textExampleTranslate,
      );
      const containerWord: HTMLElement = CreateDomElements.createNewElement('div', ['container__word']);
      const containerMean: HTMLElement = CreateDomElements.createNewElement('div', ['container__mean']);
      const containerExample: HTMLElement = CreateDomElements.createNewElement('div', ['container__example']);

      CreateDomElements.setAttributes(img, {
        src: `${baseUrl}/${word.image}`, width: '250', height: '250', alt: 'image word',
      });

      CreateDomElements.insertChilds(containerWord, [wordEng, transcription, translateWord]);
      CreateDomElements.insertChilds(containerMean, [textMeaning, textMeaningTranslate]);
      CreateDomElements.insertChilds(containerExample, [textExample, textExampleTranslate]);

      if (this.isLogin) {
        CreateDomElements.setAttributes(card, { id: word._id });
        this.activeUser.markWordsUser(card, word);
        CreateDomElements.insertChilds(
          containerText,
          [containerWord, containerMean, containerExample,
            this.activeUser.renderControlBtn(this.currentGroup)],
        );
      } else {
        CreateDomElements.setAttributes(card, { id: word.id });
        CreateDomElements.insertChilds(
          containerText,
          [containerWord, containerMean, containerExample],
        );
        this.activeUser.stylePageGroupPag(this.currentGroup);
      }

      CreateDomElements.insertChilds(
        card,
        [img, containerText, this.renderAudioIcons(word)],
      );

      CreateDomElements.insertChilds(this.containerWords, [card]);
    });
  }

  private renderAudioIcons(word: WordStructure): HTMLElement {
    const containerVoice: HTMLElement = CreateDomElements.createNewElement('div', ['container__voice']);
    const imgVoicePlay: HTMLElement = CreateDomElements.createNewElement('img', ['card__voice']);
    const imgVoiceStop: HTMLElement = CreateDomElements.createNewElement('img', ['card__voice', 'disable']);

    CreateDomElements.setAttributes(imgVoicePlay, {
      src: textbookLevel.play, width: '30', height: '30', alt: 'image voice',
    });
    CreateDomElements.setAttributes(imgVoiceStop, {
      src: textbookLevel.stop, width: '25', height: '25', alt: 'image voice',
    });

    CreateDomElements.insertChilds(
      containerVoice,
      [imgVoicePlay, imgVoiceStop, this.renderAudio(word)],
    );

    this.listenerAudio(containerVoice);
    return containerVoice;
  }

  private renderAudio(word: WordStructure): HTMLElement {
    const containerAudio: HTMLElement = CreateDomElements.createNewElement('div', ['container__audio']);
    const audio1: HTMLElement = CreateDomElements.createNewElement('audio', ['card__audio']);
    const audio2: HTMLElement = CreateDomElements.createNewElement('audio', ['card__audio']);
    const audio3: HTMLElement = CreateDomElements.createNewElement('audio', ['card__audio']);
    CreateDomElements.setAttributes(audio1, { src: `${baseUrl}/${word.audio}` });
    CreateDomElements.setAttributes(audio2, { src: `${baseUrl}/${word.audioMeaning}` });
    CreateDomElements.setAttributes(audio3, { src: `${baseUrl}/${word.audioExample}` });

    CreateDomElements.insertChilds(containerAudio, [audio1, audio2, audio3]);
    return containerAudio;
  }

  private renderGroupTextbook(): HTMLElement {
    const containerGroup: HTMLElement = CreateDomElements.createNewElement('div', ['container__group']);
    const imgTextbookLevel: Record<string, string> = textbookLevel;
    let heightLevel = 60;
    let chooseGroup: string[];

    if (this.isLogin) {
      this.allLevel = 7;
    }

    for (let i = 0; i < this.allLevel; i += 1) {
      const level: HTMLElement = CreateDomElements.createNewElement('img', ['img__book']);
      if (i === +this.currentGroup) {
        chooseGroup = ['btn__group', 'btn__shadow'];
      } else {
        chooseGroup = ['btn__group'];
      }
      const btnBook: HTMLElement = CreateDomElements.createNewElement('button', chooseGroup);

      CreateDomElements.setAttributes(
        level,
        {
          src: imgTextbookLevel[`book${i}`],
          'data-book': `${i}`,
          width: '60',
          height: `${heightLevel}`,
          alt: `book level ${i + 1}`,
        },
      );
      CreateDomElements.insertChilds(btnBook, [level]);
      CreateDomElements.insertChilds(containerGroup, [btnBook]);
      heightLevel += 5;
    }
    this.listener(containerGroup);

    return containerGroup;
  }

  private listener(books: HTMLElement): void {
    books.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLImageElement;
      if (!target.classList.contains('img__book')) return;

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
      response = (await Api.getDifficultWords()) as Response;
      data = await response.json() as AuthorizeUserWords[];
      this.renderSectionTextbook(data[0].paginatedResults, true);
    } else if (this.isLogin) {
      response = (await Api.getWordsWithOption(group, page)) as Response;
      data = await response.json() as AuthorizeUserWords[];
      this.renderSectionTextbook(data[0].paginatedResults);
    } else {
      response = (await Api.getAllWords(group, page)) as Response;
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
      if (!target.classList.contains('btn__pag')) return;

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
