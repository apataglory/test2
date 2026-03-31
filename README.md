# Deckdrop - Multi-Store Delivery Marketplace

A modern, fast, and reliable logistics-driven marketplace connecting customers with local stores and delivery riders. Built with Next.js, React, TypeScript, Prisma, and PostgreSQL.

## 🚀 Features

### Customer Features
- 🔍 **Product Search** - Search across multiple local stores with advanced filtering
- 🛒 **Smart Cart** - Add products from multiple stores, automatic cart management
- 📍 **Location-Based** - Find nearest stores and track delivery in real-time
- 💳 **Flutterwave Payment** - Secure payments with Nigeria's leading payment gateway
- 📱 **Real-Time Tracking** - Track your order and rider location live
- 📧 **Notifications** - Get updates on order status via email and push notifications
- ⭐ **Ratings & Reviews** - Rate your delivery experience

### Coming Soon
- Rider application with real-time tracking
- Store portal for vendor management
- Admin dashboard for platform oversight

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework for production
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **TanStack Query** - Server state management
- **Lucide React** - Beautiful SVG icons

### Backend
- **Next.js API Routes** - Serverless API functions
- **Prisma ORM** - Modern database management
- **PostgreSQL** - Powerful SQL database
- **JWT** - Secure authentication
- **Bcrypt** - Password hashing

### Payments & Integration
- **Flutterwave** - Payment gateway
- **Leaflet** - Map visualization
- **Socket.io** - Real-time updates

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 12+
- Flutterwave account (free)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
Create `.env.local`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/deckdrop"
JWT_SECRET="your-secret-key"
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY="your_test_key"
FLUTTERWAVE_SECRET_KEY="your_secret_key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
NODE_ENV="development"
```

### 3. Set Up Database
```bash
npx prisma migrate dev --name init
```

### 4. Start Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📝 API Endpoints

- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/products/search` - Search products  
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders

See [API documentation](./docs/API.md) for details.

## 📁 Project Structure

```
src/
├── app/api/           # Backend API routes
├── components/        # React components
├── hooks/            # Custom hooks
├── lib/              # Utilities
├── store/            # State management
└── types/            # TypeScript types
```

## 🔐 Authentication

Uses JWT tokens stored in localStorage. All authenticated requests include the token in headers.

## 💳 Payment

Integrated with Flutterwave for secure payments. Test keys available in dashboard.

## 🚀 Deployment

Deploy to Vercel by connecting your Git repository. Environment variables are configured in the Vercel dashboard.

## 📱 Demo

**Test Credentials:**
- Email: demo@deckdrop.com
- Password: demo123456

## 🤝 Contributing

Contributions welcome! Fork, create a feature branch, and submit a pull request.

## 📞 Support

- Email: support@deckdrop.com
- WhatsApp: +234 800 123 4567

## 📜 License

MIT License - See LICENSE file for details.

---

**Built with ❤️ by the Deckdrop Team**
