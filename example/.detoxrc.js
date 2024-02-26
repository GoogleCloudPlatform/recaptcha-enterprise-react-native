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

/** @type {Detox.DetoxConfig} */
module.exports = {
    testRunner: {
      args: {
        '$0': 'jest',
        config: 'e2e/jest.config.js'
      },
      jest: {
        setupTimeout: 120000
      }
    },
    apps: {
      'ios.debug': {
        type: 'ios.app',
        binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/RecaptchaEnterpriseReactNativeExample.app',
        build: 'xcodebuild -workspace ios/RecaptchaEnterpriseReactNativeExample.xcworkspace -scheme RecaptchaEnterpriseReactNativeExample -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build'
      },
      'ios.release': {
        type: 'ios.app',
        binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/RecaptchaEnterpriseReactNativeExample.app',
        build: 'xcodebuild -workspace ios/RecaptchaEnterpriseReactNativeExample.xcworkspace -scheme RecaptchaEnterpriseReactNativeExample -configuration Release -sdk iphonesimulator -derivedDataPath ios/build'
      },
      'android.debug': {
        type: 'android.apk',
        binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
        build: 'cd android ; ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug ; cd -',
        reversePorts: [
          8081
        ]
      },
      'android.release': {
        type: 'android.apk',
        binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
        build: 'cd android ; ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release ; cd -'
      }
    },
    devices: {
      simulator: {
        type: 'ios.simulator',
        device: {
          type: 'iPhone 15'
        }
      },
      attached: {
        type: 'android.attached',
        device: {
          adbName: '.*'
        }
      },
      emulator: {
        type: 'android.emulator',
        device: {
          avdName: 'Pixel_7_API_32'
        }
      }
    },
    configurations: {
      'ios.sim.debug': {
        device: 'simulator',
        app: 'ios.debug'
      },
      'ios.sim.release': {
        device: 'simulator',
        app: 'ios.release'
      },
      'android.att.debug': {
        device: 'attached',
        app: 'android.debug'
      },
      'android.att.release': {
        device: 'attached',
        app: 'android.release'
      },
      'android.emu.debug': {
        device: 'emulator',
        app: 'android.debug'
      },
      'android.emu.release': {
        device: 'emulator',
        app: 'android.release'
      }
    }
  };
  