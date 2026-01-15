# Referral Market System

React + Supabase yordamida qurilgan referral market tizimi. Admin panel va user dashboard.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Library**: Ant Design 5.x
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Testing**: Vitest + fast-check (PBT)

## Quick Start

### 1. Install Dependencies

```bash
cd referral-market-system
npm install
```

### 2. Setup Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL migrations in `supabase/migrations/` folder:
   - `001_create_tables.sql` - Creates all tables
   - `002_seed_data.sql` - Adds default admin/user accounts
   - `003_rls_policies.sql` - Sets up Row Level Security (optional)

### 3. Configure Environment

Copy `.env.local` and update with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Logo Already Included!

The project comes with a professional SVG logo at `public/images/logo.svg`
- **Format**: SVG (scalable vector graphics)
- **Design**: Referral network with connected nodes and dollar sign
- **Colors**: Gradient purple/gold theme matching the app
- **Features**:
  - Sidebar display: 160x160px
  - Login/Register: 160x160px  
  - Background watermark: 600px (8% opacity)
  
If you want to use your own logo, simply replace `public/images/logo.svg` with your logo file.

### 5. Run Development Server

```bash
npm run dev
```

## Default Credentials

- **Admin**: +998901234567 / admin123
- **User**: +998901234568 / user123

## Features

### Admin Panel
- User management (CRUD)
- Reward settings configuration
- Balance management (add/deduct)
- View all referrals and transactions
- Beautiful gradient background with glass morphism design

### User Dashboard
- View profile and referral status
- Generate and share referral link
- View referral list and earnings
- Modern UI with gradient backgrounds

### Keep-Alive Service
- **Automatic Ping System**: Har 5 daqiqada Supabase ga ping yuboradi
- **Prevents Sleep Mode**: Supabase free plan 1 hafta ishlatilmasa sleep mode ga o'tadi, bu service buni oldini oladi
- **Background Operation**: Foydalanuvchi uchun ko'rinmas, fonda ishlaydi
- **Auto-start**: Ilova ochilganda avtomatik ishga tushadi
- **Console Logs**: Browser console da "Keep-alive ping successful" xabarlarini ko'rishingiz mumkin

**Qanday ishlaydi:**
1. Ilova ochilganda avtomatik ishga tushadi
2. Darhol birinchi ping yuboradi
3. Har 5 daqiqada `reward_settings` jadvalidan oddiy SELECT query yuboradi
4. Bu Supabase database ni active holatda saqlaydi
5. Browser console da har bir ping natijasini ko'rishingiz mumkin

## Design Features

- **Logo Integration**: Professional SVG logo displayed in sidebar (160x160px)
- **Gradient Backgrounds**: Beautiful purple gradient (135deg, #667eea to #764ba2)
- **Glass Morphism**: Semi-transparent cards with backdrop blur effect
- **Responsive Design**: Mobile-friendly layout
- **Clean UI**: No distracting watermarks, focus on content

## Project Structure

```
src/
├── components/
│   ├── Admin/       # Admin panel components
│   ├── Auth/        # Authentication components
│   ├── Common/      # Shared components
│   └── User/        # User dashboard components
├── pages/           # Page components
├── services/        # API services
├── types/           # TypeScript interfaces
├── utils/           # Utility functions
└── test/            # Test files
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## Deployment

### Vercel ga deploy qilish

To'liq qo'llanma uchun [DEPLOYMENT.md](./DEPLOYMENT.md) faylini o'qing.

**Qisqacha:**

1. GitHub repository yarating va push qiling
2. [vercel.com](https://vercel.com) ga kiring
3. "Add New Project" → GitHub repository ni tanlang
4. Environment Variables qo'shing:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy tugmasini bosing!

**Vercel CLI orqali:**

```bash
npm install -g vercel
vercel
```

### Environment Variables

Vercel dashboard da quyidagi o'zgaruvchilarni qo'shing:

```
VITE_SUPABASE_URL = your_supabase_url
VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
```

### Automatic Deployments

- ✅ Har bir `git push` avtomatik deploy qiladi
- ✅ Pull Request lar uchun preview URL
- ✅ Main branch → Production

## Database Schema

See `supabase/migrations/001_create_tables.sql` for complete schema.

### Tables
- `users` - User accounts
- `referrals` - Referral relationships
- `reward_settings` - Reward configuration
- `transactions` - Balance transactions
