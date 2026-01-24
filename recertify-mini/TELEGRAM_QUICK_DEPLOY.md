# Recertify Mini - Telegram Mini App Quick Deploy

## ⚡ 10-Minute Deployment

### Step 1: Create Bot (2 min)
```
1. Open Telegram → Search @BotFather
2. Send /newbot
3. Name: Recertify Mini Bot
4. Username: recertify_mini_bot (must be unique)
5. Copy the TOKEN
```

### Step 2: Deploy to Vercel (3 min)
```bash
# Install Vercel CLI globally (if not already)
npm install -g vercel

# Navigate to project
cd recertify-mini

# Deploy
vercel --prod

# Answer prompts:
# - Link to existing project? No
# - Project name? recertify-mini
# - Framework? Next.js
# - Build command? (default)
# - Install command? (default)

# Copy the deployment URL
# Example: https://recertify-mini.vercel.app
```

### Step 3: Set Environment Variables (2 min)

In Vercel dashboard:
1. Go to your project → Settings → Environment Variables
2. Add these:
```
NEXT_PUBLIC_BOT_TOKEN = YOUR_BOT_TOKEN
NEXT_PUBLIC_MINIAPP_URL = https://recertify-mini.vercel.app
NEXT_PUBLIC_BOT_USERNAME = recertify_mini_bot
```
3. Redeploy: `vercel --prod`

### Step 4: Configure Bot (3 min)

**Option A: Via BotFather (Easiest)**
```
Open @BotFather
/mybots → Select bot → Menu Button → Web App
Text: 🎓 Learn
URL: https://recertify-mini.vercel.app
```

**Option B: Via API (Manual)**
```bash
curl -X POST "https://api.telegram.org/botYOUR_TOKEN/setChatMenuButton" \
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

---

## ✅ Verification

### Test in Telegram
1. Open your bot: `@recertify_mini_bot`
2. Click menu button (should say "🎓 Learn")
3. Mini app should load
4. Verify user data shows in console

### Console Check
```javascript
// In browser console (F12):
console.log(window.Telegram);
console.log(window.Telegram.WebApp.initData);
```

---

## 🔧 File Locations (Already Done)

| Component | File |
|-----------|------|
| Telegram SDK Integration | `src/lib/telegram.ts` |
| User Store | `src/lib/store.ts` |
| API Webhook | `src/app/api/telegram/webhook/route.ts` |
| Home Layout | `src/app/layout.tsx` |

---

## 🌐 Telegram Integration Features

✅ **User Authentication**
- Auto-login via Telegram
- User data from Telegram profile
- Photo from Telegram avatar

✅ **Sharing**
- Share achievements to chat
- Share with friends
- Invite links

✅ **Wallet**
- TON wallet connection
- Send transactions
- Check balance

✅ **Analytics**
- Track events
- Page views
- User behavior

✅ **Notifications**
- In-app notifications
- Achievement alerts
- Level ups

---

## 📱 Mobile Optimization

Already implemented:
- ✅ Responsive design (320px+)
- ✅ Touch-friendly buttons
- ✅ Full screen support
- ✅ Safe area handling
- ✅ Dark/Light theme

---

## 🚀 Live Checklist

Before announcing:
- [ ] Bot username set correctly
- [ ] Mini app URL HTTPS
- [ ] Menu button shows and works
- [ ] User data loads
- [ ] All 5 tabs work
- [ ] Quizzes complete
- [ ] Points awarded
- [ ] Certificates generate
- [ ] Share works
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Dark theme works

---

## 📊 Deployment Confirmation

After deployment, verify:

```bash
# Test bot exists
curl https://api.telegram.org/botYOUR_TOKEN/getMe

# Should return:
# {
#   "ok": true,
#   "result": {
#     "id": 123456789,
#     "is_bot": true,
#     "first_name": "Recertify Mini Bot",
#     "username": "recertify_mini_bot",
#     ...
#   }
# }
```

---

## 💬 Share with Friends

Once deployed, share this link:
```
https://t.me/recertify_mini_bot
```

Friends can:
1. Click the link
2. Open in Telegram
3. Click "Start"
4. Click menu button to open app

---

## 🎯 Next Steps

After deployment:

1. **Announce** - Share bot link with users
2. **Monitor** - Check Telegram stats in BotFather
3. **Iterate** - Collect feedback from users
4. **Scale** - Add more content based on usage
5. **Monetize** - Add premium features (optional)

---

## 🔗 Useful Commands

```bash
# Redeploy after changes
vercel --prod

# Check deployment status
vercel status

# View logs
vercel logs

# Rollback to previous version
vercel rollback

# Check environment variables
vercel env ls
```

---

## ❓ Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Web App URL invalid" | Ensure HTTPS, not HTTP |
| "User data empty" | Refresh browser, clear cache |
| "Wallet not connecting" | User needs TON wallet installed |
| "Menu button not showing" | Wait 2 min, restart Telegram |
| "Build fails" | Run `npm install`, check `package.json` |

---

**Status**: 🚀 Ready to Deploy
**Time**: 10-15 minutes
**Difficulty**: Easy
**Next**: Open Telegram and test!
