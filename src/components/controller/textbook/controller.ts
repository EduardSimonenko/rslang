import { MethodEnum, UrlFolderEnum } from '../../../types/loadServerData/enum';
import Loader from '../load';

class ControllerTextbook extends Loader {
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
}

export default ControllerTextbook;
