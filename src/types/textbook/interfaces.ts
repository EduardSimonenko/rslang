import { RemoveElements } from './type';

export interface StateTextbook {
  page: string,
  group: string,
}

export interface PageElements {
  clean: RemoveElements,
  group: string,
  isLogin: string | null
}

export interface ControlMenu {
  header: HTMLElement,
  footer: HTMLElement,
  namePage?: string,
}

export interface UserLogin {
  token: string,
  userId: string,
}

export interface SpinnerOptions {
  lines: number,
  length: number,
  width: number,
  radius: number,
  scale: number,
  corners: number,
  speed: number,
  rotate: number,
  animation: string,
  direction: number,
  color: string,
  fadeColor: string,
  top: string,
  left: string,
  shadow: string,
  zIndex: number,
  className: string,
  position: string,
}
