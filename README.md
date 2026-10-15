# Surra

Swedish conversation practice from A1 to C1, built as a journey across Sweden from Malmö to Kiruna. The interface is in English. Lessons train you to **respond** in real situations, from fika small talk to job interviews, with work scenarios for both the office and life sciences.

**Open the app:** https://ronaksingh0075.github.io/surra/

## Install it on your phone

- **Android (Chrome):** open the link, then tap **Install app** in the menu, or use the Install button in Surra's Settings.
- **iPhone/iPad (Safari):** tap **Share**, then **Add to Home Screen**.

Once installed, Surra opens full screen and works offline.

## What's inside

- 20 stops across 5 levels (A1 Skåne → C1 Norrbotten). Each stop has key phrases, reply drills, sentence building and a conversation.
- Gamification: XP and combos, a daily goal, a streak shown as seven candles, city stamps, 20 badges, the 60-second Snabbsvar game, and a review pile built from your mistakes.
- 80 "Did you know?" facts on history, culture and food, nature and geography, and language. They unlock as you finish lessons, each with a Swedish word to hear and learn.
- Colour themes: six palettes inspired by Sweden (Mysig, Skärgård, Skog, Ljung, plus Midnattssol and Norrsken, which unlock as you practise) and an Auto/Light/Dark switch. Your choice syncs with your profile.
- Optional profile: sign up with email and a confirmation link, then progress is backed up and follows you across devices. Guests can learn without an account, and their progress carries over when they sign up.

## Project layout

| Path | What it is |
| --- | --- |
| `src/` | App source: curriculum (`data_a.js`, `data_b.js`), facts, map, core logic, UI, accounts, styles, icons |
| `src/config.js` | Firebase web config. Its values are public identifiers; access is controlled by the security rules |
| `firebase/firestore.rules` | Security rules: each person can read and write only their own document, after confirming their email |
| `tools/` | Build script, curriculum validator, icon renderer |
| `docs/` | The built site that GitHub Pages serves. Generated: don't edit by hand |

## Build

```bash
npm install
npm run build   # validates the curriculum, then writes docs/ and build/surra.html
```

`build/surra.html` is the claude.ai artifact version. It has live Claude role-plays, and progress syncs to your Claude account there.

## Accounts (Firebase)

- Authentication uses Email/Password with verification emails.
- Progress is stored in Cloud Firestore at `users/{uid}` as `{ progress, updatedAt, v }`.
- The site's domain must be listed under Authentication → Settings → Authorized domains.
