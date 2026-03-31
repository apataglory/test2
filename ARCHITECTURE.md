# Deckdrop Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      DECKDROP ECOSYSTEM                          │
└─────────────────────────────────────────────────────────────────┘

                        ┌─────────────────┐
                        │  Admin App      │
                        │  (Dashboard)    │
                        └────────┬────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
┌───────▼────────┐   ┌──────────▼─────────┐   ┌──────────▼──────┐
│ Customer Web   │   │ Rider Mobile App   │   │ Store Portal    │
│ (Next.js)      │   │ (React Native)     │   │ (Next.js)       │
└───────┬────────┘   └──────────┬─────────┘   └──────────┬──────┘
        │                       │                        │
        └───────────────────────┼────────────────────────┘
                                │
                    ┌───────────▼──────────┐
                    │  API Server         │
                    │  (Next.js Routes)   │
                    │  - /api/auth        │
                    │  - /api/products    │
                    │  - /api/orders      │
                    │  - /api/riders      │
                    │  - /api/tracking    │
                    └───────────┬─────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
        ┌───────▼─────┐ ┌──────▼──────┐ ┌──────▼────────┐
        │ PostgreSQL  │ │ Redis Cache │ │ JWT Auth     │
        │ Database    │ │ (Optional)  │ │ System       │
        └─────────────┘ └─────────────┘ └─────────────┘

External Services:
├── Flutterwave (Payments)
├── SendGrid (Email)
├── Google Maps API (Tracking)
└── Socket.io (Real-time)
```

## Data Flow

### User Places Order

```
1. Customer Web App
   └─> User searches products
       └─> Frontend calls /api/products/search
           └─> Prisma queries PostgreSQL
               └─> Returns results
   
2. User adds to cart (Zustand Store - Client Side)
   
3. User clicks "Checkout"
   └─> Frontend validates
       └─> Calls /api/orders (POST)
           └─> API validates
               └─> Creates Order record
                   └─> Creates OrderItems
                       └─> Sends notification
                           └─> Returns Order ID

4. User pays via Flutterwave
   └─> Payment gateway processes
       └─> Webhook calls /api/webhooks/payment
           └─> Updates paymentStatus to COMPLETED
               └─> Triggers notification

5. Rider App notified
   └─> Socket.io emits 'NEW_ORDER'
       └─> Available riders see notification
           └─> Rider accepts order
               └─> Order status changes to RIDER_ASSIGNED

6. Real-time tracking
   └─> Rider location updates
       └─> Socket.io emits LOCATION_UPDATE
           └─> Customer web app receives
               └─> Map updates in real-time
```

## Component Architecture

### Frontend Components (`src/components/`)

```
Header
├── Navigation links
├── Cart badge
├── User menu
└── Mobile menu

SearchBar
├── Search input
├── Category filter
├── Price range filter
└── Distance filter

ProductCard
├── Product image
├── Product name
├── Store info
├── Price display
├── Add to cart button
└── Quantity selector

Cart (Page)
├── Cart items list
├── Item quantity controls
├── Delivery address input
├── Order summary
└── Checkout button
```

### Pages (`src/app/`)

```
/                    -> Home (Product listing)
/auth/login          -> Login form
/auth/register       -> Registration form
/cart                -> Shopping cart
/orders              -> Order history
/orders/[id]         -> Order details & tracking

/api/auth/login      -> POST - Authenticate
/api/auth/register   -> POST - Create account
/api/products/search -> GET - Search products
/api/orders          -> GET/POST - Orders
/api/tracking        -> GET - Live tracking
```

## State Management (Zustand Stores)

### useAuthStore
```javascript
{
  user: User | null,
  token: string | null,
  isAuthenticated: boolean,
  login(user, token),
  logout(),
  initialize()
}
```

### useCartStore
```javascript
{
  items: CartItem[],
  addItem(item),
  removeItem(productId),
  updateQuantity(productId, qty),
  getTotal(),
  clear()
}
```

### useLocationStore
```javascript
{
  latitude: number,
  longitude: number,
  address: string,
  setLocation(lat, lng, address),
  clearLocation()
}
```

### useNotificationStore
```javascript
{
  notifications: Notification[],
  addNotification(notification),
  removeNotification(id),
  markAsRead(id),
  clear()
}
```

## Database Schema

### Core Tables

```
Users (Customers)
├── id, email, phone, name
├── password (bcrypt hashed)
├── role (CUSTOMER, STORE_OWNER, ADMIN)
└── addresses

Stores
├── id, name, phone, address
├── latitude, longitude
├── category, isRegistered
└── products

Products
├── id, name, description
├── storeId
├── basePrice, deliveryFee
├── sector, availability
└── image

