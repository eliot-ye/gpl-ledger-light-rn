import {LangCode} from '@assets/I18n';
import ImageDefaultMap from './default';

export type ImageNameMapType = typeof ImageDefaultMap;
export type ImageNameType = keyof ImageNameMapType;

type ImageDataType = {default: ImageNameMapType} & {
  [lang in LangCode]?: Partial<ImageNameMapType>;
};
export const ImageData: ImageDataType = {
  default: ImageDefaultMap,
};

export function ImageGet(name: ImageNameType, lang?: LangCode) {
  return ImageData[lang ?? 'default']?.[name] ?? ImageData.default[name];
}
