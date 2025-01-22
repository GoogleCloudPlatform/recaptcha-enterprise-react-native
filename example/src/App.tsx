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

import {
  Button,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  execute,
  initClient,
  Recaptcha,
  RecaptchaAction,
  type RecaptchaClient,
} from '@google-cloud/recaptcha-enterprise-react-native';

export default function App() {
  const [recaptchaClient, setRecaptchaClient] =
    React.useState<RecaptchaClient>();
  const [initResult, setInitResult] = React.useState<string>('Not Initialized');
  const [action, setAction] = React.useState<string>(
    RecaptchaAction.LOGIN().action
  );
  const [executeResult, setExecuteResult] = React.useState<
    string | undefined
  >();
  const [token, setToken] = React.useState<string | undefined>();
  console.log('Config: ' + JSON.stringify(Config));

  const configSiteKey =
    (Platform.OS === 'ios' ? Config.IOS_SITE_KEY : Config.ANDROID_SITE_KEY) ??
    'SITEKEY';
  const [siteKey, setSiteKey] = React.useState<string>(configSiteKey);

  return (
    <View style={styles.container}>
      <Text>Action name:</Text>
      <TextInput testID="actionId" onChangeText={setAction} value={action} />

      <Text>SiteKey:</Text>
      <Button
        onPress={async () => {
          setSiteKey(configSiteKey);
        }}
        title="Reset Site Key"
        testID="resetSiteKeyButtonId"
      />
      <TextInput testID="siteKeyId" onChangeText={setSiteKey} value={siteKey} />

      <Button
        onPress={async () => {
          try {
            const client = await Recaptcha.fetchClient(siteKey ?? 'SITEKEY');
            setRecaptchaClient(client);
            setInitResult('ok');
          } catch (error: any) {
            setInitResult(`${error.code} ${error.message.substring(0, 15)}`);
          }
        }}
        title="Fetch Client"
        testID="fetchClientButtonId"
      />
      <Text>Fetch Client Result: </Text>
      <Text testID="fetchClientResultId">{initResult}</Text>

      <Button
        onPress={() => {
          if (recaptchaClient) {
            recaptchaClient
              .execute(new RecaptchaAction(action), 10000)
              .then((newToken) => {
                setExecuteResult(newToken.startsWith('03') ? 'ok' : 'error');
                setToken(newToken);
              })
              .catch((error) => {
                setExecuteResult(
                  `${error.code} ${error.message.substring(0, 15)}`
                );
              });
          } else {
            setExecuteResult('Recaptcha Client is undefined');
          }
        }}
        title="Execute"
        testID="clientExecuteButtonId"
      />
      <Text>Execute Result:</Text>
      <Text testID="clientExecuteResultId">{executeResult}</Text>

      <Text>Deprecated methods</Text>

      <Button
        onPress={() =>
          initClient(siteKey ?? 'SITEKEY', 10000)
            .then(() => {
              setInitResult('ok');
            })
            .catch((error) => {
              setInitResult(`${error.code} ${error.message.substring(0, 15)}`);
            })
        }
        title="Init"
        testID="initButtonId"
      />
      <Text>Init Result: </Text>
      <Text testID="initResultId">{initResult}</Text>

      <Button
        onPress={() =>
          execute(new RecaptchaAction(action), 10000)
            .then((newToken) => {
              setExecuteResult(newToken.startsWith('03') ? 'ok' : 'error');
              setToken(newToken);
            })
            .catch((error) => {
              setExecuteResult(
                `${error.code} ${error.message.substring(0, 15)}`
              );
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
