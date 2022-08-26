import { Headers } from './type';

export interface DataWords {
  id: string,
  group: number,
  page: number,
  word: string,
  image: string,
  audio: string,
  audioMeaning: string,
  audioExample: string,
  textMeaning: string,
  textExample: string,
  transcription: string,
  wordTranslate: string,
  textMeaningTranslate: string,
  textExampleTranslate: string
}

export interface QueryOptions {
  method: string;
  headers?: Headers;
  body?: string;
}

export interface WordStructure {
  group: number,
  page: number,
  word: string,
  image: string,
  audio: string,
  audioMeaning: string,
  audioExample: string,
  textMeaning: string,
  textExample: string,
  transcription: string,
  wordTranslate: string,
  textMeaningTranslate: string,
  textExampleTranslate: string,
  userWord?: UserWord,
  id?: string,
  _id?: string
}

export interface UserWord {
  difficulty: string,
  optional: OptionalUserWord
}

export interface OptionalUserWord {
  progress: string
}
