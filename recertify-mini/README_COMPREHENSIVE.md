# Recertify Mini - Telegram Mini App

A modern, Material Design 3-powered Telegram mini app for learning Web3, blockchain, and cryptocurrency through interactive quizzes and project-based learning, inspired by bitdegree.org.

## Features

### MVP Features ✅
- **Material Design 3 Theme** - Modern, accessible UI with light/dark mode support
- **Home Tab** - Hero section with user stats, project discovery grid with filtering
- **Quiz Tab** - Category-based quiz browser with difficulty indicators and social proof
- **Leaderboard Tab** - Competitive rankings with top 3 podium and user statistics
- **Social Tasks Tab** - Shareable tasks for earning bonus points (share, invite, reviews)
- **Profile Tab** - User stats, achievements, TON wallet integration, and progress tracking
- **Bottom Navigation** - Smooth tab navigation with animated transitions
- **Responsive Design** - Mobile-first approach optimized for Telegram client

### Tech Stack
- **Frontend**: Next.js 15 + React 19 with TypeScript
- **UI Framework**: Material UI (MUI) v7 with Material Design 3
- **Animations**: Framer Motion for smooth interactions
- **Styling**: MUI System (emotion) with custom MD3 theme
- **Authentication**: TON Wallet integration
- **Telegram Integration**: Telegram Mini App SDK, sharing, bot commands
- **State Management**: Zustand (for future features)
- **Fonts**: Google Roboto (Material Design standard)

## Project Structure

```
recertify-mini/
├── src/
│   ├── app/                          # Next.js app router pages
│   │   ├── layout.tsx               # Root layout with theme provider
│   │   ├── page.tsx                 # Home page
│   │   ├── quiz/
│   │   │   └── page.tsx             # Quiz discovery page
│   │   ├── leaderboard/
│   │   │   └── page.tsx             # Leaderboard page
│   │   ├── tasks/
│   │   │   └── page.tsx             # Social tasks page
│   │   └── profile/
│   │       └── page.tsx             # User profile page
│   │
│   ├── components/                   # Reusable React components
│   │   ├── common/
│   │   │   ├── ThemeProvider.tsx    # MUI theme provider with context
│   │   │   └── BottomNav.tsx        # Bottom navigation bar
│   │   ├── home/
│   │   │   ├── HeroSection.tsx      # Hero banner with user stats
│   │   │   └── ProjectGrid.tsx      # Project cards grid component
│   │   ├── md3/                     # Material Design 3 components
│   │   │   ├── buttons/
│   │   │   ├── cards/
│   │   │   ├── forms/
│   │   │   └── navigation/
│   │   ├── quiz/                    # Quiz-related components
│   │   └── layout/                  # Layout components
│   │
│   ├── lib/                          # Utilities and helpers
│   │   ├── theme/
│   │   │   └── index.ts             # MUI theme configuration (MD3)
│   │   ├── projectData.ts           # Mock project data
│   │   ├── quizData.ts              # Mock quiz data
│   │   ├── telegram.ts              # Telegram API integration
│   │   └── mock/                    # Mock data generators
│   │
│   ├── types/                        # TypeScript type definitions
│   │   └── index.ts                 # All shared types
│   │
│   └── styles/                       # Global styles
│       └── globals.css              # Global CSS (if needed)
│
├── public/                           # Static assets
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
├── next.config.js                    # Next.js configuration
└── README.md                         # This file
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type check
npm run type-check

# Lint
npm run lint
```

Visit `http://localhost:3000` to see the app.

## Key Components

### Material Design 3 Implementation
- **Color System**: Complete MD3 light and dark themes with semantic colors
- **Typography**: 15-token type scale (Display, Headline, Title, Body, Label)
- **Spacing**: 8dp grid system with consistent padding and margins
- **Components**: Buttons (5 variants), Cards, Navigation Bar, Chips, and more
- **Elevation**: Proper shadow system with 5 elevation levels
- **Motion**: Springy animations for natural feel

### Home Tab (Bitdegree.org Inspired)
- **Hero Section**: User stats dashboard with points, streak, level, and achievements
- **Progress Tracker**: Visual progress bars for daily goals
- **Project Grid**: 
  - 2-column grid on mobile, 3+ on desktop
  - Project icons with floating animations
  - Difficulty badges (Beginner/Intermediate/Advanced)
  - Star ratings and completion indicators
  - Points rewards display
  - Progress bars for each project
  - Learning modules and quiz counts

### Quiz Tab
- **Quiz Discovery**: Browse quizzes by category (DeFi, NFTs, Gaming, Infrastructure, Security)
- **Quiz Cards**: Show difficulty, time estimate, points, completed count, and rating
- **Filtering**: Category-based filtering with "All" option
- **Social Proof**: Display completed count and average rating

### Leaderboard Tab
- **Top 3 Podium**: Visual podium display with ranking badges
- **User Rankings**: Full list of users with points, levels, and badges
- **Timeframe Filters**: Week, Month, All-time views
- **Current User Highlight**: Highlight your position in the leaderboard

