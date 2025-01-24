package com.screencapture;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;

public class ScreenCaptureModule extends NativeScreenCaptureSpec {
    private final ScreenCaptureModuleImpl implementation;

    ScreenCaptureModule(ReactApplicationContext reactContext) {
        super(reactContext);
        implementation = new ScreenCaptureModuleImpl(reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return ScreenCaptureModuleImpl.NAME;
    }

    @Override
    public void setFlag() {
        implementation.setFlag();
    }

    @Override
    public void clearFlag() {
        implementation.clearFlag();
    }
}
