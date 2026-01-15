import { supabase } from './supabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';

type SubscriptionCallback = (payload: unknown) => void;

class RealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map();

  subscribeToUsers(callback: SubscriptionCallback): () => void {
    const channel = supabase
      .channel('users-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users' },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    this.channels.set('users', channel);

    return () => {
      channel.unsubscribe();
      this.channels.delete('users');
    };
  }

  subscribeToReferrals(callback: SubscriptionCallback): () => void {
    const channel = supabase
      .channel('referrals-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'referrals' },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    this.channels.set('referrals', channel);

    return () => {
      channel.unsubscribe();
      this.channels.delete('referrals');
    };
  }

  subscribeToRewardSettings(callback: SubscriptionCallback): () => void {
    const channel = supabase
      .channel('reward-settings-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reward_settings' },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    this.channels.set('reward_settings', channel);

    return () => {
      channel.unsubscribe();
      this.channels.delete('reward_settings');
    };
  }

  subscribeToTransactions(callback: SubscriptionCallback): () => void {
    const channel = supabase
      .channel('transactions-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    this.channels.set('transactions', channel);

    return () => {
      channel.unsubscribe();
      this.channels.delete('transactions');
    };
  }

  unsubscribeAll(): void {
    this.channels.forEach((channel) => {
      channel.unsubscribe();
    });
    this.channels.clear();
  }
}

export const realtimeService = new RealtimeService();
