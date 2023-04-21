// import {
//   BiometricIsAvailable,
//   LoginBiometricAuth,
//   SetUser,
//   // UpdateUser,
//   GetUser,
//   DeleteUser,
// } from 'react-native-biometric-login';

interface UserInfo {
  username: string;
  password: string;
}

// export const biometrics = {
//   isSensorAvailable: async () => ({available: await BiometricIsAvailable()}),

//   loginBiometricAuth: (): Promise<UserInfo> => LoginBiometricAuth(),

//   getUser: (): Promise<UserInfo> => GetUser(),

//   async setUser(username: string, password: string) {
//     const res = await SetUser(username, password);

//     return res;
//   },

//   async deleteUser() {
//     return await DeleteUser();
//   },
// };

export const biometrics = {
  isSensorAvailable: async () => ({available: false}),

  loginBiometricAuth: (): Promise<UserInfo> => {},

  getUser: (): Promise<UserInfo> => {},

  async setUser(username: string, password: string) {},

  async deleteUser() {},
};
