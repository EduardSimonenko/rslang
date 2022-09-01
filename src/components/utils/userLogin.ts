import CustomStorage from '../controller/storage';

function getUserData() {
  return {
    userId: CustomStorage.getStorage('userId'),
    token: CustomStorage.getStorage('token'),
  };
}

export default getUserData;
