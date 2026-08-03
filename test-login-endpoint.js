const { vercelDb } = require('./src/utils/vercelDb');
const { verifyPassword } = require('./src/utils/crypto');

function sanitizeInput(val, type) {
  if (!val) return '';
  let clean = val
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // remove zero-width spaces
    .replace(/[\r\n\t]/g, '') // remove carriage returns, newlines, tabs
    .trim();

  // Strip prefixes like "username : ", "password : "
  if (type === 'email') {
    clean = clean.replace(/^(username|email|user)\s*:\s*/i, '');
  } else if (type === 'password') {
    clean = clean.replace(/^(password|pass)\s*:\s*/i, '');
  }

  clean = clean.trim();

  // Strip leading and trailing double/single quotes if present
  if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
    clean = clean.slice(1, -1);
  }

  return clean.trim();
}

async function test() {
  const credentials = await vercelDb.getCredentials();
  console.log('Stored DB username:', JSON.stringify(credentials.username));
  console.log('Stored DB passwordHash:', JSON.stringify(credentials.passwordHash));

  // Simulated inputs
  const inputEmail = sanitizeInput('admin', 'email');
  const inputPassword = sanitizeInput('Meet@_999', 'password');

  const cleanDbUsername = typeof credentials.username === 'string' ? sanitizeInput(credentials.username, 'email') : 'admin';
  const cleanDbPasswordHash = typeof credentials.passwordHash === 'string' ? sanitizeInput(credentials.passwordHash, 'password') : '';

  console.log('Sanitized inputEmail:', JSON.stringify(inputEmail));
  console.log('Sanitized inputPassword:', JSON.stringify(inputPassword));
  console.log('Sanitized DB Username:', JSON.stringify(cleanDbUsername));
  console.log('Sanitized DB PasswordHash:', JSON.stringify(cleanDbPasswordHash));

  const isUserMatch = inputEmail === cleanDbUsername || inputEmail === 'kadamproductionweb@gmail.com' || inputEmail === 'admin';
  const isPassMatch = isUserMatch ? verifyPassword(inputPassword, cleanDbPasswordHash) : false;

  console.log('User Match:', isUserMatch);
  console.log('Password Match:', isPassMatch);
}

test();
