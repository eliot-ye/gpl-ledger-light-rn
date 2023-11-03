import iconMap from './icons';
import imgMap from './img';

export const ImageDefaultMap = {
  logoWhite: require('./logo-white.png'),
  logoBlack: require('./logo-black.png'),
  logoGreen: require('./logo-green.png'),
  logoGreenBlock: require('./logo-green-block.png'),
  ...iconMap,
  ...imgMap,
} as const;
