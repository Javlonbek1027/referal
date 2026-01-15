import { supabase } from './supabaseClient';
import type { Referral } from '../types';

interface ReferralWithUser extends Referral {
  referral_name?: string;
  referral_phone?: string;
}

export const referralService = {
  async getReferralsByUserId(userId: string): Promise<ReferralWithUser[]> {
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select(`
          *,
          referral:referral_id (
            name,
            phone
          )
        `)
        .eq('referrer_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching referrals:', error);
        return [];
      }

      return data.map((r) => ({
        id: r.id,
        referrer_id: r.referrer_id,
        referral_id: r.referral_id,
        reward_amount: parseFloat(r.reward_amount),
        created_at: r.created_at,
        referral_name: r.referral?.name,
        referral_phone: r.referral?.phone,
      }));
    } catch (err) {
      console.error('Error fetching referrals:', err);
      return [];
    }
  },

  async createReferral(referrerId: string, referralId: string, rewardAmount: number): Promise<Referral | null> {
    try {
      // Check if referral already exists
      const { data: existing } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', referrerId)
        .eq('referral_id', referralId)
        .single();

      if (existing) {
        console.error('Referral already exists');
        return null;
      }

      const { data, error } = await supabase
        .from('referrals')
        .insert({
          referrer_id: referrerId,
          referral_id: referralId,
          reward_amount: rewardAmount,
        })
        .select()
        .single();

      if (error || !data) {
        console.error('Error creating referral:', error);
        return null;
      }

      return {
        ...data,
        reward_amount: parseFloat(data.reward_amount),
      };
    } catch (err) {
      console.error('Error creating referral:', err);
      return null;
    }
  },

  async getReferralCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('referrals')
        .select('*', { count: 'exact', head: true })
        .eq('referrer_id', userId);

      if (error) {
        console.error('Error getting referral count:', error);
        return 0;
      }

      return count || 0;
    } catch {
      return 0;
    }
  },

  async getAllReferrals(): Promise<ReferralWithUser[]> {
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select(`
          *,
          referrer:referrer_id (
            name,
            phone
          ),
          referral:referral_id (
            name,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all referrals:', error);
        return [];
      }

      return data.map((r) => ({
        id: r.id,
        referrer_id: r.referrer_id,
        referral_id: r.referral_id,
        reward_amount: parseFloat(r.reward_amount),
        created_at: r.created_at,
        referral_name: r.referral?.name,
        referral_phone: r.referral?.phone,
      }));
    } catch (err) {
      console.error('Error fetching all referrals:', err);
      return [];
    }
  },
};
