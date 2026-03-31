# Quick Start Guide - Deckdrop Web App

Get your Deckdrop marketplace running in 5 minutes!

## ⚡ 5-Minute Setup

### 1. Prerequisites Check (1 min)
- ✅ Node.js 18+ installed?
- ✅ PostgreSQL installed and running?
- ✅ Git installed?

### 2. Clone & Install (2 min)
```bash
cd c:\Users\[YourUsername]\OneDrive\Desktop\Documents\GLORY\deckdrop-web

# Install dependencies (might take 1-2 min)
npm install
```

### 3. Environment Setup (1 min)
Create `.env.local` file:
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/deckdrop"
JWT_SECRET="your-secret-key-here"
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY="FLWPUBK_TEST_"
FLUTTERWAVE_SECRET_KEY="FLWSECK_TEST_"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
NODE_ENV="development"
```

### 4. Database Setup (1 min)
```bash
# Create database and tables
npx prisma migrate dev --name init
```

### 5. Start Development Server (1 min)
```bash
npm run dev
```

## ✨ You're Live!

Open browser: **http://localhost:3000**

### Login with demo account:
- Email: `demo@deckdrop.com`
- Password: `demo123456`

---

## 🎯 What's Ready to Use

### ✅ Customer Features (Live)
- Browse products from multiple stores
- Search with category filtering
- Add items to cart
- User authentication
- View order history

### ⏳ Coming Soon
- Payment processing (Flutterwave API keys needed)
- Real-time order tracking
- Rider notifications
- Store management portal

### 📧 Notifications
- In-app notifications system prepared
- Email integration ready (configure SendGrid)

---

## 📚 Important Files

| File | Purpose |
|------|---------|
| `.env.local` | Configuration (credentials, API keys) |
| `prisma/schema.prisma` | Database structure |
| `src/app/page.tsx` | Home page |
| `src/app/api/auth/` | Login/Register endpoints |
| `src/app/api/products/` | Product search API |
| `README.md` | Full documentation |
| `SETUP_GUIDE.md` | Complete setup instructions |
| `DEPLOYMENT.md` | How to deploy to production |

---

## 🚀 Next Steps

1. **Get Flutterwave Keys** (5 min)
   - Visit https://flutterwave.com
   - Sign up (free)
   - Get test API keys
   - Add to `.env.local`

2. **Explore Code** (10 min)
   - Check `src/components/` for UI components
   - Review `src/app/api/` for API endpoints
   - Look at `src/store/` for state management

3. **Add Test Data** (10 min)
   - Use `npx prisma studio` for GUI
   - Or create `prisma/seed.ts` for batch import

4. **Deploy** (20 min)
   - Follow `DEPLOYMENT.md`
   - Deploy to Vercel
   - Set up database

---

## 🐛 Troubleshooting

### "Cannot find module" errors
```bash
npm install
```

### Port 3000 already in use?
```bash
npm run dev -- -p 3001
```

### Database connection error?
Check `.env.local` DATABASE_URL matches your PostgreSQL setup

### Prisma errors?
```bash
npx prisma generate
npx prisma db push
```

### Need help?
1. Check `README.md` for detailed docs
2. See `SETUP_GUIDE.md` for complete setup
3. Review `DEPLOYMENT.md` for deployment help

---

## 🎨 Customization

### Change App Name
1. Edit `next.config.ts` - Change title
2. Update `src/components/Header.tsx` - Change logo text
3. Modify `public/` folder - Replace logo image

### Change Colors
- Update `src/globals.css` for Tailwind theme
- Change color scheme in components (currently blue/purple)

### Add Your Logo
- Replace `public/` images
- Update Header component

---

## 📖 Full Guides Available

- **Setup Guide**: `SETUP_GUIDE.md` - Complete 4-app architecture guide
- **Deployment**: `DEPLOYMENT.md` - Production deployment instructions
- **Architecture**: `README.md` - Technical documentation

---

## 💡 Tips

1. **Development Faster**: Use `npm run dev` with auto-reload
2. **View Database**: `npx prisma studio` opens visual DB explorer
3. **Make API Calls**: Use `src/lib/api.ts` APIClient singleton
4. **State Management**: Use Zustand stores in `src/store/`
5. **Type Safety**: All components are TypeScript - leverage types!

---

## 🎯 Success Check

Your app is working if you can:
- [ ] Load homepage at `http://localhost:3000`
- [ ] See "Search products" bar
- [ ] Click "Register" and create account
- [ ] Add products to cart
- [ ] View cart with total price

---

## 🚢 Deploy When Ready

Once core features look good:

```bash
# Build for production
npm run build

# Test production build
npm start

# Deploy to Vercel (if you push to GitHub first)
vercel --prod
```

---

**Happy coding! 🚀 Start with homepage, expand to features.**

Need production-level features? Check `SETUP_GUIDE.md` for the full 4-app business model!
