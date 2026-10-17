/* ================= Surra typing: å, ä, ö and é, letter help, typing lessons and race paragraphs =================
   Typing goes word by word, like Typeracer: type the highlighted word and a space to move on, fix a slip before
   you can continue. Letter help (on unless you switch it off in Settings) lets a, o and e stand in for å, ä, ö
   and é and forgives capitals, so a keyboard without Swedish letters is no handicap; the on-screen keys insert
   the real letters. The å, ä, ö drill always asks for the real letters: far, får and för are three words. */
const LETTER_BASE = { 'å': 'a', 'ä': 'a', 'ö': 'o', 'é': 'e' };
const TYPE_KEYS = ['å', 'ä', 'ö', 'é'];
// what you'll actually be asked to type: straight punctuation only, no typographic quotes
const typeClean = s => String(s || '').replace(/[“”„"«»]/g, '').replace(/[‘’]/g, "'").replace(/…/g, '...').replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim();
function charOk(typed, want, easy) {
  if (typed === want) return true;
  if (!easy) return false;
  const t = typed.toLowerCase(), w = want.toLowerCase();
  return t === w || LETTER_BASE[w] === t;
}
// how many characters of `typed` match `target` from the start
function matchLen(typed, target, easy) { let i = 0; while (i < typed.length && i < target.length && charOk(typed[i], target[i], easy)) i++; return i; }
// the word that starts at `at`, with its trailing space (the last word has none)
function wordAt(text, at) { const sp = text.indexOf(' ', at); return sp < 0 ? text.slice(at) : text.slice(at, sp + 1); }
const wpmOf = (chars, ms) => (ms > 0 ? Math.round((chars / 5) / (ms / 60000)) : 0);
const accOf = (keys, errs) => (keys > 0 ? Math.max(0, Math.round(100 * (1 - errs / keys))) : 100);
const letterEasy = s => !s || !s.settings || s.settings.letters !== 'exact';

/* ---------- typing lessons */
const LETTER_DRILL = [
  ['far får för', 'father · sheep, or gets · for'],
  ['har hår', 'has · hair'],
  ['kar kär', 'tub · in love'],
  ['matt mätt', 'dull · full, after a meal'],
  ['rost röst', 'rust · voice'],
  ['idé entré', 'idea · entrance'],
  ['Jag är kär i dig.', "I'm in love with you."],
  ['Hon har långt hår.', 'She has long hair.'],
  ['Äntligen fredag!', 'Finally Friday!'],
  ['Öppna fönstret, är du snäll.', 'Open the window, please.'],
  ['Åk försiktigt!', 'Drive safely!'],
];
function typeQ(sid, sv, en, mode, extra) {
  return { kind: 'type', uid: uid(), key: null, sid, sv: typeClean(sv), shown: sv, en, mode: mode || 'see', ...extra };
}
function lessonLetters() {
  const qs = [{ kind: 'card', uid: uid(), sid: null, phrase: ['å · ä · ö', 'Three letters of their own', 'They are separate letters at the end of the alphabet, not a with dots. On a phone, hold a or o to find them. On a computer, tap the keys under the typing box.'] }];
  LETTER_DRILL.forEach(([sv, en]) => qs.push(typeQ(null, sv, en, 'see', { strict: true })));
  return { type: 'type', key: 'type:letters', sid: null, title: 'Typing · Å, ä och ö', questions: qs, requeue: true };
}
function lessonType(sid, mode) {
  const st = STOPS[sid];
  const qs = shuffle(st.phrases.map(p => typeQ(sid, p[0], p[1], mode)));
  return { type: 'type', key: sid + ':type', sid, title: `${st.city} · ${mode === 'hear' ? 'Hear and type' : 'Typing'}`, questions: qs };
}

/* ---------- race paragraphs, one set per level (you race on your current city's level) */
const RACE_TEXTS = {
  A1: [
    'Hej! Jag heter Sam och jag bor i Malmö. Varje morgon tar jag en kaffe på ett litet café nära stationen. Där är det alltid trevligt, och personalen säger hej på svenska.',
    'I Ystad finns det en fin strand. På sommaren badar vi i havet och äter glass. Sedan går vi hem längs vägen och tittar på solen när den går ner.',
    'Min första dag på jobbet i Lund gick bra. Min chef visade mig kontoret, och klockan tre drack vi kaffe tillsammans. Alla var snälla och frågade var jag kommer ifrån.',
    'Tåget till Helsingborg går från spår fyra. Jag köper en biljett i appen och sätter mig vid fönstret. Resan tar bara en halvtimme, så jag hinner läsa lite.',
  ],
  A2: [
    'I Göteborg regnar det ofta, men ingen bryr sig. Man tar på sig en regnjacka och går ut ändå. På helgen åker många ut till skärgården och äter räkor vid vattnet.',
    'Jag ringde vårdcentralen för att boka en tid. Tyvärr var doktorn fullbokad på måndag, så jag fick en tid på torsdag i stället. Det passade mig faktiskt bättre.',
    'Vi var hemma hos Lisa i lördags. Hon hade lagat en fantastisk middag med potatis och lax. Efteråt drack vi kaffe och pratade om allt mellan himmel och jord.',
    'På jobbet tar vi fika två gånger om dagen. Någon tar alltid med sig kanelbullar på fredagar. Det är där man får höra vad som händer på riktigt.',
  ],
  B1: [
    'Jag tycker att man borde cykla mer i stan. Det är både billigare och snabbare än att ta bilen, och man mår bättre av att röra på sig. Dessutom blir luften renare för alla.',
    'På mötet i dag gick vi igenom tidsplanen för hösten. Lanseringen skjuts upp till oktober, vilket påverkar budgeten. Jag tog på mig att sammanställa kundernas synpunkter till nästa vecka.',
    'Paketet som jag beställde för två veckor sedan har fortfarande inte kommit. Jag ringde kundtjänst, och de lovade att skicka ett nytt med expressleverans. Nu hoppas jag att det stämmer.',
    'På intervjun fick jag berätta om en svår situation som jag hade löst. Jag beskrev hur vi hanterade en försenad leverans precis innan en lansering, och vad jag lärde mig av det.',
  ],
  B2: [
    'Det var inte i går vi sågs! Han berättade att han hade flyttat till Sundsvall för jobbet, men att han nog skulle flytta tillbaka till Gävle så småningom. Man vet ju aldrig hur det blir.',
    'Förhandlingen drog ut på tiden. Leverantören höll fast vid sitt pris, men till slut gick de med på en rabatt under förutsättning att vi tecknade ett längre avtal. Alla var nöjda med resultatet.',
    'Plötsligt stod det en älg mitt på vägen. Vi bromsade så hårt vi kunde och stannade bara några meter ifrån den. Älgen tittade lugnt på oss en stund och gick sedan in i skogen igen.',
    'Efter presentationen kom det flera frågor om prognoserna. Jag förklarade att vi hade räknat på ett försiktigare scenario också, och lovade att mejla siffrorna till alla efter mötet.',
  ],
  C1: [
    'Visserligen flyttar många unga från Norrbotten, men bilden är inte så svartvit som den ofta målas upp. Den gröna industrin lockar nya invånare, och distansarbete har fått en del att flytta tillbaka.',
    'Det är ingen ko på isen, sa hon lugnt när kunden ännu inte hade svarat. Deadline var först på fredag, och hon visste av erfarenhet att det brukade lösa sig om man inte ropade hej för tidigt.',
    'Att leda en förändring kräver tålamod. Man måste involvera nyckelpersoner tidigt, lyssna på farhågorna och visa resultat, annars riskerar man att tappa förtroendet hos dem som berörs mest.',
    'Midnattssolen gör något med en. I juni går solen aldrig ner över Kiruna, och det är lätt att tappa känslan för tid. Man äter middag vid midnatt och vandrar i fjällen när resten av landet sover.',
  ],
};
const RACE_LIST = LEVEL_IDS.flatMap(id => RACE_TEXTS[id].map((t, i) => ({ id, i, text: typeClean(t) })));
const raceTextIndex = level => { const base = RACE_LIST.findIndex(x => x.id === level); return base + Math.floor(Math.random() * RACE_TEXTS[level].length); };
const raceText = n => (RACE_LIST[n] || RACE_LIST[0]).text;
// pacer bees for a solo race, in words per minute
const PACERS = { A1: [12, 18, 26], A2: [14, 21, 29], B1: [16, 24, 33], B2: [18, 27, 36], C1: [20, 30, 40] };
const PACER_NAMES = [['Humlan', 'The bumblebee'], ['Biet', 'The bee'], ['Getingen', 'The wasp']];
