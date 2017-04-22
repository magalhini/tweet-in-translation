const config = require('./config.js');
const twit = require('twit');
const fs = require('fs');
const Twitter = new twit(config);

const postText = data => {
  Twitter.post('statuses/update', { status: data.text }, function(err, data, response) {
    console.log(data);
  });
}

const postWithMedia = data => {
  const b64 = fs.readFileSync(data.path, { encoding: 'base64' });

  Twitter.post('media/upload', {
    media_data: b64
  }, (err, data, response) => {
    if (err) return new Error(err);

    const mediaIdStr = data.media_id_string;
    const altText = "Small flowers in a planter on a sunny balcony, blossoming.";
    const meta_params = { media_id: mediaIdStr, alt_text: { text: altText } };

    Twitter.post('media/metadata/create', meta_params, (err, data, response) => {
      if (err) throw err;

      const params = {
        status: 'status message',
        media_ids: [mediaIdStr]
      };

      Twitter.post('statuses/update', params, function (err, data, response) {
        console.log('Post with media sent at ' + new Date());
      });
   });
  })
}

module.exports = {
  postText,
  postWithMedia
};
