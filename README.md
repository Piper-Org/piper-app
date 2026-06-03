# 🎵 Piper App — Programmable Money Streams PWA

**`piper-app`** is the primary user interface for the Piper Protocol — a **Progressive Web App (PWA)** that lets anyone create, manage, and receive programmable payment streams on Sui. It turns your Move smart contracts and TypeScript SDK into a **real‑world, judge‑ready product**.

> *Stream salaries, DCA into any token, pay per‑use for AI, or charge for a ride by the second — all from a mobile‑friendly interface, without a seed phrase.*

---

## 🌟 Vision

Payments today are static transfers. Piper changes that: **every payment is a live on‑chain object** that can stream, split, and convert value atomically every second. This app is the consumer layer — a simple, beautiful interface that hides the complexity and lets you **start streaming in under a minute**.

---

## 📱 Core Features

### For Senders (Stream Creators)
- **One‑tap stream creation** — continuous, DCA, or pay‑per‑use.
- **Set flow rate, budget, recipient, and splits** in a guided wizard.
- **Real‑time monitoring** — see funds tick down, remaining time, total streamed.
- **Instant revoke** — stop any stream and get unspent funds back immediately.
- **History & receipts** — on‑chain ledger for every payment event.
- **zkLogin** — sign in with Google/Apple, no wallet required.
- **Installable PWA** — feels like a native app on mobile.

### For Recipients (Drivers, Freelancers, Services)
- **View incoming streams** — see who is streaming to you, at what rate.
- **Claim funds manually (or automatically)** — the “Tick” button triggers a payment update, or a keeper does it behind the scenes.
- **Track earnings** — total received, per‑stream breakdown, transaction history.
- **Withdraw or reinvest** — funds land directly in your wallet; you can route them further via DeFi.

---

## 🧪 Supported Stream Modes

| Mode | User’s Perspective | Recipient’s Perspective |
|------|-------------------|-------------------------|
| **Continuous (time‑based)** | “I pay my freelancer 2000 USDC/month, streamed per second.” | “I see money arriving every second; I can withdraw at any time.” |
| **DCA (dollar‑cost averaging)** | “I put 100 USDC in a stream that buys SUI every minute for 30 days.” | *(self‑directed; the sender is also the recipient of the swapped tokens.)* |
| **Pay‑Per‑Use (on‑demand)** | “I pre‑fund 10 USDC for my AI chatbot; it bills me per token, with a hard cap.” | “The chatbot backend charges my credit line automatically, never exceeding the budget.” |

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js v18+
- npm or pnpm
- A Sui wallet (for testing) or a Google account (for zkLogin)
- Piper Move contracts deployed on Sui Testnet (package ID required)
- Piper SDK (`@piper/sdk`) published or linked locally

### Installation
```bash
git clone https://github.com/piper-protocol/piper-app.git
cd piper-app
npm install
```

### Configuration
Create a `.env.local` file:
```
VITE_PIPER_PACKAGE_ID=0xYOUR_PIPER_PACKAGE_ID
VITE_SUI_RPC_URL=https://fullnode.testnet.sui.io:443
VITE_ZKLOGIN_CLIENT_ID=your_google_client_id   # optional, for zkLogin
```

### Run the App
```bash
npm run dev
```
Open `http://localhost:5173` in your browser. The app will prompt you to connect a wallet or sign in with Google.

---

## 📖 End‑to‑End User Flows

### 1. Continuous Stream (Uber‑style Ride Payment)

**Sender (Passenger) flow:**
1. Open the Piper app on mobile, sign in with Google.
2. Tap **“Create Stream”** → choose **“Continuous Stream”**.
3. **Deposit:** Select USDC and enter an estimated maximum fare (e.g., 5 USDC for a 20‑minute ride).
4. **Set flow rate:** Enter `0.001 USDC per second` (or use the “total over time” helper). The app calculates the duration automatically.
5. **Recipient:** Paste the driver’s Sui address (or scan a QR code).
6. **Splits (optional):** None for a simple ride.
7. **Review & Confirm:** See a summary: “You will pay 0.001 USDC/sec to 0xDriver… up to 5 USDC. Stop anytime.” Tap **“Start Ride”**.
8. The transaction is signed (via zkLogin or wallet) → stream is now live. The passenger sees a live countdown of remaining balance and a big **“End Ride / Revoke”** button.
9. When the ride ends, tap **“End Ride”**. The stream is revoked, and any unspent USDC returns instantly to the passenger’s wallet.

**Recipient (Driver) flow:**
1. The driver opens the Piper app (or any Sui wallet) and sees an incoming stream from the passenger’s address.
2. **Live view:** The stream detail page shows “Incoming: 0.001 USDC/sec” and a growing “Earned so far” counter.
3. To claim the funds, the driver taps **“Claim”** (or the keeper auto‑ticks). A PTB executes: tick the stream, transfer the streamed amount to the driver’s wallet.
4. The driver can withdraw or reinvest. If the passenger revokes, the stream disappears and the driver keeps what was already earned.

