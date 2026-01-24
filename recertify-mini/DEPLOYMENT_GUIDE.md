# Recertify Mini - Setup & Deployment Guide

## Local Development Setup

### Step 1: Installation
```bash
cd recertify-mini
npm install
# If npm install hangs, use:
npm install --legacy-peer-deps --prefer-offline
```

### Step 2: Run Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:3000`

### Step 3: Testing in Telegram
To test in Telegram Mini App environment:

1. Create a Telegram bot using @BotFather
2. Set bot URL to your local tunnel (ngrok, cloudflare tunnel, etc.)
3. Access via: `https://t.me/YOUR_BOT_USERNAME/app`

## Build & Deployment

### Production Build
```bash
npm run build
npm start
```

### Deployment Platforms

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### AWS/Railway/Heroku
```bash
# Push to git repository and connect to platform
# Platform will auto-detect Next.js and build correctly
```

## Environment Variables

Create `.env.local`:
```env
# Telegram Bot
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=your_bot_token_here
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username

# TON Network (Testnet for development)
NEXT_PUBLIC_TON_ENDPOINT=https://testnet.toncenter.com/api/v2/jsonRPC
NEXT_PUBLIC_TON_NETWORK=testnet

# API Base URL
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Development Checklist

- [ ] Node.js 18+ installed
- [ ] npm install completed successfully
- [ ] TypeScript compiles (npm run type-check)
- [ ] Dev server starts (npm run dev)
- [ ] All pages render without console errors
- [ ] Bottom navigation switches between tabs smoothly
- [ ] Material Design 3 theme applied correctly
- [ ] Animations play smoothly (60fps)
- [ ] Responsive design works on mobile view

## Testing

### Manual Testing Checklist
- [ ] Navigation between all 5 tabs works
- [ ] Home page displays hero and project grid
- [ ] Quiz page shows quiz cards with filters
- [ ] Leaderboard shows user rankings
- [ ] Tasks display with completion tracking
- [ ] Profile shows user stats and achievements
- [ ] Dark/Light theme toggle works
- [ ] All animations are smooth
- [ ] No console errors or warnings
- [ ] Responsive on mobile (375px width)

### Browser DevTools Testing
```javascript
// Test Telegram API availability
window.Telegram?.WebApp?.ready()

// Get mock Telegram user
window.Telegram?.WebApp?.initDataUnsafe?.user
```

## Performance Monitoring

### Lighthouse Audit
```bash
# Run Google Lighthouse
npm run build
npm start
# Then audit at http://localhost:3000 in Chrome DevTools
```

### Bundle Analysis
```bash
# Analyze bundle size
npm install --save-dev @next/bundle-analyzer
# Then add to next.config.js and run build
```

## Troubleshooting

### Issue: npm install hangs
```bash
# Solution: Use legacy peer deps
npm install --legacy-peer-deps --prefer-offline

# Or clear cache
npm cache clean --force
npm install
```

### Issue: Module not found errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 3000 already in use
```bash
# Use different port
npm run dev -- -p 3001
```

### Issue: TypeScript errors after changes
```bash
# Run type check
npm run type-check

# Fix build
npm run build
```

### Issue: Material UI theme not applying
- Check ThemeProvider wraps entire app
- Verify CssBaseline is imported
- Check browser DevTools for CSS being applied
- Verify Roboto font is loaded (Google Fonts)

## Database/Backend Setup (Future)

When moving from mock data to real backend:

### 1. Set up database
```bash
# Example with Prisma
npm install @prisma/client
npx prisma init

# Configure .env with DATABASE_URL
# Create schema.prisma
# Run migrations: npx prisma migrate dev
```

### 2. Create API routes
```typescript
// app/api/quizzes/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Query database
  // Return quiz data
}
```

### 3. Update components
```typescript
// Replace mock data imports with API calls
const { data: quizzes } = await fetchQuizzes();
```

## Deployment Checklist

- [ ] All environment variables set
- [ ] TypeScript type-check passes
- [ ] Build completes without errors
- [ ] No console errors in production build
- [ ] All pages accessible
- [ ] Navigation works
- [ ] Animations smooth
- [ ] Images optimized
- [ ] API endpoints responding
- [ ] Error boundaries in place
- [ ] Analytics/tracking working
- [ ] Security headers configured

## Production Optimization

### Image Optimization
```typescript
import Image from 'next/image';

// Always use Next.js Image component
<Image src="/icon.png" alt="..." width={48} height={48} />
```

### Code Splitting
```typescript
import dynamic from 'next/dynamic';

// Lazy load heavy components
const QuizRunner = dynamic(() => import('@/components/quiz/QuizRunner'));
```

### CSS Optimization
```typescript
// MUI already handles CSS optimization with emotion
// All styles are generated at build time
```

## Monitoring & Logs

### Enable debug mode
```env
DEBUG=recertify:*
```

### Monitor errors
```typescript
// Add error boundary
import { ErrorBoundary } from 'react-error-boundary';

// Wrap pages with error handling
```

### Analytics
```typescript
// Track user interactions
import { TelegramAnalytics } from '@/lib/telegram';

TelegramAnalytics.trackEvent('page_view', { page: 'home' });
```

## Next Steps

1. **Complete MVP**: Finish implementing quiz runner
2. **User Testing**: Test with real Telegram users
3. **Backend Setup**: Migrate from mock data to real API
4. **Telegram Bot**: Create bot for notifications and sharing
5. **TON Integration**: Implement real reward distribution
6. **Analytics**: Set up analytics tracking
7. **Launch**: Deploy to production

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Material UI v7](https://mui.com/)
- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
- [TON Blockchain](https://ton.org/)
- [Framer Motion](https://www.framer.com/motion/)

## Support

For questions or issues:
1. Check existing GitHub issues
2. Review logs in production
3. Contact development team
4. Create detailed bug report with reproduction steps
