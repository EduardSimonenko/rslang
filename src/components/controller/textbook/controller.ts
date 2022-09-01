import { MethodEnum, UrlFolderEnum } from '../../../types/loadServerData/enum';
import { UserWordStructure } from '../../../types/loadServerData/interfaces';
import { UserLogin } from '../../../types/textbook/interfaces';
import Loader from '../load';

class Api extends Loader {
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

  static createUserWord(
    wordId: string,
    wordOption: UserWordStructure,
    user: UserLogin,
  ): Promise<Response> {
    return super.load(
      {
        method: MethodEnum.post,
        headers: {
          Authorization: `Bearer ${user.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wordOption),
      },
      [UrlFolderEnum.users, user.userId, UrlFolderEnum.words, wordId],
    );
  }

  static updateUserWord(
    wordId: string,
    wordOption: UserWordStructure,
    user: UserLogin,
  ): Promise<Response> {
    return super.load(
      {
        method: MethodEnum.put,
        headers: {
          Authorization: `Bearer ${user.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wordOption),
      },
      [UrlFolderEnum.users, user.userId, UrlFolderEnum.words, wordId],
    );
  }

  static async deleteWordUser(wordId: string, user: UserLogin): Promise<Response> {
    return super.load(
      {
        method: MethodEnum.delete,
        headers: {
          Authorization: `Bearer ${user.token}`,
          Accept: 'application/json',
        },
      },
      [UrlFolderEnum.users, user.userId, UrlFolderEnum.words, wordId],
    );
  }

  static async getWordUser(wordId: string, user: UserLogin): Promise<Response> {
    return super.load(
      {
        method: MethodEnum.get,
        headers: {
          Authorization: `Bearer ${user.token}`,
          Accept: 'application/json',
        },
      },
      [UrlFolderEnum.users, user.userId, UrlFolderEnum.words, wordId],
    );
  }

  static async getAllUserWord(user: UserLogin): Promise<Response> {
    return super.load(
      {
        method: MethodEnum.get,
        headers: {
          Authorization: `Bearer ${user.token}`,
          Accept: 'application/json',
        },
      },
      [UrlFolderEnum.users, user.userId, UrlFolderEnum.words],
    );
  }

  static async getWordsWithOption(group: string, page: string, user: UserLogin): Promise<Response> {
    return super.load(
      {
        method: MethodEnum.get,
        headers: {
          Authorization: `Bearer ${user.token}`,
          Accept: 'application/json',
        },
      },
      [UrlFolderEnum.users, user.userId, UrlFolderEnum.aggregatedWords],
      [`page=${page}`, `group=${group}`, 'wordsPerPage=20'],
    );
  }

  static async getDifficultWords(user: UserLogin): Promise<Response> {
    const hardWords = JSON.stringify({ 'userWord.difficulty': 'hard' });
    return super.load(
      {
        method: MethodEnum.get,
        headers: {
          Authorization: `Bearer ${user.token}`,
          Accept: 'application/json',
        },
      },
      [UrlFolderEnum.users, user.userId, UrlFolderEnum.aggregatedWords],
      ['wordsPerPage=50', `filter=${hardWords}`],
    );
  }
}

export default Api;
