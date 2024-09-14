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

import { RecaptchaEnterpriseReactNative } from './index';
import type { RecaptchaAction } from './recaptcha_action';

interface Args {
  [key: string]: number | string;
}

/**
 * Initialize a reCAPTCHA cliuent
 * @param siteKey Your application's reCAPTCHA site key
 * @param timeout An optional timeout value in milliseconds
 */
export function initClient(siteKey: string): Promise<string> {
  return RecaptchaEnterpriseReactNative.initClient(siteKey);
}

/**
 * Execute reCAPTCHA and retrieve a token
 * @param action An action to describe what the user is doing such as "login"
 * @param timeout An optional timeout value in milliseconds
 */
export function execute(
  action: RecaptchaAction,
  timeout?: number
): Promise<string> {
  let args: Args = {};

  if (timeout) {
    args.timeout = timeout;
  }

  return RecaptchaEnterpriseReactNative.execute(action.action, args);
}
