import React, {useEffect, useMemo, useState} from 'react';
import {Dimensions, Image, ImageProps, ImageSourcePropType} from 'react-native';
import {ImageGet, ImageNameType} from '@assets/images';
import {I18n} from '@/assets/I18n';

interface CPNImageProps extends Partial<ImageProps> {
  /** 本地图片定义的名称，和`source`冲突时无效 */
  name?: ImageNameType;
  /** 如果设置了`size`则默认图片宽高都为`size` */
  size?: number;
  /** 根据图片比例和显示宽度自动计算高度，和`size`冲突时失效 */
  autoHeight?: {imageWidth?: number; imageHight?: number; showWidth?: number};
}
export function CPNImage(props: Readonly<CPNImageProps>) {
  const langCode = I18n.useLangCode();

  const _source = useMemo<ImageSourcePropType>(() => {
    if (props.source) {
      return props.source;
    }

    if (!props.name) {
      return {};
    }

    return ImageGet(props.name, langCode);
  }, [props.name, props.source, langCode]);

  const [imageWidth, setImageWidth] = useState(props.autoHeight?.imageWidth);
  const [imageHight, setImageHight] = useState(props.autoHeight?.imageHight);
  useEffect(() => {
    if (
      props.size === undefined &&
      props.autoHeight?.showWidth &&
      props.source &&
      typeof props.source !== 'number' &&
      !Array.isArray(props.source) &&
      props.source?.uri
    ) {
      Image.getSize(props.source?.uri, (_imgWidth, _imgHeight) => {
        setImageWidth(_imgWidth);
        setImageHight(_imgHeight);
      });
    }
  }, [props.autoHeight?.showWidth, props.size, props.source]);
  const autoHeightStyles = useMemo(() => {
    if (imageHight && imageWidth) {
      const showWidth =
        props.autoHeight?.showWidth ?? Dimensions.get('window').width;
      const showHeight = (imageHight / imageWidth) * showWidth;

      return {width: showWidth, height: showHeight};
    }
  }, [imageHight, imageWidth, props.autoHeight?.showWidth]);

  return (
    <Image
      source={_source}
      {...props}
      style={[
        autoHeightStyles,
        !!props.size && {width: props.size, height: props.size},
        props.style,
      ]}
    />
  );
}
