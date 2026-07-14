import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from './s3';

export interface SiteSettings {
  email: string;
  phone_1: string;
  phone_2: string;
}

export interface DBImage {
  id: number;
  category: string;
  image_url: string;
  order_index: number;
}

export interface DBVideo {
  id: number;
  title: string;
  video_url: string;
  order_index: number;
}

export interface DBServiceImage {
  id: number;
  service_title: string;
  image_url: string;
}

export interface AdminCredentials {
  username: string;
  passwordHash: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  email: 'kadamproduction123@gmail.com',
  phone_1: '9537330003',
  phone_2: '8866655651'
};

const DEFAULT_CREDENTIALS: AdminCredentials = {
  username: 'admin',
  passwordHash: 'TemporaryPassword123!'
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
    return dataStr ? JSON.parse(dataStr) : {};
  } catch (err: any) {
    if (err.name === 'NoSuchKey' || err.code === 'NoSuchKey') {
      // If db does not exist, initialize with empty structure
      return {
        settings: DEFAULT_SETTINGS,
        images: [],
        videos: [],
        services: [],
        credentials: DEFAULT_CREDENTIALS
      };
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
    return db.images || [];
  },

  async setImages(images: DBImage[]): Promise<void> {
    const db = await getFullDb();
    db.images = images;
    await saveFullDb(db);
  },

  async getVideos(): Promise<DBVideo[]> {
    const db = await getFullDb();
    return db.videos || [];
  },

  async setVideos(videos: DBVideo[]): Promise<void> {
    const db = await getFullDb();
    db.videos = videos;
    await saveFullDb(db);
  },

  async getServices(): Promise<DBServiceImage[]> {
    const db = await getFullDb();
    return db.services || [];
  },

  async setServices(services: DBServiceImage[]): Promise<void> {
    const db = await getFullDb();
    db.services = services;
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
  }
};
