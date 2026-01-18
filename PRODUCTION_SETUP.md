# 🚀 Production Setup - To'liq Qo'llanma

Bu qo'llanma Referral Market System ni production ga chiqarish uchun.

---

## 📋 Checklist

- [ ] Supabase database yaratish
- [ ] SQL migrations ishga tushirish
- [ ] Admin account yaratish
- [ ] Reward settings sozlash
- [ ] Vercel environment variables
- [ ] Domain sozlash (ixtiyoriy)

---

## 1️⃣ Supabase Database Setup

### 1.1 Supabase Dashboard ga kiring

1. [supabase.com/dashboard](https://supabase.com/dashboard) ga kiring
2. Loyihangizni tanlang (yoki yangi yarating)

### 1.2 SQL Editor ni oching

1. Chap menuda **SQL Editor** ni bosing
2. **New Query** tugmasini bosing

### 1.3 Barcha SQL ni ketma-ket ishga tushiring

**MUHIM:** Har bir blokni alohida ishga tushiring!

---

## 📝 SQL Migration #1: Jadvallar yaratish

```sql
-- =============================================
-- MIGRATION 1: CREATE TABLES
-- =============================================

-- Create users table
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

-- Create referrals table
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

-- Create reward_settings table
CREATE TABLE IF NOT EXISTS reward_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reward_per_referral DECIMAL(10, 2) DEFAULT 10000,
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  type VARCHAR(20) CHECK (type IN ('referral', 'admin_add', 'admin_deduct')),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referral ON referrals(referral_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
```

**▶️ RUN tugmasini bosing**

---

## 📝 SQL Migration #2: Admin va Reward Settings

```sql
-- =============================================
-- MIGRATION 2: SEED DATA
-- =============================================

-- Insert admin user (parol: admin123)
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
ON CONFLICT (phone) DO NOTHING;

-- Insert default reward settings (10,000 UZS per referral)
INSERT INTO reward_settings (reward_per_referral, updated_at)
SELECT 10000, NOW()
WHERE NOT EXISTS (SELECT 1 FROM reward_settings);
```

**▶️ RUN tugmasini bosing**

---

## 📝 SQL Migration #3: RLS (Row Level Security) - IXTIYORIY

Agar xavfsizlikni oshirmoqchi bo'lsangiz:

```sql
-- =============================================
-- MIGRATION 3: ROW LEVEL SECURITY (Optional)
-- =============================================

-- Disable RLS for development (recommended for now)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE referrals DISABLE ROW LEVEL SECURITY;
ALTER TABLE reward_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
```

**▶️ RUN tugmasini bosing**

---

## 2️⃣ Admin Account Sozlash

### Production uchun yangi admin yaratish:

```sql
-- Yangi admin yaratish (o'z ma'lumotlaringizni kiriting)
INSERT INTO users (phone, name, password_hash, role, referral_limit)
VALUES (
  '+998XXXXXXXXX',  -- O'z telefon raqamingiz
  'Admin Name',      -- O'z ismingiz
  'your_password',   -- O'z parolingiz (xavfsiz parol tanlang!)
  'admin',
  100
);
```

### Mavjud admin parolini o'zgartirish:

```sql
UPDATE users 
SET password_hash = 'yangi_parol', name = 'Yangi Ism'
WHERE phone = '+998901234567' AND role = 'admin';
```

---

## 3️⃣ Vercel Environment Variables

### Vercel Dashboard da:

1. **Project Settings** → **Environment Variables**
2. Quyidagilarni qo'shing:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `your-anon-key` |

### Supabase credentials olish:

1. Supabase Dashboard → **Settings** → **API**
2. **Project URL** ni nusxalang → `VITE_SUPABASE_URL`
3. **anon public** key ni nusxalang → `VITE_SUPABASE_ANON_KEY`

### Vercel da Redeploy:

Environment variables qo'shgandan keyin:
1. **Deployments** tab ga o'ting
2. Oxirgi deployment ni tanlang
3. **Redeploy** tugmasini bosing

---

## 4️⃣ Supabase URL Sozlamalari

### Supabase Dashboard da:

1. **Settings** → **API** → **URL Configuration**
2. **Site URL** ga Vercel URL ni qo'shing:
   ```
   https://your-project.vercel.app
   ```

3. **Redirect URLs** ga qo'shing:
   ```
   https://your-project.vercel.app/*
   https://your-project.vercel.app/login
   https://your-project.vercel.app/register
   ```

---

## 5️⃣ Test Qilish

### Admin bilan kirish:

1. `https://your-project.vercel.app/login` ga o'ting
2. Admin credentials bilan kiring:
   - Telefon: `+998901234567` (yoki o'zingiz yaratgan)
   - Parol: `admin123` (yoki o'zingiz yaratgan)

### Tekshirish:

- [ ] Login ishlayaptimi?
- [ ] Admin panel ochilaptimi?
- [ ] Referrallar sahifasi ko'rinaptimi?
- [ ] Foydalanuvchilar ro'yxati ko'rinaptimi?
- [ ] Mukofot sozlamalari ishlayaptimi?

### User test:

1. Yangi browser yoki incognito mode oching
2. `/register` sahifasiga o'ting
3. Yangi user yarating
4. Login qiling
5. Referral link yarating

---

## 6️⃣ Reward Settings Sozlash

Admin panel da:

1. **Mukofot sozlamalari** tugmasini bosing
2. Har bir referral uchun mukofot summasini kiriting (masalan: 10000 UZS)
3. **Saqlash** tugmasini bosing

---

## 7️⃣ Custom Domain (Ixtiyoriy)

### Vercel da:

1. **Settings** → **Domains**
2. Custom domain qo'shing
3. DNS sozlamalarini yangilang

### Supabase da:

Custom domain qo'shgandan keyin:
1. **Settings** → **API** → **Site URL** ni yangilang
2. **Redirect URLs** ga yangi domain qo'shing

---

## 🔒 Security Checklist

Production uchun muhim:

- [ ] Admin parolini kuchli parolga o'zgartiring
- [ ] Test user ni o'chiring (agar kerak bo'lmasa)
- [ ] Supabase RLS ni yoqing (advanced)
- [ ] HTTPS ishlatilayotganini tekshiring (Vercel avtomatik)

### Test user ni o'chirish:

```sql
DELETE FROM users WHERE phone = '+998901234568' AND role = 'user';
```

---

## 📊 Monitoring

### Vercel:

- **Analytics** - foydalanuvchilar statistikasi
- **Logs** - real-time logs
- **Functions** - API calls

### Supabase:

- **Database** → **Table Editor** - ma'lumotlarni ko'rish
- **Logs** - database logs
- **Reports** - usage statistics

---

## 🆘 Troubleshooting

### "Could not find table" xatosi:

SQL migrations to'liq ishga tushirilmagan. Yuqoridagi SQL larni qayta ishga tushiring.

### Login ishlamayapti:

1. Supabase credentials to'g'riligini tekshiring
2. Vercel environment variables ni tekshiring
3. Redeploy qiling

### Referral link ishlamayapti:

1. Supabase Site URL to'g'riligini tekshiring
2. Redirect URLs qo'shilganini tekshiring

---

## ✅ Production Ready!

Barcha qadamlarni bajargandan keyin loyihangiz production ga tayyor!

**Credentials:**
- Admin: O'zingiz yaratgan telefon/parol
- URL: `https://your-project.vercel.app`

**Muhim:**
- Admin credentials ni xavfsiz joyda saqlang
- Supabase credentials ni hech kimga bermang
- Muntazam backup qiling

---

**Muvaffaqiyatli production!** 🎉
