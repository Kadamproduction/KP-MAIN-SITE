const fs = require('fs');
const path = require('path');

const lottiePath = path.join(__dirname, '..', '..', 'scratch', 'kp-main-site', 'public', 'Logo.json');

try {
  const data = JSON.parse(fs.readFileSync(lottiePath, 'utf8'));
  console.log('Lottie Layers and Timings:');
  
  data.layers.forEach((layer, index) => {
    console.log(`\nLayer ${index}: Name="${layer.nm}", Type=${layer.ty}`);
    console.log(`- Start Time (st): ${layer.st}`);
    console.log(`- In Frame (ip): ${layer.ip}`);
    console.log(`- Out Frame (op): ${layer.op}`);
    
    // Check keyframe properties for opacity/transform
    if (layer.ks) {
      if (layer.ks.o) {
        console.log(`  - Opacity keyframes:`, JSON.stringify(layer.ks.o).substring(0, 200));
      }
    }
  });
} catch (err) {
  console.error('Error:', err.message);
}
