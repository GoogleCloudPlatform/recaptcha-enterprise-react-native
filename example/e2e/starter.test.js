import { by, device, expect, element, waitFor } from 'detox';

describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    await element(by.id('actionId')).replaceText('login');
    await element(by.id('resetSiteKeyButtonId')).tap();
  });

  /* getClient (old) API */

  it('should have init button', async () => {
    await expect(element(by.id('initButtonId'))).toBeVisible();
  });

  it('should show ok after initialization', async () => {
    await element(by.id('initButtonId')).tap();
    await waitFor(element(by.id('initResultId')))
      .toHaveText('ok')
      .withTimeout(10000);
    await expect(element(by.id('initResultId'))).toHaveText('ok');
  });

  it('should show token after execute', async () => {
    await element(by.id('initButtonId')).tap();
    await element(by.id('executeButtonId')).tap();
    await waitFor(element(by.id('executeResultId')))
      .toHaveText('ok')
      .withTimeout(10000);
    await expect(element(by.id('executeResultId'))).toHaveText('ok');
  });

  it('should show error execute with bad action', async () => {
    await element(by.id('initButtonId')).tap();
    await waitFor(element(by.id('initResultId')))
      .toHaveText('ok')
      .withTimeout(10000);
    await element(by.id('actionId')).replaceText('asdf $%');
    await element(by.id('executeButtonId')).tap();
    const errorMessage =
      device.getPlatform() === 'ios'
        ? '5 Invalid Action.'
        : 'INVALID_ACTION Invalid action ';
    await waitFor(element(by.id('executeResultId')))
      .toHaveText(errorMessage)
      .withTimeout(10000);
    await expect(element(by.id('executeResultId'))).toHaveText(errorMessage);
  });

  it('should show error for init with bad site key', async () => {
    await element(by.id('siteKeyId')).replaceText('BADSITEKEY');
    await element(by.id('initButtonId')).tap();

    const errorMessage =
      device.getPlatform() === 'ios'
        ? '2 Only one site k'
        : 'INVALID_SITEKEY Site key invali';
    await waitFor(element(by.id('initResultId')))
      .toHaveText(errorMessage)
      .withTimeout(10000);
    await expect(element(by.id('initResultId'))).toHaveText(errorMessage);
  });

  it('should show error if execute without init or fetch client', async () => {
    await element(by.id('executeButtonId')).tap();
    const errorMessage = 'RN_EXECUTE_FAILED Initialize clie';
    await waitFor(element(by.id('executeResultId')))
      .toHaveText(errorMessage)
      .withTimeout(10000);
    await expect(element(by.id('executeResultId'))).toHaveText(errorMessage);
  });

  /* fetchClient (new) API */

  it('should have fetch client button', async () => {
    await expect(element(by.id('fetchClientButtonId'))).toBeVisible();
  });

  it('should show ok after fetching a client', async () => {
    await element(by.id('fetchClientButtonId')).tap();
    await waitFor(element(by.id('fetchClientResultId')))
      .toHaveText('ok')
      .withTimeout(10000);
    await expect(element(by.id('fetchClientResultId'))).toHaveText('ok');
  });

  it('should show token after fetch client and execute', async () => {
    await element(by.id('fetchClientButtonId')).tap();
    await element(by.id('clientExecuteButtonId')).tap();
    await waitFor(element(by.id('clientExecuteResultId')))
      .toHaveText('ok')
      .withTimeout(10000);
    await expect(element(by.id('clientExecuteResultId'))).toHaveText('ok');
  });

  it('should show error execute with bad action after fetch client', async () => {
    await element(by.id('fetchClientButtonId')).tap();
    await element(by.id('actionId')).replaceText('asdf $%');
    await element(by.id('clientExecuteButtonId')).tap();
    const errorMessage =
      device.getPlatform() === 'ios'
        ? '5 Invalid Action.'
        : 'INVALID_ACTION Invalid action ';
    await waitFor(element(by.id('clientExecuteResultId')))
      .toHaveText(errorMessage)
      .withTimeout(10000);
    await expect(element(by.id('clientExecuteResultId'))).toHaveText(
      errorMessage
    );
  });

  it('should show error for init with bad site key after fetch client', async () => {
    await element(by.id('siteKeyId')).replaceText('BADSITEKEY');
    await element(by.id('fetchClientButtonId')).tap();

    const errorMessage =
      device.getPlatform() === 'ios'
        ? '2 Only one site k'
        : 'INVALID_SITEKEY Site key invali';
    await waitFor(element(by.id('fetchClientResultId')))
      .toHaveText(errorMessage)
      .withTimeout(10000);
    await expect(element(by.id('fetchClientResultId'))).toHaveText(
      errorMessage
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
