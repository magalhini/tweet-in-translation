const env = require('node-env-file')
const twit = require('twit');
const fs = require('fs');

if (process.env.NODE_ENV === 'dev') env('./.env');

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

const deleteTweet = (id) => {
  return Twitter.post(`statuses/destroy/:id`, { id }, (err, data, response) => {
    console.log(`Deleted tweet ${id}`);
  });
}

const deleteAllTweets = (data) => {
  console.log('🎃 WARNING: All tweets will be deleted in 10 seconds...!');
  setTimeout(() => {
    Twitter.get('statuses/user_timeline', { count: 200 }, (err, data, response) => {
      const all = data.map(tweet => tweet.id_str);
      all.forEach((id, idx) => setTimeout(() => deleteTweet(id), idx * 1100));
    })
  }, 10000);
}

const postWithMedia = data => {
  const b64 = fs.readFileSync(data.path, { encoding: 'base64' });
  const flag = data.lang.flag;
  const status = `${flag} ${data.translation.translation.original}`;

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
  postWithMedia,
  deleteAllTweets,
};
