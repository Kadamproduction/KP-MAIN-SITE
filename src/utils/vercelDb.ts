import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from './s3';

export interface SiteSettings {
  email: string;
  phone_1: string;
  phone_2: string;
  address: string;
  smtp_host?: string;
  smtp_port?: string;
  smtp_user?: string;
  smtp_pass?: string;
  from_email?: string;
}

export interface DBImage {
  id: string;
  category: string;
  image_url: string;
  order_index: number;
}

export interface DBVideo {
  id: string;
  title: string;
  video_url: string;
  order_index: number;
}

export interface DBServiceImage {
  id: number;
  service_title: string;
  image_url: string;
}

export interface DBVibrant {
  id: string;
  title: string;
  image_url: string;
  order_index: number;
}

export interface AdminCredentials {
  username: string;
  passwordHash: string;
  resetToken?: string | null;
  resetTokenExpiry?: number | null;
  otpCode?: string | null;
  otpExpiry?: number | null;
  resetCount?: number;
  recoveryKey?: string;
  resetPeriodStart?: number | null;
  recoveryKeys?: string[];
}

const DEFAULT_SETTINGS: SiteSettings = {
  email: 'kadamproduction123@gmail.com',
  phone_1: '9537330003',
  phone_2: '8866655651',
  address: 'Gaurav Path Road, Palanpur, Surat, Gujarat'
};

const DEFAULT_CREDENTIALS: AdminCredentials = {
  username: 'admin',
  passwordHash: 'TemporaryPassword123!',
  resetToken: null,
  resetTokenExpiry: null,
  resetCount: 0,
  recoveryKey: 'KP-777-RESET',
  resetPeriodStart: null,
  recoveryKeys: ['KP-777-RESET', 'KP-KADAM-RECOVER-99', 'KP-SECURE-ADMIN-77']
};

const DEFAULT_IMAGES: DBImage[] = [
  // Weddings (5 images)
  { id: '1', category: 'Weddings', image_url: '/images/Untitled-design-13.png', order_index: 1 },
  { id: '2', category: 'Weddings', image_url: '/images/Untitled-design-15_bdfxt9.png', order_index: 2 },
  { id: '3', category: 'Weddings', image_url: '/images/Untitled-design-18_tdjp2b.png', order_index: 3 },
  { id: '4', category: 'Weddings', image_url: '/images/Untitled-design-21_atubxz.png', order_index: 4 },
  { id: '5', category: 'Weddings', image_url: '/images/Untitled-design-20_sm7myc.png', order_index: 5 },
  
  // Festivals (5 images)
  { id: '6', category: 'Festivals', image_url: '/images/Untitled-design-18_tdjp2b.png', order_index: 6 },
  { id: '7', category: 'Festivals', image_url: '/images/Untitled-design-14_ogyqmd.png', order_index: 7 },
  { id: '8', category: 'Festivals', image_url: '/images/Untitled-design-32_atcfrs.png', order_index: 8 },
  { id: '9', category: 'Festivals', image_url: '/images/Untitled-design-13.png', order_index: 9 },
  { id: '10', category: 'Festivals', image_url: '/images/Untitled-design-21_atubxz.png', order_index: 10 },

  // Concerts (5 images)
  { id: '11', category: 'Concerts', image_url: '/images/Untitled-design-21_atubxz.png', order_index: 11 },
  { id: '12', category: 'Concerts', image_url: '/images/Untitled-design-32_atcfrs.png', order_index: 12 },
  { id: '13', category: 'Concerts', image_url: '/images/Untitled-design-15_bdfxt9.png', order_index: 13 },
  { id: '14', category: 'Concerts', image_url: '/images/Untitled-design-13.png', order_index: 14 },
  { id: '15', category: 'Concerts', image_url: '/images/Untitled-design-18_tdjp2b.png', order_index: 15 },

  // Corporate (5 images)
  { id: '16', category: 'Corporate', image_url: '/images/Untitled-design-20_sm7myc.png', order_index: 16 },
  { id: '17', category: 'Corporate', image_url: '/images/Untitled-design-25_f2t475.png', order_index: 17 },
  { id: '18', category: 'Corporate', image_url: '/images/Untitled-design-17_ubz6ho.png', order_index: 18 },
  { id: '19', category: 'Corporate', image_url: '/images/Untitled-design-15_bdfxt9.png', order_index: 19 },
  { id: '20', category: 'Corporate', image_url: '/images/Untitled-design-13.png', order_index: 20 },

  // Road Shows (5 images)
  { id: '21', category: 'Road Shows', image_url: '/images/Untitled-design-17_ubz6ho.png', order_index: 21 },
  { id: '22', category: 'Road Shows', image_url: '/images/Untitled-design-13.png', order_index: 22 },
  { id: '23', category: 'Road Shows', image_url: '/images/Untitled-design-15_bdfxt9.png', order_index: 23 },
  { id: '24', category: 'Road Shows', image_url: '/images/Untitled-design-18_tdjp2b.png', order_index: 24 },
  { id: '25', category: 'Road Shows', image_url: '/images/Untitled-design-21_atubxz.png', order_index: 25 },

  // SFX & Pyrotechnics (5 images)
  { id: '26', category: 'SFX & Pyrotechnics', image_url: '/images/ChatGPT_Image_Jul_8_2026_02_56_39_PM_nux2y0.png', order_index: 26 },
  { id: '27', category: 'SFX & Pyrotechnics', image_url: '/images/Untitled-design-13.png', order_index: 27 },
  { id: '28', category: 'SFX & Pyrotechnics', image_url: '/images/Untitled-design-15_bdfxt9.png', order_index: 28 },
  { id: '29', category: 'SFX & Pyrotechnics', image_url: '/images/Untitled-design-18_tdjp2b.png', order_index: 29 },
  { id: '30', category: 'SFX & Pyrotechnics', image_url: '/images/Untitled-design-21_atubxz.png', order_index: 30 }
];

