/* ================= Surra spoken Swedish: how a written line sounds in everyday speech, plus expert tips =================
   Written Swedish and spoken Swedish drift apart in a few very common words: "jag" is said "ja", "det är" becomes
   "de e", "mig" is "mej". spokenForm() rewrites a line the way most Swedes would say it in a relaxed conversation,
   and spokenTip() adds one expert tip when a phrase has a well-known everyday alternative. */
const SPOKEN_WORDS = {
  jag: 'ja', det: 'de', 'är': 'e', mig: 'mej', dig: 'dej', sig: 'sej', de: 'dom', dem: 'dom',
  'någon': 'nån', 'något': 'nåt', 'några': 'nåra', 'någonting': 'nånting', 'någonstans': 'nånstans',
  'sådan': 'sån', 'sådant': 'sånt', 'sådana': 'såna', sedan: 'sen', vad: 'va', och: 'å', skall: 'ska',
  mycket: 'mycke', sade: 'sa', lade: 'la',
};
const SPOKEN_RE = new RegExp(`(^|[^\\p{L}])(${Object.keys(SPOKEN_WORDS).sort((a, b) => b.length - a.length).join('|')})(?=[^\\p{L}]|$)`, 'giu');
function spokenForm(sv) {
  const src = String(sv || '');
  let out = src.replace(/\bkommer att (?=\p{L})/giu, m => (m[0] === 'K' ? 'Kommer ' : 'kommer '));
  out = out.replace(SPOKEN_RE, (m, pre, w) => {
    const low = w.toLowerCase(), sp = SPOKEN_WORDS[low];
    if (!sp) return m;
    return pre + (w[0] !== low[0] ? sp[0].toUpperCase() + sp.slice(1) : sp);
  });
  return out === src ? null : out;
}
// one tip per phrase: the first that matches. Word edges are worked out with Unicode letters (\b ignores å, ä, ö).
const TW = p => new RegExp('(?:^|[^\\p{L}])(?:' + p + ')(?![\\p{L}])', 'iu');
const TS = p => new RegExp('^(?:' + p + ')(?![\\p{L}])', 'iu');
const SPOKEN_TIPS = [
  [TS('hej(?! då)'), 'Among friends, Swedes often say “Tja!” or “Tjena!” instead of “Hej!”.'],
  [TW('hej då'), 'Goodbyes in real life: “Hej då!”, “Ha det!” or “Vi hörs!” (talk soon).'],
  [TW('hur mår du'), 'Casual: “Hur är läget?” or just “Läget?”. The answer: “Bra, och själv?”.'],
  [TW('tack så mycket'), 'Said quickly it\'s “tack så mycke”, and many Swedes just say “Tackar!”.'],
  [TS('förlåt|ursäkta'), 'For a small slip, plenty of Swedes simply say “Sorry!”.'],
  [TW('förstår (?:inte|du)'), 'Casual Swedes say “fatta” (to get it): “Jag fattar inte”, “Fattar du?”.'],
  [TW('det gör (?:ingenting|inget)'), 'Casual: “Ingen fara!” or “Lugnt!”.'],
  [TW('god morgon'), 'Said “go\'morron”, or just “Morrn!” at home.'],
  [TW('vi ses'), 'Also “Ses!”, “Vi hörs!” (talk soon) or, in Göteborg, “Ha det gött!”.'],
  [TW('jag vet inte|ingen aning'), 'Spoken: “Ja vet inte”, or the shrug words “Vet inte” and “Ingen aning”.'],
  [TW('trevligt att träffas'), 'Casual: “Kul att träffas!”.'],
  [TW('grattis|gratulerar'), '“Grattis!” is the everyday word. “Gratulerar” sounds formal.'],
  [TW('vad synd|tråkigt'), 'Sympathy in speech: “Åh nej!”, “Aj då!” or “Vad synd!”.'],
  [TW('fungerar'), 'In everyday speech “fungerar” becomes “funkar”.'],
  [TW('funkar'), '“Funkar” is the everyday form of “fungerar” (works).'],
  [TW('kan jag få'), '“Kan jag få…?” is the polite everyday way to ask for something, even in a shop.'],
  [TW('okej'), '“Okej då” (okay then) is how Swedes give in, and “Kör!” means let\'s do it.'],
  [TW('jätte\\p{L}+'), '“Jätte-” (giant) makes anything bigger: jättebra, jättegott, jättekul.'],
  [TW('absolut|självklart|visst'), 'Listen for the breathed-in “ja”: Swedes often say yes while inhaling.'],
  [TW('du då|och du'), '“Själv då?” (and yourself?) is another friendly way to bounce a question back.'],
  [TW('ju'), '“Ju” means “as we both know”: a tiny word Swedes use all the time.'],
  [TW('väl'), '“Väl” turns a statement into a hopeful question: “Du kommer väl?” = you\'re coming, right?'],
  [TW('nog'), '“Nog” softens: “Det blir nog bra” = it\'ll probably be fine.'],
  [TW('mejl\\p{L}*'), 'Swedes write “mejl” and “mejla”, a Swedish spelling of email.'],
  [TW('jobb|jobba|jobbar|jobbet'), '“Jobb” and “jobba” are everyday Swedish. “Arbete” and “arbeta” sound written or formal.'],
  [TW('kul'), '“Kul” is the everyday word for fun. “Roligt” works everywhere too.'],
  [TW('fika'), 'Fika works as a verb too: “Ska vi fika?” = shall we have a fika?'],
];
function spokenTip(sv) {
  const t = String(sv || '');
  for (const [re, tip] of SPOKEN_TIPS) if (re.test(t)) return tip;
  return null;
}
const spokenOn = s => !s || !s.settings || s.settings.spoken !== false;
