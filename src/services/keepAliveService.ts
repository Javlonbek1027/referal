import { supabase } from './supabaseClient';

/**
 * Keep-Alive Service
 * 
 * Supabase free plan 1 hafta ishlatilmasa sleep mode ga o'tadi.
 * Bu service har 5 daqiqada ping yuboradi va database ni active holatda saqlaydi.
 */

class KeepAliveService {
  private intervalId: number | null = null;
  private readonly PING_INTERVAL =  1 * 60 * 1000; // 5 daqiqa (milliseconds)
  private isRunning = false;

  /**
   * Supabase ga ping yuborish
   * Oddiy SELECT query yuboradi
   */
  private async ping(): Promise<void> {
    try {
      // Oddiy query yuborish - reward_settings jadvalidan bitta qator olish
      const { error } = await supabase
        .from('reward_settings')
        .select('id')
        .limit(1)
        .single();

      if (error) {
        console.warn('Keep-alive ping failed:', error.message);
      } else {
        console.log('Keep-alive ping successful:', new Date().toLocaleString());
      }
    } catch (error) {
      console.error('Keep-alive ping error:', error);
    }
  }

  /**
   * Keep-alive service ni boshlash
   */
  start(): void {
    if (this.isRunning) {
      console.log('Keep-alive service allaqachon ishlamoqda');
      return;
    }

    console.log('Keep-alive service boshlandi - har 5 daqiqada ping yuboriladi');
    
    // Darhol birinchi ping yuborish
    this.ping();

    // Har 5 daqiqada ping yuborish
    this.intervalId = window.setInterval(() => {
      this.ping();
    }, this.PING_INTERVAL);

    this.isRunning = true;
  }

  /**
   * Keep-alive service ni to'xtatish
   */
  stop(): void {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
      this.isRunning = false;
      console.log('Keep-alive service to\'xtatildi');
    }
  }

  /**
   * Service holati
   */
  getStatus(): { isRunning: boolean; interval: number } {
    return {
      isRunning: this.isRunning,
      interval: this.PING_INTERVAL,
    };
  }
}

// Singleton instance
export const keepAliveService = new KeepAliveService();
