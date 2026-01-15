-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Users table policies
-- Admin can see all users
CREATE POLICY "Admin can view all users" ON users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can view their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT
  USING (id = auth.uid());

-- Admin can insert users
CREATE POLICY "Admin can insert users" ON users
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin can update users
CREATE POLICY "Admin can update users" ON users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin can delete users
CREATE POLICY "Admin can delete users" ON users
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Referrals table policies
-- Admin can see all referrals
CREATE POLICY "Admin can view all referrals" ON referrals
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can view their own referrals
CREATE POLICY "Users can view own referrals" ON referrals
  FOR SELECT
  USING (referrer_id = auth.uid() OR referral_id = auth.uid());

-- Admin can manage referrals
CREATE POLICY "Admin can manage referrals" ON referrals
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Reward settings policies
-- Everyone can view reward settings
CREATE POLICY "Everyone can view reward settings" ON reward_settings
  FOR SELECT
  USING (true);

-- Only admin can update reward settings
CREATE POLICY "Admin can update reward settings" ON reward_settings
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin can insert reward settings" ON reward_settings
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Transactions table policies
-- Admin can see all transactions
CREATE POLICY "Admin can view all transactions" ON transactions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can view their own transactions
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT
  USING (user_id = auth.uid());

-- Admin can manage transactions
CREATE POLICY "Admin can manage transactions" ON transactions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );
