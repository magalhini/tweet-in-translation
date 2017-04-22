const twit = require('twit');
const fs = require('fs');
const Jimp = require('jimp');
const twitter = require('./twit');

const PPC = 18; // pixels per characters
const IMAGE_PATH = 'media.png'; // image to be created and tweeted

const readFile = path => new Promise((resolve, reject) => {
  fs.readFile(path, 'utf8', (err, data) => {
    if (data) return resolve(JSON.parse(data));
    else return reject(err);
  });
});

const calculateImageSize = data => new Promise((resolve, reject) => {
  const max = Math.max(...Object.keys(data).map(line => data[line].length));
  resolve({ size: max * PPC, translation: data });
});

const writePicture = (data, size) => {
  return new Jimp(size, 250, 0xFFFFFFFF, (err, image) => {
    Jimp.loadFont(Jimp.FONT_SANS_16_BLACK)
      .then(font => image.print(font, 32, 32, 'Phrase:'))
      .then(Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(font => image.print(font, 32, 64, data.original)))
      .then(Jimp.loadFont(Jimp.FONT_SANS_16_BLACK).then(font => image.print(font, 32, 120, 'Translation:')))
      .then(Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(font => {
        image.print(font, 32, 150, data.translation).write(IMAGE_PATH);
      }))
      .catch(err => new Error('Error creating image', err));
  });
}

// Application logic

readFile('./data/german.json')
  .then(translation => calculateImageSize(translation[1]))
  .then(data => writePicture(data.translation, data.size))
  .then(twitter.postWithMedia({
    path: `./${IMAGE_PATH}`
  }));
