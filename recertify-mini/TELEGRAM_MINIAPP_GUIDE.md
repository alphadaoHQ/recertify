# Telegram Mini App Deployment Guide for Recertify Mini

## 🤖 Overview

Recertify Mini is a **Telegram Mini App** - a web application that runs inside Telegram. This guide covers deploying and integrating it with Telegram's Bot API.

---

## 📋 Prerequisites

1. **Telegram Bot** - Created via @BotFather
2. **Domain/Hosting** - HTTPS required (Vercel, Netlify, etc.)
3. **Next.js Project** - Already configured
4. **Telegram Mini App SDK** - `@twa-dev/sdk` (already installed)

---

## 🔧 Step 1: Create Telegram Bot

### Create Bot via @BotFather

1. Open Telegram and chat with **@BotFather**
2. Send `/newbot`
3. Follow prompts:
   - **Name**: Recertify Mini Bot
   - **Username**: `recertify_mini_bot` (must be unique)
4. **Copy the token** (you'll need this)
   ```
   Example: 123456789:ABCDefGHIjklmnoPQRstuvwxyzABCDEfgh
   ```

### Enable Inline Mode (Optional)
```
/mybots → Select bot → Inline Mode → Enable
```

---

## 🌐 Step 2: Deploy to HTTPS

### Option A: Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd recertify-mini
vercel

# During deployment:
# - Select project name: recertify-mini
# - Select framework: Next.js
# - Build settings: default
# - Environment variables: see next section
```

**Get your deployment URL:**
```
https://recertify-mini.vercel.app
```

### Option B: Netlify

```bash
# Build first
npm run build

# Deploy
netlify deploy --prod --dir=.next
```

### Option C: Self-hosted with Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🔐 Step 3: Environment Variables

Create `.env.local` in `recertify-mini/`:

```env
# Telegram Bot
NEXT_PUBLIC_BOT_TOKEN=YOUR_BOT_TOKEN_HERE
NEXT_PUBLIC_MINIAPP_URL=https://recertify-mini.vercel.app
NEXT_PUBLIC_BOT_USERNAME=recertify_mini_bot

# Telegram API
TELEGRAM_API_URL=https://api.telegram.org/botYOUR_BOT_TOKEN/

# Optional: Database
DATABASE_URL=your_database_url
WEBHOOK_SECRET=your_webhook_secret
```

**In Vercel:**
1. Go to Project Settings → Environment Variables
2. Add each variable
3. Redeploy

---

## 🎮 Step 4: Set Mini App URL

### Via BotFather

```
/mybots → Select bot → Menu Button → Web App
```

Or use Telegram Bot API:

```bash
curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/setChatMenuButton" \
  -H "Content-Type: application/json" \
  -d '{
    "menu_button": {
      "type": "web_app",
      "text": "🎓 Learn",
      "web_app": {
        "url": "https://recertify-mini.vercel.app"
      }
    }
  }'
```

### Alternatively: Inline Button

Create a button in your bot response:

```javascript
const keyboard = {
  inline_keyboard: [[
    {
      text: "🎓 Open Recertify",
      web_app: { url: "https://recertify-mini.vercel.app" }
    }
  ]]
};
```

---

## 🚀 Step 5: Test Mini App

### In Telegram Desktop/Web

1. Open your bot: `@recertify_mini_bot`
2. Click the menu button or "Open Recertify"
3. Mini app should load

### Verify Telegram Context

Add this to `src/app/page.tsx` to verify:

```typescript
import { useTelegramApp } from '@/lib/telegram';

export default function Home() {
  const telegramApp = useTelegramApp();
  
  useEffect(() => {
    console.log('Telegram User:', telegramApp.user);
    console.log('Is Mini App:', telegramApp.isMiniApp);
  }, []);
  
  // ... rest of component
}
```

---

## 🔗 Step 6: Configure Webhook (Optional)

For receiving bot messages:

```bash
curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://recertify-mini.vercel.app/api/telegram/webhook"
  }'
```

**Verify webhook:**

```bash
curl "https://api.telegram.org/botYOUR_BOT_TOKEN/getWebhookInfo"
```

---

## 📱 Mini App Features (Already Implemented)

### TelegramApp Class
```typescript
// Get user info
const user = TelegramApp.getUser();
// {
//   id: number,
//   first_name: string,
//   last_name?: string,
//   username?: string,
//   language_code?: string,
//   photo_url?: string
// }

