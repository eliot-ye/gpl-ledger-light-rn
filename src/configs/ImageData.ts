import {LangCode} from '@assets/I18n';
import {ImageDefaultMap} from '@images/ImageMap';

export type ImageNameMapType = typeof ImageDefaultMap;

type ImageDataType = {default: ImageNameMapType} & {
  [lang in LangCode]?: Partial<ImageNameMapType>;
};
export const ImageData: ImageDataType = {
  default: ImageDefaultMap,
};
