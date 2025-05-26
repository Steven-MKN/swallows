const crypto = require('crypto');
const axios = require('axios');
const OAuth = require('oauth-1.0a');

require('dotenv').config();

const twitterConfig = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  token: process.env.TWITTER_ACCESS_TOKEN,
  token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
};

const oauth = OAuth({
  consumer: {
    key: twitterConfig.consumer_key,
    secret: twitterConfig.consumer_secret,
  },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
    return crypto.createHmac('sha1', key).update(base_string).digest('base64');
  },
});

function getAuthHeader(url, method) {
  return oauth.toHeader(
    oauth.authorize({ url, method }, {
      key: twitterConfig.token,
      secret: twitterConfig.token_secret,
    })
  );
}

async function twitterGet(url) {
  const headers = getAuthHeader(url, 'GET');
  try {
    const res = await axios.get(url, { headers });
    return res.data;
  } catch (error) {
    console.error('Twitter API GET error:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = {
  twitterGet,
  getAuthHeader,
};
