import React, {useCallback, useEffect, useRef, useState} from 'react';
import {I18n} from '@/assets/I18n';
import {
  CPNButton,
  CPNIonicons,
  CPNPageModal,
  CPNPageView,
  CPNText,
  IONName,
} from '@/components/base';
import {dbDeleteColor, dbGetColors, dbSetColor} from '@/database';
import {ColorItem} from '@/database/color/schema';
import {TouchableOpacity, View} from 'react-native';
import {CNPCellGroup, CNPCell, CNPInput} from '@/components';
import {getRandomStrMD5} from '@/utils/tools';
import {StyleGet} from '@/configs/styles';
import {Colors} from '@/configs/colors';

export function ColorManagementPage() {
  const [colorList, colorListSet] = useState<ColorItem[]>([]);
  const getDBColors = useCallback(async () => {
    const res = await dbGetColors();
    colorListSet(res);
  }, []);
  useEffect(() => {
    getDBColors();
  }, [getDBColors]);

  const [showDetailsModal, showDetailsModalSet] = useState(false);
  const [details, detailsSet] = useState<Partial<ColorItem>>({});
  const detailsRef = useRef<Partial<ColorItem>>({});
  function renderDetailsModal() {
    return (
      <CPNPageModal.View
        gestureEnabled
        show={showDetailsModal}
        onClose={() => showDetailsModalSet(false)}>
        <CPNPageView
          titleText={
            detailsRef.current.name
              ? (I18n.formatString(
                  I18n.EditColor,
                  detailsRef.current.name,
                ) as string)
              : I18n.AddColor
          }
          scrollEnabled={false}
          headerBackgroundColor={detailsRef.current.value}
          safeArea={false}
          leftIconType="close"
          onPressLeftIcon={() => showDetailsModalSet(false)}
          rightIcon={
            !!detailsRef.current.name && (
              <TouchableOpacity
                onPress={async () => {
                  if (detailsRef.current.id) {
                    dbDeleteColor(detailsRef.current.id);
                    await getDBColors();
                    showDetailsModalSet(false);
                  }
                }}>
                <CPNIonicons name={IONName.Delete} />
              </TouchableOpacity>
            )
          }>
          <View style={{padding: 20}}>
            <View style={{paddingBottom: 10}}>
              <CNPInput
                placeholder={I18n.ColorName}
                value={details.name}
                onChangeText={name => detailsSet({...details, name})}
              />
            </View>
            <View style={{paddingBottom: 20}}>
              <CNPInput
                placeholder={I18n.ColorValue}
                value={details.value}
                onChangeText={value => detailsSet({...details, value})}
              />
            </View>
            <CPNButton
              text={I18n.Submit}
              onPress={async () => {
                if (!details.name) {
                  return;
                }
                if (!details.value) {
                  return;
                }
                if (!details.id) {
                  details.id = getRandomStrMD5();
                }
                await dbSetColor(details);
                await getDBColors();
                showDetailsModalSet(false);
              }}
            />
          </View>
        </CPNPageView>
      </CPNPageModal.View>
    );
  }

  return (
    <>
      <CPNPageView titleText={I18n.ColorManagement}>
        <View style={{padding: 20}}>
          <CNPCellGroup>
            {colorList.map(item => (
              <CNPCell
                key={item.id}
                title={
                  <>
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: item.value,
                        marginRight: 6,
                      }}
                    />
                    <CPNText>{item.name}</CPNText>
                  </>
                }
                value={item.value}
                onPress={() => {
                  detailsSet(item);
                  detailsRef.current = item;
                  showDetailsModalSet(true);
                }}
              />
            ))}
            <TouchableOpacity
              style={[
                StyleGet.cellView(),
                {
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}
              onPress={() => {
                detailsSet({});
                detailsRef.current = {};
                showDetailsModalSet(true);
              }}>
              <CPNIonicons name={IONName.Add} color={Colors.theme} />
            </TouchableOpacity>
          </CNPCellGroup>
        </View>
      </CPNPageView>
      {renderDetailsModal()}
    </>
  );
}
