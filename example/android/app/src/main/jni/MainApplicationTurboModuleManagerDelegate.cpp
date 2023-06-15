// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

#include "MainApplicationTurboModuleManagerDelegate.h"

#include "MainApplicationModuleProvider.h"

namespace facebook {
namespace react {

jni::local_ref<MainApplicationTurboModuleManagerDelegate::jhybriddata>
MainApplicationTurboModuleManagerDelegate::initHybrid(
    jni::alias_ref<jhybridobject>) {
  return makeCxxInstance();
}

void MainApplicationTurboModuleManagerDelegate::registerNatives() {
  registerHybrid({
      makeNativeMethod("initHybrid",
                       MainApplicationTurboModuleManagerDelegate::initHybrid),
      makeNativeMethod(
          "canCreateTurboModule",
          MainApplicationTurboModuleManagerDelegate::canCreateTurboModule),
  });
}

std::shared_ptr<TurboModule>
MainApplicationTurboModuleManagerDelegate::getTurboModule(
    const std::string &name, const std::shared_ptr<CallInvoker> &jsInvoker) {
  // Not implemented yet: provide pure-C++ NativeModules here.
  return nullptr;
}

std::shared_ptr<TurboModule>
MainApplicationTurboModuleManagerDelegate::getTurboModule(
    const std::string &name, const JavaTurboModule::InitParams &params) {
  return MainApplicationModuleProvider(name, params);
}

bool MainApplicationTurboModuleManagerDelegate::canCreateTurboModule(
    const std::string &name) {
  return getTurboModule(name, nullptr) != nullptr ||
         getTurboModule(name, {.moduleName = name}) != nullptr;
}

}  // namespace react
}  // namespace facebook
