import {
  CPNPageView,
  CPNCellGroup,
  CPNCell,
  CPNSwipeItem,
  CPNIonicons,
  IONName,
  CPNAlert,
  CPNInput,
  CPNFormItem,
} from '@/components/base';
import {Colors} from '@/configs/colors';
import {LS_UserInfo, useLSUserInfoList} from '@/store/localStorage';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import FS from 'react-native-fs';
import {PageProps} from '../Router';
import {I18n} from '@/assets/I18n';
import {formatDateTime} from '@/utils/dateFn';
import {colorGetBackground} from '@/utils/tools';
import {AESDecrypt} from '@/utils/encoding';
import {getRealm} from '@/database/main';
import {CPNNoData} from '@/components/CPNNoData';

export function AccountManagementPage() {
  const navigation =
    useNavigation<PageProps<'AccountManagementPage'>['navigation']>();

  const useInfoList = useLSUserInfoList();

  function renderInfo() {
    return (
      <View>
        {useInfoList.map(item => (
          <View key={item.id} style={{marginBottom: 10}}>
            <CPNSwipeItem
              buttons={[
                {
                  text: (
                    <CPNIonicons name={IONName.Delete} color={Colors.fail} />
                  ),
                  backgroundColor: colorGetBackground(Colors.fail),
                  async onPress() {
                    return new Promise((resolve, reject) => {
                      const alertId = CPNAlert.open({
                        title: I18n.t('DeleteConfirm', item.username),
                        initSVState: {value: '', hasError: false},
                        renderSV: ([data, dataSet]) => {
                          return (
                            <CPNFormItem
                              titleColor={Colors.warning}
                              errorText={I18n.t('PasswordError1')}
                              hasError={data.hasError}
                              style={{marginTop: 10}}>
                              <CPNInput
                                secureTextEntry={true}
                                value={data.value}
                                onChangeText={value =>
                                  dataSet({value, hasError: false})
                                }
                              />
                            </CPNFormItem>
                          );
                        },
                        buttons: [
                          {
                            text: I18n.t('Confirm'),
                            textColor: Colors.warning,
                            keep: true,
                            onPress: async ([data, dataSet]) => {
                              if (!data.value) {
                                dataSet({...data, hasError: true});
                                return;
                              }
                              let DBKey = '';
                              try {
                                DBKey = AESDecrypt(item.token, data.value);
                              } catch (error) {
                                dataSet({...data, hasError: true});
                                return;
                              }
                              if (!DBKey) {
                                dataSet({...data, hasError: true});
                                return;
                              }
                              try {
                                const realm = await getRealm(item.id, DBKey);
                                FS.unlink(realm.path);
                                FS.unlink(realm.path + '.lock');
                                FS.unlink(realm.path + '.management');
                              } catch (error) {
                                console.log(error);
                              }
                              CPNAlert.close(alertId);
                              resolve(() => {
                                LS_UserInfo.remove(item.id);
                              });
                            },
                          },
                          {
                            text: I18n.t('Cancel'),
                            textColor: Colors.theme,
                            onPress: () => {
                              reject();
                            },
                          },
                        ],
                      });
                    });
                  },
                },
              ]}>
              <CPNCellGroup>
                <CPNCell
                  isLast
                  title={item.username}
                  value={formatDateTime(
                    Number(item.lastModified || item.id.split(':')[1]),
                  )}
                  onPress={() => {
                    navigation.navigate('AccountInfoPage', item);
                  }}
                />
              </CPNCellGroup>
            </CPNSwipeItem>
          </View>
        ))}
      </View>
    );
  }

  return (
    <CPNPageView
      title={I18n.t('AccountManagement')}
      rightIcon={
        <TouchableOpacity
          onPress={async () => {
            navigation.navigate('SignUpPage');
          }}>
          <CPNIonicons name={IONName.Add} />
        </TouchableOpacity>
      }>
      <View style={{flex: 1, padding: 20}}>
        {renderInfo()}
        {useInfoList.length === 0 && <CPNNoData />}
      </View>
    </CPNPageView>
  );
}
