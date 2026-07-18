const fs = require('fs');
const path = require('path');

const lottiePath = path.join(__dirname, '..', '..', 'scratch', 'kp-main-site', 'public', 'Logo.json');

try {
  const data = JSON.parse(fs.readFileSync(lottiePath, 'utf8'));
  console.log('Precomposition Assets:');
  
  if (data.assets && data.assets.length > 0) {
    data.assets.forEach((asset, index) => {
      if (asset.layers) {
        console.log(`\nAsset ${index}: ID="${asset.id}", Layers=${asset.layers.length}`);
        asset.layers.forEach((l, lIdx) => {
          console.log(`  - Sub-Layer ${lIdx}: Name="${l.nm}", Type=${l.ty}, Start=${l.st}, In=${l.ip}, Out=${l.op}`);
          if (l.ks && l.ks.o) {
            console.log(`    - Opacity keyframes:`, JSON.stringify(l.ks.o).substring(0, 300));
          }
        });
      }
    });
  }
} catch (err) {
  console.error('Error:', err.message);
}
