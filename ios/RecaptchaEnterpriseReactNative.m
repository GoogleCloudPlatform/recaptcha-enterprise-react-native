// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE (RecaptchaEnterpriseReactNative, NSObject)

RCT_EXTERN_METHOD(initClient: (NSString)siteKey 
                 arguments: (NSDictionary *)args
                 withResolver: (RCTPromiseResolveBlock)resolve 
                 withRejecter: (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(execute: (NSString)action 
                 arguments: (NSDictionary *)args 
                 withResolver: (RCTPromiseResolveBlock)resolve 
                 withRejecter: (RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

@end
