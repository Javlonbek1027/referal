import { supabase } from './supabaseClient';
import type { RewardSettings } from '../types';
import { authService } from './authService';
import { transactionService } from './transactionService';

export const rewardService = {
  async getRewardSettings(): Promise<RewardSettings | null> {
    try {
      const { data, error } = await supabase
        .from('reward_settings')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        // Return default if no settings exist
        return {
          id: '',
          reward_per_referral: 10000,
          updated_by: '',
          updated_at: new Date().toISOString(),
        };
      }

      return {
        ...data,
        reward_per_referral: parseFloat(data.reward_per_referral),
      };
    } catch {
      return {
        id: '',
        reward_per_referral: 10000,
        updated_by: '',
        updated_at: new Date().toISOString(),
      };
    }
  },

  async updateRewardSettings(rewardPerReferral: number): Promise<boolean> {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser || currentUser.role !== 'admin') {
        console.error('Only admin can update reward settings');
        return false;
      }

      // Check if settings exist
      const { data: existing } = await supabase
        .from('reward_settings')
        .select('id')
        .limit(1)
        .single();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('reward_settings')
          .update({
            reward_per_referral: rewardPerReferral,
            updated_by: currentUser.id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);

        if (error) {
          console.error('Error updating reward settings:', error);
          return false;
        }
      } else {
        // Insert new
        const { error } = await supabase
          .from('reward_settings')
          .insert({
            reward_per_referral: rewardPerReferral,
            updated_by: currentUser.id,
          });

        if (error) {
          console.error('Error creating reward settings:', error);
          return false;
        }
      }

      return true;
    } catch (err) {
      console.error('Error updating reward settings:', err);
      return false;
    }
  },

  async addBalance(userId: string, amount: number, description: string): Promise<boolean> {
    try {
      // Get current balance
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('reward_balance')
        .eq('id', userId)
        .single();

      if (userError || !user) {
        console.error('Error getting user balance:', userError);
        return false;
      }

      const currentBalance = parseFloat(user.reward_balance);
      const newBalance = currentBalance + amount;

      // Update balance
      const { error: updateError } = await supabase
        .from('users')
        .update({
          reward_balance: newBalance,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating balance:', updateError);
        return false;
      }

      // Create transaction record
      await transactionService.createTransaction(userId, amount, 'admin_add', description);

      return true;
    } catch (err) {
      console.error('Error adding balance:', err);
      return false;
    }
  },

  async deductBalance(userId: string, amount: number, description: string): Promise<boolean> {
    try {
      // Get current balance
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('reward_balance')
        .eq('id', userId)
        .single();

      if (userError || !user) {
        console.error('Error getting user balance:', userError);
        return false;
      }

      const currentBalance = parseFloat(user.reward_balance);
      
      if (currentBalance < amount) {
        console.error('Insufficient balance');
        return false;
      }

      const newBalance = currentBalance - amount;

      // Update balance
      const { error: updateError } = await supabase
        .from('users')
        .update({
          reward_balance: newBalance,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating balance:', updateError);
        return false;
      }

      // Create transaction record
      await transactionService.createTransaction(userId, -amount, 'admin_deduct', description);

      return true;
    } catch (err) {
      console.error('Error deducting balance:', err);
      return false;
    }
  },

  async getRewardBalance(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('reward_balance')
        .eq('id', userId)
        .single();

      if (error || !data) {
        return 0;
      }

      return parseFloat(data.reward_balance);
    } catch {
      return 0;
    }
  },
};
