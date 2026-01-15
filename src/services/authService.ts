import { supabase } from './supabaseClient';
import type { User } from '../types';

const SESSION_KEY = 'referral_market_session';

export interface AuthSession {
  user: User;
  token: string;
}

export const authService = {
  async login(phone: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phone)
        .single();

      if (error || !data) {
        return { success: false, error: 'Invalid phone number or password' };
      }

      // For demo purposes, we'll do simple password comparison
      // In production, use bcrypt.compare
      const isValidPassword = await this.verifyPassword(password, data.password_hash);
      
      if (!isValidPassword) {
        return { success: false, error: 'Invalid phone number or password' };
      }

      const user: User = {
        id: data.id,
        phone: data.phone,
        name: data.name,
        role: data.role,
        referral_limit: data.referral_limit,
        referral_count: data.referral_count,
        reward_balance: parseFloat(data.reward_balance),
        referrer_phone: data.referrer_phone,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      // Store session
      const session: AuthSession = {
        user,
        token: btoa(JSON.stringify({ id: user.id, phone: user.phone, role: user.role })),
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));

      return { success: true, user };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: 'An error occurred during login' };
    }
  },

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    // Simple password verification for demo
    // In production, use bcrypt
    const simplePasswords: Record<string, string> = {
      'admin123': '$2a$10$rQEY7xQxKz5Z5Z5Z5Z5Z5OqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq',
      'user123': '$2a$10$sQEY7xQxKz5Z5Z5Z5Z5Z5OqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq',
    };
    return simplePasswords[password] === hash || password === hash;
  },

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
  },

  getSession(): AuthSession | null {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) return null;
    
    try {
      return JSON.parse(sessionStr) as AuthSession;
    } catch {
      return null;
    }
  },

  getCurrentUser(): User | null {
    const session = this.getSession();
    return session?.user || null;
  },

  isAuthenticated(): boolean {
    return this.getSession() !== null;
  },

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  },

  async refreshUser(): Promise<User | null> {
    const session = this.getSession();
    if (!session) return null;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error || !data) return null;

      const user: User = {
        id: data.id,
        phone: data.phone,
        name: data.name,
        role: data.role,
        referral_limit: data.referral_limit,
        referral_count: data.referral_count,
        reward_balance: parseFloat(data.reward_balance),
        referrer_phone: data.referrer_phone,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      const newSession: AuthSession = { ...session, user };
      localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));

      return user;
    } catch {
      return null;
    }
  },
};
