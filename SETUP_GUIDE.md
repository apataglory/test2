# Deckdrop Platform - Complete Setup Guide

## Overview

Deckdrop consists of 4 integrated applications:
1. **Customer Web App** (✅ Currently built) - Main user-facing marketplace
2. **Rider App** (📖 Coming next) - Delivery agent mobile app
3. **Store App** (Coming soon) - Vendor management portal
4. **Admin App** (Coming soon) - Platform administration dashboard

This document covers the setup and deployment of the entire ecosystem.

---

## Part 1: Customer Web App (COMPLETE)

### What's Included

✅ **Core Features** (Ready)
- Product search with advanced filtering by category, price, distance
- Multi-store shopping cart
- User authentication (register/login)
- Order creation and management
- Real-time order status tracking
- Notification system
- Flutterwave payment integration

✅ **Database Schema** (Prisma Models)
- Users, Stores, Products
- Orders, OrderItems
- Riders, Earnings, RideHistory
- Tracking, Notifications, Ratings

✅ **Infrastructure**
- TypeScript for type safety
- Zustand for state management
- Next.js API routes as backend
- Environment configuration

### Database Setup

#### Step 1: Install PostgreSQL

**Windows:**
1. Download from [postgresql.org](https://postgresql.org/download/windows)
2. Run installer
3. Remember the password you set for `postgres` user

**Mac:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
```

#### Step 2: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE deckdrop;

# List databases to verify
\l

# Exit psql
\q
```

#### Step 3: Update .env.local

Replace with your actual PostgreSQL credentials:
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/deckdrop"
```

#### Step 4: Run Migrations

```bash
# Run Prisma migrations
npx prisma migrate dev --name init

# This will:
# - Create all tables from schema.prisma
# - Generate Prisma Client
# - Create migration files
```

#### Step 5: Seed Database (Optional)

Create seed data for testing:

```bash
npx prisma db seed
```

You can create a `prisma/seed.ts` file if you want custom seed data.

### Get Flutterwave API Keys

1. Go to [flutterwave.com](https://flutterwave.com)
2. Create account (free)
3. Navigate to "Keys" in dashboard
4. Get test keys for development:
   - **FLWPUBK_TEST_...** (Public Key)
   - **FLWSECK_TEST_...** (Secret Key)
5. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY="FLWPUBK_TEST_..."
   FLUTTERWAVE_SECRET_KEY="FLWSECK_TEST_..."
   ```

### Running the Web App

```bash
# Development
npm run dev

# Built for production
npm run build
npm start

# Check for errors
npm run lint
```

Access at: `http://localhost:3000`

### Key Files to Know

**Authentication:**
- `src/lib/auth.ts` - JWT and password utilities
- `src/app/api/auth/login/route.ts` - Login endpoint
- `src/app/api/auth/register/route.ts` - Registration endpoint

**API Routes:**
- `src/app/api/products/search/route.ts` - Product search
- `src/app/api/orders/route.ts` - Order management

**Components:**
- `src/components/Header.tsx` - Navigation
- `src/components/ProductCard.tsx` - Product display
- `src/components/SearchBar.tsx` - Search interface

**Pages:**
- `src/app/page.tsx` - Home (product listing)
- `src/app/auth/login/page.tsx` - Login page
- `src/app/auth/register/page.tsx` - Registration page
- `src/app/cart/page.tsx` - Shopping cart
- `src/app/orders/page.tsx` - Order history

---

## Part 2: Rider App (Next Phase)

### What Will Be Built

The Rider App will be a **React Native** or **Flutter** application with:

**Features:**
- Real-time order notifications
- Map interface for pickup/delivery
- In-app navigation
- Status update management
- Earnings tracking
- Document verification
- Rating system

**Tech Stack:**
- React Native or Flutter
- Firebase for push notifications
- Google Maps API
- Real-time geolocation

### Preliminary Structure

```bash
# Future Commands
mkdir rider-app
cd rider-app

# For React Native
npx create-expo-app .

# Or for Flutter
flutter create .
```

---

## Part 3: Store App (Future Phase)

### What Will Be Built

A **Next.js** web application for store owners:

**Features:**
- Store registration
- Product management (add/edit/delete)
- Inventory tracking
- Order dashboard
- Analytics and reporting
- Customer ratings
- Profile management

### Tech Stack
- Next.js (same as customer app)
- Prisma for database
- PostgreSQL
- TailwindCSS

---

## Part 4: Admin App (Future Phase)

### What Will Be Built

An **Admin Dashboard** application:

**Features:**
- Platform-wide analytics
- User management
- Store verification
- Rider verification
- Order monitoring
- Dispute resolution
- Financial reports
- System configuration

### Tech Stack
- Next.js or React
- Redux for state management
- Recharts for analytics
- Vercel deployable

---

## 🚀 Deployment Guide

### Deploy Customer Web App to Vercel

**Option 1: Git Integration (Recommended)**

1. Push project to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/deckdrop-web
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Vercel auto-detects Next.js configuration
6. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `FLUTTERWAVE_PUBLIC_KEY`
   - `FLUTTERWAVE_SECRET_KEY`
7. Click "Deploy"

**Option 2: Vercel CLI**

```bash
# Install CLI
npm i -g vercel

# Deploy
vercel
```

Follow prompts and add environment variables when asked.

### Production Database Setup

For production, use Vercel's recommended services:

**Option 1: Vercel Postgres** (Integrated)
```bash
# Enable in Vercel dashboard
# Automatically provides DATABASE_URL
```

**Option 2: External Hosting**
- **Heroku Postgres**: heroku.com/postgres
- **AWS RDS**: aws.amazon.com/rds
- **Digital Ocean**: digitalocean.com/products/managed-databases
- **Railway**: railway.app

Update `DATABASE_URL` in Vercel Environment Variables.

### Custom Domain Setup

1. In Vercel dashboard → Settings → Domains
2. Add your domain (e.g., `www.deckdrop.com`)
3. Update DNS records as shown in Vercel dashboard
4. SSL certificate auto-provisioned (free)

---

## 🔒 Security Considerations

### Before Production

1. **Change JWT Secret**
   ```env
   JWT_SECRET="generate-a-strong-random-string"
   ```
   Generate strong secret: [random.org](https://www.random.org)

2. **Use Production Flutterwave Keys**
   - Replace test keys with live keys
   - Ensure FLUTTERWAVE_SECRET_KEY never exposed in frontend code

3. **Enable HTTPS**
   - Vercel automatically provides SSL
   - Enforce HTTPS in all requests

4. **Set CORS Headers**
   ```javascript
   // Already configured in API routes
   // Restrict to your domain only
   ```

5. **Rate Limiting**
   Consider adding packages:
   ```bash
   npm install next-rate-limit
   ```

6. **Input Validation**
   Already implemented in API routes using basic checks
   For production, add `zod` for schema validation:
   ```bash
   npm install zod
   ```

---

## 💰 Estimated Costs

### Free Tier Options (Development)
- ✅ Vercel - Free tier for Next.js
- ✅ PostgreSQL - Free tier on Railway or Render
- ✅ Flutterwave - Free test account
- ✅ GitHub - Free repositories
- ✅ Total: **$0** for development

### Production Estimates (Monthly)
- Vercel Pro - $20/month (for advanced features)
- PostgreSQL Managed DB - $25-50/month
- **Total: ~$50-70/month** (for small-medium scale)

---

## 🧪 Testing

### Test Flutterwave Payments

Use these test card numbers:
```
Visa:           4242 4242 4242 4242
MasterCard:     5399 8383 8383 8383
Expiry:         Any future date (MM/YY)
CVV:            Any 3 digits
```

### Test Users

**Customer Account:**
- Email: demo@deckdrop.com
- Password: demo123456

---

## 📋 Next Steps

1. ✅ **Complete**: Customer Web App
2. ⏳ **Phase 2**: Build Rider App
3. ⏳ **Phase 3**: Build Store App
4. ⏳ **Phase 4**: Build Admin App
5. ⏳ **Phase 5**: Mobile App (React Native)
6. ⏳ **Phase 6**: Marketing & Launch

---

## 🚨 Troubleshooting

### Issue: `DATABASE_URL is not set`
**Solution**: Ensure `.env.local` exists and has the correct DATABASE_URL

### Issue: `Module not found` errors
**Solution**: Run `npm install` again

### Issue: Port 3000 already in use
**Solution**: 
```bash
npm run dev -- -p 3001  # Use different port
```

### Issue: Prisma migration conflicts
**Solution**:
```bash
npx prisma migrate reset  # Reset database (removes all data)
```

---

## 📚 Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://prisma.io/docs
- **PostgreSQL Docs**: https://postgresql.org/docs
- **Flutterwave Docs**: https://developer.flutterwave.com
- **Tailwind CSS**: https://tailwindcss.com/docs

---

**Last Updated**: March 30, 2026

**Made with ❤️ by Deckdrop Team**
