/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/* eslint-env mocha */

const AccessibilityFormatter = require('../../formatters/accessibility.js');
const Handlebars = require('handlebars');
const assert = require('assert');

describe('Formatter', () => {
  it('handles invalid input', () => {
    const pretty = AccessibilityFormatter.getFormatter('pretty');
    assert.doesNotThrow(_ => pretty());
    assert.doesNotThrow(_ => pretty({}));
    assert.doesNotThrow(_ => pretty({impact: ''}));
    assert.doesNotThrow(_ => pretty({impact: '', helpUrl: ''}));
    assert.doesNotThrow(_ => pretty({impact: '', helpUrl: '', nodes: []}));
  });

  it('generates valid html output', () => {
    Handlebars.registerHelper(AccessibilityFormatter.getHelpers());

    const formatter = AccessibilityFormatter.getFormatter('html');
    const template = Handlebars.compile(formatter);

    let output = template({nodes: [{target: 'some-id'}]});
    assert.ok(output.match(/1 element failed this test/g), 'msg for one input');
    assert.ok(output.match(/<code>some-id<\/code>/g));

    output = template({nodes: [{target: 'some-id'}, {target: 'some-id2'}]});
    assert.ok(output.match(/2 elements fail this test/g), 'msg for more than one input');
    assert.ok(output.match(/<code>some-id<\/code>/g));
    assert.ok(output.match(/<code>some-id2<\/code>/g));
  });
});
