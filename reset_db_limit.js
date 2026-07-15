const { vercelDb } = require('./src/utils/vercelDb');

async function run() {
  console.log('Resetting admin credentials limit counter...');
  try {
    const credentials = await vercelDb.getCredentials();
    console.log('Current Credentials:', credentials);
    
    credentials.resetCount = 0;
    credentials.resetToken = null;
    credentials.resetTokenExpiry = null;
    
    await vercelDb.setCredentials(credentials);
    console.log('✓ Successfully reset credentials limits to 0!');
    
    // Also let's update settings SMTP Username to the one they provided
    const settings = await vercelDb.getSettings();
    console.log('Current Settings:', settings);
    settings.smtp_user = 'a11152001@smtp-brevo.com';
    settings.email = 'kadamproductionweb@gmail.com';
    await vercelDb.setSettings(settings);
    console.log('✓ Successfully updated settings with SMTP user and contact email!');
  } catch (err) {
    console.error('Error during database update:', err);
  }
}

run();
