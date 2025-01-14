import CreateDomElements from '../../controller/newElement';
import CustomStorage from '../../controller/storage';
import descrBlocks from '../../model/descsriptionBlocks';
import teammates from '../../model/teammateData';
import AppView from '../appView';

class Page {
  private static body = document.querySelector('body') as HTMLBodyElement;

  static renderPage(): void {
    const header = this.renderHeader();
    const main = this.renderMain();
    const footer = this.renderFooter();

    CreateDomElements.insertChilds(this.body, [header, main, footer]);
  }

  static renderHeader(): HTMLElement {
    if (this.body.firstElementChild) {
      while (this.body.firstElementChild) {
        this.body.firstElementChild.remove();
      }
    }

    const wrapper = CreateDomElements.createNewElement('div', ['wrapper']);
    const header = CreateDomElements.createNewElement('header', ['header']);
    const logo = CreateDomElements.createNewElement('div', ['logo']);
    const login = CreateDomElements.createNewElement('button', ['login']);
    const navbar = this.renderMenu();

    const logoLink = CreateDomElements.createNewElement('a', ['logo__link']) as HTMLLinkElement;
    const logoImg = CreateDomElements.createNewElement('img', ['logo__img']) as HTMLImageElement;
    const loginImg = CreateDomElements.createNewElement('img', ['login__img']) as HTMLImageElement;

    logoLink.href = '#main';
    loginImg.src = '../../assets/images/login-icon.svg';
    logoImg.src = '../../assets/images/logo-icon.svg';

    logoImg.alt = 'logo image';
    loginImg.alt = 'login image';

    CreateDomElements.setAttributes(loginImg, { 'data-page': 'login' });

    CreateDomElements.insertChilds(logoLink, [logoImg]);
    CreateDomElements.insertChilds(logo, [logoLink]);
    CreateDomElements.insertChilds(login, [loginImg]);

    CreateDomElements.insertChilds(wrapper, [logo, navbar, login]);
    CreateDomElements.insertChilds(header, [wrapper]);
    login.addEventListener('click', this.listenLogIn);

    return header;
  }

  private static renderMenu(): HTMLElement {
    const navbar = CreateDomElements.createNewElement('nav', ['navbar']);
    const nav = CreateDomElements.createNewElement('ul', ['nav']);
    const linkToMainPage = CreateDomElements.createNewElement('a', ['nav__link'], 'главная');
    const linkToTextbook = CreateDomElements.createNewElement('a', ['nav__link'], 'учебник');
    const linkToGames = CreateDomElements.createNewElement('p', ['nav__link', 'link-to-games'], 'мини игры');
    const linkToStatistics = CreateDomElements.createNewElement('a', ['nav__link'], 'статистика');

    const submenu = CreateDomElements.createNewElement('ul', ['submenu']);
    const linkToSprintGame = CreateDomElements.createNewElement('a', ['link-to-games__content'], 'cпринт');
    const linkToAudioGame = CreateDomElements.createNewElement('a', ['link-to-games__content'], 'аудиовызов');
    const arrOfGamesLinks = [linkToSprintGame, linkToAudioGame];

    CreateDomElements.setAttributes(linkToMainPage, { href: '#main' });
    CreateDomElements.setAttributes(linkToTextbook, { href: '#textbook' });
    CreateDomElements.setAttributes(linkToSprintGame, { href: '#game/sprint' });
    CreateDomElements.setAttributes(linkToAudioGame, { href: '#game/audio-call' });
    CreateDomElements.setAttributes(linkToStatistics, { href: '#statistics' });

    arrOfGamesLinks.forEach((el) => {
      const newItem = CreateDomElements.createNewElement('li', ['submenu__item']);
      CreateDomElements.insertChilds(newItem, [el]);
      CreateDomElements.insertChilds(submenu, [newItem]);
    });

    CreateDomElements.insertChilds(linkToGames, [submenu]);

    const linksToPages = [linkToMainPage, linkToTextbook, linkToGames, linkToStatistics];

    linksToPages.forEach((el) => {
      const newItem = CreateDomElements.createNewElement('li', ['nav__item']);
      CreateDomElements.insertChilds(newItem, [el]);
      CreateDomElements.insertChilds(nav, [newItem]);
    });

    CreateDomElements.insertChilds(navbar, [nav]);

    if (!CustomStorage.getStorage('token')) {
      linkToStatistics.style.display = 'none';
    }

    return navbar;
  }

