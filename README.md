# Surra

Swedish conversation practice from A1 to C1, built as a journey across Sweden from Malmö to Kiruna. The interface is in English. Lessons train you to **respond** in real situations, from fika small talk to job interviews, with work scenarios for both the office and life sciences, plus an optional life-science track.

**Open the app:** https://ronaksingh0075.github.io/surra/

## Install it on your phone

- **Android (Chrome):** open the link, then tap **Install app** in the menu, or use the Install button in Surra's Settings.
- **iPhone/iPad (Safari):** tap **Share**, then **Add to Home Screen**.

Once installed, Surra opens full screen and works offline.

## What's inside

- An app-style layout with five tabs at the bottom: Home, Map, Practice, Passport and Me. On Android the back button closes the top-most sheet or lesson first.
- 20 stops across 5 levels (A1 Skåne → C1 Norrbotten). Each stop has key phrases, reply drills, sentence building, a conversation and a typing lesson.
- A zoomable map: pinch, drag, scroll or use the buttons. The route is drawn as roads with real road numbers (E4, E6, E45 and friends), the stretch you have travelled glows, and zooming in reveals a signpost at each city whose boards are its facts. Tap a board to read it.
- Journey kilometres: each lesson covers part of the real road into its city (30 km over the bridge into Malmö, 360 km from Östersund to Umeå), scaled by your stars, so the whole journey is about 2,700 km. Practice (reviews, Snabbsvar, replays, typing) adds detours of about a kilometre per right answer, up to 40 km a day. Plus combos, city stamps, 28 badges, the 60-second Snabbsvar game and a review pile built from your mistakes.
- Typing, Typeracer style: type real Swedish word by word, fixing slips as you go. A drill for å, ä and ö (far, får and för are three different words), each city's key phrases, and hear-and-type. Letter help, on by default, lets a, o and e stand in for å, ä, ö and é, and on-screen keys type the real letters. The bee race pits you against three pacer bees on the way to the blomma.
- Spoken Swedish: feedback shows how a line sounds in everyday speech (“Ja vet inte va de e”) with expert tips on what Swedes really say, from Tjena to nån and dom. It can be switched off in Settings.
- 80 "Did you know?" facts on history, culture and food, nature and geography, and language. They unlock as you finish lessons, each with a Swedish word to hear and learn.
- Life-science track: pick "Life sciences" (or "Mix") as your field and 10 work stops gain a lab lesson, from lab safety in Lund to health economics in Luleå, with 60 phrases, 40 reply drills and 20 sentences from labs, clinics, pharma and medtech. With the life-science focus, lab replies also show up in Respond lessons and Snabbsvar, and 5 extra signposts cover Swedish life-science history.
- Colour themes: six palettes inspired by Sweden (Mysig, Skärgård, Skog, Ljung, plus Midnattssol and Norrsken, which unlock as you practise) and an Auto/Light/Dark switch. Your choice syncs with your profile.
- Optional profile: sign up with email and a confirmation link, then progress is backed up and follows you across devices. Guests can learn without an account, and their progress carries over when they sign up.
- Players map (with a profile, opt-in): see where other learners have got to on the journey, grouped into bubbles by city, and challenge anyone in your city or up to two cities away, as often as you like (one open challenge with the same player at a time). You both answer the same 8 replies; more right answers wins and a faster time breaks a tie. Kilometres are at stake: a quarter of the road between your two cities, from 10 to 100 km (10 km in the same city). The winner gains them and the loser gives them up, never going below zero; lessons, stars and stamps are never affected. Challenge requests show on Home and as a badge on the Map tab, and anyone can leave the map in Me.
- Safehouses: Malmö, Göteborg, Stockholm and Umeå are safe. Nobody can challenge you there and you can't challenge from one, so you can learn without losing kilometres. Friendly typing races still work.
- Boss bees: each safehouse has a boss who guards the road out. Malte in Malmö, Gösta in Göteborg, Stina in Stockholm and Ulla in Umeå. A boss battle is a race to the blomma: every right reply flies you a tenth of the way, and the boss's motto (a line of real spoken Swedish, explained afterwards) is the final stretch. Beat the boss to travel past the safehouse and win 50 km. Each loss makes the boss 10% slower, up to 50%, so nobody gets stuck. Players who were already past a safehouse keep their road open and can fight its boss for the bonus.
- Three races in onboarding: new players pick their level, then race three bees, each typing one short sentence at that level. Bettan keeps it close (10 km head start for a win, 5 for trying), her big brother Sixten flies about five words a minute faster (10 km for a win), and the third is a mystery: Fjälldrottningen, the queen bee of Kebnekaise, who waits until you're a quarter of the way, then zooms past. Nobody beats her on day one. The screen after her race shows where she lives and the road there, so the journey has an ending to aim for. The races can be skipped at any point.
- Kebnekaise: once you reach Kiruna, climb Sweden's highest mountain, from Fjällstationen at 690 m to the north top at 2,097 m, in 12 pitches. Each pitch is a Norrbotten reply or key phrase against the clock (more time for longer replies); a right answer climbs, and a mistake or running out of time makes you slip back a pitch. Two camps catch your fall and become where your next climb starts, and the pitch into each camp and the summit is a rope pitch: type the line before your grip goes. On top, the rematch with the queen: type her motto before she reaches the blomma. She flies at 30 words a minute, 10% slower after each loss down to 20. The summit is worth 50 km and the queen 100, with a badge for each. The mountain is on the map beside Kiruna, and the whole climb is animated: the camera follows you up the trail, slips tumble you down with falling rocks, the snow thickens as the clock runs out, and the flag goes up on the summit.
- Live typing races: race a player in your city to the blomma. You both type the same paragraph from the same moment and watch each other's bee; the first to finish takes 10 km from the other (nothing in a safehouse). The invited player gets a notification and has two minutes to join.
- The race for everyone: guests see live, anonymous counts of how many learners are on the road and where, with prompts to create a profile. Home shows one prompt at a time (create a profile, join the players map, turn on challenge alerts), each with "Not now" that waits a few days before asking again. Players on the map get a "You're #4 of 12" card, ranked by kilometres (cities visited break ties), with their nearest rivals, what's at stake and Race or Challenge buttons, plus invite links that tell you when a friend joins.
- Push notifications (with a profile, per device): a challenge for you, the result of yours, a typing race invite, and a reminder six hours before a challenge expires. Practice reminders at a time you choose and rival alerts ("Alex just passed you") are off unless you turn them on. Nothing arrives between 22:00 and 08:00 except a reminder at the time you picked. On iPhone and iPad, Surra needs to be on the Home Screen first. Notifications are sent by the Surra notifier, a small Google Apps Script described in [`notifier/README.md`](notifier/README.md).

