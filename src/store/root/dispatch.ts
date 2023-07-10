import {I18n, LangCode} from '@assets/I18n';
import {Colors, ThemeCode} from '@/configs/colors';
import {createDispatch} from '@/libs/ReactContextStore';
import initialState from './initialState';

const initialStateStr = JSON.stringify(initialState);

interface DispatchPayloadRoot {
  reset: undefined;
  theme: ThemeCode;
  langCode: LangCode;
  isSignIn: boolean;
}

export default createDispatch<typeof initialState, DispatchPayloadRoot>({
  reset: () => JSON.parse(initialStateStr),
  theme: (state, theme: ThemeCode) => {
    if (theme === state.theme) {
      return state;
    }

    Colors.setCode(theme);

    return {...state, theme};
  },
  langCode: (state, langCode: LangCode) => {
    if (langCode === state.langCode) {
      return state;
    }

    I18n.setLanguage(langCode);

    return {...state, langCode};
  },
  isSignIn: (state, isSignIn) =>
    state.isSignIn === isSignIn ? state : {...state, isSignIn},
});
