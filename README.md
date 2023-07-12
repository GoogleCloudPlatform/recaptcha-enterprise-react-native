# reCAPTCHA Enterprise React Native Module

NOTE: This plugin is considered a Public Preview at this stage and the public
API is subject to change.

Please note that issues filed in this repository are not an official Google
support channel and are answered on a best effort basis. For official support,
please visit: https://cloud.google.com/support-hub.

If you have an issue with the React Native plugin please post issues in this
repository. If you are having issues with the underlying SDK, please post issues
in
[https://github.com/GoogleCloudPlatform/recaptcha-enterprise-mobile-sdk](https://github.com/GoogleCloudPlatform/recaptcha-enterprise-mobile-sdk).

For general documentation on reCAPTCHA Enterprise for mobile applications, see
[Android](https://cloud.google.com/recaptcha-enterprise/docs/instrument-android-apps)
and
[iOS](https://cloud.google.com/recaptcha-enterprise/docs/instrument-ios-apps).

## Setup

Add the package to your React Native project:

`npx yarn add @google-cloud/recaptcha-enterprise-react-native`

## Podfile

Similar to
[Firebase](https://rnfirebase.io/#altering-cocoapods-to-use-frameworks), the
library requires frameworks and static linkage:

`use_frameworks! :linkage => :static`

And flipper is not compatible with static linkage so disable flipper in the
Podfile:

`flipper_config = FlipperConfiguration.disabled`

## Basic usage

```
import { execute, initClient, RecaptchaAction, } from '@google-cloud/recaptcha-enterprise-react-native';

const [initResult, setInitResult] = React.useState<string | undefined>();
const [executeResult, setExecuteResult] = React.useState<
  string | undefined
>();
const [token, setToken] = React.useState<string | undefined>();
```

Init:

```
initClient(siteKey ?? 'SITEKEY', 10000)
  .then(setInitResult('ok'))
  .catch((error) => {
    setInitResult(error.toString());
  })
```

Execute:

```
execute(RecaptchaAction.LOGIN(), 10000)
  .then((token) => {
    setExecuteResult(token);
  })
  .catch((error) => {
    setExecuteResult(error.toString());
  })
```

## Common Problems:

*   `error: include of non-modular header inside framework module 'RecaptchaEnterprise.Recaptcha'`

Use static linking in pods, for instance: `USE_FRAMEWORKS=static pod install` or
`use_frameworks! :linkage => :static` in your Podfile.

*   `fatal error: 'FlipperKit/FlipperClient.h' file not found #import
    <FlipperKit/FlipperClient.h>`

Flipper is not yet compatible with static linkage, so disable flipper in your
Podfile: `flipper_config = FlipperConfiguration.disabled`

## Example App

Install prerequisites:

npm update cd example && npm update cd example/ios && pod install

### Run sample app:

cd example && npx react-native run-android

cd example && npx react-native run-ios

### Running Integration Tests

brew tap wix/brew && brew install applesimutils

cd example && npx detox build --configuration ios.sim.debug && npx detox test --configuration ios.sim.debug

cd example && npx detox build --configuration android.emu.debug && npx detox test --configuration android.emu.debug
