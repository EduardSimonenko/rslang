import NewElement from '../../controller/newElement';
import descrBlocks from '../../model/descsriptionBlocks';
import teammates from '../../model/teammateData';

class Page {
  private static body = document.querySelector('body') as HTMLBodyElement;

  static renderMainPage(): void {
    const header = this.renderHeader();
    const main = this.renderMain();
    const footer = this.renderFooter();

    NewElement.insertChilds(this.body, [header, main, footer]);
  }

  static renderHeader(): HTMLElement {
    const wrapper = NewElement.createNewElement('div', ['wrapper']);
    const header = NewElement.createNewElement('header', ['header']);
    const logo = NewElement.createNewElement('div', ['logo']);
    const login = NewElement.createNewElement('button', ['login']);
    const navbar = this.renderMenu();

    const logoLink = NewElement.createNewElement('a', ['logo__link']) as HTMLImageElement;
    const logoImg = NewElement.createNewElement('img', ['logo__img']) as HTMLImageElement;
    const loginImg = NewElement.createNewElement('img', ['login__img']) as HTMLImageElement;

    loginImg.src = '../../assets/images/login-icon.svg';
    logoImg.src = '../../assets/images/logo-icon.svg';

    logoImg.alt = 'logo image';
    loginImg.alt = 'login image';

    NewElement.insertChilds(logoLink, [logoImg]);
    NewElement.insertChilds(logo, [logoLink]);
    NewElement.insertChilds(login, [loginImg]);

    NewElement.insertChilds(wrapper, [logo, navbar, login]);
    NewElement.insertChilds(header, [wrapper]);

    return header;
  }

  private static renderMenu(): HTMLElement {
    const navbar = NewElement.createNewElement('nav', ['navbar']);
    const nav = NewElement.createNewElement('ul', ['nav']);
    const linkToMainPage = NewElement.createNewElement('a', ['nav__link'], 'главная');
    const linkToTextbook = NewElement.createNewElement('a', ['nav__link'], 'учебник');
    const linkToGames = NewElement.createNewElement('a', ['nav__link'], 'мини игры');
    const linkToStatistics = NewElement.createNewElement('a', ['nav__link'], 'статистика');

    const linksToPages = [linkToMainPage, linkToTextbook, linkToGames, linkToStatistics];

    linksToPages.forEach((el) => {
      const newItem = NewElement.createNewElement('li', ['nav__item']);
      NewElement.insertChilds(newItem, [el]);
      NewElement.insertChilds(nav, [newItem]);
    });

    NewElement.insertChilds(navbar, [nav]);

    return navbar;
  }

  private static renderMain(): HTMLElement {
    const main = NewElement.createNewElement('main', ['main']);
    const wrapper = NewElement.createNewElement('div', ['wrapper']);
    const gameBenefitsSection = NewElement.createNewElement('section', ['game-benefits']);
    const gameBenefitsTitle = NewElement.createNewElement('h1', ['game-benefits__title'], 'Rs-lang разработано на базовых принципах');
    const teamSection = this.renderTeamSection();

    descrBlocks.forEach((el, index) => {
      const benefitDescriptionBlock = NewElement.createNewElement('div', ['game-benefits__description', 'description-block']);
      const subtitle = NewElement.createNewElement('h3', ['description-block__title'], el.titleContent);
      const quote = NewElement.createNewElement('blockquote', ['description-block__blockquote'], el.quote);
      NewElement.insertChilds(benefitDescriptionBlock, [subtitle, quote]);

      if (el.additionalContent) {
        const additionalContent = NewElement.createNewElement('p', ['description-block__content'], el.additionalContent);
        NewElement.insertChilds(benefitDescriptionBlock, [additionalContent]);
      }

      const imageBlock = this.createBlockWithImg('game-benefits__img-block', `../../assets/images/benefit${index}.png`, 'benefit image');
      if (index % 2 === 0) {
        NewElement.insertChilds(gameBenefitsSection, [imageBlock, benefitDescriptionBlock]);
      } else {
        NewElement.insertChilds(gameBenefitsSection, [benefitDescriptionBlock, imageBlock]);
      }
    });

    NewElement.insertChilds(wrapper, [gameBenefitsTitle, gameBenefitsSection, teamSection]);
    NewElement.insertChilds(main, [wrapper]);

    return main;
  }

  static renderFooter(): HTMLElement {
    const wrapper = NewElement.createNewElement('div', ['wrapper']);
    const footer = NewElement.createNewElement('footer', ['footer']);
    const logoRSBlock = NewElement.createNewElement('div', ['rs-school-logo']);
    const logoRSLink = NewElement.createNewElement('a', ['rs-school-logo__link']);
    const logoRSImg = NewElement.createNewElement('img', ['rs-school-logo__link']) as HTMLImageElement;
    const githubLinksBlock = NewElement.createNewElement('div', ['github-links']);
    const yearBlock = NewElement.createNewElement('div', ['creation-year']);
    const yearBlockContent = NewElement.createNewElement('p', ['creation-year__content'], '2022');

    logoRSImg.src = './assets/images/rs-school-logo.png';

    teammates.forEach((el) => {
      const linkToTeammate = NewElement.createNewElement('a', ['github-links__item']) as HTMLLinkElement;
      const githubImage = NewElement.createNewElement('img', ['github-links__image']) as HTMLImageElement;

      linkToTeammate.href = el.linkToGithub;
      githubImage.src = el.pathToGithubFoto;
      githubImage.alt = 'teammate github logo';
      NewElement.insertChilds(linkToTeammate, [githubImage]);
      NewElement.insertChilds(githubLinksBlock, [linkToTeammate]);
    });

    NewElement.insertChilds(logoRSLink, [logoRSImg]);
    NewElement.insertChilds(logoRSBlock, [logoRSLink]);
    NewElement.insertChilds(yearBlock, [yearBlockContent]);
    NewElement.insertChilds(wrapper, [logoRSBlock, githubLinksBlock, yearBlock]);
    NewElement.insertChilds(footer, [wrapper]);

    return footer;
  }

  private static createBlockWithImg(blockClassName: string, path: string, alt: string):HTMLElement {
    const gameBenefitsImgBlock = NewElement.createNewElement('div', [blockClassName]);
    const gameBenefitsImg = NewElement.createNewElement('img', ['game-benefits__img']) as HTMLImageElement;
    gameBenefitsImg.src = path;
    gameBenefitsImg.alt = alt;
    NewElement.insertChilds(gameBenefitsImgBlock, [gameBenefitsImg]);

    return gameBenefitsImgBlock;
  }

  private static renderTeamSection(): HTMLElement {
    const teamSection = NewElement.createNewElement('section', ['team']);
    const teamTitle = NewElement.createNewElement('h2', ['team-title'], 'Лучшие разработчики РБ');

    NewElement.insertChilds(teamSection, [teamTitle]);

    teammates.forEach((el) => {
      const teammate = NewElement.createNewElement('div', ['teammate']);
      const teammateFoto = NewElement.createNewElement('img', ['teammate__foto']) as HTMLImageElement;
      const linkToGithub = NewElement.createNewElement('a', ['teammate__link'], el.name) as HTMLLinkElement;

      teammateFoto.src = el.pathToFoto;
      teammateFoto.alt = 'handsome man photo';
      linkToGithub.href = el.linkToGithub;

      NewElement.insertChilds(teammate, [teammateFoto, linkToGithub]);
      NewElement.insertChilds(teamSection, [teammate]);
    });

    return teamSection;
  }
}

export default Page;
