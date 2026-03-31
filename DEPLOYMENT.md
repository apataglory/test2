# Deckdrop Deployment Guide

## Quick Deployment Checklist

- [ ] Verify all environment variables are set
- [ ] Run database migrations
- [ ] Test payment integration with Flutterwave test keys
- [ ] Run `npm run build` successfully
- [ ] Test production build locally with `npm start`
- [ ] Configure production database
- [ ] Switch to Flutterwave live keys
- [ ] Deploy to Vercel
- [ ] Configure custom domain
- [ ] Monitor errors in production

## Step-by-Step Deployment

### 1. Pre-Deployment Testing

```bash
# Run linting
npm run lint

# Build the project
npm run build

# Start production server locally
npm start
```

Test all critical flows:
- User registration
- User login
- Product search
- Add to cart
- Create order

### 2. Database Preparation

**For Vercel Postgres (Recommended):**

```bash
# Connect Vercel account
vercel link

# Push production schema
npx prisma generate
npx prisma migrate deploy
```

**For External Database:**

```bash
# Update DATABASE_URL in .env.production
DATABASE_URL="your_production_db_url"

# Run migrations
npx prisma migrate deploy
```

### 3. Environment Variables Setup

Add these to Vercel dashboard (Settings → Environment Variables):

```
DATABASE_URL = your_production_database_url
JWT_SECRET = generate_a_strong_random_string
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY = your_live_public_key
FLUTTERWAVE_SECRET_KEY = your_live_secret_key
NEXT_PUBLIC_APP_URL = https://yourdomain.com
NEXT_PUBLIC_API_URL = https://yourdomain.com/api
NODE_ENV = production
```

### 4. Deploy to Vercel

**Via CLI:**
```bash
npm install -g vercel
vercel --prod
```

**Via Git (Recommended):**
1. Push to GitHub
2. Go to vercel.com
3. Import repository
4. Add environment variables
5. Deploy

### 5. Post-Deployment

#### Domain Setup
1. Purchase domain (Namecheap, GoDaddy, etc.)
2. In Vercel → Settings → Domains
3. Add domain
4. Update DNS records as shown
5. Wait for DNS propagation (15 min - 48 hours)

#### Monitor Performance
```bash
# View real-time logs
vercel logs

# Check analytics
vercel analytics
```

#### Set up Monitoring
- Create free account on Sentry for error tracking
- Add to Vercel environment variables

```bash
npm install @sentry/nextjs
```

### 6. Performance Optimization

```bash
# Analyze bundle size
npm run build -- --analyze

# Enable caching
# Already configured in next.config.ts
```

## Production Checklist

### Security
- [ ] JWT secret is strong and unique
- [ ] Database has backups enabled
- [ ] HTTPS enforced
- [ ] API rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] CORS properly configured

### Functionality
- [ ] All pages load correctly
- [ ] Authentication works
- [ ] Search and filtering work
- [ ] Cart persists across sessions
- [ ] Payment processing works
- [ ] Notifications sent
- [ ] Admin can access all features

### Performance
- [ ] Page load time < 3 seconds
- [ ] First Contentful Paint < 1.5s
- [ ] Images optimized
- [ ] Database queries optimized

### Maintenance
- [ ] Daily backup schedule enabled
- [ ] Logs being collected
- [ ] Error monitoring active
- [ ] Performance metrics being tracked

## Scaling for High Traffic

### When you reach 100+ orders/day

1. **Database Optimization**
   ```bash
   # Add indexes to frequently queried fields
   npx prisma migrate dev --name add_indexes
   ```

2. **Enable Caching**
   ```bash
   npm install redis
   ```

3. **Implement CDN**
   - Vercel includes edge caching by default
   - Images automatically optimized via Image component

4. **Separate Read/Write Database**
   - Read replicas for search queries
   - Primary for write operations

### When you reach 1000+ orders/day

1. **Microservices Architecture**
   - Separate API for orders
   - Separate API for products
   - Separate API for notifications

2. **Message Queue** (for heavy operations)
   ```bash
   npm install bull redis
   ```

3. **Load Balancing**
   - Vercel handles automatically
   - No additional setup needed

## Rollback Strategy

If something goes wrong in production:

**Quick Rollback:**
1. Go to Vercel dashboard
2. Deployments tab
3. Click previous successful deployment
4. Click "Rollback"

**Git Rollback:**
```bash
git revert HEAD
git push
# Vercel auto-deploys from git
```

## 24/7 Uptime Monitoring

### Option 1: Vercel Analytics (Included)
- Built-in monitoring
- Real-time alerts

### Option 2: UptimeRobot (Free)
1. Go to uptimerobot.com
2. Add monitoring for https://yourdomain.com
3. Get alerts if site goes down

### Option 3: Sentry (Error Tracking)
```bash
npm install @sentry/nextjs
```

## Database Backups

### Automatic Backups
- Vercel Postgres: Auto backup daily
- Railway: Auto backup daily
- AWS RDS: Configurable backup retention

### Manual Backup
```bash
# Export all data
npx prisma generate
npx prisma db push --skip-generate

# Backup to file
pg_dump $DATABASE_URL > backup.sql
```

## Debugging Production Issues

### Check Logs
```bash
vercel logs --function=api
```

### Database Inspection
```bash
npx prisma studio --browser
```

### Performance Profiling
```bash
npm run build -- --profile
```

## Cost Optimization

### Reduce Bandwidth
- Image optimization (Next.js Image component)
- Compression (automatic via Vercel)
- Remove unused dependencies

### Reduce Database Calls
- Implement caching
- Use pagination (already done)
- Database connection pooling

### Monitor Costs
Track in Vercel dashboard → Settings → Billing

## Common Issues & Solutions

### Issue: 502 Bad Gateway
**Solution**: Check function logs for errors
```bash
vercel logs
```

### Issue: Slow Database Queries
**Solution**: 
```bash
npx prisma studio  # Inspect data
# Add indexes or optimize queries
```

### Issue: Out of Memory
**Solution**: 
- Add `--memory 3008` to function
- Split into multiple functions
- Use streaming for large responses

### Issue: Timeout Errors
**Solution**: 
- Increase timeout (default 30s for Vercel Pro)
- Optimize long-running queries
- Use background jobs for heavy lifting

## Support Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Prisma Deployment**: https://prisma.io/docs/concepts/overview/prisma-in-your-stack/deployment
- **PostgreSQL Backups**: https://postgresql.org/docs/current/backup
- **Flutterwave Production**: https://developer.flutterwave.com/

---

**Ready to launch? Follow this checklist and deploy with confidence!** 🚀

Need help? Check SETUP_GUIDE.md for additional information.
