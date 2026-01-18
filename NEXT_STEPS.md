# 🎯 Keyingi qadamlar

Loyihangiz Vercel ga deploy qilishga tayyor! Quyidagi qadamlarni bajaring:

## 1. GitHub ga yuklash

```bash
# GitHub da yangi repository yarating
# Keyin:

git remote add origin https://github.com/YOUR_USERNAME/referral-market-system.git
git branch -M main
git push -u origin main
```

## 2. Vercel ga deploy qilish

### Oson yo'l (Dashboard):

1. 🌐 [vercel.com](https://vercel.com) ga kiring
2. ➕ "Add New Project" tugmasini bosing
3. 📦 GitHub repository ni import qiling
4. ⚙️ Environment Variables qo'shing:
   ```
   VITE_SUPABASE_URL = https://ggumztstskcizadpmcen.supabase.co
   VITE_SUPABASE_ANON_KEY = sb_publishable_TgCCYI-fnWjaWeix2sANrQ_xyMYFfd_
   ```
5. 🚀 Deploy tugmasini bosing!

### Tezkor yo'l (CLI):

```bash
npm install -g vercel
vercel
```

## 3. Supabase sozlash

1. [Supabase Dashboard](https://supabase.com/dashboard) ga kiring
2. Project Settings → API
3. **Site URL** ga Vercel URL ni qo'shing
4. **Redirect URLs** ga qo'shing:
   - `https://your-project.vercel.app/*`
   - `https://your-project.vercel.app/login`
   - `https://your-project.vercel.app/register`

## 4. Test qilish

Deploy tugagandan keyin:

1. ✅ Vercel URL ni oching
2. ✅ Login sahifasini tekshiring
3. ✅ Admin bilan kiring: `+998901234567` / `admin123`
4. ✅ Browser console da keep-alive logs ni ko'ring
5. ✅ Barcha funksiyalarni test qiling

## 📚 Qo'llanmalar

- **Tezkor:** [VERCEL_QUICK_START.md](./VERCEL_QUICK_START.md) - 5 daqiqada deploy
- **To'liq:** [DEPLOYMENT.md](./DEPLOYMENT.md) - Batafsil qo'llanma
- **Checklist:** [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Tekshirish ro'yxati

## 🎉 Tayyor!

Sizning loyihangiz:
- ✅ Keep-alive service bilan (Supabase sleep bo'lmaydi)
- ✅ Professional dizayn (gradient + glass morphism)
- ✅ Admin panel + User dashboard
- ✅ Referral system
- ✅ Real-time updates
- ✅ Vercel ga deploy qilishga tayyor

---

**Muvaffaqiyatli deploy!** 🚀

Savollar bo'lsa, qo'llanmalarni o'qing yoki Vercel support ga murojaat qiling.
