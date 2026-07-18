const { vercelDb } = require('./src/utils/vercelDb');

async function run() {
  try {
    const videos = await vercelDb.getVideos();
    console.log('Videos from DB:');
    console.log(JSON.stringify(videos, null, 2));
  } catch (err) {
    console.error('Error fetching videos:', err.message);
  }
}

run();
