import { supabase } from './supabaseClient';
import type { Referral, ReferralWithUser } from '../types';
import { rewardService } from './rewardService';

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
        status: r.status || 'pending',
        approved_at: r.approved_at,
        approved_by: r.approved_by,
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

      // Create referral with 'pending' status - admin must approve
      const { data, error } = await supabase
        .from('referrals')
        .insert({
          referrer_id: referrerId,
          referral_id: referralId,
          reward_amount: rewardAmount,
          status: 'pending', // Kutilmoqda - admin tasdiqlashi kerak
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

  // Admin tasdiqlash funksiyasi
  async approveReferral(referralId: string, adminId: string): Promise<boolean> {
    try {
      // Get referral details
      const { data: referral, error: fetchError } = await supabase
        .from('referrals')
        .select('*, referral:referral_id(name)')
        .eq('id', referralId)
        .single();

      if (fetchError || !referral) {
        console.error('Referral not found:', fetchError);
        return false;
      }

      // Check if already approved
      if (referral.status === 'approved') {
        console.error('Referral already approved');
        return false;
      }

      // Update referral status to approved
      const { error: updateError } = await supabase
        .from('referrals')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: adminId,
        })
        .eq('id', referralId);

      if (updateError) {
        console.error('Error approving referral:', updateError);
        return false;
      }

      // Add reward to referrer's balance
      const rewardAmount = parseFloat(referral.reward_amount);
      const referralName = referral.referral?.name || 'Noma\'lum';
      await rewardService.addBalance(
        referral.referrer_id, 
        rewardAmount, 
        `Referral tasdiqlandi: ${referralName}`
      );

      return true;
    } catch (err) {
      console.error('Error approving referral:', err);
      return false;
    }
  },

  // Admin rad etish funksiyasi
  async rejectReferral(referralId: string, adminId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('referrals')
        .update({
          status: 'rejected',
          approved_at: new Date().toISOString(),
          approved_by: adminId,
        })
        .eq('id', referralId);

      if (error) {
        console.error('Error rejecting referral:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error rejecting referral:', err);
      return false;
    }
  },

  // Pending referrallar sonini olish
  async getPendingReferralsCount(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('referrals')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (error) {
        console.error('Error getting pending count:', error);
        return 0;
      }

      return count || 0;
    } catch {
      return 0;
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

  // Barcha referrallarni olish (admin uchun)
  async getAllReferrals(statusFilter?: 'pending' | 'approved' | 'rejected'): Promise<ReferralWithUser[]> {
    try {
      let query = supabase
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

      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching all referrals:', error);
        return [];
      }

      return data.map((r) => ({
        id: r.id,
        referrer_id: r.referrer_id,
        referral_id: r.referral_id,
        reward_amount: parseFloat(r.reward_amount),
        status: r.status || 'pending',
        approved_at: r.approved_at,
        approved_by: r.approved_by,
        created_at: r.created_at,
        referral_name: r.referral?.name,
        referral_phone: r.referral?.phone,
        referrer_name: r.referrer?.name,
        referrer_phone: r.referrer?.phone,
      }));
    } catch (err) {
      console.error('Error fetching all referrals:', err);
      return [];
    }
  },
};