const DEFAULT_VIDEOS: DBVideo[] = [
  { id: '1', title: 'Main Promo', video_url: '/videos/upscaled-video_v3jizt.mp4', order_index: 1 },
  { id: '2', title: 'Concert Light Rig', video_url: '/videos/Trim-1.mp4', order_index: 2 },
  { id: '3', title: 'Wedding Entrance', video_url: '/videos/Trim-3-1.mp4', order_index: 3 },
  { id: '4', title: 'Festival Pyrotechnics', video_url: '/videos/Trim-6.mp4', order_index: 4 },
  { id: '5', title: 'Neon Laser Show', video_url: '/videos/Untitled_design_2_pbfqf3.mp4', order_index: 5 },
  { id: '6', title: 'VIP Night Setup', video_url: '/videos/Untitled_design_3_lw9eld.mp4', order_index: 6 },
  { id: '7', title: 'Stage Sound Check', video_url: '/videos/download_2_sispkn.mp4', order_index: 7 }
];

const DEFAULT_SERVICES: DBServiceImage[] = [
  { id: 1, service_title: 'WEDDINGS', image_url: '/images/Untitled-design-15_bdfxt9.png' },
  { id: 2, service_title: 'CONCERTS', image_url: '/images/Untitled-design-20_sm7myc.png' },
  { id: 3, service_title: 'FESTIVALS', image_url: '/images/Untitled-design-32_atcfrs.png' },
  { id: 4, service_title: 'CORPORATE EVENTS', image_url: '/images/Untitled-design-17_ubz6ho.png' },
  { id: 5, service_title: 'ROAD SHOWS', image_url: '/images/Untitled-design-13.png' },
  { id: 6, service_title: 'PRIVATE PARTIES', image_url: '/images/ChatGPT_Image_Jul_8_2026_02_29_02_PM_dfrv2l.png' },
  { id: 7, service_title: 'SFX & PYROTECHNICS', image_url: '/images/ChatGPT_Image_Jul_8_2026_02_56_39_PM_nux2y0.png' },
  { id: 8, service_title: 'STAGE SETUP', image_url: '/images/ChatGPT_Image_Jul_8_2026_02_34_55_PM_nbkkog.png' },
  { id: 9, service_title: 'EVENT MANAGEMENT', image_url: '/images/Untitled-design-17.png' }
];

