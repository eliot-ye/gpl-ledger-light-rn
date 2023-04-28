import {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';

export function useDimensions(type: 'window' | 'screen') {
  const [scaledSize, scaledSizeSet] = useState(Dimensions.get(type));

  useEffect(() => {
    const ev = Dimensions.addEventListener('change', ({window, screen}) => {
      if (type === 'screen') {
        scaledSizeSet(screen);
      }
      if (type === 'window') {
        scaledSizeSet(window);
      }
    });

    return () => ev.remove();
  }, [type]);

  return scaledSize;
}
