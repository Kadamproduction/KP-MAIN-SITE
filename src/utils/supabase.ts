const projectId = 'vrwhhajqjsrkripwalfp';
const anonKey = 'sb_publishable_Hm8_WV0IqLb1BBVjE-jYpQ_Ij8vnBDI';
const supabaseBaseUrl = `https://${projectId}.supabase.co`;

export interface SupabaseUser {
  id: string;
  email: string;
}

export const supabase = {
  auth: {
    async signInWithPassword(email: string, password: string) {
      const response = await fetch(`${supabaseBaseUrl}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'apikey': anonKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error_description || errorData.error || 'Failed to sign in');
      }

      const data = await response.json();
      return {
        access_token: data.access_token as string,
        user: {
          id: data.user.id,
          email: data.user.email
        } as SupabaseUser
      };
    },

    async getUser(token: string): Promise<SupabaseUser | null> {
      try {
        const response = await fetch(`${supabaseBaseUrl}/auth/v1/user`, {
          method: 'GET',
          headers: {
            'apikey': anonKey,
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) return null;
        const data = await response.json();
        return {
          id: data.id,
          email: data.email
        };
      } catch {
        return null;
      }
    }
  },

  storage: {
    from(bucket: string) {
      return {
        async upload(filename: string, file: File | Blob, token: string): Promise<string> {
          const cleanFilename = encodeURIComponent(filename.replace(/\s+/g, '_'));
          const url = `${supabaseBaseUrl}/storage/v1/object/${bucket}/${cleanFilename}`;
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'apikey': anonKey,
              'Authorization': `Bearer ${token}`,
              'Content-Type': file.type || 'application/octet-stream'
            },
            body: file
          });

          if (!response.ok) {
            const err = await response.text();
            throw new Error(`Upload failed: ${err}`);
          }

          // Return the public URL
          return `${supabaseBaseUrl}/storage/v1/object/public/${bucket}/${cleanFilename}`;
        },

        async remove(filenames: string[], token: string): Promise<void> {
          const url = `${supabaseBaseUrl}/storage/v1/object/${bucket}`;
          const response = await fetch(url, {
            method: 'DELETE',
            headers: {
              'apikey': anonKey,
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prefixes: filenames })
          });

          if (!response.ok) {
            const err = await response.text();
            console.warn(`Storage delete warning: ${err}`);
          }
        }
      };
    }
  },

  from(table: string) {
    return {
      async select(orderBy: string = 'order_index', orderDir: 'asc' | 'desc' = 'asc'): Promise<any[]> {
        const url = `${supabaseBaseUrl}/rest/v1/${table}?select=*&order=${orderBy}.${orderDir}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'apikey': anonKey,
            'Authorization': `Bearer ${anonKey}`
          }
        });

        if (!response.ok) {
          const err = await response.text();
          throw new Error(`Fetch ${table} failed: ${err}`);
        }

        return await response.json();
      },

      async insert(data: any, token: string): Promise<any[]> {
        const url = `${supabaseBaseUrl}/rest/v1/${table}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'apikey': anonKey,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          const err = await response.text();
          throw new Error(`Insert into ${table} failed: ${err}`);
        }

        return await response.json();
      },

      async update(data: any, matchingColumn: string, matchingValue: any, token: string): Promise<any[]> {
        const url = `${supabaseBaseUrl}/rest/v1/${table}?${matchingColumn}=eq.${matchingValue}`;
        const response = await fetch(url, {
          method: 'PATCH',
          headers: {
            'apikey': anonKey,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          const err = await response.text();
          throw new Error(`Update ${table} failed: ${err}`);
        }

        return await response.json();
      },

      async delete(matchingColumn: string, matchingValue: any, token: string): Promise<void> {
        const url = `${supabaseBaseUrl}/rest/v1/${table}?${matchingColumn}=eq.${matchingValue}`;
        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            'apikey': anonKey,
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const err = await response.text();
          throw new Error(`Delete from ${table} failed: ${err}`);
        }
      }
    };
  }
};
