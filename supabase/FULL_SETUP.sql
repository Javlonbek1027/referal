-- =============================================
-- REFERRAL MARKET SYSTEM - FULL DATABASE SETUP
-- =============================================
-- Bu faylni Supabase SQL Editor da ishga tushiring
-- Barcha jadvallar va boshlang'ich ma'lumotlar yaratiladi
-- =============================================

-- =============================================
-- STEP 1: CREATE TABLES
-- =============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  referral_limit INT DEFAULT 5,
  referral_count INT DEFAULT 0,
  reward_balance DECIMAL(10, 2) DEFAULT 0,
  referrer_phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Referrals table (with status for admin approval)
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referral_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reward_amount DECIMAL(10, 2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_at TIMESTAMP,
  approved_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(referrer_id, referral_id)
);

-- Reward settings table
CREATE TABLE IF NOT EXISTS reward_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reward_per_referral DECIMAL(10, 2) DEFAULT 10000,
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  type VARCHAR(20) CHECK (type IN ('referral', 'admin_add', 'admin_deduct')),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- STEP 2: CREATE INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referral ON referrals(referral_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);

-- =============================================
-- STEP 3: DISABLE RLS (for development)
-- =============================================

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE referrals DISABLE ROW LEVEL SECURITY;
ALTER TABLE reward_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;

-- =============================================
-- STEP 4: INSERT DEFAULT DATA
-- =============================================

-- Insert admin user (Phone: +998901234567, Password: admin123)
-- MUHIM: Production da parolni o'zgartiring!
INSERT INTO users (phone, name, password_hash, role, referral_limit, referral_count, reward_balance)
VALUES (
  '+998901234567',
  'Admin',
  'admin123',
  'admin',
  100,
  0,
  0
)
ON CONFLICT (phone) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  referral_limit = EXCLUDED.referral_limit;

-- Insert default reward settings (10,000 UZS per referral)
INSERT INTO reward_settings (reward_per_referral, updated_at)
SELECT 10000, NOW()
WHERE NOT EXISTS (SELECT 1 FROM reward_settings);

-- =============================================
-- SETUP COMPLETE!
-- =============================================
-- Admin credentials:
-- Phone: +998901234567
-- Password: admin123
-- 
-- Reward per referral: 10,000 UZS
-- =============================================
