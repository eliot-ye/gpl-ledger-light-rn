import {LangCode, langDefault} from '../../assets/I18n';
import {ThemeCode} from '../../configs/colors';
import {LSUserInfo} from '../localStorage';

export default {
  theme: ThemeCode.default as ThemeCode,
  langCode: langDefault as LangCode,
  isSignIn: false,
  userInfoList: undefined as LSUserInfo[] | undefined,
};