const DEFAULT_VIBRANTS: DBVibrant[] = [
  { id: '1', title: 'FESTIVALS', image_url: '/images/Untitled-design-20_sm7myc.png', order_index: 1 },
  { id: '2', title: 'CONCERT', image_url: '/images/Untitled-design-14_ogyqmd.png', order_index: 2 },
  { id: '3', title: 'WEDDING', image_url: '/images/Untitled-design-13.png', order_index: 3 },
  { id: '4', title: 'ROAD SHOWS', image_url: '/images/Untitled-design-32_atcfrs.png', order_index: 4 },
  { id: '5', title: 'UNIQUE EVENTS', image_url: '/images/Untitled-design-25_f2t475.png', order_index: 5 }
];

export interface DBSignatureProject {
  id: string;
  number: string;
  name: string;
  category: string;
  col1_img1: string;
  col1_img2: string;
  col2_img: string;
  link: string;
}

export interface DBCrewMember {
  name: string;
  role: string;
  bio: string;
  src: string;
}

export interface DBAbout {
  hero_image_url: string;
  crew: DBCrewMember[];
}

const DEFAULT_SIGNATURES: DBSignatureProject[] = [
  {
    id: 'wedding-productions',
    number: '01',
    name: 'Royal Weddings',
    category: 'Wedding Production',
    col1_img1: '/images/Untitled-design-13.png',
    col1_img2: '/images/Untitled-design-18_tdjp2b.png',
    col2_img: '/images/Untitled-design-21_atubxz.png',
    link: 'https://github.com'
  },
  {
    id: 'festival-productions',
    number: '02',
    name: 'Cultural Festivals',
    category: 'Arena Production',
    col1_img1: '/images/Untitled-design-20_sm7myc.png',
    col1_img2: '/images/Untitled-design-17_ubz6ho.png',
    col2_img: '/images/Untitled-design-15_bdfxt9.png',
    link: 'https://github.com'
  },
  {
    id: 'concert-productions',
    number: '03',
    name: 'Live Concerts',
    category: 'Stadium Production',
    col1_img1: '/images/Untitled-design-14_ogyqmd.png',
    col1_img2: '/images/Untitled-design-32_atcfrs.png',
    col2_img: '/images/Untitled-design-25_f2t475.png',
    link: 'https://github.com'
  }
];

const DEFAULT_ABOUT: DBAbout = {
  hero_image_url: '/images/Untitled-design-13.png',
  crew: [
    { name: 'ROHAN', role: 'Managing Director', bio: 'Directing creative operations, production strategies, and high-end light & sound installations.', src: '/images/WhatsApp-Image-2026-01-10-at-8.52.25-PM-3_vohntj.png' },
    { name: 'DISHANT', role: 'Managing Director', bio: 'Overseeing event execution, client coordination, and technical system setups.', src: '/images/WhatsApp-Image-2026-01-10-at-8.52.25-PM-2_ug0sl5.png' }
  ]
};

