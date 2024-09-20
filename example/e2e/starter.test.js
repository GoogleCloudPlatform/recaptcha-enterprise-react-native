import { by, device, expect, element, waitFor } from 'detox';

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

  it('should have fetch client button', async () => {
    await expect(element(by.id('fetchClientButtonId'))).toBeVisible();
  });

  it('should show ok after initialization', async () => {
    await element(by.id('initButtonId')).tap();
    await waitFor(element(by.id('initResultId')))
      .toHaveText('ok')
      .withTimeout(10000);
    await expect(element(by.id('initResultId'))).toHaveText('ok');
  });

  it('should show ok after fetching a client', async () => {
    await element(by.id('fetchClientButtonId')).tap();
    await waitFor(element(by.id('fetchClientResultId')))
      .toHaveText('ok')
      .withTimeout(10000);
    await expect(element(by.id('fetchClientResultId'))).toHaveText('ok');
  });

  it('should show token after execute', async () => {
    await element(by.id('initButtonId')).tap();
    await element(by.id('executeButtonId')).tap();
    await waitFor(element(by.id('executeResultId')))
      .toHaveText('ok')
      .withTimeout(10000);
    await expect(element(by.id('executeResultId'))).toHaveText('ok');
  });

  it('should show token after fetch client and execute', async () => {
    await element(by.id('fetchClientButtonId')).tap();
    await element(by.id('clientExecuteButtonId')).tap();
    await waitFor(element(by.id('clientExecuteResultId')))
      .toHaveText('ok')
      .withTimeout(10000);
    await expect(element(by.id('clientExecuteResultId'))).toHaveText('ok');
  });

  it('should show error if execute without init or fetch client', async () => {
    await element(by.id('executeButtonId')).tap();
    await waitFor(element(by.id('executeResultId')))
      .toHaveText('Error: Initialize client first')
      .withTimeout(10000);
    await expect(element(by.id('executeResultId'))).toHaveText(
      'Error: Initialize client first'
    );
  });

  it('should show error if client execute without init or fetch client', async () => {
    await element(by.id('clientExecuteButtonId')).tap();
    await waitFor(element(by.id('clientExecuteResultId')))
      .toHaveText('Recaptcha Client is undefined')
      .withTimeout(10000);
    await expect(element(by.id('clientExecuteResultId'))).toHaveText(
      'Recaptcha Client is undefined'
    );
  });
});
