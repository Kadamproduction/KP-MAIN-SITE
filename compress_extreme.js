const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ffmpegPath = ffmpegInstaller.path;
console.log('FFmpeg binary path:', ffmpegPath);

// Load env vars
const envPath = path.join(__dirname, '..', '..', 'scratch', 'kp-main-site', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const parts = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (parts) {
      const key = parts[1];
      let val = parts[2] || '';
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
      process.env[key] = val.trim();
    }
  });
}

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

const bucketName = process.env.R2_BUCKET_NAME;

const videoKeys = [
  'videos/Trim-1.mp4',
  'videos/Trim-3-1.mp4',
  'videos/Trim-6.mp4',
  'videos/Untitled_design_2_pbfqf3.mp4',
  'videos/Untitled_design_3_lw9eld.mp4',
  'videos/download_2_sispkn.mp4',
  'videos/upscaled-video_v3jizt.mp4'
];

const tempDir = path.join(__dirname, 'temp_extreme');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

async function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

async function processVideo(key) {
  console.log(`\n========================================`);
  console.log(`Processing: ${key}`);
  const baseName = path.basename(key, '.mp4');
  const localInput = path.join(tempDir, `${baseName}_orig.mp4`);
  const localOptMp4 = path.join(tempDir, `${baseName}_opt.mp4`);

  // 1. Download original MP4
  console.log(`Downloading ${key}...`);
  const getCmd = new GetObjectCommand({ Bucket: bucketName, Key: key });
  const getRes = await s3.send(getCmd);
  const buffer = await streamToBuffer(getRes.Body);
  fs.writeFileSync(localInput, buffer);
  const origSize = buffer.length;
  console.log(`Current size: ${(origSize / 1024 / 1024).toFixed(2)} MB`);

  // 2. Compress to H.264 MP4 (Extreme web optimization: CRF 32, max bitrate 500k, no audio)
  console.log(`Compressing to extreme web-optimized H.264...`);
  execFileSync(ffmpegPath, [
    '-y',
    '-i', localInput,
    '-c:v', 'libx264',
    '-profile:v', 'high',
    '-level:v', '4.1',
    '-crf', '32',
    '-b:v', '500k',
    '-maxrate', '700k',
    '-bufsize', '1200k',
    '-an', // remove audio
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart', // fast start
    localOptMp4
  ], { stdio: 'ignore' });

  const optMp4Size = fs.statSync(localOptMp4).size;
  console.log(`Extreme Optimized MP4 size: ${(optMp4Size / 1024 / 1024).toFixed(2)} MB (${((1 - optMp4Size / origSize) * 100).toFixed(1)}% reduction)`);

  // 3. Upload optimized MP4 back to R2
  console.log(`Uploading optimized MP4 back to R2: ${key}...`);
  const putMp4Cmd = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fs.readFileSync(localOptMp4),
    ContentType: 'video/mp4'
  });
  await s3.send(putMp4Cmd);

  // Clean up local temp files
  fs.unlinkSync(localInput);
  fs.unlinkSync(localOptMp4);
  console.log(`Completed processing: ${key}`);
}

async function run() {
  try {
    for (const key of videoKeys) {
      await processVideo(key);
    }
    console.log('\n========================================');
    console.log('All videos successfully extreme-compressed and uploaded to R2!');
    // Remove temp directory
    fs.rmdirSync(tempDir);
  } catch (err) {
    console.error('Error running extreme compression script:', err);
  }
}

run();
