import NewElement from '../../controller/newElement';

export default class Header {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  static getHeader(): void {
    const body = document.querySelector('body');
    const wrapper = NewElement.createNewElement('div', ['wrapper']);
    const header = NewElement.createNewElement('header', ['header']);
    const burger = NewElement.createNewElement('button', ['burger-btn']);
    const login = NewElement.createNewElement('button', ['login-btn']);
    const logoLink = NewElement.createNewElement('a', ['logo-link']);

    const burgerImg = NewElement.createNewElement('img', ['burger-img']) as HTMLImageElement;
    const loginImg = NewElement.createNewElement('img', ['login-img']) as HTMLImageElement;
    const logoImg = NewElement.createNewElement('img', ['logo-img']) as HTMLImageElement;

    burgerImg.src = '../../assets/images/burger-icon.svg';
    loginImg.src = '../../assets/images/login-icon.svg';
    logoImg.src = '../../assets/images/logo-icon.svg';

    NewElement.insertChilds(burger, [burgerImg]);
    NewElement.insertChilds(login, [loginImg]);
    NewElement.insertChilds(logoLink, [logoImg]);
    NewElement.insertChilds(wrapper, [burger, logoLink, login]);

    NewElement.insertChilds(header, [wrapper]);
    NewElement.insertChilds(body, [header]);
  }
}
