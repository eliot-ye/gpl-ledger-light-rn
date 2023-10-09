import iconMap from './icons';
import imgMap from './img';

export const ImageDefaultMap = {
  logo: require('./logo.png'),
  ...iconMap,
  ...imgMap,
} as const;
