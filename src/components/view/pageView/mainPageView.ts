import NewElement from '../../controller/newElement';

export default class Page {
  private static body = document.querySelector('body');

  static renderHeader() {
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

  private static renderMenu() {
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
}
