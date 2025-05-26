// index.js
require('dotenv').config();
const { fetchOldTweets } = require('./fetchTweets');
const { deleteTweets } = require('./deleteTweets');

(async () => {
  try {
    console.log('🔍 Fetching old tweets...');
    const tweets = await fetchOldTweets();
    console.log(`📦 Found ${tweets.length} tweet(s) to delete.`);

    if (tweets.length === 0) {
      console.log('✅ No tweets to delete. Exiting.');
      return;
    }

    console.log('🗑️ Deleting tweets...');
    await deleteTweets(tweets);
    console.log('✅ Deletion process complete.');
  } catch (err) {
    console.error('❌ Error:', err);
  }
})();
