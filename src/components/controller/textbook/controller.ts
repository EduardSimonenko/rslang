import { MethodEnum, UrlFolderEnum } from '../../../types/loadServerData/enum';
import { UserWordStructure } from '../../../types/loadServerData/interfaces';
import Loader from '../load';
import CustomStorage from '../storage';

class Api extends Loader {
  static token: string = CustomStorage.getStorage('token');

  static userId: string = CustomStorage.getStorage('userId');

  static getAllWords(group: string, page: string): Promise<Response> {
    return super.load(
      {
        method: MethodEnum.get,
        headers: {
          'Content-Type': 'application/json',
        },
      },
      [UrlFolderEnum.words],
      [`page=${page}`, `group=${group}`],
    );
  }

  static createUserWord(wordId: string, wordOption: UserWordStructure): Promise<Response> {
    return super.load(
      {
        method: MethodEnum.post,
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wordOption),
      },
      [UrlFolderEnum.users, this.userId, UrlFolderEnum.words, wordId],
    );
  }

  static updateUserWord(wordId: string, wordOption: UserWordStructure): Promise<Response> {
    return super.load(
      {
        method: MethodEnum.put,
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wordOption),
      },
      [UrlFolderEnum.users, this.userId, UrlFolderEnum.words, wordId],
    );
  }

  static async deleteWordUser(wordId: string): Promise<Response> {
    return super.load(
      {
        method: MethodEnum.delete,
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/json',
        },
      },
      [UrlFolderEnum.users, this.userId, UrlFolderEnum.words, wordId],
    );
  }

  static async getWordUser(wordId: string): Promise<Response> {
    return super.load(
      {
        method: MethodEnum.get,
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/json',
        },
      },
      [UrlFolderEnum.users, this.userId, UrlFolderEnum.words, wordId],
    );
  }

  static async getAllUserWord(): Promise<Response> {
    return super.load(
      {
        method: MethodEnum.get,
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/json',
        },
      },
      [UrlFolderEnum.users, this.userId, UrlFolderEnum.words],
    );
  }

  static async getWordsWithOption(group: string, page: string): Promise<Response> {
    return super.load(
      {
        method: MethodEnum.get,
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/json',
        },
      },
      [UrlFolderEnum.users, this.userId, UrlFolderEnum.aggregatedWords],
      [`page=${page}`, `group=${group}`, 'wordsPerPage=20'],
    );
  }

  static async getDifficultWords(): Promise<Response> {
    const hardWords = JSON.stringify({ 'userWord.difficulty': 'hard' });
    return super.load(
      {
        method: MethodEnum.get,
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/json',
        },
      },
      [UrlFolderEnum.users, this.userId, UrlFolderEnum.aggregatedWords],
      ['wordsPerPage=50', `filter=${hardWords}`],
    );
  }
}

export default Api;
