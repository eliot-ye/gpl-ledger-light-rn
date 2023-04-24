import React, {useCallback, useEffect, useRef, useState} from 'react';
import {I18n} from '@/assets/I18n';
import {
  CPNAlert,
  CPNButton,
  CPNIonicons,
  CPNPageModal,
  CPNPageView,
  IONName,
  CPNCellGroup,
  CPNCell,
  CPNInput,
  CPNFormItem,
} from '@/components/base';
import {dbDeleteCurrency, dbGetCurrency, dbSetCurrency} from '@/database';
import {CurrencyItem} from '@/database/currency/schema';
import {TouchableOpacity, View} from 'react-native';
import {getRandomStrMD5} from '@/utils/tools';
import {StyleGet} from '@/configs/styles';
import {Colors} from '@/configs/colors';

export function CurrencyManagementPage() {
  const [CurrencyList, CurrencyListSet] = useState<CurrencyItem[]>([]);
  const getDBCurrency = useCallback(async () => {
    const res = await dbGetCurrency();
    CurrencyListSet(res);
  }, []);
  useEffect(() => {
    getDBCurrency();
  }, [getDBCurrency]);

  const [showDetailsModal, showDetailsModalSet] = useState(false);
  const [details, detailsSet] = useState<Partial<CurrencyItem>>({});
  const detailsRef = useRef<Partial<CurrencyItem>>({});
  const [detailsError, detailsErrorSet] = useState<ErrorItem<CurrencyItem>>({});
  function renderDetailsModal() {
    return (
      <CPNPageModal.View
        gestureEnabled
        show={showDetailsModal}
        onClose={() => showDetailsModalSet(false)}>
        <CPNPageView
          title={
            detailsRef.current.id
              ? I18n.formatString(
                  I18n.EditCurrency,
                  detailsRef.current.name || '',
                )
              : I18n.AddCurrency
          }
          scrollEnabled={false}
          safeArea={false}
          leftIconType="close"
          onPressLeftIcon={() => showDetailsModalSet(false)}
          rightIcon={
            !!detailsRef.current.id && (
              <TouchableOpacity
                onPress={async () => {
                  CPNAlert.open({
                    message: I18n.formatString(
                      I18n.DeleteConfirm,
                      detailsRef.current.name || '',
                    ),
                    buttons: [
                      {text: I18n.Cancel},
                      {
                        text: I18n.Confirm,
                        async onPress() {
                          if (detailsRef.current.id) {
                            dbDeleteCurrency(detailsRef.current.id);
                            await getDBCurrency();
                            showDetailsModalSet(false);
                          }
                        },
                      },
                    ],
                  });
                }}>
                <CPNIonicons name={IONName.Delete} />
              </TouchableOpacity>
            )
          }>
          <View style={{padding: 20}}>
            <CPNFormItem
              style={{paddingBottom: 20}}
              title={I18n.CurrencyName}
              hasError={!!detailsError.name}
              errorText={detailsError.name}>
              <CPNInput
                value={details.name}
                onChangeText={name => {
                  detailsSet({...details, name});
                  detailsErrorSet({...detailsError, name: ''});
                }}
              />
            </CPNFormItem>

            <CPNFormItem
              style={{paddingBottom: 20}}
              title={I18n.CurrencyAbbreviation}
              hasError={!!detailsError.abbreviation}
              errorText={detailsError.abbreviation}>
              <CPNInput
                value={details.abbreviation}
                onChangeText={abbreviation => {
                  detailsSet({...details, abbreviation});
                  detailsErrorSet({...detailsError, abbreviation: ''});
                }}
              />
            </CPNFormItem>

            <CPNFormItem
              style={{paddingBottom: 20}}
              title={I18n.CurrencySymbol}
              hasError={!!detailsError.symbol}
              errorText={detailsError.symbol}>
              <CPNInput
                value={details.symbol}
                onChangeText={symbol => {
                  detailsSet({...details, symbol});
                  detailsErrorSet({...detailsError, symbol: ''});
                }}
              />
            </CPNFormItem>

            <CPNButton
              children={I18n.Submit}
              onPress={async () => {
                const _detailsError: ErrorItem<CurrencyItem> = {};
                if (!details.name) {
                  _detailsError.name = I18n.CurrencyNameError1;
                }

                if (!details.abbreviation) {
                  _detailsError.abbreviation = I18n.CurrencyAbbreviationError1;
                }

                if (!details.symbol) {
                  _detailsError.symbol = I18n.CurrencySymbolError1;
                }

                const errorList = Object.values(_detailsError).map(
                  _item => !!_item,
                );
                if (errorList.includes(true)) {
                  detailsErrorSet(_detailsError);
                  return;
                }

                if (!details.id) {
                  details.id = getRandomStrMD5();
                }
                await dbSetCurrency(details);
                await getDBCurrency();
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
      <CPNPageView title={I18n.CurrencyManagement}>
        <View style={{padding: 20}}>
          <CPNCellGroup>
            {CurrencyList.map(item => (
              <CPNCell
                key={item.id}
                title={`${item.name}(${item.abbreviation})`}
                value={item.symbol}
                onPress={() => {
                  detailsSet(item);
                  detailsErrorSet({});
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
                detailsErrorSet({});
                detailsRef.current = {};
                showDetailsModalSet(true);
              }}>
              <CPNIonicons name={IONName.Add} color={Colors.theme} />
            </TouchableOpacity>
          </CPNCellGroup>
        </View>
      </CPNPageView>
      {renderDetailsModal()}
    </>
  );
}
