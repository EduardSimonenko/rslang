import { RemoveElements } from './type';

export interface UserWord {
  wordId: string,
  request: string
  difficulty?: string,
  progress?: string,
}

export interface StateTextbook {
  page: string,
  group: string
}

export interface PageElements {
  clean: RemoveElements,
  group: string,
  isLogin: string | null
}

export interface ControlMenu {
  header: HTMLElement,
  footer: HTMLElement,
  namePage?: string
}
