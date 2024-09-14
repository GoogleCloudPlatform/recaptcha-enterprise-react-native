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

import RecaptchaEnterprise

@objc(RecaptchaEnterpriseReactNative)
class RecaptchaEnterpriseReactNative: NSObject {
  var recaptchaClient: RecaptchaClient?

  private func mapAction(_ actionStr: String) -> RecaptchaAction {
    if actionStr == "login" {
      return RecaptchaAction.login
    } else if actionStr == "signup" {
      return RecaptchaAction.signup
    } else {
      return RecaptchaAction(customAction: actionStr)
    }
  }

  @objc(initClient:withResolver:withRejecter:)
  func initClient(
    siteKey: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    let getClientClosure: (RecaptchaClient?, Error?) -> Void = { recaptchaClient, error in
      if let recaptchaClient = recaptchaClient {
        self.recaptchaClient = recaptchaClient
        resolve(nil)
      } else if let error = error {
        guard let error = error as? RecaptchaError else {
          reject("RN_CAST_ERROR", "Not a RecaptchaError", nil)
          return
        }
        reject(String(error.errorCode), error.errorMessage, nil)
      }
    }
    
    Recaptcha.fetchClient(withSiteKey: siteKey, completion: getClientClosure)
  }

  @objc(execute:arguments:withResolver:withRejecter:)
  func execute(
    actionStr: String,
    arguments: NSDictionary,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    guard let client = recaptchaClient else {
      reject("RN_EXECUTE_FAILED", "Initialize client first", nil)
      return
    }
    let action = mapAction(actionStr)

    let executeClosure: (String?, Error?) -> Void = { token, error -> Void in
      if let token = token {
        resolve(token)
      } else if let error = error {
        guard let error = error as? RecaptchaError else {
          reject("RN_CAST_ERROR", "Not a RecaptchaError", nil)
          return
        }
        reject(String(error.errorCode), error.errorMessage, nil)
      }
    }

    if let args = arguments as? [String: Any], let timeout = args["timeout"] as? Double {
      client.execute(withAction: action, withTimeout: timeout, completion: executeClosure)
    } else {
      client.execute(withAction: action, completion: executeClosure)
    }
  }
}
