// fetchTweets.js
require('dotenv').config();
const axios = require('axios');
const { twitterGet, getAuthHeader } = require('./twitterAuth');

const BASE_URL = 'https://api.twitter.com/2';
const MAX_RESULTS = parseInt(process.env.MAX_RESULTS || '1');
const MAX_PAGES = parseInt(process.env.MAX_PAGES || '1');
const DAYS_OLD = parseInt(process.env.DAYS_OLD || '7');

function isOlderThan(dateStr, days) {
  const tweetDate = new Date(dateStr);
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return tweetDate < cutoff;
}

async function getUserId() {
  const username = process.env.TWITTER_USERNAME;
  const url = `${BASE_URL}/users/by/username/${username}`;
  const headers = getAuthHeader(url, 'GET');
  const res = await axios.get(url, { headers });
  return res.data.data.id;
}

async function fetchOldTweets() {
  const userId = await getUserId();
  const tweets = [];
  let nextToken = null;
  let page = 0;

  while (page < MAX_PAGES) {
    const url = new URL(`${BASE_URL}/users/${userId}/tweets`);
    url.searchParams.set('max_results', MAX_RESULTS);
    url.searchParams.set('tweet.fields', 'created_at');
    if (nextToken) url.searchParams.set('pagination_token', nextToken);

    const headers = getAuthHeader(url.toString(), 'GET');
    const res = await axios.get(url.toString(), { headers });

    const pageTweets = res.data.data || [];
    // const filtered = pageTweets.filter(t => isOlderThan(t.created_at, DAYS_OLD));
    // tweets.push(...filtered);
    tweets.push(...pageTweets)

    nextToken = res.data.meta?.next_token;
    if (!nextToken) break;
    page++;
  }

  return tweets;
}

module.exports = { fetchOldTweets };