// Helper to read database.json from R2
async function getFullDb(): Promise<any> {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: 'database.json',
    });
    const response = await s3.send(command);
    const dataStr = await response.Body?.transformToString();
    const db = dataStr ? JSON.parse(dataStr) : {};

    // Seed defaults dynamically if empty/missing
    let updated = false;
    if (!db.settings) { db.settings = DEFAULT_SETTINGS; updated = true; }
    if (!db.credentials) { db.credentials = DEFAULT_CREDENTIALS; updated = true; }
    if (!db.images || db.images.length === 0) { db.images = DEFAULT_IMAGES; updated = true; }
    if (!db.videos || db.videos.length === 0) { db.videos = DEFAULT_VIDEOS; updated = true; }
    if (!db.services || db.services.length === 0) { db.services = DEFAULT_SERVICES; updated = true; }
    if (!db.vibrants || db.vibrants.length === 0) { db.vibrants = DEFAULT_VIBRANTS; updated = true; }
    if (!db.signatures || db.signatures.length === 0) { db.signatures = DEFAULT_SIGNATURES; updated = true; }
    if (!db.about) { db.about = DEFAULT_ABOUT; updated = true; }

    if (updated) {
      await saveFullDb(db);
    }

    return db;
  } catch (err: any) {
    if (err.name === 'NoSuchKey' || err.code === 'NoSuchKey' || err.$metadata?.httpStatusCode === 404) {
      const db = {
        settings: DEFAULT_SETTINGS,
        images: DEFAULT_IMAGES,
        videos: DEFAULT_VIDEOS,
        services: DEFAULT_SERVICES,
        vibrants: DEFAULT_VIBRANTS,
        signatures: DEFAULT_SIGNATURES,
        about: DEFAULT_ABOUT,
        credentials: DEFAULT_CREDENTIALS
      };
      await saveFullDb(db);
      return db;
    }
    console.error('R2 read database error:', err);
    return {};
  }
}

// Helper to write database.json back to R2
async function saveFullDb(data: any): Promise<void> {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: 'database.json',
      Body: JSON.stringify(data, null, 2),
      ContentType: 'application/json',
    });
    await s3.send(command);
  } catch (err) {
    console.error('R2 save database error:', err);
  }
}

export const vercelDb = {
  async getSettings(): Promise<SiteSettings> {
    const db = await getFullDb();
    return db.settings || DEFAULT_SETTINGS;
  },

  async setSettings(settings: SiteSettings): Promise<void> {
    const db = await getFullDb();
    db.settings = settings;
    await saveFullDb(db);
  },

  async getImages(): Promise<DBImage[]> {
    const db = await getFullDb();
    return db.images || DEFAULT_IMAGES;
  },

  async setImages(images: DBImage[]): Promise<void> {
    const db = await getFullDb();
    db.images = images;
    await saveFullDb(db);
  },

  async getVideos(): Promise<DBVideo[]> {
    const db = await getFullDb();
    return db.videos || DEFAULT_VIDEOS;
  },

  async setVideos(videos: DBVideo[]): Promise<void> {
    const db = await getFullDb();
    db.videos = videos;
    await saveFullDb(db);
  },

  async getServices(): Promise<DBServiceImage[]> {
    const db = await getFullDb();
    return db.services || DEFAULT_SERVICES;
  },

  async setServices(services: DBServiceImage[]): Promise<void> {
    const db = await getFullDb();
    db.services = services;
    await saveFullDb(db);
  },

  async getVibrants(): Promise<DBVibrant[]> {
    const db = await getFullDb();
    return db.vibrants || DEFAULT_VIBRANTS;
  },

  async setVibrants(vibrants: DBVibrant[]): Promise<void> {
    const db = await getFullDb();
    db.vibrants = vibrants;
    await saveFullDb(db);
  },

  async getCredentials(): Promise<AdminCredentials> {
    const db = await getFullDb();
    return db.credentials || DEFAULT_CREDENTIALS;
  },

  async setCredentials(credentials: AdminCredentials): Promise<void> {
    const db = await getFullDb();
    db.credentials = credentials;
    await saveFullDb(db);
  },

  async getSignatures(): Promise<DBSignatureProject[]> {
    const db = await getFullDb();
    return db.signatures || DEFAULT_SIGNATURES;
  },

  async setSignatures(signatures: DBSignatureProject[]): Promise<void> {
    const db = await getFullDb();
    db.signatures = signatures;
    await saveFullDb(db);
  },

  async getAbout(): Promise<DBAbout> {
    const db = await getFullDb();
    return db.about || DEFAULT_ABOUT;
  },

  async setAbout(about: DBAbout): Promise<void> {
    const db = await getFullDb();
    db.about = about;
    await saveFullDb(db);
  }
};
