import { supabase } from './supabaseClient';
import type { User } from '../types';
import { authService } from './authService';
import { referralService } from './referralService';
import { rewardService } from './rewardService';

interface CreateUserData {
  name: string;
  phone: string;
  password: string;
  referrer_phone?: string;
  referral_limit?: number;
}

interface UpdateUserData {
  name?: string;
  referrer_phone?: string;
  referral_limit?: number;
}

export const userService = {
  async getAllUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        return [];
      }

      return data.map((u) => ({
        ...u,
        reward_balance: parseFloat(u.reward_balance),
      }));
    } catch (err) {
      console.error('Error fetching users:', err);
      return [];
    }
  },

  async getUserById(id: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        ...data,
        reward_balance: parseFloat(data.reward_balance),
      };
    } catch {
      return null;
    }
  },

  async getUserByPhone(phone: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phone)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        ...data,
        reward_balance: parseFloat(data.reward_balance),
      };
    } catch {
      return null;
    }
  },

  async createUser(userData: CreateUserData): Promise<User | null> {
    try {
      // Check if phone already exists
      const existingUser = await this.getUserByPhone(userData.phone);
      if (existingUser) {
        console.error('Phone already exists');
        return null;
      }

      // Validate referrer if provided
      let referrer: User | null = null;
      if (userData.referrer_phone) {
        referrer = await this.getUserByPhone(userData.referrer_phone);
        if (!referrer) {
          console.error('Referrer not found');
          return null;
        }
        // Check referral limit
        if (referrer.referral_count >= referrer.referral_limit) {
          console.error('Referrer has reached referral limit');
          return null;
        }
      }

      // Create simple password hash (in production use bcrypt)
      const password_hash = userData.password;

      const { data, error } = await supabase
        .from('users')
        .insert({
          name: userData.name,
          phone: userData.phone,
          password_hash,
          role: 'user',
          referral_limit: userData.referral_limit || 5,
          referral_count: 0,
          reward_balance: 0,
          referrer_phone: userData.referrer_phone,
        })
        .select()
        .single();

      if (error || !data) {
        console.error('Error creating user:', error);
        return null;
      }

      // If referrer exists, create referral and update counts
      if (referrer) {
        // Get current reward settings
        const rewardSettings = await rewardService.getRewardSettings();
        const rewardAmount = rewardSettings?.reward_per_referral || 10000;

        // Create referral record
        await referralService.createReferral(referrer.id, data.id, rewardAmount);

        // Update referrer's referral count
        await supabase
          .from('users')
          .update({ referral_count: referrer.referral_count + 1 })
          .eq('id', referrer.id);

        // Add reward to referrer's balance
        await rewardService.addBalance(referrer.id, rewardAmount, `Referral: ${userData.name}`);
      }

      return {
        ...data,
        reward_balance: parseFloat(data.reward_balance),
      };
    } catch (err) {
      console.error('Error creating user:', err);
      return null;
    }
  },

  async updateUser(id: string, userData: UpdateUserData): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          ...userData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating user:', error);
        return false;
      }

      return true;
    } catch {
      return false;
    }
  },

  async deleteUser(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting user:', error);
        return false;
      }

      return true;
    } catch {
      return false;
    }
  },

  getCurrentUser(): User | null {
    return authService.getCurrentUser();
  },
};
