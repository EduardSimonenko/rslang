import { Spinner } from 'spin.js';
import { AuthorizeUserWords, WordStructure } from '../../../types/loadServerData/interfaces';
import Api from '../../controller/textbook/controller';
import baseUrl from '../../model/baseUrl';
import TextbookPagination from './textbookPagination';
import TextbookUsers from './textbookUsers';
import textbookLevel from '../../../mocks/textbook.json';
import CreateDomElements from '../../controller/newElement';
import CustomStorage from '../../controller/storage';
import Page from '../pageView/mainPageView';
import cleanPage from '../../utils/cleanPage';
import getUserData from '../../utils/userLogin';
import optsSpiner from '../../utils/spinner';
import getGroupAndPage from '../../utils/getGroupAndPage';
import { ResponseData } from '../../../types/textbook/type';
import { createUrlPath } from '../../utils/createUrlPath';

class TextbookWordsSection {
  private body: HTMLBodyElement;

  private wrapper: HTMLElement;

  private containerWords: HTMLElement;

  private pagination: TextbookPagination;

  private activeUser: TextbookUsers;

  private wrapperPagination: HTMLElement;

  private hardWord: HTMLElement;

  private currentGroup: string;

  private allLevel: number;

  private token: string | null;

  private header: HTMLElement;

  private footer: HTMLElement;

  private userId: string;

  private curPagination: string;

  private btnGames: HTMLElement;

  constructor(currentGroup?: string, curPagination?: string) {
    this.body = document.querySelector('.body') as HTMLBodyElement;
    this.pagination = new TextbookPagination();
    this.activeUser = new TextbookUsers();
    this.containerWords = CreateDomElements.createNewElement('div', ['container__words']);
    this.wrapperPagination = CreateDomElements.createNewElement('div', ['wrapper__pag']);
    this.wrapper = CreateDomElements.createNewElement('div', ['wrapper-textbook']);
    this.hardWord = CreateDomElements.createNewElement('h1', ['title__section'], 'Сложные слова!');
    this.currentGroup = currentGroup;
    this.allLevel = 6;
    this.token = CustomStorage.getStorage('token');
    this.userId = CustomStorage.getStorage('userId');
    this.header = Page.renderHeader();
    this.footer = Page.renderFooter();
    this.curPagination = curPagination;
    this.btnGames = this.renderBtnGames();
  }

  public renderPage(): void {
    const container = CreateDomElements.createNewElement('div', ['container__work']);

    cleanPage();
    let pagMenu;
    if (this.curPagination) {
      pagMenu = this.pagination.renderPaginationMenu(this.curPagination);
      this.getWordsChooseGroup(this.currentGroup, this.curPagination);
    } else {
      pagMenu = this.pagination.renderPaginationMenu();
      this.getWordsChooseGroup(this.currentGroup);
    }

    CreateDomElements.insertChilds(this.wrapperPagination, [pagMenu]);
    CreateDomElements.insertChilds(
      container,
      [this.renderGroupTextbook(), this.containerWords],
    );

    CreateDomElements.insertChilds(
      this.wrapper,
      [this.btnGames,
        this.wrapperPagination,
        container,
        this.createBtnUp(),
      ],
    );

    CreateDomElements.insertChilds(
      this.body,
      [this.header, this.wrapper, this.footer],
    );

    this.listenBtnPagination(this.wrapperPagination);
  }

