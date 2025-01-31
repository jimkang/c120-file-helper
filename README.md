# c120-file-helper

Help with files that you get from your Tapo c120's SD card.

# Format

The Tapo C120 camera writes files to the SD card with files named like this:

   YYYYMMDD_HHMMSS_tp_ddddd.mp4

The last five digits are sequential numbers. The part before the `_tp_` is the date and time at which the video clip started. In my experience, in continuous recording mode, the next file in date order starts right after the end of the previous file.

# Finding out which file covers a particular time

If you have a given datetime you want to view in your video, you can find the file with the datetime before the target datetime that is right before the file with the datetime after the target datetime.

Since I found this confusing to do by glancing at a file listing, I put together a script that does it. You can use it like this:

    node find-video-files-for-date-times.js <text file containing line-separated list of filenames> <csv containing dates and times in YYYY-MM-DD format and HH:MM format>

Here's an example of the dates and times list:

    2025-01-27,7:18
    2025-01-27,7:20
    2025-01-28,10:25
    2025-01-28,12:55
    2025-01-28,16:07

The script gives you results like this:

    [
      {
        date: 2025-01-27T12:18:00.000Z,
        filename: '20250127_070728_tp00040.mp4',
        nextFilename: '20250127_072716_tp00041.mp4'
      },
      {
        date: 2025-01-27T12:20:00.000Z,
        filename: '20250127_070728_tp00040.mp4',
        nextFilename: '20250127_072716_tp00041.mp4'
      },
      {
        date: 2025-01-28T15:25:00.000Z,
        filename: '20250128_101645_tp00115.mp4',
        nextFilename: '20250128_103323_tp00116.mp4'
      },
      {
        date: 2025-01-28T17:55:00.000Z,
        filename: '20250128_125215_tp00129.mp4',
        nextFilename: '20250128_130633_tp00130.mp4'
      },
      {
        date: 2025-01-28T21:07:00.000Z,
        filename: '20250128_160651_tp00141.mp4',
        nextFilename: '20250128_162617_tp00142.mp4'
      }
    ]

Each entry in the array has the target date you wanted, the filename that has that date, and then next file after it, in case you need it.
