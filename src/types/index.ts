export interface User {
  id: string;
  phone: string;
  name: string;
  role: 'admin' | 'user';
  referral_limit: number;
  referral_count: number;
  reward_balance: number;
  referrer_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referral_id: string;
  reward_amount: number;
  created_at: string;
}

export interface RewardSettings {
  id: string;
  reward_per_referral: number;
  updated_by: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'referral' | 'admin_add' | 'admin_deduct';
  description: string;
  created_at: string;
}