### Social Tasks Tab
- **Task Cards**: Share, invite friends, leave reviews, follow updates
- **Progress Tracking**: Shows completed/total tasks
- **Points Display**: Earned points from completed tasks
- **Task Actions**: Different action buttons for each task type
- **Reward Badges**: Chips showing point rewards for each task

### Profile Tab
- **User Header**: Avatar, name, level, and quick stats
- **TON Wallet Integration**: View/edit wallet address, connect wallet
- **Achievements Tab**: Unlocked achievements with descriptions and dates
- **Statistics Tab**: Level progress, learning breakdown, member stats

## Theme Customization

The app uses Material Design 3 with customizable themes:

```typescript
// Light Theme Colors
Primary: #6750A4
Secondary: #625B71
Tertiary: #7D5260
Error: #BA1A1A
Background: #FEF7FF
Surface: #FFFFFF

// Dark Theme Colors
Primary: #D0BCFF
Secondary: #CCC2DC
Tertiary: #EFB8C8
Error: #FFB4AB
Background: #121212
Surface: #1D1B20
```

## Telegram Integration

### Features Implemented
- **Mini App SDK**: Full integration with Telegram WebApp API
- **User Authentication**: Automatic user data extraction from Telegram
- **Share Functionality**: Share achievements and invitations to Telegram
- **Bot Integration**: Links to Telegram bot for on-boarding

### TON Wallet
- **TonConnect Integration**: Connect TON wallets (@tonconnect/ui-react)
- **Wallet Management**: Display and manage wallet addresses
- **Future**: Reward distributions via smart contracts

## Mock Data

### Projects
- **DeFi Fundamentals** - Learn decentralized finance basics
- **NFT Creation** - Master non-fungible token creation
- **Blockchain Gaming** - Play-to-earn and gaming tokens
- **Smart Contract Security** - Security best practices
- And more...

### Quizzes
- 4 main quiz categories with 3-4 questions each
- Multiple choice questions with explanations
- Social proof metrics (completed count, rating)
- Varying difficulty levels and time estimates

### Leaderboard
- Mock user rankings with varying levels and points
- Your user position included
- Configurable timeframes

### Tasks
- Daily check-in challenge (7-day streak)
- Share your progress
- Invite friends
- Leave reviews
- Follow updates

## API Routes (Future)

```
/api/auth/telegram     - Authenticate with Telegram
/api/auth/wallet       - Authenticate with TON wallet
/api/user/profile      - Get/update user profile
/api/quizzes           - Get quizzes with filters
/api/quizzes/:id       - Get specific quiz
/api/quizzes/:id/submit - Submit quiz answers
/api/projects          - Get projects with filters
/api/leaderboard       - Get leaderboard rankings
/api/tasks             - Get user tasks
/api/tasks/:id/complete - Mark task as complete
/api/rewards/send      - Send rewards to wallet
/api/analytics         - Track user events
```

## Performance Optimizations

- ✅ Lazy loading of images and components
- ✅ CSS-in-JS optimization with emotion
- ✅ Next.js image optimization
- ✅ Font optimization with next/font
- ✅ Bundle analysis and tree-shaking
- ✅ 60fps animations with hardware acceleration
- ✅ Proper component memoization

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Telegram client (iOS and Android)
- Edge (latest)

## Future Enhancements

### Phase 2
- Quiz runner with question cards and answer feedback
- Real-time progress syncing
- Achievement unlock animations
- Certificate generation
- Community features (friend lists, team challenges)

### Phase 3
- Advanced gamification (badges, achievements, milestones)
- Social proof integrations (show friends' progress)
- Content creator dashboard
- Admin panel for course management

### Phase 4
- Smart contract integration for token distribution
- On-chain certificate issuance
- Decentralized governance
- Advanced analytics and reporting

## Security Considerations

- ⚠️ Validate all user inputs server-side
- ⚠️ Verify Telegram init data signature
- ⚠️ Use HTTPS for all API calls
- ⚠️ Implement rate limiting
- ⚠️ Store wallet addresses securely
- ⚠️ Audit smart contract interactions

## Development Guidelines

### Code Style
- Use TypeScript for all files
- Follow Material Design 3 principles
- Write functional components with hooks
- Use Framer Motion for animations
- Keep components small and focused

### Component Patterns
```typescript
// Prefer composition over inheritance
// Use proper TypeScript types
// Add JSDoc comments for public APIs
// Export components as named exports
```

### Performance
- Lazy load heavy components
- Use React.memo for expensive components
- Implement proper key props in lists
- Optimize animations for 60fps

## Contributing

1. Follow the existing code structure
2. Use TypeScript types consistently
3. Test on actual Telegram client when possible
4. Keep components focused and reusable
5. Document complex logic with comments

## License

Proprietary - Recertify Mini

## Support

For issues and feature requests, contact: support@recertify.io

## Changelog

### v0.1.0 (MVP)
- Material Design 3 foundation
- Home, Quiz, Leaderboard, Tasks, Profile tabs
- Telegram mini app integration
- TON wallet support (basic)
- Mock data implementation
- Responsive mobile design

---

**Built with ❤️ for Web3 learners**
