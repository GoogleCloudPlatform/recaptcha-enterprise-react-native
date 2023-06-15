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

const path = require('path');
const escape = require('escape-string-regexp');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const pak = require('../package.json');

const root = path.resolve(__dirname, '..');

const modules = Object.keys({
  ...pak.peerDependencies,
});

module.exports = {
  projectRoot : __dirname,
  watchFolders : [root],

  // We need to make sure that only one version is loaded for peerDependencies
  // So we block them at the root, and alias them to the versions in example's
  // node_modules
  resolver : {
    blockList : exclusionList(modules.map(
                  (m) => new RegExp(
                      `^${escape(path.join(root, 'node_modules', m))}\\/.*$`))),

    extraNodeModules : modules.reduce(
                         (acc, name) => {
                           acc[name] =
                               path.join(__dirname, 'node_modules', name);
                           return acc;
                         },
                         {}),
  },

  transformer : {
    getTransformOptions : async () => ({
                          transform : {
                            experimentalImportSupport : false,
                            inlineRequires : true,
                          },
                        }),
  },
};
