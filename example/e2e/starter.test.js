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
  