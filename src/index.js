const twit = require('twit');
const fs = require('fs');
const Jimp = require('jimp');
const twitter = require('./twit');
const utils = require('./utils');
const languagesMap = require('./languages');

const PPC = 19; // pixels per characters
const INTERVAL_SECONDS = 7200;
const IMAGE_PATH = 'media.png'; // image to be created and tweeted

let lastTweet = {
  original: '',
  at: null
};

/**
 * Calculates the width of the image to be created based on the longest
 * length of either the original sentence or the translation
 * @param  {Object} data
 * @return {Promise}
 */
const calculateImageSize = data => new Promise((resolve, reject) => {
  const max = Math.max(...Object.keys(data).map(line => data[line].length));
  resolve({ size: max * PPC, translation: data });
});

/**
 * Creates a new Jimp image and writes the text.
 * Resolves with a promise.
 * @param  {Object} translation
 * @param  {Number} size
 * @return {Promise}
 */
const writePicture = (translation, size) =>
  new Promise((resolve, reject) => {
    new Jimp(size, 250, 0xFEFEFEFF, (err, image) => {
        Jimp.loadFont(Jimp.FONT_SANS_16_BLACK)
          .then(font => image.print(font, 32, 32, 'Phrase:').write(IMAGE_PATH))
          .then(Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(font => image.print(font, 32, 64, translation.original).write(IMAGE_PATH)))
          .then(Jimp.loadFont(Jimp.FONT_SANS_16_BLACK).then(font => image.print(font, 32, 130, 'Translation:').write(IMAGE_PATH)))
          .then(Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(font => image.print(font, 32, 160, translation.translation).write(IMAGE_PATH)))
          .then(buffer => {
            setTimeout(() =>
              resolve({
                buffer,
                translation
              }), 2000)
          })
          .catch(err => new Error('Error creating image', err));
      })
  });

const getRandomTranslation = data => new Promise((resolve, reject) => {
  const translation = data[Math.floor(Math.random() * data.length)];

  // Never tweet the previous translation
  if (translation.original !== lastTweet.original) {
    lastTweet.original = translation.original;
    return resolve(translation);
  }

  return tweetATranslation();
});

const chooseLanguage = () => {
  const lang = languagesMap[Math.floor(Math.random() * languagesMap.length)];
  return lang;
}

const tweetATranslation = () => {
  console.log('About to tweet at', new Date().toString());
  const lang = chooseLanguage();

  utils.readJSON(`./data/${lang.filename}`)
    .then(getRandomTranslation)
    .then(calculateImageSize)
    .then(data => writePicture(data.translation, data.size))
    .then(data => twitter.postWithMedia({
      lang,
      path: `./${IMAGE_PATH}`,
      translation: data
    }))
    .catch(err => console.log('Ops, something has gone wrong', err));
}

console.log(`Starting Twitter Bot 🤖`);

// Kick it off!
setInterval(tweetATranslation, INTERVAL_SECONDS * 1000);
tweetATranslation();
