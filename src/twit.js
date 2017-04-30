const env = require('node-env-file')
const twit = require('twit');
const fs = require('fs');

env('./.env');

const Twitter = new twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

const postText = data => {
  Twitter.post('statuses/update', { status: data.text }, (err, data, response) => {
    if (err) throw Error(err);
    console.log(data);
  });
}

const postWithMedia = data => {
  console.log('Translation is:', data.translation.translation);

  const b64 = fs.readFileSync(data.path, { encoding: 'base64' });
  const status = data.translation.translation.original;

  Twitter.post('media/upload', {
    media_data: b64
  }, (err, data, response) => {
    if (err) return new Error(err);

    const mediaIdStr = data.media_id_string;
    const meta_params = {
      media_id: mediaIdStr,
      alt_text: { text: status }
    };

    Twitter.post('media/metadata/create', meta_params, (err, data, response) => {
      if (err) throw err;

      const params = {
        status,
        media_ids: [mediaIdStr]
      };

      Twitter.post('statuses/update', params, function (err, data, response) {
        console.log(`Post media was sent at ${new Date()} with ${status}`);
      });
   });
  })
}

module.exports = {
  postText,
  postWithMedia
};
