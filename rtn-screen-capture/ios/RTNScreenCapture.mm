#import "RTNScreenCapture.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import "RTNScreenCaptureSpec.h"
#endif

@implementation RTNScreenCapture

RCT_EXPORT_MODULE(ScreenCapture)

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"takeScreenshot"];
}

+ (BOOL)requiresMainQueueSetup
{
  return NO;  // only do this if your module initialization relies on calling UIKit!
}


RCT_EXPORT_METHOD(setFlag)
{
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(takeScreenshot) name:UIApplicationUserDidTakeScreenshotNotification object:nil];
}

RCT_EXPORT_METHOD(clearFlag)
{
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIApplicationUserDidTakeScreenshotNotification object:nil];
}

- (void)takeScreenshot
{
    [self sendEventWithName:@"takeScreenshot" body:@{}];
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeScreenCaptureSpecJSI>(params);
}
#endif

@end
