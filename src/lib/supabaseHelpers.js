import { supabase } from '@/lib/supabase';

/**
 * Authentication Helpers
 */
export const authHelpers = {
  // Sign up a new user
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  },

  // Sign in user
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign out user
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Get user session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  // Reset password
  async resetPassword(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error };
  },

  // Update password
  async updatePassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  },
};

/**
 * Database Helpers
 */
export const dbHelpers = {
  // Select (Read)
  async select(table, options = {}) {
    let query = supabase.from(table).select(options.columns || '*');

    if (options.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // Insert (Create)
  async insert(table, data) {
    const { data: result, error } = await supabase
      .from(table)
      .insert([data])
      .select();
    return { data: result, error };
  },

  // Update
  async update(table, id, data) {
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select();
    return { data: result, error };
  },

  // Delete
  async delete(table, id) {
    const { data, error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    return { data, error };
  },
};

/**
 * Storage Helpers
 */
export const storageHelpers = {
  // Upload file
  async uploadFile(bucket, path, file) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);
    return { data, error };
  },

  // Download file
  async downloadFile(bucket, path) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path);
    return { data, error };
  },

  // Get public URL
  getPublicUrl(bucket, path) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    return data.publicUrl;
  },

  // Delete file
  async deleteFile(bucket, path) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    return { data, error };
  },

  // List files
  async listFiles(bucket, path = '') {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path);
    return { data, error };
  },
};

/**
 * Realtime Helpers
 */
export const realtimeHelpers = {
  // Subscribe to table changes
  subscribeToTable(table, callback, filter = {}) {
    const subscription = supabase
      .from(table)
      .on('*', (payload) => {
        callback(payload);
      });

    if (Object.keys(filter).length > 0) {
      Object.entries(filter).forEach(([key, value]) => {
        subscription.eq(key, value);
      });
    }

    return subscription.subscribe();
  },

  // Unsubscribe
  unsubscribe(subscription) {
    subscription.unsubscribe();
  },
};

export default {
  authHelpers,
  dbHelpers,
  storageHelpers,
  realtimeHelpers,
};
