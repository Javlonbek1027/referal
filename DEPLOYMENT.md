# Vercel ga Deploy qilish qo'llanmasi

Bu qo'llanma Referral Market System loyihangizni Vercel ga deploy qilish uchun.

## 1. Tayyorgarlik

### Git Repository yaratish

Agar hali Git repository yaratmagan bo'lsangiz:

```bash
cd referral-market-system
git init
git add .
git commit -m "Initial commit: Referral Market System"
```

### GitHub ga yuklash

1. GitHub da yangi repository yarating
2. Repository ni local loyihangizga ulang:

```bash
git remote add origin https://github.com/your-username/referral-market-system.git
git branch -M main
git push -u origin main
```

## 2. Vercel Account

1. [vercel.com](https://vercel.com) ga kiring
2. GitHub account bilan sign up/login qiling

## 3. Loyihani Deploy qilish

### Variant 1: Vercel Dashboard orqali

1. Vercel dashboard ga kiring
2. "Add New Project" tugmasini bosing
3. GitHub repository ni tanlang
4. Framework Preset: **Vite** (avtomatik tanlanadi)
5. Build Settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Variant 2: Vercel CLI orqali

```bash
# Vercel CLI ni o'rnatish
npm install -g vercel

# Loyiha papkasiga o'ting
cd referral-market-system

# Deploy qilish
vercel

# Production ga deploy qilish
vercel --prod
```

## 4. Environment Variables sozlash

Vercel dashboard da:

1. Project Settings ga kiring
2. "Environment Variables" bo'limiga o'ting
3. Quyidagi o'zgaruvchilarni qo'shing:

```
VITE_SUPABASE_URL = https://ggumztstskcizadpmcen.supabase.co
VITE_SUPABASE_ANON_KEY = sb_publishable_TgCCYI-fnWjaWeix2sANrQ_xyMYFfd_
```

**Muhim:** 
- Environment variables ni **Production**, **Preview**, va **Development** uchun qo'shing
- Har bir o'zgaruvchi nomini to'g'ri yozing (VITE_ prefixi bilan)

## 5. Deployment sozlamalari

`vercel.json` fayli allaqachon sozlangan:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Bu sozlamalar:
- ✅ React Router uchun SPA routing
- ✅ Vite build optimization
- ✅ Automatic redirects

## 6. Deploy natijasini tekshirish

Deploy tugagandan keyin:

1. Vercel sizga URL beradi (masalan: `https://your-project.vercel.app`)
2. Browser da ochib tekshiring
3. Browser console da keep-alive service ishlayotganini ko'ring:
   - `"Keep-alive service boshlandi - har 5 daqiqada ping yuboriladi"`
   - `"Keep-alive ping successful: [vaqt]"`

## 7. Custom Domain (ixtiyoriy)

Agar o'z domeningiz bo'lsa:

1. Vercel Project Settings → Domains
2. Custom domain qo'shing
3. DNS sozlamalarini yangilang (Vercel ko'rsatmalarini kuzating)

## 8. Automatic Deployments

GitHub bilan ulangandan keyin:

- ✅ Har bir `git push` avtomatik deploy qiladi
- ✅ Pull Request lar uchun preview URL yaratiladi
- ✅ Main branch production ga deploy bo'ladi

## 9. Monitoring

Vercel dashboard da:

- **Analytics**: Foydalanuvchilar statistikasi
- **Logs**: Real-time logs
- **Performance**: Loading speed metrics

## 10. Troubleshooting

### Build xatolari

Agar build xato bersa:

```bash
# Local da build qilib ko'ring
npm run build

# Agar local da ishlasa, Vercel environment variables ni tekshiring
```

### Environment variables ishlamayapti

- VITE_ prefixi borligini tekshiring
- Vercel da barcha environment (Production, Preview, Development) uchun qo'shilganini tekshiring
- Redeploy qiling

### Routing ishlamayapti

- `vercel.json` fayli mavjudligini tekshiring
- Rewrites sozlamalari to'g'riligini tekshiring

## 11. Supabase sozlamalari

Vercel URL ni Supabase da allowed origins ga qo'shing:

1. Supabase Dashboard → Settings → API
2. "Site URL" ga Vercel URL ni qo'shing
3. "Redirect URLs" ga qo'shing:
   - `https://your-project.vercel.app/*`
   - `https://your-project.vercel.app/login`
   - `https://your-project.vercel.app/register`

## 12. Keep-Alive Service

Keep-alive service avtomatik ishlaydi:
- ✅ Har 5 daqiqada Supabase ga ping yuboradi
- ✅ Supabase free plan sleep mode ga o'tmaydi
- ✅ Browser console da natijalarni ko'rish mumkin

## Qo'shimcha resurslar

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Supabase + Vercel Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-vercel)

---

**Muvaffaqiyatli deploy!** 🚀

Agar savollar bo'lsa, Vercel support yoki loyiha README.md ga qarang.
