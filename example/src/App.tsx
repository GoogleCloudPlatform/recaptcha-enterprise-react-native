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

import * as React from 'react';
import Config from 'react-native-config';

import {Button, Platform, StyleSheet, Text, View} from 'react-native';
import {
  execute,
  initClient,
  RecaptchaAction,
} from '@google-cloud/recaptcha-enterprise-react-native';

export default function App() {
  const [initResult, setInitResult] = React.useState<string | undefined>();
  const [executeResult, setExecuteResult] = React.useState<
    string | undefined
  >();
  const [token, setToken] = React.useState<string | undefined>();
  console.log('Config: ' + JSON.stringify(Config));

  const siteKey =
    Platform.OS === 'ios' ? Config.IOS_SITE_KEY : Config.ANDROID_SITE_KEY;

  return (
    <View style={styles.container}>
      <Button
        onPress={() =>
          initClient(siteKey ?? 'SITEKEY', 10000)
            .then(setInitResult('ok'))
            .catch((error) => {
              setInitResult(error.toString());
            })
        }
        title="Init"
        testID="initButtonId"
      />
      <Text>Init Result: </Text>
      <Text testID="initResultId">{initResult}</Text>

      <Button
        onPress={() =>
          execute(RecaptchaAction.LOGIN(), 10000)
            .then((token) => {
              setExecuteResult(token.startsWith('03') ? 'ok' : 'error');
              setToken(token);
            })
            .catch((error) => {
              setExecuteResult(error.toString());
            })
        }
        title="Execute"
        testID="executeButtonId"
      />
      <Text>Execute Result:</Text>
      <Text testID="executeResultId">{executeResult}</Text>
      <Text>Token:</Text>
      <Text testID="tokenId">{token}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
