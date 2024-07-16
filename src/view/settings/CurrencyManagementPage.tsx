import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
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
  CPNCellConfig,
  HeaderConfigs,
} from '@/components/base';
import {
  CurrencyItem,
  dbDeleteCurrency,
  dbGetCurrency,
  dbGetCurrencyUsedIds,
  dbSetCurrency,
} from '@/database';
import {TouchableOpacity, View} from 'react-native';
import {StyleGet} from '@/assets/styles';
import {Colors} from '@/assets/colors';
import {CPNUsedTab, ShowTabType} from '@/components/CPNUsedTab';
import {CPNNoData} from '@/components/CPNNoData';
import {ErrorItem} from 'types/global';

export function CurrencyManagementPage() {
  I18n.useLangCode();

  const [CurrencyList, CurrencyListSet] = useState<CurrencyItem[]>([]);
  const [CurrencyUsedIds, CurrencyUsedIdsSet] = useState<string[]>([]);
  const getDBCurrency = useCallback(async () => {
    const res = await dbGetCurrency();
    CurrencyListSet(res);
    const ids = await dbGetCurrencyUsedIds();
    CurrencyUsedIdsSet(ids);
  }, []);
  useEffect(() => {
    getDBCurrency();
  }, [getDBCurrency]);

  const [tabActive, tabActiveSet] = useState<ShowTabType>(ShowTabType.All);
  function renderTab() {
    return (
      <View style={{paddingBottom: 16}}>
        <CPNUsedTab value={tabActive} onChange={_type => tabActiveSet(_type)} />
      </View>
    );
  }

  const dataShowMemo = useMemo(() => {
    if (tabActive === ShowTabType.Unused) {
      return CurrencyList.filter(
        item => !CurrencyUsedIds.includes(item.abbreviation),
      );
    }
    if (tabActive === ShowTabType.Used) {
      return CurrencyList.filter(item =>
        CurrencyUsedIds.includes(item.abbreviation),
      );
    }

    return CurrencyList;
  }, [CurrencyList, CurrencyUsedIds, tabActive]);

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
            detailsRef.current.abbreviation
              ? I18n.f(I18n.t('EditCurrency'), detailsRef.current.name || '')
              : I18n.t('AddCurrency')
          }
          safeArea={false}
          leftIconType="close"
          onPressLeftIcon={() => showDetailsModalSet(false)}
          rightIcon={
            !!detailsRef.current.abbreviation && (
              <TouchableOpacity
                style={{paddingRight: HeaderConfigs.paddingHorizontal}}
                onPress={async () => {
                  await CPNAlert.confirm(
                    '',
                    I18n.t('DeleteConfirm', detailsRef.current.name || ''),
                  );
                  if (detailsRef.current.abbreviation) {
                    dbDeleteCurrency(detailsRef.current.abbreviation);
                    await getDBCurrency();
                    showDetailsModalSet(false);
                  }
                }}>
                <CPNIonicons name={IONName.Delete} />
              </TouchableOpacity>
            )
          }>
          <View style={{padding: 20}}>
            <CPNFormItem
              style={{paddingBottom: 20}}
              title={I18n.t('CurrencyName')}
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
              title={I18n.t('CurrencyAbbreviation')}
              description={I18n.t('CurrencyAbbreviationDesc')}
              hasError={!!detailsError.abbreviation}
              errorText={detailsError.abbreviation}>
              <CPNInput
                value={details.abbreviation}
                editable={!detailsRef.current.abbreviation}
                onChangeText={abbreviation => {
                  detailsSet({...details, abbreviation});
                  detailsErrorSet({...detailsError, abbreviation: ''});
                }}
              />
            </CPNFormItem>

            <CPNFormItem
              style={{paddingBottom: 20}}
              title={I18n.t('CurrencySymbol')}
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
              children={I18n.t('Submit')}
              onPress={async () => {
                const _detailsError: ErrorItem<CurrencyItem> = {};
                if (!details.name) {
                  _detailsError.name = I18n.t('CurrencyNameError1');
                }

                if (!details.abbreviation) {
                  _detailsError.abbreviation = I18n.t(
                    'CurrencyAbbreviationError1',
                  );
                } else if (
                  details.abbreviation &&
                  CurrencyList.map(item => item.abbreviation).includes(
                    details.abbreviation,
                  )
                ) {
                  _detailsError.abbreviation = I18n.t(
                    'CurrencyAbbreviationError2',
                  );
                }

                if (!details.symbol) {
                  _detailsError.symbol = I18n.t('CurrencySymbolError1');
                }

                const errorList = Object.values(_detailsError).map(
                  _item => !!_item,
                );
                if (errorList.includes(true)) {
                  detailsErrorSet(_detailsError);
                  return;
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
      <CPNPageView title={I18n.t('CurrencyManagement')}>
        <View style={{padding: 20}}>
          {renderTab()}
          <CPNCellGroup>
            {dataShowMemo.map(item => (
              <CPNCell
                key={item.abbreviation}
                title={`${item.name}(${item.abbreviation})`}
                value={item.symbol}
                onPress={
                  CurrencyUsedIds.includes(item.abbreviation)
                    ? undefined
                    : () => {
                        detailsSet(item);
                        detailsErrorSet({});
                        detailsRef.current = item;
                        showDetailsModalSet(true);
                      }
                }
              />
            ))}

            {dataShowMemo.length === 0 && <CPNNoData />}

            <TouchableOpacity
              style={[
                StyleGet.cellView(),
                {
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: CPNCellConfig.padding,
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
