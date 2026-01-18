-- Add status column to referrals table
-- Status: 'pending' (kutilmoqda), 'approved' (tasdiqlangan), 'rejected' (rad etilgan)

ALTER TABLE referrals 
ADD COLUMN status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));

-- Add approved_at and approved_by columns
ALTER TABLE referrals 
ADD COLUMN approved_at TIMESTAMP,
ADD COLUMN approved_by UUID REFERENCES users(id);

-- Update existing referrals to 'approved' status (eski ma'lumotlar uchun)
UPDATE referrals SET status = 'approved' WHERE status IS NULL OR status = 'pending';

-- Create index for status
CREATE INDEX idx_referrals_status ON referrals(status);
