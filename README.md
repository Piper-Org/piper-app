# Piper App

**`piper-app`** is the primary user interface and frontend client for the Piper Protocol — enabling programmable, real-time payment streaming on the Sui blockchain.

This repository contains the production-ready Progressive Web App (PWA) built to interact with the Piper smart contracts via the `@usepiper/sdk`.

---

## 🌟 Overview

Piper changes payments from static, lump-sum transfers into **fluid, live on-chain streams** that settle every second. This frontend application provides a beautiful, consumer-friendly interface to create, manage, and visualize these streams in real-time.

---

## 📱 Implemented Features

### 1. Interactive Landing Page
- A high-performance, animated introduction to Piper.
- Visual comparisons between static transfers, escrow, and streaming.
- Built using `framer-motion` for kinetic, scroll-driven storytelling.

### 2. Built-in Pitch Deck (`/pitch`)
- A fully integrated, animated slide deck to present Piper's go-to-market strategy and value proposition directly from the application.
- Supports keyboard navigation and dynamic transitions.

### 3. Developer Documentation (`/docs`)
- Embedded developer documentation for integrating the Piper SDK.
- Includes syntax-highlighted code blocks for Move and TypeScript implementations.

### 4. Application Dashboard (`/dashboard`)
- The core interface for users to connect their wallets or use **zkLogin** (Google/Apple) for a seamless, passwordless Web3 experience.
- Interface to view and manage active streams.

### 5. Progressive Web App (PWA)
- Fully installable on mobile devices with offline caching via `vite-plugin-pwa` and Workbox, providing a native app-like experience.

---

## 🏗️ Tech Stack

This frontend is built for extreme performance, leveraging the best of the modern React ecosystem:

| Layer | Technology |
|-------|------------|
| **Framework** | React 18 + TypeScript |
| **Build Tool** | Vite 6 |
| **Routing** | TanStack Router (File-based routing) |
| **Styling** | Tailwind CSS v4 + Radix UI Primitives |
| **Animations** | Framer Motion |
| **State / Data** | Zustand + TanStack Query (React Query) |
| **Web3 Integration**| `@mysten/dapp-kit`, `@mysten/sui` |
| **Auth** | `@mysten/enoki` (zkLogin) |
| **Core Protocol** | `@usepiper/sdk` |

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js v18+
- npm, yarn, or pnpm
- A Sui wallet (for testing) or a Google account (for zkLogin)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/piper-protocol/piper-app.git
cd piper-app
```

2. **Install dependencies:**
```bash
npm install
```

3. **Environment Configuration:**
Create a `.env.local` file in the root of `piper-app`:
```env
VITE_PIPER_PACKAGE_ID=0xYOUR_PIPER_PACKAGE_ID
VITE_SUI_RPC_URL=https://fullnode.testnet.sui.io:443
VITE_ENOKI_API_KEY=your_enoki_api_key_here
```

4. **Run the Development Server:**
```bash
npm run dev
```
Open `http://localhost:5173` in your browser. 

---

## 📡 Deployment

This application is ready to be deployed to Vercel, Netlify, or decentralized hosting solutions like Walrus Sites.

To build the production bundle:
```bash
npm run build
```
This will generate optimized, static assets in the `dist/` directory.

---

## 🔗 Related Packages

- **`piper-sdk`**: The TypeScript SDK used by this app to build Piper PTBs.
- **`piper-move`**: Core Move smart contracts deployed on Sui.

---

## 📄 License

Apache 2.0