Orders
├── id, customerId, riderId
├── deliveryAddress, deliveryLat, deliveryLng
├── subtotal, deliveryFee, total
├── status, paymentStatus
└── createdAt, updatedAt

OrderItems
├── id, orderId, productId, storeId
├── quantity, pricePerUnit, total
└── createdAt

Riders
├── id, phone, email, name
├── latitude, longitude
├── isAvailable, rating
└── verified

Notifications
├── id, userId, orderId
├── title, message, type
├── read
└── createdAt

TrackingUpdates
├── id, orderId
├── latitude, longitude
├── status, message
└── createdAt
```

## API Route Structure

### Authentication
```
POST /api/auth/register
  Body: { email, phone, name, password, passwordConfirm }
  Returns: { user, token }

POST /api/auth/login
  Body: { email, password }
  Returns: { user, token }
```

### Products
```
GET /api/products/search?q=rice&sector=EATABLES&page=1&limit=20
  Returns: { products[], total, page, limit, pages }
```

### Orders
```
POST /api/orders
  Headers: { Authorization: "Bearer token" }
  Body: { items[], deliveryAddress, deliveryLat, deliveryLng }
  Returns: { order }

GET /api/orders
  Headers: { Authorization: "Bearer token" }
  Returns: { orders[] }

GET /api/orders/[id]
  Returns: { order with tracking updates }
```

### Payments (Webhook)
```
POST /api/webhooks/flutterwave
  Body: { transaction data }
  Updates: Order payment status
```

## Authentication Flow

```
1. User Registration
   User Input -> Validate -> Hash Password -> Create User -> Return Token

2. User Login
   Email + Password -> Find User -> Verify Password -> Generate JWT -> Return Token

3. Protected Requests
   Include Token -> Middleware Validates -> Extract User ID -> Process Request

4. Token Storage
   localStorage['authToken'] -> Retrieved on app load -> Auto-login
```

## Real-Time Updates (Socket.io)

```
Client Connection
├── Rider connects with riderId
├── Customer connects with orderId
└── Server joins rooms

Events
├── LOCATION_UPDATE (Rider sends location)
├── ORDER_STATUS_CHANGE (Order updated)
├── NEW_ORDER (Sent to riders)
├── ORDER_ACCEPT (Rider accepted)
└── ORDER_DELIVERED (Delivery complete)
```

## Deployment Architecture

### Development
```
Local Machine
├── npm run dev
├── PostgreSQL (local)
└── http://localhost:3000
```

### Production
```
Vercel (Frontend + API)
├── Next.js App
├── API Routes
├── Edge Middleware
└── Automatic Deployments

PostgreSQL Managed Database
├── Vercel Postgres OR
├── Railway OR
├── AWS RDS
└── Automated Backups

Flutterwave
└── Payment Processing
```

## Error Handling

### Client-Side
```javascript
try {
  const response = await apiClient.get('/endpoint');
  if (!response.success) {
    // Show error toast
  }
} catch (error) {
  // Network error
}
```

### Server-Side
```javascript
try {
  // Process request
  return NextResponse.json({ success: true, data: result });
} catch (error) {
  console.error(error);
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

## Performance Optimization

### Frontend
- Image optimization (Next.js Image component)
- Code splitting (automatic)
- CSS-in-JS (Tailwind utility-first)
- Lazy loading (useCallback)

### Backend
- Database indexing on frequently queried fields
- Pagination (20 items per page)
- Response caching (optional Redis)
- Query optimization (select only needed fields)

### Deployment
- CDN distribution (Vercel Edge Network)
- Gzip compression (automatic)
- Minification (automatic)
- Production build optimization

## Security Measures

1. **Authentication**
   - JWT tokens with expiration
   - Password hashing with bcrypt
   - Secure cookie storage

2. **Data Protection**
   - HTTPS everywhere
   - Environment variables (secrets)
   - Input validation
   - CORS configuration

3. **API Security**
   - Middleware authentication checks
   - Rate limiting (optional)
   - Secure payment webhooks
   - SQL injection prevention (Prisma)

## Scalability Path

### Phase 1 (Current)
- Single database
- Monolithic API routes
- Local caching

### Phase 2
- Read replicas for database
- Separate microservices
- Redis caching layer

### Phase 3
- Message queue (Bull/Redis)
- Worker processes
- Distributed tracing

### Phase 4
- Kubernetes deployment
- Load balancing
- Auto-scaling

## Monitoring & Analytics

- **Vercel Analytics**: Built-in performance metrics
- **Sentry**: Error tracking and debugging
- **UptimeRobot**: Uptime monitoring
- **LogRocket**: User session recording (optional)

---

**This architecture is designed to be scalable, maintainable, and easily deployable.**

For deployment details, see `DEPLOYMENT.md`
For setup instructions, see `SETUP_GUIDE.md`
