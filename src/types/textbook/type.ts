import { AuthorizeUserWords, WordStructure } from '../loadServerData/interfaces';

export type RemoveElements = () => void;

export type ResponseData = WordStructure[] | AuthorizeUserWords[];

 type CurrenPage = {
   group: string,
   page: string
 };

export type StorageData = CurrenPage | string;
