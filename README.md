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

## Navigation

Five bottom tabs:

| Tab | Purpose |
| --- | --- |
| 🏠 **Dashboard** | Customizable widget home screen |
| 💎 **Legendary** | Legendary crafting planner |
| ⏱️ **Timers** | World boss & meta event countdowns |
| 🔧 **Tools** | All other features in a vertical list |
| ⚙️ **Settings** | API key, widgets, notifications |

---

## Features

### 🏠 Dashboard

Fully customizable — toggle and reorder widgets from Settings. Available widgets:

- **Account Summary** — AP, WvW rank, PvP rank, total playtime, net wealth
- **Account Wealth** — wallet + bank + materials priced at live TP rates
- **Reset Timers** — live countdowns to daily (00:00 UTC) and weekly (Mon 07:30 UTC) reset
- **World Boss Timer** — active bosses + next spawn countdown
- **Daily Checklist** — daily/weekly achievement tracker with Wizard's Vault integration
- **Wizard's Vault** — daily and weekly progress bars with unclaimed objective count
- **Characters** — roster preview with profession, level, and death count
- **Mastery Points** — per-region progress (Tyria, Maguuma, Desert, Tundra, Jade, Sky)
- **TP Delivery Box** — gold and items waiting in your Trading Post delivery
- **Gold Trend** — 7-day sparkline built from daily wallet snapshots

### 💎 Legendary Crafting

- Search and filter all legendaries by generation, type, and name
- Full BFS recipe tree resolving all nested components
- Shopping list grouped by source (craft / forge / timegated / buy / special)
- Live inventory cross-check across all characters, bank, and material storage
- Timegate tracker showing days required per gated material
- Summary tab with map completion, WvW, and time estimates
- **Wizard's Vault Starter Pack panel** — mark owned precursor, weapon gift, and Gift of Might/Magic to subtract them from the shopping list

### ⏱️ Timers

- Live countdowns for every world boss and meta event
- Grouped by expansion (Core / LS1–LS4 / HoT / PoF / EoD / SotO / Janthir)
- Per-stage progress bar for active multi-phase events
- Waypoint code shown in tap-to-open detail sheet

### 🔧 Tools

Vertical list of all feature screens:

| Tool | Contents |
| --- | --- |
| **Characters** | Full roster · per-character inventory, equipment, builds, map completion |
| **Trading Post** | Delivery box · buy/sell orders · transaction history · watchlist · gem exchange |
| **Guides** | 100+ in-game guides (economy, combat mechanics, crafting, exploration, etc.) |
| **WvW** | Live match scores · map objectives · rank progression · abilities planner |
| **PvP** | Season standings · rank · per-profession win/loss · match history |
| **Fractals** | Fractal level · Wizard's Vault objectives · links to community build resources |
| **Strikes** | Weekly clear tracker per expansion |
| **Collections** | Mount skins, gliders, titles, emotes — unlocked vs. total |
| **Guild** | Info · treasury · activity log · member roster |

### 🔔 Notifications

- Local push alerts before world boss and meta event spawns
- Per-event and per-expansion enable/disable
- Configurable lead time: 5 / 10 / 15 / 30 minutes

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

---

## Project Structure

```text
src/
├── api/           # GW2 API functions per domain
├── components/    # Shared UI components + dashboard widgets
├── constants/     # Theme, world boss schedules, guides, static data
├── data/          # Legendary recipes, timegate data
├── hooks/         # TanStack Query hooks (useGW2.ts, useTimers.ts)
├── screens/       # One file per screen
├── services/      # Notification scheduling
├── store/         # Zustand store (appStore.ts)
├── types/         # Shared TypeScript types + widget catalog
└── utils/         # Currency formatting, timer helpers
```

---

## Disclaimer

This is an unofficial fan project. **Guild Wars 2**, ArenaNet, and all associated assets are property of **ArenaNet LLC**. This app is not affiliated with, endorsed by, or connected to ArenaNet or NCSoft in any way.
