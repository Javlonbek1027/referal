# 📋 Vercel Deployment Checklist

Vercel ga deploy qilishdan oldin tekshiring:

## ✅ Pre-deployment

- [x] Git repository yaratildi
- [x] `.gitignore` to'g'ri sozlangan
- [x] `.env.local` git ga qo'shilmagan
- [x] `.env.example` yaratildi
- [x] `vercel.json` sozlangan
- [x] Build local da ishlaydi (`npm run build`)
- [x] Keep-alive service qo'shildi

## 📝 GitHub

- [ ] GitHub da repository yarating
- [ ] Local repository ni GitHub ga push qiling:
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/referral-market-system.git
  git branch -M main
  git push -u origin main
  ```

## 🚀 Vercel

- [ ] [vercel.com](https://vercel.com) ga kiring
- [ ] GitHub bilan ulanish
- [ ] "Add New Project" → Repository ni import qiling
- [ ] Environment Variables qo'shing:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] Deploy tugmasini bosing

## 🗄️ Supabase

- [ ] Supabase Dashboard → Settings → API
- [ ] Site URL ga Vercel URL ni qo'shing
- [ ] Redirect URLs ga qo'shing:
  - [ ] `https://your-project.vercel.app/*`
  - [ ] `https://your-project.vercel.app/login`
  - [ ] `https://your-project.vercel.app/register`

## ✅ Post-deployment

- [ ] Vercel URL ni browser da oching
- [ ] Login sahifasi ochilishini tekshiring
- [ ] Admin account bilan kirish: `+998901234567` / `admin123`
- [ ] Browser console da keep-alive service ishlayotganini tekshiring
- [ ] User dashboard ishlashini tekshiring
- [ ] Referral link yaratish ishlashini tekshiring

## 🔍 Monitoring

- [ ] Vercel Dashboard → Analytics
- [ ] Vercel Dashboard → Logs
- [ ] Browser Console → Keep-alive logs

## 📚 Qo'llanmalar

- **Tezkor boshlash:** [VERCEL_QUICK_START.md](./VERCEL_QUICK_START.md)
- **To'liq qo'llanma:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Loyiha haqida:** [README.md](./README.md)

---

**Muvaffaqiyatli deploy!** 🎉