  private renderSectionTextbook(words: WordStructure[], groupHard?: boolean): void {
    if (groupHard) {
      this.wrapperPagination.style.display = 'none';
      this.btnGames.insertAdjacentElement('afterend', this.hardWord);
    } else {
      this.wrapperPagination.style.display = 'flex';
      this.hardWord.remove();
    }

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

      if (this.token) {
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

  private renderBtnGames(): HTMLElement {
    const containerGame: HTMLElement = CreateDomElements.createNewElement('div', ['container__game']);
    const btnAudioGame: HTMLElement = CreateDomElements.createNewElement('button', ['game__audio']);
    const btnSprintGame: HTMLElement = CreateDomElements.createNewElement('button', ['game__sprint']);
    const btnBackgroundA: HTMLElement = CreateDomElements.createNewElement('img', ['game__img-audio']);
    const btnBackgroundS: HTMLElement = CreateDomElements.createNewElement('img', ['game__img-sprint']);
    const btnTextA: HTMLElement = CreateDomElements.createNewElement('p', ['game__text-audio'], 'Аудио Вызов');
    const btnTextS: HTMLElement = CreateDomElements.createNewElement('p', ['game__text-sprint'], 'Спринт');
    const btnPlayA: HTMLElement = CreateDomElements.createNewElement('a', ['game__play-audio', 'play'], 'Играть');
    const btnPlayS: HTMLElement = CreateDomElements.createNewElement('a', ['game__play-sprint', 'play'], 'Играть');

    CreateDomElements.setAttributes(btnBackgroundA, {
      src: '../../../assets/svg/sprint.svg',
      width: '60px',
      height: '80px',
    });
    CreateDomElements.setAttributes(btnBackgroundS, {
      src: '../../../assets/svg/audioCall.svg',
      width: '60px',
      height: '80px',
    });
    CreateDomElements.setAttributes(btnPlayA, { 'data-name': 'game/audio-call/play' });
    CreateDomElements.setAttributes(btnPlayS, { 'data-name': 'game/sprint/play' });

    CreateDomElements.insertChilds(btnAudioGame, [btnTextA, btnBackgroundS, btnPlayA]);
    CreateDomElements.insertChilds(btnSprintGame, [btnTextS, btnBackgroundA, btnPlayS]);
    CreateDomElements.insertChilds(containerGame, [btnAudioGame, btnSprintGame]);

    [btnPlayA, btnPlayS].forEach((btn) => btn.addEventListener('click', this.gameLaunchToTextbook));

    return containerGame;
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
      [imgVoicePlay, imgVoiceStop, this.renderAudio(word), this.activeUser.renderProgressWord()],
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
    let chooseGroup: string[];

    if (this.token) {
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
      CreateDomElements.setAttributes(btnBook, { id: `${i}` });

      CreateDomElements.setAttributes(
        level,
        {
          src: imgTextbookLevel[`book${i}`],
          'data-book': `${i}`,
          'data-page': 'textbook/words',
          width: '60',
          height: '85',
          alt: `book level ${i + 1}`,
        },
      );
      CreateDomElements.insertChilds(btnBook, [level]);
      CreateDomElements.insertChilds(containerGroup, [btnBook]);
    }
    this.listenerGroupWords(containerGroup);

    return containerGroup;
  }

  private createBtnUp(): HTMLElement {
    const btnUp = CreateDomElements.createNewElement('button', ['button__up']);
    const btnImg = CreateDomElements.createNewElement('img', ['button__img-up']);

    CreateDomElements.setAttributes(btnImg, {
      src: '../../../assets/images/button-up.png',
      width: '40',
      height: '40',
      alt: 'button up',
    });

    CreateDomElements.insertChilds(btnUp, [btnImg]);
    btnUp.addEventListener('click', () => { window.scrollTo(0, 0); });
    window.addEventListener('scroll', this.openBtnUp);

    return btnUp;
  }

  private openBtnUp(): void {
    const btn = document.querySelector('.button__up') as HTMLButtonElement;
    const heightWindow: number = window.pageYOffset;
    const startPoint = 300;
    if (heightWindow > startPoint) {
      btn.classList.add('open-button-up');
    }
    if (heightWindow < startPoint) {
      btn.classList.remove('open-button-up');
    }
  }

  private listenerGroupWords(books: HTMLElement): void {
    books.addEventListener('click', (e: Event) => {
      const target = (e.target as HTMLImageElement).parentElement;
      const group = target.getAttribute('id') as string;

      this.currentGroup = group;
      this.pagination.chooseNumPage = '0';
      this.chooseLevel(group);
      this.getWordsChooseGroup(group);
      this.startNumPage();
      createUrlPath(
        {
          group: this.currentGroup,
          page: this.pagination.chooseNumPage,
          path: 'textbook/words',
        },
      );
      CustomStorage.setStorage('textbookWords', { group, page: '0' });
    });
  }

  public async getWordsChooseGroup(group: string, page = '0'): Promise<void> {
    let words: ResponseData;
    const hardGroup = '6';
    const container = document.querySelector('.body') as HTMLElement;
    const spinner = new Spinner(optsSpiner);
    spinner.spin(container);

    if (this.token && group === hardGroup) {
      words = (await Api.getDifficultWords(getUserData())) as AuthorizeUserWords[];
      this.cleanSectionWords();
      this.renderSectionTextbook(words[0].paginatedResults, true);
    } else if (this.token) {
      words = (await Api.getWordsWithOption(group, page, getUserData())) as AuthorizeUserWords[];
      this.cleanSectionWords();
      this.renderSectionTextbook(words[0].paginatedResults);
    } else {
      words = (await Api.getAllWords(group, page)) as WordStructure[];
      this.cleanSectionWords();
      this.renderSectionTextbook(words);
    }
    this.currentGroup = group;
    spinner.stop();
  }

  public chooseLevel(group: string): void {
    const btns = document.querySelectorAll('.btn__group') as NodeListOf<Element>;
    btns.forEach((btn) => btn.classList.remove('btn__shadow'));
    document.getElementById(group).classList.add('btn__shadow');
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
      const target = (e.target as HTMLLinkElement);
      if (!target.classList.contains('btn__pag')) return;

      const page = target.dataset.page as string;

      this.pagination.changeNumPagination(page);
      this.getWordsChooseGroup(this.currentGroup, this.pagination.chooseNumPage);
      createUrlPath(
        {
          group: this.currentGroup,
          page: this.pagination.chooseNumPage,
          path: 'textbook/words',
        },
      );
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

  private gameLaunchToTextbook(e: PointerEvent): void {
    const { name } = (e.target as HTMLParagraphElement).dataset;
    const urlPage: string = CustomStorage.getStorage('page');
    const chooseGame = e.currentTarget as HTMLLinkElement;
    const data: string[] = getGroupAndPage(urlPage);
    chooseGame.href = `#${name}?group=${data[0]}&page=${data[1]}`;
  }
}

export default TextbookWordsSection;
