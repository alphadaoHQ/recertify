# Recertify Mini - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install & Start
```bash
cd recertify-mini
npm install  # Wait for this to complete
npm run dev
```

Open `http://localhost:3000` in your browser.

### 2. Explore the App
- **Home** (House icon) - View projects and hero section
- **Quiz** (Question icon) - Browse quizzes by category  
- **Leaderboard** (Trophy icon) - See rankings
- **Tasks** (Send icon) - Complete social tasks
- **Profile** (Person icon) - View your stats

### 3. Build for Production
```bash
npm run build
npm start
```

## 📱 Telegram Testing

### Option 1: Telegram Web
1. Open Telegram Web (web.telegram.org)
2. Go to @BotFather and create a bot
3. Get your bot token
4. Add bot to your account
5. Access mini app via bot menu

### Option 2: Local Testing
1. Use ngrok or cloudflare tunnel for local tunneling
2. Set bot webhook to your tunnel URL
3. Test in Telegram client

## 🎨 Understanding the Design

### Pages
| Page | Purpose | Key Features |
|------|---------|--------------|
| Home | Browse projects | Hero section, project grid, filters |
| Quiz | Find quizzes | Category filter, difficulty badges |
| Leaderboard | Competitive rankings | Top 3 podium, full rankings |
| Tasks | Earn bonus points | Share, invite, review, follow |
| Profile | User dashboard | Stats, achievements, wallet |

### Key Components
- **HeroSection** - User stats dashboard
- **ProjectGrid** - Project cards with ratings
- **BottomNav** - Tab navigation
- **ThemeProvider** - Light/dark theme

## 🛠️ Development

### File Locations
- **Pages**: `src/app/*/page.tsx`
- **Components**: `src/components/*/`
- **Data**: `src/lib/*Data.ts`
- **Types**: `src/types/index.ts`
- **Theme**: `src/lib/theme/index.ts`

### Useful Commands
```bash
npm run type-check    # Check TypeScript errors
npm run lint          # Lint code
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
```

## 💡 Common Tasks

### Add a New Project
Edit `src/lib/projectData.ts`:
```typescript
{
  id: 'new-project',
  title: 'Project Title',
  description: 'Description',
  icon: '🎯',
  category: 'DeFi',
  difficulty: 'Beginner',
  estimatedTime: '45 min',
  pointsReward: 100,
  progress: 0,
  quizCount: 3,
  learningModules: [],
  tags: ['tag1', 'tag2'],
  rating: 4.8,
  completedCount: 100,
}
```

### Add a New Quiz
Edit `src/lib/quizData.ts`:
```typescript
{
  id: 'quiz-id',
  title: 'Quiz Title',
  description: 'Description',
  projectId: 'project-id',
  category: 'DeFi',
  difficulty: 'Intermediate',
  estimatedTime: 15,
  points: 75,
  questions: [
    {
      id: 'q1',
      question: 'Question text?',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0,
      explanation: 'Explanation'
    }
  ],
  socialProof: {
    completedCount: 500,
    averageScore: 85,
    rating: 4.8
  }
}
```

### Change Theme Colors
Edit `src/lib/theme/index.ts`:
```typescript
primary: {
  main: '#6750A4',  // Change here
  light: '#EADDFF',
  dark: '#4F378B',
}
```

### Modify Navigation
Edit `src/components/common/BottomNav.tsx`:
```typescript
const navigationItems = [
  { label: 'Home', path: '/', icon: HomeIcon },
  // Add/remove items here
];
```

## 🐛 Troubleshooting

### Page doesn't load
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Styles not applying
- Check ThemeProvider wraps the component
- Verify CssBaseline is imported
- Check DevTools for CSS being loaded

### Type errors
```bash
npm run type-check
# Fix errors shown in output
```

### Navigation not working
- Check BottomNav is in layout.tsx
- Verify routes exist in `src/app/*/page.tsx`
- Check no special characters in route names

## 📚 Resources

- [Next.js Docs](https://nextjs.org/)
- [Material UI Docs](https://mui.com/)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)

## 🎓 Learning Path

1. **Understand the Structure** - Explore `src/` directory
2. **Run the App** - `npm run dev`
3. **Modify Components** - Change colors, text, layouts
4. **Add Mock Data** - Create new projects/quizzes
5. **Connect to Backend** - Replace mock data with API
6. **Deploy** - Push to Vercel or your server

## 🚀 Next Steps

1. **Add Quiz Runner** - Create quiz taking experience
2. **Connect API** - Replace mock data with backend
3. **User Authentication** - Implement Telegram login
4. **Telegram Bot** - Create bot for sharing
5. **Deploy** - Launch to production
6. **User Testing** - Get feedback from real users
7. **Iterate** - Improve based on feedback

## 💬 Getting Help

- Check existing code for patterns
- Review comments in source code
- Read comprehensive docs in repo root
- Check error messages in console
- Test in multiple browsers

## 📊 Project Stats

| Metric | Value |
|--------|-------|
| Pages | 5 |
| Components | 10+ |
| Lines of Code | 3000+ |
| TypeScript Coverage | 100% |
| Mobile Optimized | Yes |
| Dark Mode | Yes |
| Animations | Yes |

## 🎉 You're Ready!

Start building with:
```bash
npm run dev
```

Then open http://localhost:3000 and explore! 🚀

---

**Happy coding!** If you have questions, check the comprehensive documentation in the repo root directory.
