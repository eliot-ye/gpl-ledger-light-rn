package com.screencapture;

import android.view.WindowManager;

import com.facebook.react.bridge.ReactApplicationContext;

public class ScreenCaptureModuleImpl {

    public static final String NAME = "ScreenCapture";

    ReactApplicationContext rtx;

    ScreenCaptureModuleImpl(ReactApplicationContext reactContext) {
        rtx = reactContext;
    }

    public void setFlag() {
        // Toast.makeText(getReactApplicationContext(), "setFlag", Toast.LENGTH_SHORT).show();
        rtx.getCurrentActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                rtx.getCurrentActivity().getWindow().setFlags(WindowManager.LayoutParams.FLAG_SECURE,
                        WindowManager.LayoutParams.FLAG_SECURE); // 禁止截屏
            }
        });
    }

    public void clearFlag() {
        // Toast.makeText(getReactApplicationContext(), "clearFlag", Toast.LENGTH_SHORT).show();
        rtx.getCurrentActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                rtx.getCurrentActivity().getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE); // 解除禁止截屏
            }
        });
    }

}