<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 💈 Prelook Studio

AI-powered hairstyle visualization platform that lets users try on different hairstyles before visiting the salon.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)

View your app in AI Studio: https://ai.studio/apps/drive/1w567IJmIOBuw_O9ASVvs4u5kWlVe5Jxk

## ✨ Features

### For Customers
- 📸 **Upload or Capture** - Use your camera or upload an existing photo
- 🎨 **AI Transformation** - Generate photorealistic hairstyle previews instantly
- 🔄 **360° Views** - Unlock front, left, right, and back angles (premium feature)
- 📱 **Quick Login** - Returning users get 1-tap access to their history
- 💾 **Session History** - All your generated styles saved automatically
- 📍 **Salon Finder** - Book appointments at nearby salons

### For Salon Partners
- 🏪 **Admin Dashboard** - Manage bookings and customer flow
- 📊 **Analytics** - Track AI sessions and revenue
- 🎫 **Walk-in Codes** - Issue special codes for customers with salon perks

## 🚀 Quick Start

**Prerequisites:**  Node.js 18+

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   - Copy `.env.local.example` to `.env.local` (if not exists)
   - Add your Gemini API key:
     ```
     API_KEY=your_gemini_api_key_here
     ```

3. **Run the app:**
   ```bash
   npm run dev
   ```

4. Visit `http://localhost:5173`

## 📁 Project Structure

```
prelook-studio/
├── src/                        # NEW: Organized source (in progress)
│   ├── components/ui/          # Reusable UI components ✅
│   ├── hooks/                  # Custom React hooks ✅
│   ├── services/               # API & business logic ✅
│   ├── types/                  # TypeScript definitions ✅
│   └── constants/              # App constants ✅
├── components/                 # Current components (active)
├── services/                   # Current services (active)
├── App.tsx                     # Main application
└── types.ts                    # Type definitions
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for complete documentation.

## 🎯 User Flow Improvements

### ✅ New Users
- **Before:** Forced to login first
- **After:** Directly see upload/camera interface - no login required to start!

### ✅ Returning Users  
- **Before:** Manual email/password every time
- **After:** 1-tap quick login from recent users list with OTP

## 🛠️ Technology Stack

- **React 18** + **TypeScript** - UI framework with type safety
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Google Gemini AI** - Image generation
- **Lucide React** - Beautiful icons

## 💳 Credit System

- **Free**: 2 credits (try before you buy)
- **Pro**: ₹99 - 15 credits  
- **Ultimate**: ₹169 - 60 credits

**Usage:**
- 1 credit = Front view generation
- 2 credits = Unlock 360° views (all angles)

## 🎨 New UI Component Library

Production-ready components in `src/components/ui/`:

```typescript
import { Button, Card, Avatar, Badge, Modal, Input } from '@/components/ui';

<Card variant="elevated" padding="lg">
  <Avatar src={user.avatar} size="lg" />
  <Badge variant="success">Active</Badge>
  <Button variant="primary" fullWidth>Get Started</Button>
</Card>
```

## 📱 Responsive Design

Fully responsive across:
- 📱 Mobile: Touch-optimized, full-screen camera
- 📧 Tablet: Adaptive layouts  
- 💻 Desktop: Multi-column interface

## 🔄 Migration Status

### ✅ Completed
- Production folder structure created
- Reusable UI component library built
- Custom hooks implemented (useAuth, useHistory, useLocalStorage)
- **Fixed authentication flow** for new vs returning users
- Comprehensive documentation added

### 🚧 In Progress
- Migrating components to new `src/` structure
- Updating import paths

### 📋 Planned
- Complete migration & cleanup
- Unit tests
- Performance optimization

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

**Built with ❤️ by the Prelook Studio Team**
