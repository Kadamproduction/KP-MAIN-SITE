const https = require('https');

function checkSize(url) {
  console.log(`Checking size for: ${url}`);
  const req = https.get(url, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`Content-Length: ${res.headers['content-length']} bytes (${(parseInt(res.headers['content-length'] || 0) / 1024 / 1024).toFixed(2)} MB)`);
    
    let totalData = 0;
    res.on('data', (chunk) => {
      totalData += chunk.length;
    });
    res.on('end', () => {
      console.log(`Downloaded: ${(totalData / 1024 / 1024).toFixed(2)} MB`);
    });
  });
  req.on('error', (e) => {
    console.error('Error:', e.message);
  });
}

checkSize('https://assets.kadamproduction.in/Scene-1-2_kyav4b.json');
