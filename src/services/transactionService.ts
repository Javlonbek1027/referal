import { supabase } from './supabaseClient';
import type { Transaction } from '../types';

export const transactionService = {
  async createTransaction(
    userId: string,
    amount: number,
    type: 'referral' | 'admin_add' | 'admin_deduct',
    description: string
  ): Promise<Transaction | null> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          amount,
          type,
          description,
        })
        .select()
        .single();

      if (error || !data) {
        console.error('Error creating transaction:', error);
        return null;
      }

      return {
        ...data,
        amount: parseFloat(data.amount),
      };
    } catch (err) {
      console.error('Error creating transaction:', err);
      return null;
    }
  },

  async getTransactionsByUserId(userId: string): Promise<Transaction[]> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        return [];
      }

      return data.map((t) => ({
        ...t,
        amount: parseFloat(t.amount),
      }));
    } catch (err) {
      console.error('Error fetching transactions:', err);
      return [];
    }
  },

  async getAllTransactions(): Promise<Transaction[]> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          user:user_id (
            name,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all transactions:', error);
        return [];
      }

      return data.map((t) => ({
        ...t,
        amount: parseFloat(t.amount),
      }));
    } catch (err) {
      console.error('Error fetching all transactions:', err);
      return [];
    }
  },
};
