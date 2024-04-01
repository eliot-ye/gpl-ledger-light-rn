import {Colors} from '@/configs/colors';
import React, {useMemo} from 'react';
import {useWindowDimensions, View} from 'react-native';
import RenderHtml, {
  defaultSystemFonts,
  MixedStyleDeclaration,
  RenderHTMLProps,
} from 'react-native-render-html';

type TagsStyles = Record<string, MixedStyleDeclaration>;

interface RichTextViewProps extends Partial<RenderHTMLProps> {
  /** 富文本内容 */
  richText: string;
  /** 富文本内容的全局颜色 */
  color?: string;
  /** 富文本内容的全局字體大小 */
  fontSize?: number;
  /** ___use memoized value___ */
  tagsStyles?: Readonly<TagsStyles>;
  width?: number;
}

/** 使用 `react-native-render-html` 自定義的富文本渲染器 */
export function CPNRichTextView(props: Readonly<RichTextViewProps>) {
  const systemFonts = useMemo(() => [...defaultSystemFonts], []);

  const baseStyle = useMemo<MixedStyleDeclaration>(
    () => ({
      color: props.color ?? Colors.fontText,
      fontSize: props.fontSize ?? 14,
      fontWeight: '400',
    }),
    [props.color, props.fontSize],
  );

  const tagsStyles = useMemo<TagsStyles>(() => {
    const tagsStylesDefault: TagsStyles = {
      table: {
        borderWidth: 0.5,
        borderColor: Colors.line,
        width: '100%',
        minWidth: 200,
      },
      td: {
        borderWidth: 0.5,
        borderColor: Colors.line,
        justifyContent: 'center',
      },
      th: {
        borderWidth: 0.5,
        borderColor: Colors.line,
        padding: 10,
        minHeight: 36,
      },
      ol: {width: '100%'},
      ul: {width: '100%'},
      li: {width: '100%', marginBottom: 8},
      p: {
        marginBottom: 10,
      },
    };

    if (!props.tagsStyles) {
      return tagsStylesDefault;
    }

    let tagsStylesNew: TagsStyles = {};

    const tagList = Object.keys(props.tagsStyles);
    for (let i = 0; i < tagList.length; i++) {
      const tag = tagList[i];
      if (tagsStylesDefault[tag]) {
        tagsStylesNew[tag] = {
          ...tagsStylesDefault[tag],
          ...props.tagsStyles[tag],
        };
      } else {
        tagsStylesNew[tag] = props.tagsStyles[tag];
      }
    }

    return {...tagsStylesDefault, ...tagsStylesNew};
  }, [props.tagsStyles]);

  const ignoredDomTags = useMemo(() => ['colgroup'], []);

  const {width: windowWidth} = useWindowDimensions();

  const sourceMemo = useMemo(
    () => ({html: `${props.richText}`}),
    [props.richText],
  );

  if (!props.richText) {
    return <View />;
  }

  return (
    <RenderHtml
      contentWidth={props.width ?? windowWidth}
      systemFonts={systemFonts}
      baseStyle={baseStyle}
      ignoredDomTags={ignoredDomTags}
      {...props}
      tagsStyles={tagsStyles}
      source={sourceMemo}
    />
  );
}