---

### 2. DCA Stream (Automated SUI Accumulation)

**Sender (Investor) flow:**
1. Sign in, tap **“Create Stream”** → choose **“DCA Stream”**.
2. **Deposit:** 100 USDC.
3. **Duration:** 30 days. The app auto‑computes the flow rate (~0.0000386 USDC/sec).
4. **Target token:** Select “SUI”. Set max slippage (e.g., 0.5%).
5. **Recipient:** The sender’s own wallet (by default) — the swapped SUI will be sent back to them.
6. **Splits:** Optional — 20% to a savings wallet, 80% to spending.
7. **Confirm & sign.**
8. The DCA stream starts. The dashboard shows a mini‑chart of accumulated SUI vs time, plus each swap event in the ledger. The user can top up or revoke at any time.

**“Recipient” (the same user) experience:**
- The swapped SUI appears automatically after each tick (if keeper runs) or after manual claim.
- The user can see every swap on the stream detail page: time, USDC amount, SUI received, execution price.

---

### 3. Pay‑Per‑Use Stream (AI Chatbot Credit)

**Sender (End‑user) flow:**
1. Sign in, tap **“Create Stream”** → choose **“Pay‑Per‑Use Credit”**.
2. **Deposit:** 10 USDC (total budget).
3. **Service Recipient:** The chatbot’s wallet address (provided by the service).
4. **Authorized Spender:** The service’s backend public key (displayed by the chatbot).
5. **Confirm.** The stream is created; the user sees it under “Active Credit Lines”.
6. The user now interacts with the chatbot. Each time a message is sent, the chatbot’s backend calls `pay(streamId, 0.0005 USDC)` **without needing the user’s signature**.
7. The user can watch the remaining credit drop in real time. At any point, they can **“Revoke”** the credit line, instantly cutting off further charges.

**Recipient (Chatbot service) flow:**
- The service monitors the on‑chain stream for new `Pay` events. After each successful `pay`, the USDC is transferred to the service wallet.
- The backend uses the `@piper/sdk` with its authorized key to build and sign a `pay` PTB after each billable event.
- The service can also check the remaining balance before providing service.

---

## 🧩 How the App Works Under the Hood

The app is a **pure client‑side React application** that interacts directly with the Sui blockchain via RPC and the Piper SDK. There is no custom backend.

- **Data reads:** `sui_getObject`, `sui_getDynamicFields`, `sui_queryEvents` for stream state and history.
- **Transactions:** All writes (create, tick, pay, revoke) are built using `@piper/sdk` and signed by the user’s wallet or zkLogin session.
- **Real‑time updates:** The app polls the RPC every 5–10 seconds and uses optimistic local counters to show smooth balance changes.
- **DeepBook integration:** For DCA, the PTB includes a swap command that routes through Sui’s native DEX aggregator, ensuring best‑price execution.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Routing | React Router v6 |
| Styling | Tailwind CSS |
| State / caching | TanStack Query (React Query) |
| Wallet connection | `@mysten/dapp-kit` |
| Passwordless auth | `@mysten/zklogin` |
| Blockchain interaction | `@mysten/sui` + `@piper/sdk` |
| PWA features | Workbox, manifest.json |
| Hosting | Vercel or Walrus Sites |

---

## 📂 Project Structure

```
piper-app/
├── public/
│   ├── manifest.json
│   └── sw.js
├── src/
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom hooks (useStream, useStreams, etc.)
│   ├── pages/            # Dashboard, Create, StreamDetail, etc.
│   ├── lib/              # SDK initialization, constants
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── package.json
└── README.md
```

---

## 📡 Deployment

For hackathon demos, we recommend deploying on **Vercel** (fast, free) or **Walrus Sites** (fully decentralised).  
Build the app:

```bash
npm run build
```

Then deploy the `dist/` folder to your hosting of choice.  
Make sure the environment variables are set in your hosting dashboard.

---

## 🔗 Related Repositories

- **`piper-move`** — Core Move smart contracts ([repo](https://github.com/piper-protocol/piper-move))
- **`piper-sdk`** — TypeScript SDK for building Piper PTBs ([repo](https://github.com/piper-protocol/piper-sdk))
- **`piper-indexer`** — Off‑chain indexer and API ([repo](https://github.com/piper-protocol/piper-indexer))
- **`piper-docs`** — Full protocol documentation ([repo](https://github.com/piper-protocol/piper-docs))

---

## 🤝 Contributing

We welcome contributions! See `CONTRIBUTING.md` for guidelines. For feature requests, please open an issue.

---

## 📄 License

Apache 2.0

---

**Piper App** — *Money that moves like music, right in your pocket.*
