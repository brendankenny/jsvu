// Copyright 2019 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the “License”);
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// <https://apache.org/licenses/LICENSE-2.0>.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an “AS IS” BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const fs = require('fs');

const ProgressBar = require('progress');

const get = require('./get.js');
const tempFilePath = require('./temp-file-path.js');

const download = async (url) => {
	const bar = new ProgressBar('  [:bar] :percent', {
		complete: '=',
		incomplete: ' ',
		width: 72,
		total: 100,
	});

	let data;
	try {
		data = await get(url, {
			onDownloadProgress: progress => {
				bar.update(progress.percent);
			},
		}).arrayBuffer();
	} catch (error) {
		throw new Error(`Download error: ${error.message}`);
	}

	// Clear the progress bar.
	console.log('\x1B[1A\x1B[2K\x1B[1A');
	const buffer = Buffer.from(data);
	const filePath = tempFilePath();
	fs.writeFileSync(filePath, buffer);
	return filePath;
}

module.exports = download;
