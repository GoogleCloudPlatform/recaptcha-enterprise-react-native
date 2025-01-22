/*
* Copyright 2022 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*      https://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

package com.google.recaptchaenterprisereactnative

import android.app.Application
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.google.android.recaptcha.Recaptcha
import com.google.android.recaptcha.RecaptchaAction
import com.google.android.recaptcha.RecaptchaClient
import com.google.android.recaptcha.RecaptchaException
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch

class RecaptchaEnterpriseReactNativeModule(reactContext: ReactApplicationContext) :
ReactContextBaseJavaModule(reactContext) {
  
  private lateinit var recaptchaClient: RecaptchaClient
  private val application: Application = reactContext.getApplicationContext() as Application
  
  override fun getName(): String {
    return NAME
  }
  
  fun mapAction(actionStr: String): RecaptchaAction {
    if (actionStr.equals("login", ignoreCase = false)) {
      return RecaptchaAction.LOGIN
    } else if (actionStr.equals("signup", ignoreCase = false)) {
      return RecaptchaAction.SIGNUP
    } else {
      return RecaptchaAction.custom(actionStr)
    }
  }
  
  @ReactMethod
  fun fetchClient(siteKey: String, promise: Promise) {
    GlobalScope.launch {
      try {
        recaptchaClient = Recaptcha.fetchClient(application, siteKey)
        promise.resolve(null)
      } catch (exception: Exception) {
        promise.reject(exception)
      }
    }
  }
  
  @ReactMethod
  fun initClient(siteKey: String, arguments: ReadableMap, promise: Promise) {
    GlobalScope.launch {
      let {
        if (arguments.hasKey("timeout")) {
          // JS+ReadableMap have no support for long
          val timeout = arguments.getDouble("timeout").toLong()
          Recaptcha.getClient(application, siteKey, timeout)
        } else {
          Recaptcha.getClient(application, siteKey)
        }
      }
      .onSuccess { client ->
        recaptchaClient = client
        promise.resolve(null)
      }
      .onFailure { exception ->
        if (exception is RecaptchaException) { promise.reject(exception.errorCode.toString(), exception.errorMessage, exception) } else {
          promise.reject(exception)
        }
      }
    }
  }
  
  @ReactMethod
  fun execute(actionStr: String, arguments: ReadableMap, promise: Promise) {
    if (!this::recaptchaClient.isInitialized) {
      promise.reject("RN_EXECUTE_FAILED", "Initialize client first", null)
      return
    }
    
    val action = mapAction(actionStr)
    
    GlobalScope.launch {
      recaptchaClient
      .let {
        if (arguments.hasKey("timeout")) {
          // JS+ReadableMap have no support for long
          val timeout = arguments.getDouble("timeout").toLong()
          it.execute(action, timeout)
        } else {
          it.execute(action)
        }
      }
      .onSuccess { token ->
        promise.resolve(token)
      }
      .onFailure { exception ->
        if (exception is RecaptchaException) {
          promise.reject(exception.errorCode.toString(), exception.errorMessage, exception)
        } else {
          promise.reject(exception)
        }
      }
    }
  }
  
  companion object {
    const val NAME = "RecaptchaEnterpriseReactNative"
  }
}
