// deleteTweets.js
require('dotenv').config();
const axios = require('axios');
const { getAuthHeader } = require('./twitterAuth');

const BASE_URL = 'https://api.twitter.com/2';

async function deleteTweet(id) {
  const url = `${BASE_URL}/tweets/${id}`;
  const headers = getAuthHeader(url, 'DELETE');
  try {
    const res = await axios.delete(url, { headers });
    console.log(`✅ Deleted tweet ${id}`);
    return res.data;
  } catch (error) {
    console.error(`❌ Failed to delete ${id}:`, error.response?.data || error.message);
  }
}

async function deleteTweets(tweets) {
  for (const tweet of tweets) {
    await deleteTweet(tweet.id);
  }
}

module.exports = { deleteTweets };
