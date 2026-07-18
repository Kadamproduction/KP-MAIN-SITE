const fs = require('fs');
const path = require('path');

const lottiePath = path.join(__dirname, '..', '..', 'scratch', 'kp-main-site', 'public', 'Logo.json');

if (!fs.existsSync(lottiePath)) {
  console.error('Logo.json not found!');
  process.exit(1);
}

try {
  const data = JSON.parse(fs.readFileSync(lottiePath, 'utf8'));
  console.log('Lottie Animation Properties:');
  console.log(`- Frame Rate (fr): ${data.fr}`);
  console.log(`- Start Frame (ip): ${data.ip}`);
  console.log(`- End Frame (op): ${data.op}`);
  const durationSec = (data.op - data.ip) / data.fr;
  console.log(`- Calculated Duration: ${durationSec.toFixed(2)} seconds`);
  
  // Let's check if there are empty keyframes or layers at the end of the timeline
  if (data.layers && data.layers.length > 0) {
    console.log(`- Number of Layers: ${data.layers.length}`);
  }
} catch (err) {
  console.error('Error parsing Lottie JSON:', err.message);
}
