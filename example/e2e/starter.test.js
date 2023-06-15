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

describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have init button', async () => {
    await expect(element(by.id('initButtonId'))).toBeVisible();
  });

  it('should show ok after initialization', async () => {
    await element(by.id('initButtonId')).tap();
    await expect(element(by.id('initResultId'))).toHaveText('ok');
  });

  it('should show token after execute', async () => {
    await element(by.id('initButtonId')).tap();
    await element(by.id('executeButtonId')).tap();
    await waitFor(element(by.id('executeResultId')))
        .toHaveText('ok')
        .withTimeout(5000);
    await expect(element(by.id('executeResultId'))).toHaveText('ok');
  });

  it('should show error if execute without init', async () => {
    await element(by.id('executeButtonId')).tap();
    await waitFor(element(by.id('executeResultId')))
        .toHaveText('Error: Initialize client first')
        .withTimeout(5000);
    await expect(element(by.id('executeResultId')))
        .toHaveText('Error: Initialize client first');
  });
});
