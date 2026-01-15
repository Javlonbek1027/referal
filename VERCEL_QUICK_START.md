# ⚡ Vercel ga tezkor deploy qilish

## 1️⃣ GitHub ga yuklash

```bash
# GitHub da yangi repository yarating (masalan: referral-market-system)
# Keyin quyidagi buyruqlarni bajaring:

git remote add origin https://github.com/YOUR_USERNAME/referral-market-system.git
git branch -M main
git push -u origin main
```

## 2️⃣ Vercel ga deploy qilish

### Variant A: Vercel Dashboard (Oson)

1. [vercel.com](https://vercel.com) ga kiring
2. **"Add New Project"** tugmasini bosing
3. GitHub repository ni import qiling
4. **Environment Variables** qo'shing:
   ```
   VITE_SUPABASE_URL = https://ggumztstskcizadpmcen.supabase.co
   VITE_SUPABASE_ANON_KEY = sb_publishable_TgCCYI-fnWjaWeix2sANrQ_xyMYFfd_
   ```
5. **Deploy** tugmasini bosing!

### Variant B: Vercel CLI (Tezkor)

```bash
# Vercel CLI ni o'rnatish
npm install -g vercel

# Deploy qilish
vercel

# Production ga deploy qilish
vercel --prod
```

## 3️⃣ Supabase sozlamalari

Vercel URL ni Supabase da qo'shing:

1. [Supabase Dashboard](https://supabase.com/dashboard) → Project Settings → API
2. **Site URL** ga Vercel URL ni qo'shing (masalan: `https://your-project.vercel.app`)
3. **Redirect URLs** ga qo'shing:
   - `https://your-project.vercel.app/*`
   - `https://your-project.vercel.app/login`
   - `https://your-project.vercel.app/register`

## ✅ Tayyor!

Sizning loyihangiz endi live! 🎉

- 🌐 URL: `https://your-project.vercel.app`
- 🔄 Har bir `git push` avtomatik deploy qiladi
- 📊 Vercel dashboard da analytics va logs ko'ring
- 🚀 Keep-alive service avtomatik ishlaydi

## 🔧 Troubleshooting

### Build xato bersa:
```bash
npm run build  # Local da test qiling
```

### Environment variables ishlamasa:
- VITE_ prefixi borligini tekshiring
- Vercel da **Production**, **Preview**, **Development** uchun qo'shilganini tekshiring

### Routing ishlamasa:
- `vercel.json` fayli mavjudligini tekshiring

---

**To'liq qo'llanma:** [DEPLOYMENT.md](./DEPLOYMENT.md)
