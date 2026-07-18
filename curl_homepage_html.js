const https = require('https');

https.get('https://www.kadamproduction.in', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Find all <link tags
    const links = data.match(/<link[^>]+>/g) || [];
    console.log('--- LINK TAGS SERVED BY SERVER ---');
    links.forEach(l => {
      if (l.includes('icon') || l.includes('manifest') || l.includes('shortcut')) {
        console.log(l);
      }
    });
  });
}).on('error', (err) => {
  console.error('Error fetching homepage HTML:', err);
});
