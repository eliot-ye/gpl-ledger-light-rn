package com.screencapture;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class ScreenCaptureModule extends ReactContextBaseJavaModule {
    private final ScreenCaptureModuleImpl implementation;

    ScreenCaptureModule(ReactApplicationContext reactContext) {
        super(reactContext);
        implementation = new ScreenCaptureModuleImpl(reactContext);
    }

    @Override
    public String getName() {
        return implementation.NAME;
    }

    @ReactMethod
    public void setFlag() {
        implementation.setFlag();
    }

    @ReactMethod
    public void clearFlag() {
        implementation.clearFlag();
    }

}
