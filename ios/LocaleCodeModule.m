//
//  LocaleCodeModule.m
//  GplLedgerLight
//
//  Created by Eliot on 2024/1/9.
//

#import "LocaleCodeModule.h"
#import <Foundation/Foundation.h>

@implementation LocaleCodeModule

RCT_EXPORT_MODULE(LocaleCode);

- (NSDictionary *)constantsToExport
{
  return @{ @"language": [self getCurrentLanguage] };
}

+ (BOOL)requiresMainQueueSetup
{
  return YES;  // only do this if your module initialization relies on calling UIKit!
}

-(NSString*) getCurrentLanguage
{
  NSUserDefaults *userDefault = [NSUserDefaults standardUserDefaults];
  NSString* langCode = [userDefault objectForKey:@"langCode"];
  if (langCode == nil ) { return nil; }
  return langCode;

  return [[NSLocale preferredLanguages] objectAtIndex:0];
}

RCT_EXPORT_METHOD(setLanguage: (NSString *) langCode)
{
  NSUserDefaults *userDefault = [NSUserDefaults standardUserDefaults];
  [userDefault setObject:langCode forKey:@"langCode"];
}

@end
