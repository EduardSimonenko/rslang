import { UserLogin } from '../../types/textbook/interfaces';
import CustomStorage from '../controller/storage';

function getUserData(): UserLogin {
  return {
    userId: CustomStorage.getStorage('userId'),
    token: CustomStorage.getStorage('token'),
  };
}

export default getUserData;
