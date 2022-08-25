import { AuthorizeUserWords, WordStructure } from '../loadServerData/interfaces';

export type RemoveElements = () => void;

export type ResponseData = WordStructure[] | AuthorizeUserWords[];
