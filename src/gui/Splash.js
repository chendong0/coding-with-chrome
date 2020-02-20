/**
 * @fileoverview Splashscreen for the Coding with Chrome suite.
 *
 * @license Copyright 2020 The Coding with Chrome Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React from 'react';
import ReactDOM from 'react-dom';

import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';

import { Version } from '../config/Config';
import { StackQueue } from '../utils/stack/StackQueue';

/**
 * Splash Screen class
 */
export class Splash {
  /**
   * @param {Object} stackQueueInstance
   * @constructor
   */
  constructor(stackQueueInstance = new StackQueue(false)) {
    this.currentProgress = 0;
    this.currentProgressText = '';
    this.progressSize = 0;
    this.progressStep = 1;
    this.progressTextLog = [];
    this.stackQueue = stackQueueInstance;
    this.startTime = new Date();
  }

  /**
   * Shows the splash screen.
   */
  show() {
    console.log('Showing Splashscreen ...');
    this.render();
  }

  /**
   * Render splash screen.
   */
  render() {
    ReactDOM.render(
      templateProgress(this),
      document.querySelector('#cwc-splash-screen > div.content > div.progress')
    );
    ReactDOM.render(
      templateVersion(),
      document.querySelector('#cwc-splash-screen > div.version')
    );
  }

  /**
   * @param {String} name
   * @param {Function=} func
   */
  addStep(name, func) {
    if (func) {
      this.stackQueue.addPromise(() => {
        this.progress = (100 / this.progressSize) * this.progressStep++;
        this.progressText = name;
        return func();
      });
    } else {
      this.stackQueue.addCommand(() => {
        this.progress = (100 / this.progressSize) * this.progressStep++;
        this.progressText = name;
      });
    }
  }

  /**
   * @param {number} progress
   */
  set progress(progress) {
    console.log('Set Progress to', progress);
    this.currentProgress = progress;
    this.render();
  }

  /**
   * @return {number}
   */
  get progress() {
    return this.currentProgress;
  }

  /**
   * @param {String} text
   */
  set progressText(text) {
    console.log('Set Progress text to', text);
    const elapsedTime = Number.parseFloat(
      // @ts-ignore
      (new Date() - this.startTime) / 1000
    ).toFixed(3);
    const progressPer = Math.round(this.progress);
    this.currentProgressText = text;
    this.progressTextLog.push(`[${progressPer}%] (${elapsedTime} sec) ${text}`);
    this.render();
  }

  /**
   * @return {string}
   */
  get progressText() {
    return this.currentProgressText;
  }

  /**
   *
   */
  execute() {
    this.progressSize = this.stackQueue.getSize();
    this.stackQueue.start();
  }
}

/**
 * @param {Object} data
 * @return {*}
 */
const templateProgress = data => {
  return (
    <Box className=".splash_screen">
      <Box className="info"></Box>
      <Box className="progress">
        <LinearProgress variant="determinate" value={data.currentProgress} />
      </Box>
      <Box className="progressText">{data.progressText}</Box>
      <Box className="progressTextLog">
        <ul>
          {data.progressTextLog.map((text, index) => {
            return <li key={index}> {text} </li>;
          })}
        </ul>
      </Box>
    </Box>
  );
};

/**
 * @return {*}
 */
const templateVersion = () => {
  return <Box className="version">Coding with Chrome Suite {Version}</Box>;
};