## Project layout

| Path | What it is |
| --- | --- |
| `src/` | App source: curriculum (`data_a.js`, `data_b.js`), life-science track (`life.js`), facts, map (`ui_map.js`), app shell and tabs (`ui_shell.js`), core logic, UI, accounts, styles, icons |
| `src/config.js` | Firebase web config. Its values are public identifiers; access is controlled by the security rules |
| `firebase/firestore.rules` | Security rules: your own progress and notification settings are private to you; the players map is visible to signed-in players, each writing only their own entry; a challenge or typing race is visible only to its two players, scores and finishing times can't be changed once written, and nobody can challenge in or out of a safehouse; anonymous race counts are public |
| `notifier/` | The Surra notifier: a Google Apps Script that sends push notifications and keeps the race counts and player roster fresh. `notifier/dist/Code.gs` is what goes into the Apps Script editor |
| `src/mapdata.json` | The journey map: coastlines, lakes, city positions and the road routes. Generated by `tools/mapgen.js` |
| `tools/` | Build script, curriculum and map validator, map generator, icon renderer |
| `docs/` | The built site that GitHub Pages serves. Generated: don't edit by hand |

## Build

```bash
npm install
npm run build   # validates the curriculum, then writes docs/, build/surra.html and notifier/dist/Code.gs
npm run release # builds, then lists only the publishing steps this build needs (see Releasing)
```

`build/surra.html` is the claude.ai artifact version. It has live Claude role-plays, and progress syncs to your Claude account there.

Every dependency is a build-time one: the app and the notifier ship only what the build bundles into `docs/` and `notifier/dist/`. `package.json` overrides `@grpc/grpc-js` because Firebase's Node.js Firestore client still asks for version 1.9, which has security advisories. Surra bundles Firestore Lite (plain HTTPS), so gRPC never reaches the app, and `npm audit` should report no vulnerabilities.

### The map

```bash
npm run map     # regenerates src/mapdata.json
```

Coastlines and borders come from Natural Earth (1:10m, public domain) and lakes from Natural Earth 1:50m. Roads follow the real routes (E6 via Halmstad and Varberg, E4 via Skellefteå and Piteå, and so on) through waypoints in `tools/mapgen.js`. Where a route would stray into water, the generator finds a way round over land. `npm run build` checks that every stop sits on land and every road keeps clear of the sea and lakes, so a change that puts a road in the water fails the build.

## Accounts (Firebase)

- Authentication uses Email/Password with verification emails.
- Progress is stored in Cloud Firestore at `users/{uid}` as `{ progress, updatedAt, v }`.
- The players map uses `players/{uid}` (`name, avatar, color, stop, km, cities, updatedAt, v`, plus `xp` holding the same kilometres for app versions before 1.6), `challenges/{id}` and `races/{id}`. Deleting an account removes all three along with the progress.
- Notifications use `notify/{uid}`: the settings (which alerts, reminder hour), one push subscription per device, and a small summary for timing reminders (time zone, last practice day, current stop, next lesson and the kilometres left to the next city, name). Only its owner can read it; the notifier reads it with its own Google access. Signing out removes the device's subscription; deleting the account removes the document.
- The notifier writes `public/map` (counts per city, readable by anyone), `shared/roster` (everyone on the players map in one document, readable by signed-in players, so the app reads one document instead of one per player) and `meta/state` (its own bookkeeping, readable by no one).
- The site's domain must be listed under Authentication → Settings → Authorized domains.

## Releasing

Run `npm run release`. It builds, compares the result with what is live (`origin/main`) and lists only the steps this update needs. Most updates only change the app, and then a push to `main` is all it takes: GitHub Pages serves `/docs` from `main`.

When an update also changes the backend, publish in this order so nothing is ever refused: first `firebase/firestore.rules` (Firestore → Rules in the Firebase console), then the new `notifier/dist/Code.gs` (paste it into the Apps Script editor and deploy a new version, see [`notifier/README.md`](notifier/README.md)), then the site. The app copes with older rules in the meantime: it writes the older map entry and explains that live races need the update.
