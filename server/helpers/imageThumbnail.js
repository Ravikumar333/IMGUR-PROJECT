const { spawn } = require('child_process');
const { createWriteStream } = require('fs');

const imageDetails = require('../models/imageDetailsSchema');
const port = require('../config/default').port;

const ffmpegPath = '/usr/bin/ffmpeg';
const width = 256;
const height = 144;

const generateThumbnail = (target, title, username) => {
  title = title.replace(/.mov|.mpg|.mpeg|.mp4|.wmv|.avi/gi, '');
  let tmpFile = createWriteStream('media/uploads/image_thumbnails/' + title);
  const ffmpeg = spawn(ffmpegPath, [
    '-ss',
    0,
    '-i',
    target,
    '-vf',
    `thumbnail,scale=${width}:${height}`,
    '-qscale:v',
    '2',
    '-frames:v',
    '1',
    '-f',
    'image2',
    '-c:v',
    'mjpeg',
    'pipe:1'
  ]);
  ffmpeg.stdout.pipe(tmpFile);
  const imageDetails = new imageDetails({
    uploader_name: username,
    upload_title: title,
    image_path: target,
    thumbnail_path: 'http://127.0.0.1:' + port + '/api/images/image_thumbnails/' + encodeURIComponent(title)
  });
  imageDetails
    .save()
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });
}

module.exports = {
  generateThumbnail: generateThumbnail
}
