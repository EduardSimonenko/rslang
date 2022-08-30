import { Headers } from './type';

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
  userWord?: UserWordStructure,
  id?: string,
  _id?: string
}

export interface QueryOptions {
  method: string;
  headers?: Headers;
  body?: string;
}

export interface UserWordStructure {
  difficulty: string,
  optional: OptionalUserWord
}

export interface OptionalUserWord {
  isLearned: boolean,
  learnStep?: number,
  startLearningAt?: number
}

export interface AuthorizeUserWords {
  paginatedResults: WordStructure[]
  totalCount: []
}
