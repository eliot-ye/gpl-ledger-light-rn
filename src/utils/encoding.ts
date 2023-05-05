import 'react-native-get-random-values';
import {AES, enc} from 'crypto-js';

export function AESEncrypt(message: string, key: string) {
  return AES.encrypt(message, key).toString();
}
export function AESDecrypt(message: string, key: string) {
  return AES.decrypt(message, key).toString(enc.Utf8);
}

export function stringToUint8Array(str: string) {
  const ab = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    ab[i] = str.charCodeAt(i);
  }
  return ab;
}
