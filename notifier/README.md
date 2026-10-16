# Surra notifier

Sends Surra's push notifications. It's a Google Apps Script that runs under the Google account that owns the Firebase project, so there's no server to run, nothing to pay for and no keys in this repository. Apps Script reads Firestore with that account's own access, and the script keeps its private push key in its own Script Properties.

## What it sends

| Alert | Default | When |
| --- | --- | --- |
| A challenge for you | On | Seconds after it's sent (the app pings the notifier), or within 10 minutes |
| Your challenge's result | On | Seconds after the other player answers or declines |
| Challenge about to expire | On | About six hours before a challenge you haven't answered expires |
| A friend joined from your invite | On | When someone who opened your invite link creates a profile |
| Practice reminder | Off | At the hour the player picks, on days they haven't practised. Warns when a streak is about to go out. Stops after a week away |
| Rival alerts | Off | When someone passes you on the road, or a new player joins within two cities. At most one a day |

Alerts that arrive between 22:00 and 08:00 in the player's time zone wait until morning, except a reminder at the time they picked. Players change all of this in Surra under Me → Notifications.

It also keeps two documents fresh for the app: `public/map` (anonymous counts of players per city, shown to guests) and `shared/roster` (everyone on the players map in one document).

## Set up, once

1. Build it: `npm run build` (or just `npm run notifier`) writes `notifier/dist/Code.gs` and `notifier/dist/appsscript.json`.
2. Sign in to [script.google.com](https://script.google.com) with the Google account that owns the Firebase project, and create a new project called **Surra notifier**.
3. In **Project Settings**, tick **Show "appsscript.json" manifest file in editor**.
4. In the editor, replace the contents of `appsscript.json` with `notifier/dist/appsscript.json`, and of `Code.gs` with `notifier/dist/Code.gs`. Save.
5. Choose the `setup` function and press **Run**. Allow the permissions it asks for (Google shows "Google hasn't verified this app": choose **Advanced**, then **Go to Surra notifier**, because it's your own script). The log ends with the **VAPID public key**.
6. **Deploy → New deployment → Web app**, with *Execute as: Me* and *Who has access: Anyone*. Copy the web app URL.
7. In `src/config.js`, set `notifier: { url: '<web app URL>', vapid: '<VAPID public key>' }`, then rebuild and publish the site.
8. Publish `firebase/firestore.rules` in the Firebase console (Firestore Database → Rules).
9. Turn on notifications in Surra (Me → Notifications), then run `testPush` in the editor. It says hej to the most recently active device.

`setup` also starts a trigger that runs `tick` every 10 minutes. `status` logs how things stand.

## Updating

Rebuild, paste the new `Code.gs` over the old one and save. Then **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**, so the web app picks up the new code. The URL stays the same. Run `setup` again only if the script asks for new permissions.

## If Firestore access fails

The script calls Firestore with its owner's Google access and names the Firebase project as the quota project. If the log shows that the Firestore API "has not been used in project …", link the script to the Firebase project's Google Cloud project instead: in the Google Cloud console for `surra-abf91`, set up the OAuth consent screen (External, then publish it), and in Apps Script **Project Settings → Google Cloud Platform (GCP) Project → Change project**, enter the project number `245377506736`. Then run `setup` again.

## Limits

A free Google account allows 20,000 URL fetches and 90 minutes of trigger time a day. Each push is one fetch, and a 10-minute tick takes a second or two, so this covers a few thousand notifications a day. Firestore reads stay small: the notifier reads only what changed since its last run, plus the whole players map every six hours.
