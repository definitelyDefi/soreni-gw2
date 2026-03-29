# GW2 Companion — Soreni

![React Native](https://img.shields.io/badge/React_Native-0.76-61DAFB?logo=react&logoColor=white&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white&style=flat-square)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?logo=reactquery&logoColor=white&style=flat-square)
![Zustand](https://img.shields.io/badge/Zustand-4.5-brown?style=flat-square)
![GW2 API](https://img.shields.io/badge/GW2_API-v2-c8972b?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![Platform](https://img.shields.io/badge/platform-Android-3DDC84?logo=android&logoColor=white&style=flat-square)

**A full-featured Guild Wars 2 companion app for Android.**

*Not affiliated with ArenaNet or NCSoft.*

---

## Features

### 🏠 Dashboard

- Account summary — AP, WvW rank, PvP rank, total playtime hours
- **Net wealth** — wallet + bank + materials priced at live Trading Post rates
- **Gold trend** — 7-day sparkline chart built from daily wallet snapshots
- **Reset countdown** — live timers to daily reset (00:00 UTC) and weekly reset (Mon 07:30 UTC)
- **Next boss** — next world boss spawn with live countdown
- **Daily checklist** — manual task tracker + API-driven daily achievement status + Wizard's Vault objectives

### ⏱️ Boss Timers

- Live countdowns for every world boss and meta event
- Grouped by expansion (Core / LS1–LS4 / HoT / PoF / EoD / SotO / Janthir)
- Per-stage progress bar for active multi-phase events
- Waypoint code shown in tap-to-open detail sheet
- Active event badge count on tab icon

### 🧙 Characters

- Full roster with profession icons, level, and race
- Per-character tabs: **Overview**, **Inventory**, **Equipment**, **Builds**, **Maps**
- Inventory grid with rarity borders and live TP sell price overlays
- Equipment viewer with stat rollup per slot
- Saved build templates with specialization + trait display
- Quick-nav to Map Completion, Bank, Crafting, and Guides

### 🌀 Progression

| Tab | Contents |
| --- | --- |
| **Fractals** | Fractal level + T1–T4 tier pips · Wizard's Vault fractal objectives · Mastery progress per region · Weekly dungeon path completion · Meta build guide by role |
| **Strikes** | Weekly clear status per expansion (IBS / EoD / SotO / Janthir) · CM badges · Wizard's Vault weekly strike objectives |
| **Collections** | Mount skins · Gliders · Titles · Emotes — unlocked count vs. estimated total with progress bars |
| **Guild** | Guild info + MOTD · Treasury with upgrade progress · Activity log · Member roster with sort |

### ⚔️ Competitive

#### World vs World

- Live match scores with skirmish breakdown
- Map objectives grouped by type with team colouring
- WvW rank progression and abilities
- **Abilities planner** — shows each ability's rank, cost, and highlights what you can afford with your current Badges of Honor balance

#### PvP

- Season standings + division display
- Rank progression with XP bar
- Per-profession win/loss breakdown
- Recent match history

### 💹 Trading Post

- Delivery box with pending coins and items
- Active buy and sell orders with status
- Transaction history (buys + sells)
- **Watchlist** — track any item by ID with custom buy/sell price alert targets
- **Exchange** — live gem ↔ gold rates refreshed every 5 minutes

### 🔔 Notifications

- Local push alerts before world boss and meta event spawns
- Per-event and per-expansion enable/disable
- Configurable lead time: 5 / 10 / 15 / 30 minutes before spawn

---

## Screenshots

> *Coming soon*

---

## Tech Stack

| | |
| --- | --- |
| Framework | React Native 0.76 (bare CLI) |
| Language | TypeScript 5.3 |
| Data fetching | TanStack Query v5 |
| State management | Zustand + AsyncStorage |
| Navigation | React Navigation v6 |
| Notifications | Notifee |
| HTTP | Axios |
| API | GW2 API v2 |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Android Studio with SDK platform 34
- An Android emulator or USB-connected device with USB debugging enabled

### Install & run

```bash
git clone https://github.com/yourusername/gw2companion.git
cd gw2companion
npm install
npx react-native run-android
```

### Start Metro only

```bash
npm start
# or with cache clear
npm run start:clean
```

---

## API Key

Get your key at **[account.arena.net](https://account.arena.net) → Applications**

Required permissions:

| Permission | Used for |
| --- | --- |
| `account` | Account info, playtime, fractal level, WvW rank |
| `characters` | Character list, inventory, equipment, builds |
| `inventories` | Bank, material storage |
| `wallet` | Gold, karma, laurels, other currencies |
| `progression` | Masteries, dungeon/strike completion, home nodes |
| `builds` | Saved build templates |
| `guilds` | Guild info, treasury, log, members |
| `pvp` | PvP stats, match history, season standings |
| `wvw` | WvW match data, abilities |
| `tradingpost` | Buy/sell orders, transaction history, delivery |
| `unlocks` | Mount skins, gliders, titles, emotes |

Enter your key in **Settings → API Key** inside the app.

---

## Building a Release APK

```bash
cd android && ./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

For a signed release build, configure `android/app/build.gradle` with your keystore details (never commit your keystore or `keystore.properties` to source control).

---

## Scripts

```bash
npm run android        # Run on Android device/emulator
npm run lint           # ESLint (src/)
npm run type-check     # tsc --noEmit
npm run build:android  # Assemble release APK
```

---

## Project Structure

```text
src/
├── api/           # GW2 API functions per domain
├── components/    # Shared UI components + dashboard widgets
├── constants/     # Theme, world boss schedules, static data
├── hooks/         # TanStack Query hooks (useGW2.ts)
├── screens/       # One file per screen
├── services/      # Notification scheduling
├── store/         # Zustand store
├── types/         # Shared TypeScript types
└── utils/         # Currency formatting, timer helpers
```

---

## Disclaimer

This is an unofficial fan project. **Guild Wars 2**, ArenaNet, and all associated assets are property of **ArenaNet LLC**. This app is not affiliated with, endorsed by, or connected to ArenaNet or NCSoft in any way.
