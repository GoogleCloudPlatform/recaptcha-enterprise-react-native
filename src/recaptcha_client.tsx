import { RecaptchaEnterpriseReactNative } from './index';
import type { RecaptchaAction } from './recaptcha_action';

interface Args {
    [key: string]: number | string;
}

/** A client that enables Android and iOS Apps to trigger reCAPTCHA Enterprise. */
export interface RecaptchaClient {
    /**
     * Execute reCAPTCHA and retrieve a token
     * @param action An action to describe what the user is doing such as "login"
     * @param timeout An optional timeout value in milliseconds
     */
    execute(
        action: RecaptchaAction,
        timeout?: number
    ): Promise<string>
}

export class RecaptchaClientImpl implements RecaptchaClient {
    execute(
        action: RecaptchaAction,
        timeout?: number
    ): Promise<string> {
        let args: Args = {};

        if (timeout) {
            args.timeout = timeout;
        }

        return RecaptchaEnterpriseReactNative.execute(action.action, args);
    }
}