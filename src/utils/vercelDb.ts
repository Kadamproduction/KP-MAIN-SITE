import { kv } from '@vercel/kv';

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
  passwordHash: string; // Plain password for simple project, or bcrypt hash. We will use simple plain text matching for ease of maintenance.
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

export const vercelDb = {
  async getSettings(): Promise<SiteSettings> {
    try {
      const data = await kv.get<SiteSettings>('site:settings');
      return data || DEFAULT_SETTINGS;
    } catch (err) {
      console.warn('Vercel KV read warning (settings):', err);
      return DEFAULT_SETTINGS;
    }
  },

  async setSettings(settings: SiteSettings): Promise<void> {
    await kv.set('site:settings', settings);
  },

  async getImages(): Promise<DBImage[]> {
    try {
      const data = await kv.get<DBImage[]>('gallery:images');
      return data || [];
    } catch (err) {
      console.warn('Vercel KV read warning (images):', err);
      return [];
    }
  },

  async setImages(images: DBImage[]): Promise<void> {
    await kv.set('gallery:images', images);
  },

  async getVideos(): Promise<DBVideo[]> {
    try {
      const data = await kv.get<DBVideo[]>('stage:videos');
      return data || [];
    } catch (err) {
      console.warn('Vercel KV read warning (videos):', err);
      return [];
    }
  },

  async setVideos(videos: DBVideo[]): Promise<void> {
    await kv.set('stage:videos', videos);
  },

  async getServices(): Promise<DBServiceImage[]> {
    try {
      const data = await kv.get<DBServiceImage[]>('service:images');
      return data || [];
    } catch (err) {
      console.warn('Vercel KV read warning (services):', err);
      return [];
    }
  },

  async setServices(services: DBServiceImage[]): Promise<void> {
    await kv.set('service:images', services);
  },

  async getCredentials(): Promise<AdminCredentials> {
    try {
      const data = await kv.get<AdminCredentials>('admin:credentials');
      return data || DEFAULT_CREDENTIALS;
    } catch (err) {
      console.warn('Vercel KV read warning (credentials):', err);
      return DEFAULT_CREDENTIALS;
    }
  },

  async setCredentials(credentials: AdminCredentials): Promise<void> {
    await kv.set('admin:credentials', credentials);
  }
};
