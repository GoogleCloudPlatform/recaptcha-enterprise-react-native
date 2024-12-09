# reCAPTCHA Enterprise React Native Module

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

```bash
npx yarn add @google-cloud/recaptcha-enterprise-react-native
```

If using VSCode install eslint:

`https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint`

You may need to use an older JDK:

```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-19-latest/Contents/Home
```

### Podfile

Similar to
[Firebase](https://rnfirebase.io/#altering-cocoapods-to-use-frameworks), the
library requires frameworks and static linkage:

```
use_frameworks! :linkage => :static
```

And flipper is not compatible with static linkage so disable flipper in the
Podfile:

```
flipper_config = FlipperConfiguration.disabled
```

## Basic Usage

This section shows how to integrate with reCAPTCHA SDK.

### 1. Import Recaptcha

Use the following imports to access the APIs provided by the SDK.

```typescript
import {
  Recaptcha,
  RecaptchaAction,
  type RecaptchaClient,
} from '@google-cloud/recaptcha-enterprise-react-native';
```

### 2. Initialize the client

Instantiate a client by using the reCAPTCHA key (KEY_ID) that you created for your Android/iOS app.

```typescript
const client = await Recaptcha.fetchClient(SITE_KEY);
```

> [!NOTE]
> You must initialize the reCAPTCHA client only once during the lifetime of your app. 

### 3. Fetch Token

For each action of your app that is protected using reCAPTCHA, call the execute method passing a 
`RecaptchaAction`. reCAPTCHA provides a built-in set of actions and if necessary you can create 
custom actions.

The following code snippet shows how to use execute to protect a `LOGIN` action.

```typescript
const token = await client.execute(RecaptchaAction.LOGIN());
```

In case a custom action use `RecaptchaAction.custom('ACTION')`;

## Example App

Follow guidance at [Example App](example/README.md).

## Common Problems:

### `error: include of non-modular header inside framework module 'RecaptchaEnterprise.Recaptcha'`

Use static linking in pods, for instance: `USE_FRAMEWORKS=static pod install` or
`use_frameworks! :linkage => :static` in your Podfile.

### `fatal error: 'FlipperKit/FlipperClient.h' file not found #import
    <FlipperKit/FlipperClient.h>`

Flipper is not yet compatible with static linkage, so disable flipper in your
Podfile: `flipper_config = FlipperConfiguration.disabled`

### SDK Location Not found

Run the following command in the terminal:

```bash
export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk
```

###  Unsupported class file major version 67

This happens when a unsupported Java version is used. Run

```bash
npx react-native doctor
```

To discover the version that's being used and the supported ones. Change the
version of Java to a supported one and try again.
