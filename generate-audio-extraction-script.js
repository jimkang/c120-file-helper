#!/bin/node

/* global process */

var fs = require('fs');
var path = require('path');

if (process.argv.length < 3) {
  console.error(
    'Usage: node generate-audio-extraction-script.js <JSON file with array containing "filename" entries; output of find-video-files-for-date-times.js>'
  );
  process.exit();
}

var fileInfoObjects = JSON.parse(
  fs.readFileSync(process.argv[2], { encoding: 'utf8' })
);

var videoFilenames = fileInfoObjects.map((o) => o.filename);
var commands = videoFilenames.map(
  (filename) =>
    `ffmpeg -i ${filename} -vn ${path.basename(filename, '.mp4')}.wav`
);

var script = `#!/bin/bash

${commands.join('\n')}`;

console.log(script);
