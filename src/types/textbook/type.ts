import { AuthorizeUserWords, WordStructure } from '../loadServerData/interfaces';

export type RemoveElements = () => void;

export type ResponseData = WordStructure[] | AuthorizeUserWords[];

export type DataUrl = {
  group: string,
  page: string,
  pageUrl?: string
};

export type StorageData = DataUrl | string;
