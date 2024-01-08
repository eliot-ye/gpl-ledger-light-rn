package com.gplledgerlight;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

public class LocaleCodeModule extends ReactContextBaseJavaModule {

    final String LANG_CODE_KEY = "langCode";
    LocaleCodeModule(ReactApplicationContext reactContext) {
        super(reactContext);

        String langCodeOverride = getPreferences().getString(LANG_CODE_KEY, null);
        if(langCodeOverride != null){
            setLang(langCodeOverride);
        }
    }

    @Override
    public String getName() {
        return "LocaleCode";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("language", getCurrentLanguage());
        return constants;
    }

    private void setLang(String langCode){
        Resources resources = getReactApplicationContext().getResources();
        Configuration config = resources.getConfiguration();
        String[] langCodeList = langCode.split("-");
        if(langCodeList.length == 1){
            config.locale = new Locale(langCode);
        }else{
            config.locale = new Locale(langCodeList[0], langCodeList[1]);
        }
        resources.updateConfiguration(config, null);
    }
    @ReactMethod
    public void setLanguage(String langCode){
        setLang(langCode);
        SharedPreferences.Editor editor = getPreferences().edit();
        editor.putString(LANG_CODE_KEY, langCode);
        editor.commit();
    }

    private String getCurrentLanguage(){
        Locale locale = getReactApplicationContext().getResources().getConfiguration().locale;
        String langCode = locale.getLanguage();
        String countryCode = locale.getCountry();

        return langCode+"-"+countryCode;
    }

    private SharedPreferences getPreferences(){
        return getReactApplicationContext().getSharedPreferences("RNLocaleCode", Context.MODE_PRIVATE);
    }
}
