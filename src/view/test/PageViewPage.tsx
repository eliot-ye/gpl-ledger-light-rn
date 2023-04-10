import React, {useEffect, useState} from 'react';
import {ImageDefaultMap} from '@/assets/images/ImageMap';
import {CPNPageView, CPNImage, CPNRichTextView} from '@/components/base';
import {Animated, View, useWindowDimensions} from 'react-native';
import {langCodeTabel} from './RichTextPage';

export function PageViewPage() {
  const windowDimensions = useWindowDimensions();

  const [richText, richTextSet] = useState('');
  useEffect(() => {
    setTimeout(() => {
      richTextSet(langCodeTabel);
    }, 0);
  }, []);

  return (
    <CPNPageView
      fixedTop
      renderIOSTopNegativeDistanceView={h => {
        return (
          <Animated.Image
            source={ImageDefaultMap.test1}
            style={{
              width: windowDimensions.width,
              height: Animated.add(h, 260),
            }}
          />
        );
      }}>
      <CPNImage
        source={ImageDefaultMap.test1}
        style={{
          width: windowDimensions.width,
          height: 260,
        }}
      />
      <View style={{flex: 1, padding: 20}}>
        <CPNRichTextView richText={richText} />
      </View>
    </CPNPageView>
  );
}
