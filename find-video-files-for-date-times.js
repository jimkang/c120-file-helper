#!/bin/node

/* global process */

var fs = require('fs');

if (process.argv.length < 4) {
  console.error(
    'Usage: node tools/find-video-files-for-date-times.js <line-separated filename list> <date time csv, one date and time per row>'
  );
  process.exit();
}

var filenamesContents = fs.readFileSync(process.argv[2], { encoding: 'utf8' });
var dateTimeContents = fs.readFileSync(process.argv[3], { encoding: 'utf8' });

var filenames = filenamesContents.split('\n');
var dateTimes = dateTimeContents.split('\n');

var filenameStartDates = filenames.map(filenameToDateRange);
filenameStartDates.sort();
// console.log(filenameStartDates);
var targetDates = dateTimes.map(dateTimeStringToDate);
// console.log(targetDates);

var containingFiles = targetDates.map(getContainingFile);
console.log(containingFiles);

function filenameToDateRange(filename) {
  var parts = filename.split('_');
  if (parts.length < 2) {
    return { filename, startDateTime: null };
  }
  var dateString =
    parts[0].slice(0, 4) + '-' + parts[0].slice(4, 6) + '-' + parts[0].slice(6);
  var timeString =
    parts[1].slice(0, 2) + ':' + parts[1].slice(2, 4) + ':' + parts[1].slice(4);
  return { filename, startDateTime: new Date(dateString + 'T' + timeString) };
}

function dateTimeStringToDate(s) {
  return new Date(
    s
      // Separate the date and time with T.
      .replace(',', 'T')
      // Get rid of the carriage return.
      .replace('\r', '')
      // Pad the hour string to two digits
      .replace(/T(\d):/, (_, h) => 'T0' + h + ':')
  );
}

function getContainingFile(date) {
  // TODO: Bisection if filenameStartDates ever gets long enough.
  // Assumes no gaps in filenameStartDates and that they're sorted.
  var prevFilenameStartDate = filenameStartDates[0];

  for (let i = 1; i < filenameStartDates.length; ++i) {
    let filenameStartDate = filenameStartDates[i];
    if (
      date >= prevFilenameStartDate.startDateTime &&
      date < filenameStartDate.startDateTime
    ) {
      return {
        date,
        filename: prevFilenameStartDate.filename,
        nextFilename: filenameStartDate.filename,
      };
    }
    prevFilenameStartDate = filenameStartDate;
  }
}
