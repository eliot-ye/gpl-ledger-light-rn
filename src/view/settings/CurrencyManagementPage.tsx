import React, {useCallback, useEffect, useRef, useState} from 'react';
import {I18n} from '@/assets/I18n';
import {
  CPNAlert,
  CPNButton,
  CPNIonicons,
  CPNPageModal,
  CPNPageView,
  IONName,
} from '@/components/base';
import {dbDeleteCurrency, dbGetCurrency, dbSetCurrency} from '@/database';
import {CurrencyItem} from '@/database/currency/schema';
import {TouchableOpacity, View} from 'react-native';
import {CNPCellGroup, CNPCell, CNPInput, CNPFormItem} from '@/components';
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
          titleText={
            detailsRef.current.id
              ? (I18n.formatString(
                  I18n.EditCurrency,
                  detailsRef.current.name || '',
                ) as string)
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
                    ) as string,
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
            <CNPFormItem
              style={{paddingBottom: 20}}
              title={I18n.CurrencyName}
              hasError={!!detailsError.name}
              errorText={detailsError.name}>
              <CNPInput
                value={details.name}
                onChangeText={name => {
                  detailsSet({...details, name});
                  detailsErrorSet({...detailsError, name: ''});
                }}
              />
            </CNPFormItem>

            <CNPFormItem
              style={{paddingBottom: 20}}
              title={I18n.CurrencyAbbreviation}
              hasError={!!detailsError.abbreviation}
              errorText={detailsError.abbreviation}>
              <CNPInput
                value={details.abbreviation}
                onChangeText={abbreviation => {
                  detailsSet({...details, abbreviation});
                  detailsErrorSet({...detailsError, abbreviation: ''});
                }}
              />
            </CNPFormItem>

            <CNPFormItem
              style={{paddingBottom: 20}}
              title={I18n.CurrencySymbol}
              hasError={!!detailsError.symbol}
              errorText={detailsError.symbol}>
              <CNPInput
                value={details.symbol}
                onChangeText={symbol => {
                  detailsSet({...details, symbol});
                  detailsErrorSet({...detailsError, symbol: ''});
                }}
              />
            </CNPFormItem>

            <CPNButton
              text={I18n.Submit}
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
      <CPNPageView titleText={I18n.CurrencyManagement}>
        <View style={{padding: 20}}>
          <CNPCellGroup>
            {CurrencyList.map(item => (
              <CNPCell
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
          </CNPCellGroup>
        </View>
      </CPNPageView>
      {renderDetailsModal()}
    </>
  );
}
