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

import { NativeModules } from 'react-native';
import { execute, initClient, Recaptcha, RecaptchaAction } from '../index';

jest.mock('react-native', () => ({
  Platform: {
    select: jest.fn((obj) => obj.default ?? ''),
  },
  NativeModules: {
    RecaptchaEnterpriseReactNative: {
      fetchClient: jest.fn(),
      initClient: jest.fn(),
      execute: jest.fn(),
    },
  },
}));

const mockNative = NativeModules.RecaptchaEnterpriseReactNative;

describe('RecaptchaAction', () => {
  it('creates standard LOGIN and SIGNUP actions', () => {
    expect(RecaptchaAction.LOGIN().action).toBe('login');
    expect(RecaptchaAction.SIGNUP().action).toBe('signup');
  });

  it('creates custom actions', () => {
    expect(RecaptchaAction.custom('checkout').action).toBe('checkout');
  });
});

describe('Recaptcha.fetchClient and RecaptchaClient.execute', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('fetches a client and executes an action without timeout', async () => {
    mockNative.fetchClient.mockResolvedValueOnce(null);
    mockNative.execute.mockResolvedValueOnce('token-123');

    const client = await Recaptcha.fetchClient('site-key-1');
    expect(mockNative.fetchClient).toHaveBeenCalledWith('site-key-1');

    const token = await client.execute(RecaptchaAction.LOGIN());
    expect(mockNative.execute).toHaveBeenCalledWith('login', {});
    expect(token).toBe('token-123');
  });

  it('passes timeout (including 0) and omits null/undefined when provided to client.execute', async () => {
    mockNative.fetchClient.mockResolvedValueOnce(null);
    mockNative.execute.mockResolvedValue('token-456');

    const client = await Recaptcha.fetchClient('site-key-1');

    await client.execute(RecaptchaAction.SIGNUP(), 5000);
    expect(mockNative.execute).toHaveBeenCalledWith('signup', {
      timeout: 5000,
    });

    await client.execute(RecaptchaAction.custom(' zero '), 0);
    expect(mockNative.execute).toHaveBeenCalledWith(' zero ', {
      timeout: 0,
    });

    await client.execute(
      RecaptchaAction.LOGIN(),
      null as unknown as number | undefined
    );
    expect(mockNative.execute).toHaveBeenLastCalledWith('login', {});
  });

  it('propagates native rejections from fetchClient and client.execute', async () => {
    mockNative.fetchClient.mockRejectedValueOnce(new Error('INVALID_SITEKEY'));
    await expect(Recaptcha.fetchClient('bad-key')).rejects.toThrow(
      'INVALID_SITEKEY'
    );

    mockNative.fetchClient.mockResolvedValueOnce(null);
    const client = await Recaptcha.fetchClient('site-key-1');

    mockNative.execute.mockRejectedValueOnce(new Error('INVALID_ACTION'));
    await expect(
      client.execute(RecaptchaAction.custom('bad action'))
    ).rejects.toThrow('INVALID_ACTION');
  });
});

describe('deprecated initClient and execute', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('calls native initClient with timeout (including 0) and omits null/undefined', async () => {
    mockNative.initClient.mockResolvedValue('ok');

    await initClient('site-key-2');
    expect(mockNative.initClient).toHaveBeenCalledWith('site-key-2', {});

    await initClient('site-key-2', 10000);
    expect(mockNative.initClient).toHaveBeenCalledWith('site-key-2', {
      timeout: 10000,
    });

    await initClient('site-key-2', 0);
    expect(mockNative.initClient).toHaveBeenCalledWith('site-key-2', {
      timeout: 0,
    });

    await initClient('site-key-2', null as unknown as number | undefined);
    expect(mockNative.initClient).toHaveBeenLastCalledWith('site-key-2', {});
  });

  it('calls native execute with timeout (including 0) and omits null/undefined', async () => {
    mockNative.execute.mockResolvedValue('legacy-token');

    const token1 = await execute(RecaptchaAction.LOGIN());
    expect(mockNative.execute).toHaveBeenCalledWith('login', {});
    expect(token1).toBe('legacy-token');

    await execute(RecaptchaAction.SIGNUP(), 3000);
    expect(mockNative.execute).toHaveBeenCalledWith('signup', {
      timeout: 3000,
    });

    await execute(RecaptchaAction.SIGNUP(), 0);
    expect(mockNative.execute).toHaveBeenCalledWith('signup', {
      timeout: 0,
    });

    await execute(
      RecaptchaAction.SIGNUP(),
      null as unknown as number | undefined
    );
    expect(mockNative.execute).toHaveBeenLastCalledWith('signup', {});
  });
});
