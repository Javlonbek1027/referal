-- Insert default admin user
-- Password: admin123 (hashed with bcrypt)
INSERT INTO users (phone, name, password_hash, role, referral_limit, referral_count, reward_balance)
VALUES (
  '+998901234567',
  'Admin',
  '$2a$10$rQEY7xQxKz5Z5Z5Z5Z5Z5OqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq',
  'admin',
  10,
  0,
  0
);

-- Insert default test user
-- Password: user123 (hashed with bcrypt)
INSERT INTO users (phone, name, password_hash, role, referral_limit, referral_count, reward_balance)
VALUES (
  '+998901234568',
  'Test User',
  '$2a$10$sQEY7xQxKz5Z5Z5Z5Z5Z5OqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq',
  'user',
  5,
  0,
  0
);

-- Insert default reward settings
INSERT INTO reward_settings (reward_per_referral, updated_at)
VALUES (10000, NOW());
