import { MethodEnum, UrlFolderEnum } from '../../../types/loadServerData/enum';
import { UserWord } from '../../../types/textbook/interfaces';
import Loader from '../load';
import CustomStorage from '../storage';

class ControllerTextbook extends Loader {
  private token: string;

  private userId: string;

  private customStorage:CustomStorage;

  constructor() {
    super();
    this.customStorage = new CustomStorage();
    this.token = this.customStorage.getStorage('token');
    this.userId = this.customStorage.getStorage('userId');
  }

  public getwords(group: string, page: string): Promise<void | Response> {
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

  public CreateAndUpdateUserWord(userRequest: UserWord): Promise<void | Response> {
    const wordOption = {
      difficulty: userRequest.difficulty,
      optional: {
        progress: userRequest.progress,
      },
    };
    return super.load(
      {
        method: userRequest.request,
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wordOption),
      },
      [UrlFolderEnum.users, this.userId, UrlFolderEnum.words, userRequest.wordId],
    );
  }

  public async GetAndDeleteWordUser(userRequest: UserWord): Promise<void | Response> {
    return super.load(
      {
        method: userRequest.request,
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/json',
        },
      },
      [UrlFolderEnum.users, this.userId, UrlFolderEnum.words, userRequest.wordId],
    );
  }

  public async getAllUserWord(): Promise<void | Response> {
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
}

export default ControllerTextbook;
