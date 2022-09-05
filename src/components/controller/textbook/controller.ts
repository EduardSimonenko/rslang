import { MethodEnum, UrlFolderEnum } from '../../../types/loadServerData/enum';
import { AuthorizeUserWords, UserWordStructure, WordStructure } from '../../../types/loadServerData/interfaces';
import { StatisticsData } from '../../../types/statistics/interfaces';
import { UserLogin } from '../../../types/textbook/interfaces';
import { ResponseData } from '../../../types/textbook/type';
import Loader from '../load';

class Api extends Loader {
  static async getAllWords(group: string, page: string): Promise<WordStructure[]> {
    const response: Response = await super.load(
      {
        method: MethodEnum.get,
        headers: {
          'Content-Type': 'application/json',
        },
      },
      [UrlFolderEnum.words],
      [`page=${page}`, `group=${group}`],
    );
    const data = await response.json() as WordStructure[];
    return data;
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

  static async getWordsWithOption(
    group: string,
    page: string,
    user: UserLogin,
  ): Promise<ResponseData> {
    const response: Response = await super.load(
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
    const data = await response.json() as AuthorizeUserWords[];
    return data;
  }

  static async getfilterWords(user: UserLogin, filter: string): Promise<ResponseData> {
    const response: Response = await super.load(
      {
        method: MethodEnum.get,
        headers: {
          Authorization: `Bearer ${user.token}`,
          Accept: 'application/json',
        },
      },
      [UrlFolderEnum.users, user.userId, UrlFolderEnum.aggregatedWords],
      ['wordsPerPage=600', `filter=${filter}`],
    );
    const data = await response.json() as AuthorizeUserWords[];
    return data;
  }

  static async updateStatistics(user: UserLogin, options: StatisticsData): Promise<void> {
    const response: Response = await super.load(
      {
        method: MethodEnum.put,
        headers: {
          Authorization: `Bearer ${user.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      },
      [UrlFolderEnum.users, user.userId, UrlFolderEnum.statistics],
    );
    const data = await response.json();
    return data;
  }

  static async getStatistics(user: UserLogin): Promise<StatisticsData> {
    const response: Response = await super.load(
      {
        method: MethodEnum.get,
        headers: {
          Authorization: `Bearer ${user.token}`,
          Accept: 'application/json',
        },
      },
      [UrlFolderEnum.users, user.userId, UrlFolderEnum.statistics],
    );
    const data = await response.json();
    return data;
  }
}

export default Api;
