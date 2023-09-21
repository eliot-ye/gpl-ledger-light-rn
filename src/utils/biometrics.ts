import {createBiometrics} from '@/libs/Biometrics';
import {LS_UserInfo} from '@/store/localStorage';

const Biometrics = createBiometrics();

interface UserInfo {
  userId: string;
  password: string;
}

export const biometrics = {
  isSensorAvailable: Biometrics.isSensorAvailable,

  async getUserFlag(token: string) {
    return Biometrics.getDataFlag(token);
  },

  async getUser(token: string): Promise<UserInfo> {
    return Biometrics.getData({token});
  },

  async setUser(userInfo: UserInfo) {
    const token = await Biometrics.setData({
      payload: JSON.stringify(userInfo),
      biometrics: true,
    });
    return LS_UserInfo.update({id: userInfo.userId, biometriceToken: token});
  },

  async deleteUser(userKey: string) {
    return Biometrics.deleteData({token: userKey});
  },
};