// Share to chat
TelegramApp.shareToChat("🎉 I just completed DeFi Fundamentals!");

// Trigger Telegram feedback
TelegramApp.vibrate();
TelegramApp.triggerHaptic('success');

// Close app
TelegramApp.closeApp();
```

### TONWalletAPI Class
```typescript
// Connect wallet
const address = await TONWalletAPI.connectWallet();

// Get balance
const balance = await TONWalletAPI.getBalance(address);

// Send transaction
const txHash = await TONWalletAPI.sendTransaction({
  to: '0x...',
  amount: 1000000,
  payload: 'certificate_token'
});
```

### Analytics
```typescript
// Track events
TelegramAnalytics.trackEvent('quiz_completed', {
  quizId: 'defi-intro-quiz',
  score: 95,
  points: 150
});

// Track pages
TelegramAnalytics.trackPage('/quiz/defi-intro-quiz');
```

---

## 🎯 Step 7: Configure Mini App Settings

### In BotFather

```
/mybots → Select bot → Menu Button → Settings
```

**Recommended Settings:**

| Setting | Value |
|---------|-------|
| Short Name | Recertify |
| Description | Learn Web3 & Blockchain |
| Tall Mode | Yes |
| Responsive Web View | Yes |
| Full Screen | Yes |

### Via API

```bash
curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/setMyName" \
  -H "Content-Type: application/json" \
  -d '{"name": "Recertify Mini"}'

curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/setMyDescription" \
  -H "Content-Type: application/json" \
  -d '{"description": "Learn Web3, Blockchain & Crypto through interactive quizzes"}'
```

---

## 📊 Step 8: Add Bot Commands

```bash
curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/setMyCommands" \
  -H "Content-Type: application/json" \
  -d '{
    "commands": [
      {"command": "start", "description": "Start using Recertify"},
      {"command": "help", "description": "Get help"},
      {"command": "stats", "description": "View your stats"},
      {"command": "refer", "description": "Get referral link"}
    ]
  }'
```

---

## 🔄 Step 9: User Data Flow

```
User Opens Bot
  ↓
Clicks "Open Recertify"
  ↓
Mini App Loads (src/app/page.tsx)
  ↓
Telegram SDK Initializes
  ↓
useUserStore retrieves user from Telegram
  ↓
User starts learning
  ↓
Quiz completion
  ↓
Points awarded
  ↓
Optional: Send achievement to chat
```

---

## 📡 API Webhook Handler

Your webhook already handles:

```typescript
// POST /api/telegram/webhook

// Supported commands:
/start    - Welcome message
/help     - Help information
/stats    - User statistics
/refer    - Referral link

// Button callbacks
callback_query - Handle button clicks
```

**Example response:**

```typescript
{
  type: 'message',
  text: '📚 Welcome to Recertify!\n\nLearn Web3 & Blockchain through interactive quizzes.',
  keyboard: {
    inline_keyboard: [[
      {
        text: '🎓 Open App',
        web_app: { url: 'https://recertify-mini.vercel.app' }
      }
    ]]
  }
}
```

---

## 🧪 Testing Checklist

- [ ] Bot created and token obtained
- [ ] App deployed to HTTPS URL
- [ ] Mini App URL set in bot settings
- [ ] Telegram context loads (user data visible)
- [ ] All 5 tabs work in mini app
- [ ] Quizzes can be completed
- [ ] Points tracked
- [ ] Certificates generated
- [ ] Share functionality works
- [ ] Wallet connection works
- [ ] Dark/Light theme works
- [ ] No console errors
- [ ] Responsive on mobile

---

## 🔐 Security Best Practices

### 1. Validate Telegram User

```typescript
import crypto from 'crypto';

export function validateTelegramAuth(data: Record<string, string>, token: string) {
  const dataCheckString = Object.keys(data)
    .filter(key => key !== 'hash')
    .sort()
    .map(key => `${key}=${data[key]}`)
    .join('\n');
  
  const secretKey = crypto
    .createHash('sha256')
    .update(token)
    .digest();
  
  const hash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');
  
  return hash === data.hash;
}
```

### 2. Verify User ID

```typescript
// Always verify the user ID from Telegram context
const telegramUser = TelegramApp.getUser();
if (!telegramUser || !telegramUser.id) {
  // Reject request
  return NextResponse.json({ error: 'Invalid user' }, { status: 401 });
}
```

### 3. Store User Securely

```typescript
// Never expose sensitive data in frontend
// Use backend API to store:
- User ID (from Telegram)
- User stats
- Quiz results
- Certificates
```

### 4. HTTPS Only

- Mini app **must** be served over HTTPS
- Telegram validates SSL certificate
- Self-signed certificates not accepted

### 5. Rate Limiting

```typescript
// Implement rate limiting on rewards API
const rateLimit = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 10 // 10 requests per minute
});

