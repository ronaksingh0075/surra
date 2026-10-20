// What does publishing this build take? Compares it with what is live (origin/main) and lists only the steps
// needed, in the order that keeps everything working: security rules, then the notifier, then the site.
// Run it with `npm run release`, which validates and builds first.
const { execSync } = require('child_process');
const sh = cmd => execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();

try { sh('git fetch -q origin main'); } catch (e) { console.log('(Offline: comparing with the last fetched origin/main.)'); }
const changed = path => sh(`git diff --name-only origin/main -- ${path}`) !== '';
const steps = [];
if (changed('firebase/firestore.rules')) steps.push('Publish the security rules: Firebase console, Firestore, Rules. Paste firebase/firestore.rules and press Publish.');
if (changed('notifier/dist/Code.gs')) steps.push('Update the notifier: paste notifier/dist/Code.gs into the Apps Script editor and save, then Deploy, Manage deployments, Edit, New version, Deploy.');
if (changed('docs')) steps.push('Publish the site: commit and push main. GitHub Pages builds it from /docs on main within a minute or two.');

console.log(steps.length ? `To publish this build:\n${steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}` : 'Nothing to publish: this build matches what is live.');
if (steps.length === 1 && changed('docs')) console.log('Only the app changed, so a push is all it takes.');
if (sh('git status --porcelain')) console.log('Note: there are uncommitted changes. Commit them before pushing.');
