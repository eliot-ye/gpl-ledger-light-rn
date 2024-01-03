package com.gplledgerlight;

import android.view.WindowManager;
// import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class FlagSecureModule extends ReactContextBaseJavaModule {

    FlagSecureModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "FlagSecure"; //标记这个模块，在JavaScript中通过NativeModules.FlagSecure访问到这个模块
    }

    @ReactMethod
    public void setFlag() {
        // Toast.makeText(getReactApplicationContext(), "setFlag", Toast.LENGTH_SHORT).show();
        getCurrentActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                getCurrentActivity().getWindow().setFlags(WindowManager.LayoutParams.FLAG_SECURE,
                        WindowManager.LayoutParams.FLAG_SECURE); // 禁止截屏
            }
        });
    }

    @ReactMethod
    public void clearFlag() {
        // Toast.makeText(getReactApplicationContext(), "clearFlag", Toast.LENGTH_SHORT).show();
        getCurrentActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                getCurrentActivity().getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE); // 解除禁止截屏
            }
        });
    }
}