app.post('/api/rewards', rateLimit, (req, res) => {
  // ...
});
```

---

## 📈 Analytics Setup

### Track User Events

```typescript
import { TelegramAnalytics } from '@/lib/telegram';

// Track quiz completion
TelegramAnalytics.trackEvent('quiz_completed', {
  quizId: 'defi-intro-quiz',
  score: 95,
  timeTaken: 300, // seconds
  difficulty: 'Beginner'
});

// Track page views
TelegramAnalytics.trackPage('/project/defi-basics');

// Track engagement
TelegramAnalytics.trackEvent('certificate_downloaded', {
  projectId: 'defi-basics',
  format: 'pdf'
});
```

---

## 🚨 Troubleshooting

### Issue: "Web App URL is invalid"

**Solution:**
- Verify URL is HTTPS
- Check domain is accessible
- Clear Telegram cache: Settings → Advanced → Clear Cache

### Issue: "User data not loading"

**Solution:**
```typescript
// Add to src/app/layout.tsx
useEffect(() => {
  const app = window.Telegram?.WebApp;
  if (app) {
    app.ready();
    console.log('Telegram ready:', app.initData);
  }
}, []);
```

### Issue: "Wallet connection fails"

**Solution:**
- Ensure TON Connect initialized
- Check network (mainnet/testnet)
- Verify user has TON wallet installed

### Issue: "Commands not showing"

**Solution:**
- Use BotFather to set commands
- Or call setMyCommands API
- Wait 1-2 minutes for cache update

---

## 📦 Production Deployment Checklist

- [ ] Environment variables set (token, URLs)
- [ ] Database configured (if using)
- [ ] SSL certificate valid
- [ ] Bot token secured (never in frontend code)
- [ ] Webhook verified
- [ ] Commands set via BotFather
- [ ] Mini App URL configured
- [ ] Menu button added
- [ ] Analytics tracking working
- [ ] Error logging enabled
- [ ] Rate limiting configured
- [ ] User validation working
- [ ] Performance optimized (Lighthouse 90+)
- [ ] Mobile responsiveness tested
- [ ] Dark/Light mode tested

---

## 🔄 CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install Vercel CLI
        run: npm install -g vercel
      
      - name: Deploy to Vercel
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
      
      - name: Update Telegram Bot
        run: |
          curl -X POST "https://api.telegram.org/bot${{ secrets.TELEGRAM_BOT_TOKEN }}/setWebhook" \
            -H "Content-Type: application/json" \
            -d '{"url": "https://recertify-mini.vercel.app/api/telegram/webhook"}'
```

---

## 📚 Resources

- [Telegram Bot API Docs](https://core.telegram.org/bots/api)
- [Telegram Web Apps](https://core.telegram.org/bots/webapps)
- [TON Connect UI](https://github.com/ton-connect/ton-connect-ui)
- [Vercel Deployment](https://vercel.com/docs)
- [Next.js 15 Docs](https://nextjs.org/docs)

---

## 🎯 What's Next?

### Phase 4: Production Optimization

1. **Database Integration**
   - Store user progress
   - Cache quiz results
   - Persist achievements

2. **Performance**
   - Image optimization
   - Code splitting
   - Caching strategy

3. **Monitoring**
   - Error tracking (Sentry)
   - Analytics (Segment, Amplitude)
   - User behavior (Mixpanel)

4. **Scaling**
   - Multi-region deployment
   - CDN integration
   - Database optimization

---

## ✅ Verification Commands

```bash
# Check bot exists
curl https://api.telegram.org/botYOUR_TOKEN/getMe

# Check webhook
curl https://api.telegram.org/botYOUR_TOKEN/getWebhookInfo

# Check commands
curl https://api.telegram.org/botYOUR_TOKEN/getMyCommands

# Send test message
curl -X POST https://api.telegram.org/botYOUR_TOKEN/sendMessage \
  -d "chat_id=YOUR_CHAT_ID&text=Test"
```

---

**Status**: ✅ Ready for Telegram Mini App Deployment
**Next**: Deploy to Vercel and configure with BotFather
**Estimated Time**: 10-15 minutes