  private static renderMain(): HTMLElement {
    const main = CreateDomElements.createNewElement('main', ['main']);
    const wrapper = CreateDomElements.createNewElement('div', ['wrapper']);
    const gameBenefitsSection = CreateDomElements.createNewElement('section', ['game-benefits']);
    const gameBenefitsTitle = CreateDomElements.createNewElement('h1', ['game-benefits__title'], 'Rs-lang разработано на базовых принципах');
    const teamSection = this.renderTeamSection();

    descrBlocks.forEach((el, index) => {
      const benefitDescriptionBlock = CreateDomElements.createNewElement('div', ['game-benefits__description', 'description-block']);
      const subtitle = CreateDomElements.createNewElement('h3', ['description-block__title'], el.titleContent);
      const quote = CreateDomElements.createNewElement('blockquote', ['description-block__blockquote'], el.quote);
      CreateDomElements.insertChilds(benefitDescriptionBlock, [subtitle, quote]);

      if (el.additionalContent) {
        const additionalContent = CreateDomElements.createNewElement('p', ['description-block__content'], el.additionalContent);
        CreateDomElements.insertChilds(benefitDescriptionBlock, [additionalContent]);
      }

      const imageBlock = this.createBlockWithImg('game-benefits__img-block', `../../assets/images/benefit${index}.png`, 'benefit image');
      if (index % 2 === 0) {
        CreateDomElements.insertChilds(gameBenefitsSection, [imageBlock, benefitDescriptionBlock]);
      } else {
        CreateDomElements.insertChilds(gameBenefitsSection, [benefitDescriptionBlock, imageBlock]);
      }
    });

    CreateDomElements.insertChilds(wrapper, [gameBenefitsTitle, gameBenefitsSection, teamSection]);
    CreateDomElements.insertChilds(main, [wrapper]);

    return main;
  }

  static renderFooter(): HTMLElement {
    const wrapper = CreateDomElements.createNewElement('div', ['wrapper']);
    const footer = CreateDomElements.createNewElement('footer', ['footer']);
    const logoRSBlock = CreateDomElements.createNewElement('div', ['rs-school-logo']);
    const logoRSLink = CreateDomElements.createNewElement('a', ['rs-school-logo__link']);
    CreateDomElements.setAttributes(logoRSLink, { href: 'https://rs.school/js/', target: '_blank' });
    const logoRSImg = CreateDomElements.createNewElement('img', ['rs-school-logo__link']) as HTMLImageElement;
    const githubLinksBlock = CreateDomElements.createNewElement('div', ['github-links']);
    const yearBlock = CreateDomElements.createNewElement('div', ['creation-year']);
    const yearBlockContent = CreateDomElements.createNewElement('p', ['creation-year__content'], '2022');

    logoRSImg.src = '../assets/images/rs-school-logo.png';

    teammates.forEach((el) => {
      const linkToTeammate = CreateDomElements.createNewElement('a', ['github-links__item']) as HTMLLinkElement;
      const githubImage = CreateDomElements.createNewElement('img', ['github-links__image']) as HTMLImageElement;

      CreateDomElements.setAttributes(linkToTeammate, { target: '_blank' });
      linkToTeammate.href = el.linkToGithub;
      githubImage.src = el.pathToGithubFoto;
      githubImage.alt = 'teammate github logo';
      CreateDomElements.insertChilds(linkToTeammate, [githubImage]);
      CreateDomElements.insertChilds(githubLinksBlock, [linkToTeammate]);
    });

    CreateDomElements.insertChilds(logoRSLink, [logoRSImg]);
    CreateDomElements.insertChilds(logoRSBlock, [logoRSLink]);
    CreateDomElements.insertChilds(yearBlock, [yearBlockContent]);
    CreateDomElements.insertChilds(wrapper, [logoRSBlock, githubLinksBlock, yearBlock]);
    CreateDomElements.insertChilds(footer, [wrapper]);

    return footer;
  }

  private static createBlockWithImg(blockClassName: string, path: string, alt: string):HTMLElement {
    const gameBenefitsImgBlock = CreateDomElements.createNewElement('div', [blockClassName]);
    const gameBenefitsImg = CreateDomElements.createNewElement('img', ['game-benefits__img']) as HTMLImageElement;
    gameBenefitsImg.src = path;
    gameBenefitsImg.alt = alt;
    CreateDomElements.insertChilds(gameBenefitsImgBlock, [gameBenefitsImg]);

    return gameBenefitsImgBlock;
  }

  private static renderTeamSection(): HTMLElement {
    const teamSection = CreateDomElements.createNewElement('section', ['team']);
    const teamTitle = CreateDomElements.createNewElement('h2', ['team-title'], 'Команда разработчиков');

    CreateDomElements.insertChilds(teamSection, [teamTitle]);

    teammates.forEach((el) => {
      const teammate = CreateDomElements.createNewElement('div', ['teammate']);
      const teammateFoto = CreateDomElements.createNewElement('img', ['teammate__foto']) as HTMLImageElement;
      const linkToGithub = CreateDomElements.createNewElement('a', ['teammate__link'], el.name) as HTMLLinkElement;
      const teammateRole = CreateDomElements.createNewElement('div', ['teammate__role'], el.role);

      CreateDomElements.setAttributes(linkToGithub, { target: '_blank' });
      teammateFoto.src = el.pathToFoto;
      teammateFoto.alt = 'handsome man photo';
      linkToGithub.href = el.linkToGithub;

      CreateDomElements.insertChilds(teammate, [teammateFoto, linkToGithub, teammateRole]);
      CreateDomElements.insertChilds(teamSection, [teammate]);
    });

    return teamSection;
  }

  private static listenLogIn(): void {
    const login: AppView = new AppView();
    login.startAuth();
  }
}

export default Page;
