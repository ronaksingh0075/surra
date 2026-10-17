/* Surra curriculum — levels and A1–A2 stops.
   Reply option: [swedish, english, isBest (1/0), note]
   Build: {en, sv, alt:[other accepted orders], extra:[distractor tiles]}
   Gap:   {sv with ___, en, a: answer, opts, why, cue?} */

const LEVELS = [
  { id: "A1", region: "Skåne", title: "Första orden", en: "First words", rank: "Turist",
    blurb: "Greet people, order a fika, survive your first workday and rescue a conversation when you get lost.",
    stops: ["malmo", "ystad", "lund", "helsingborg"], marker: [150, 862], lab: "right" },
  { id: "A2", region: "Götaland", title: "Vardagen", en: "Everyday life", rank: "Nyinflyttad",
    blurb: "Small talk, booking and rescheduling, dinner invitations and chatting in the break room.",
    stops: ["goteborg", "jonkoping", "linkoping", "norrkoping"], marker: [110, 800], lab: "right" },
  { id: "B1", region: "Svealand", title: "Göra sig förstådd", en: "Making yourself understood", rank: "Stamgäst",
    blurb: "Share opinions, hold your own in meetings, complain effectively and nail a job interview.",
    stops: ["orebro", "vasteras", "uppsala", "stockholm"], marker: [96, 620] },
  { id: "B2", region: "Norrland", title: "Nyanser", en: "Nuance", rank: "Kollega",
    blurb: "Read between the lines, negotiate, tell a good story and handle tough questions after a presentation.",
    stops: ["gavle", "sundsvall", "ostersund", "umea"], marker: [112, 540] },
  { id: "C1", region: "Norrbotten", title: "Briljera", en: "Shine", rank: "Ordkonstnär",
    blurb: "Give hard feedback with grace, debate with nuance, lead change and play with idioms.",
    stops: ["lulea", "jokkmokk", "gallivare", "kiruna"], marker: [190, 262] },
];

const STOPS = {};

/* ───────────── A1 · Skåne ───────────── */

STOPS.malmo = {
  city: "Malmö", level: "A1", reg: "casual", glyph: "tower",
  theme: "Hej!", en: "Greetings & introductions",
  intro: "Say hello, give your name and where you're from, and always ask something back.",
  culture: "Swedes say “hej” to almost everyone, from colleagues to the CEO. It works at work and in a shop alike.",
  phrases: [
    ["Hej! Jag heter Sam.", "Hi! My name is Sam.", "“Hej” works almost everywhere, even at work."],
    ["Vad heter du?", "What's your name?"],
    ["Trevligt att träffas!", "Nice to meet you!"],
    ["Var kommer du ifrån?", "Where are you from?", "The little word “ifrån” often lands at the end of the question."],
    ["Jag kommer från Kanada, men jag bor i Malmö.", "I'm from Canada, but I live in Malmö."],
    ["Hur mår du?", "How are you?"],
    ["Bara bra, tack! Och du?", "Just fine, thanks! And you?", "“Bara bra” is the standard friendly answer."],
    ["Hej då! Vi ses!", "Bye! See you!"],
  ],
  replies: [
    { who: "Your new neighbour", say: "Hej! Vad heter du?", en: "Hi! What's your name?",
      opts: [
        ["Jag heter Sam. Och du?", "My name is Sam. And you?", 1, "Answer, then ask back. “Och du?” keeps the conversation going."],
        ["Jag mår bra, tack. Och du?", "I'm fine, thanks. And you?", 0, "That answers “How are you?”, not “What's your name?”."],
        ["Jag är heter Sam. Och du?", "I am is called Sam. And you?", 0, "“Heter” already means “am called”, so drop “är”: “Jag heter Sam”."],
      ] },
    { who: "A friend of a friend", say: "Hur mår du?", en: "How are you?",
      opts: [
        ["Bara bra, tack! Och du?", "Just fine, thanks! And you?", 1, "The natural, friendly reply, and you ask back."],
        ["Jag heter Alex. Och du?", "My name is Alex. And you?", 0, "That's your name, not how you are."],
        ["Jag är bra, tack! Och du?", "I'm good (at things), thanks! And you?", 0, "“Jag är bra” sounds like you're good at something. For how you feel, use “mår”: “Jag mår bra”."],
      ] },
    { who: "Someone at a party", say: "Var kommer du ifrån?", en: "Where are you from?",
      opts: [
        ["Jag kommer från Kanada.", "I'm from Canada.", 1, "“Komma från” = come from. Clear and correct."],
        ["Jag bor på Storgatan i Malmö.", "I live on Storgatan in Malmö.", 0, "That's where you live, not where you're from."],
        ["Jag kommer till Kanada.", "I'm coming to Canada.", 0, "“Komma till” means to arrive somewhere. Where you're from is “komma från”."],
      ] },
    { who: "Your neighbour, leaving", say: "Hej då! Ha en bra dag!", en: "Bye! Have a good day!",
      opts: [
        ["Tack, detsamma!", "Thanks, same to you!", 1, "“Detsamma” = same to you. The perfect reply to any wish."],
        ["Trevligt att träffas!", "Nice to meet you!", 0, "That's for meeting someone, not for saying goodbye."],
        ["Tack, varsågod!", "Thanks, here you go!", 0, "“Varsågod” is for handing something over or answering a thank-you. To return a wish, say “detsamma”."],
      ] },
    { who: "Someone you just met", say: "Trevligt att träffas!", en: "Nice to meet you!",
      opts: [
        ["Detsamma!", "Likewise!", 1, "Short and natural: likewise!"],
        ["Ha det så bra!", "Take care!", 0, "That's a goodbye. To return “nice to meet you”, say “Detsamma!”."],
        ["Tack, jag mår bra.", "Thanks, I'm fine.", 0, "That answers “How are you?”, a different question."],
      ] },
    { who: "A friend, casually", say: "Tjena! Läget?", en: "Hey! What's up?",
      opts: [
        ["Bra! Och med dig?", "Good! And with you?", 1, "“Läget?” is short for “Hur är läget?” (how are things?). “Och med dig?” bounces it back."],
        ["God morgon, herr Andersson.", "Good morning, Mr Andersson.", 0, "Far too formal for a friend's “Tjena!”."],
        ["Läget är i Malmö.", "The location is in Malmö.", 0, "Here “läget” means how things are, not a location."],
      ] },
  ],
  builds: [
    { en: "My name is Sam. And you?", sv: "Jag heter Sam. Och du?", alt: ["Jag är Sam. Och du?"], extra: ["är", "mår"] },
    { en: "I come from Canada.", sv: "Jag kommer från Kanada.", extra: ["till", "bor"] },
    { en: "Nice to meet you!", sv: "Trevligt att träffas!", extra: ["träffa", "och"] },
  ],
  gaps: [],
  talk: {
    title: "Nya grannen", scene: "You've just moved into a building in Malmö and meet your neighbour Elin by the mailboxes.",
    who: "Elin, your neighbour", persona: "Friendly and chatty, in her thirties, has lived in the building for years.",
    goals: ["Greet Elin and say your name", "Say where you're from", "Ask Elin a question back", "Say goodbye politely"],
    open: "Hej! Är du ny här i huset?", open_en: "Hi! Are you new in the building?",
    hint: "Say yes and give your name: “Ja, jag heter…”",
  },
};

STOPS.ystad = {
  city: "Ystad", level: "A1", reg: "casual", glyph: "stones",
  theme: "En fika, tack", en: "At the café: ordering & paying",
  intro: "Order a coffee and a bun, answer the barista's questions and pay without stress.",
  culture: "Fika is a coffee break, a ritual and a verb: “Ska vi fika?” Many cafés only take cards or Swish.",
  phrases: [
    ["En kaffe, tack.", "A coffee, please."],
    ["Jag skulle vilja ha en kanelbulle.", "I'd like a cinnamon bun.", "“Jag skulle vilja ha…” = I would like… Polite and very common."],
    ["Vad kostar det?", "How much is it?"],
    ["Kan jag betala med kort?", "Can I pay by card?", "Many Swedish cafés are card-only."],
    ["Har ni havremjölk?", "Do you have oat milk?", "“Ni” = you (plural): the café as a business."],
    ["Det blir 45 kronor.", "That'll be 45 kronor.", "“Det blir…” is how staff tell you the total."],
    ["Ska du äta här eller ta med?", "Are you eating here or taking it away?"],
    ["Tack så mycket! Ha det bra!", "Thanks a lot! Take care!"],
  ],
  replies: [
    { who: "Barista", say: "Hej! Vad får det lov att vara?", en: "Hi! What can I get you?",
      opts: [
        ["Jag skulle vilja ha en kaffe, tack.", "I'd like a coffee, please.", 1, "Polite and natural. “Vad får det lov att vara?” is the classic counter question."],
        ["Jag skulle vilja vara en kaffe, tack.", "I'd like to be a coffee, please.", 0, "You'd like to be a coffee? The verb you want is “ha”: “Jag skulle vilja ha en kaffe”."],
        ["Ge mig en kaffe, och snabbt.", "Give me a coffee, and fast.", 0, "Sounds bossy in Swedish too. Use “Jag skulle vilja ha…” or just “En kaffe, tack”."],
      ] },
    { who: "Barista", say: "Ska du äta här eller ta med?", en: "Eating here or taking away?",
      opts: [
        ["Ta med, tack.", "Take away, please.", 1, "Short and perfect."],
        ["Ja, tack, gärna det.", "Yes, thanks, I'd love that.", 0, "It's an either-or question, so “ja” doesn't choose. Say “Här, tack” or “Ta med, tack”."],
        ["Jag tar bort, tack.", "I'll remove it, thanks.", 0, "“Ta bort” means remove or delete. Takeaway is “ta med”."],
      ] },
    { who: "Barista", say: "Det blir 52 kronor.", en: "That'll be 52 kronor.",
      opts: [
        ["Kan jag betala med kort?", "Can I pay by card?", 1, "Natural: ask about card. Most cafés prefer it."],
        ["Hur mycket blir det?", "How much will it be?", 0, "She just told you: 52 kronor."],
        ["Nej tack, det är för mycket för mig.", "No thanks, that's too much for me.", 0, "Haggling isn't a thing in Swedish cafés."],
      ] },
    { who: "Barista", say: "Vill du ha kvittot?", en: "Do you want the receipt?",
      opts: [
        ["Nej tack, det behövs inte.", "No thanks, that's not needed.", 1, "“Det behövs inte” is a polite no."],
        ["Nej tack, det behöver inte.", "No thanks, it doesn't need.", 0, "You want “behövs” (is needed): “det behövs inte”. “Det behöver inte” leaves the sentence hanging."],
        ["Ja tack, det behövs inte.", "Yes please, it's not needed.", 0, "“Ja tack” means yes please, which clashes with “not needed”."],
      ] },
    { who: "Barista", say: "Något mer?", en: "Anything else?",
      opts: [
        ["Nej, det var allt. Tack!", "No, that's all. Thanks!", 1, "“Det var allt” = that's all. Note the past tense, which is idiomatic here."],
        ["Nej, jag har inget mer. Tack!", "No, I don't have anything else. Thanks!", 0, "“Något mer?” asks if you want anything else, not what you have."],
        ["Nej tack, jag är mätt nu.", "No thanks, I'm full now.", 0, "“Jag är mätt” is for turning down more food at the table. At the till, say “Det var allt”."],
      ] },
    { who: "A friend", say: "Ska vi fika?", en: "Shall we have a fika?",
      opts: [
        ["Ja, gärna! Var då?", "Yes, I'd love to! Where?", 1, "“Gärna” = gladly, the warmest yes. “Var då?” = where, then?"],
        ["Nej, jag har kaffe.", "No, I have coffee.", 0, "Fika is the break and the company, not just the coffee."],
        ["Ja, jag fikar gärna själv.", "Yes, I like to have fika on my own.", 0, "Fika is about the company. Saying you'll have it alone turns the invitation down."],
      ] },
  ],
  builds: [
    { en: "I would like a cinnamon bun.", sv: "Jag skulle vilja ha en kanelbulle.", extra: ["vill", "ett"] },
    { en: "Can I pay by card?", sv: "Kan jag betala med kort?", extra: ["på", "betalar"] },
    { en: "No, that's all. Thanks!", sv: "Nej, det var allt. Tack!", alt: ["Nej tack, det var allt."], extra: ["mycket", "någon"] },
  ],
  gaps: [],
  talk: {
    title: "Fika på torget", scene: "A cosy café on the main square in Ystad. Order a drink and a pastry, ask about the menu, and pay.",
    who: "Jonas, the barista", persona: "Cheerful and quick, uses typical counter phrases like “Vad får det lov att vara?” and “Något mer?”.",
    goals: ["Order a drink and something to eat", "Ask a question about the menu", "Pay and say thanks"],
    open: "Hej hej! Vad får det lov att vara?", open_en: "Hi there! What can I get you?",
    hint: "Order politely: “Jag skulle vilja ha…”",
  },
};

STOPS.lund = {
  city: "Lund", level: "A1", reg: "pro", glyph: "church",
  theme: "Ny på jobbet", en: "Your first day at work",
  intro: "Introduce yourself and your role, find your way around and ask colleagues for help.",
  culture: "Swedish workplaces are flat: you use “du” with everyone and the 3 o'clock fika is close to sacred.",
  phrases: [
    ["Hej, jag heter Sam. Jag är ny här.", "Hi, I'm Sam. I'm new here."],
    ["Jag ska jobba med marknadsanalys.", "I'm going to work with market analysis.", "“Jobba med” = work with/on. It's how Swedes describe their job."],
    ["Vad jobbar du med?", "What do you do (for work)?"],
    ["Var ligger köket?", "Where's the kitchen?", "The office kitchen is where fika happens."],
    ["Kan du hjälpa mig med en sak?", "Can you help me with something?"],
    ["Vem ska jag prata med om det?", "Who should I talk to about that?"],
    ["Tack för hjälpen!", "Thanks for the help!"],
    ["Vi ses på mötet!", "See you at the meeting!"],
  ],
  replies: [
    { who: "Your new manager", say: "Välkommen! Hur känns det?", en: "Welcome! How does it feel?",
      opts: [
        ["Tack! Det känns bra, lite nervöst bara.", "Thanks! It feels good, just a bit nervous.", 1, "Honest and natural. “Lite nervöst bara” = just a bit nervous."],
        ["Tack! Det känns kallt, lite blåsigt bara.", "Thanks! It feels cold, just a bit windy.", 0, "That's about the weather, not your first day!"],
        ["Tack! Jag känner bra, lite nervös bara.", "Thanks! I know well, just a bit nervous.", 0, "“Känna” needs “mig” here: “Jag känner mig lite nervös”. Or say “Det känns bra”."],
      ] },
    { who: "A colleague", say: "Vad ska du jobba med här?", en: "What will you be working on here?",
      opts: [
        ["Jag ska jobba med marknadsanalys.", "I'm going to work with market analysis.", 1, "“Jobba med” + your field. Exactly right."],
        ["Jag ska börja jobba på måndag.", "I'm going to start work on Monday.", 0, "Says when, not what."],
        ["Jag ska jobba på kontoret i Lund.", "I'm going to work at the office in Lund.", 0, "Says where, not what."],
      ] },
    { who: "A colleague", say: "Behöver du hjälp med något?", en: "Do you need help with anything?",
      opts: [
        ["Ja, gärna! Hur loggar jag in?", "Yes, please! How do I log in?", 1, "Accept warmly with “gärna”, then ask something concrete."],
        ["Ja, jag hjälper dig gärna med det!", "Yes, I'd be happy to help you with that!", 0, "Roles reversed: they offered to help you."],
        ["Ja, jag behöver hjälpa med något.", "Yes, I need to help with something.", 0, "“Hjälpa” is the verb (to help). You need “hjälp” (help, the noun): “Ja, jag behöver hjälp”."],
      ] },
    { who: "Receptionist", say: "Har du fått ditt passerkort?", en: "Have you got your access card?",
      opts: [
        ["Nej, inte än. Var hämtar jag det?", "No, not yet. Where do I pick it up?", 1, "“Inte än” = not yet."],
        ["Ja, jag har passerat kortet i dag.", "Yes, I've passed the card today.", 0, "“Passera” means to pass by. They're asking whether you've got your access card."],
        ["Nej, jag har inte fått än det.", "No, I haven't got yet it.", 0, "“Än” goes last: “Jag har inte fått det än”."],
      ] },
    { who: "A colleague", say: "Vi brukar fika klockan tre. Häng med!", en: "We usually have fika at three. Come along!",
      opts: [
        ["Gärna! Var brukar ni sitta?", "I'd love to! Where do you usually sit?", 1, "A warm yes plus a question. Never skip fika on day one."],
        ["Jag brukar inte fika på jobbet.", "I don't usually have fika at work.", 0, "Sounds dismissive on your first day. Fika is where you get to know people."],
        ["Nej tack, jag dricker inte kaffe.", "No thanks, I don't drink coffee.", 0, "Fika doesn't have to mean coffee: tea or juice works too. Saying no on day one is a missed chance."],
      ] },
    { who: "Your manager", say: "Jag har bokat ett möte med teamet klockan tio.", en: "I've booked a meeting with the team at ten.",
      opts: [
        ["Toppen, tack! Var är mötet?", "Great, thanks! Where's the meeting?", 1, "Confirm and ask a practical question."],
        ["Perfekt. Vilken rum är det i?", "Perfect. Which room is it in? (wrong form)", 0, "“Rum” is an ett-word, so it's “vilket rum”."],
        ["Perfekt. Vilken rummet är det i?", "Perfect. Which the room is it in?", 0, "After “vilket” use the plain form, and “rum” is an ett-word: “vilket rum”."],
      ] },
  ],
  builds: [
    { en: "Hi, I'm Sam. I'm new here.", sv: "Hej, jag heter Sam. Jag är ny här.", alt: ["Hej, jag är ny här. Jag heter Sam."], extra: ["nya", "hit"] },
    { en: "Can you help me with something?", sv: "Kan du hjälpa mig med en sak?", extra: ["jag", "ett"] },
    { en: "Who should I talk to?", sv: "Vem ska jag prata med?", extra: ["vad", "till"] },
  ],
  gaps: [],
  talk: {
    general: {
      title: "Första dagen", scene: "Your first morning at a new office in Lund. A colleague, Karin, shows you around.",
      who: "Karin, a colleague", persona: "Helpful project coordinator, chatty, proud of the office coffee machine.",
      goals: ["Introduce yourself and your role", "Ask where something is", "Ask Karin what she works with", "Thank her for the help"],
      open: "Hej! Du måste vara den nya. Välkommen!", open_en: "Hi! You must be the new one. Welcome!",
      hint: "Introduce yourself: “Hej, jag heter… Jag är ny här.”",
    },
    life: {
      title: "Första dagen på Medicon Village", scene: "Your first day at a life-science company at Medicon Village in Lund. Ahmed from the medical affairs team welcomes you.",
      who: "Ahmed, medical affairs", persona: "Warm, a little nerdy about science, loves explaining who does what in the company.",
      goals: ["Introduce yourself and your role", "Ask where something is", "Ask Ahmed what he works with", "Thank him for the help"],
      open: "Hej och välkommen till Medicon Village! Är det du som börjar i dag?", open_en: "Hi and welcome to Medicon Village! Are you the one starting today?",
      hint: "Say yes and introduce yourself: “Ja, det är jag! Jag heter…”",
    },
  },
};

STOPS.helsingborg = {
  city: "Helsingborg", level: "A1", reg: "mixed", glyph: "keep",
  theme: "Förlåt, vad sa du?", en: "When you don't understand",
  intro: "Ask people to repeat, slow down or explain, and check that you understood. Your most useful survival skill.",
  culture: "Many Swedes switch to English the moment you hesitate. “Kan vi fortsätta på svenska?” usually keeps them in Swedish.",
  phrases: [
    ["Förlåt, vad sa du?", "Sorry, what did you say?"],
    ["Kan du prata lite långsammare?", "Can you speak a bit more slowly?"],
    ["Jag förstår inte riktigt.", "I don't quite understand."],
    ["Vad betyder “lagom”?", "What does “lagom” mean?"],
    ["Hur säger man “deadline” på svenska?", "How do you say “deadline” in Swedish?", "Swedes often just say “deadline” too!"],
    ["Kan du säga det igen?", "Can you say that again?"],
    ["Jag pratar bara lite svenska.", "I only speak a little Swedish."],
    ["Menar du att…?", "Do you mean that…?", "Great for checking that you understood."],
  ],
  replies: [
    { who: "A stranger at the station, speaking fast", say: "Ursäkta, vet du om tåget till Göteborg går från spår fyra eller fem?", en: "Excuse me, do you know if the train to Gothenburg leaves from track four or five?",
      cue: "You didn't catch that.",
      opts: [
        ["Förlåt, kan du prata lite långsammare?", "Sorry, can you speak a bit more slowly?", 1, "When it's too fast, ask them to slow down. People are happy to."],
        ["Ja, tåget går från spår fyra eller fem.", "Yes, the train leaves from track four or five.", 0, "You didn't catch the question, so don't guess. Ask them to slow down."],
        ["Förlåt, kan du prata lite högre?", "Sorry, can you speak a bit louder?", 0, "The problem was speed, not volume: ask for “långsammare”."],
      ] },
    { who: "A colleague", say: "Det är lagom varmt i dag.", en: "It's nicely warm today.",
      cue: "You don't know the word “lagom”.",
      opts: [
        ["Vad betyder “lagom”?", "What does “lagom” mean?", 1, "Ask! “Lagom” means just right, not too much, not too little."],
        ["Ja, det är för varmt i dag.", "Yes, it's too warm today.", 0, "“Lagom” means just right, not too warm. If you don't know a word, ask."],
        ["Vad heter “lagom” på svenska?", "What's “lagom” in Swedish?", 0, "That asks for a Swedish word, but “lagom” already is one. Ask “Vad betyder…?” (what does … mean?)."],
      ] },
    { who: "Your landlord on the phone", say: "Du behöver felanmäla det via hemsidan.", en: "You need to report the fault via the website.",
      cue: "You're not sure what “felanmäla” means.",
      opts: [
        ["Förlåt, menar du att jag ska fylla i ett formulär?", "Sorry, do you mean I should fill in a form?", 1, "Checking with “Menar du att…?” shows what you understood."],
        ["Okej, tack så mycket! Då gör jag det i morgon. Hej då!", "Okay, thanks a lot! Then I'll do it tomorrow. Bye!", 0, "Agreeing to something you didn't understand rarely ends well. Check what they mean first."],
        ["Jag förstår. Jag felanmäler dig på hemsidan.", "I understand. I'll report you on the website.", 0, "You report a fault, like a leak, not a person. And you weren't sure what the word meant."],
      ] },
    { who: "A shop assistant", say: "Vill du ha en påse?", en: "Do you want a bag?",
      cue: "You understood. Answer politely.",
      opts: [
        ["Nej tack, jag har en egen.", "No thanks, I have my own.", 1, "Polite and very Swedish: bags cost extra."],
        ["Förlåt, kan du säga det en gång till?", "Sorry, can you say that once more?", 0, "You understood, so just answer."],
        ["Nej tack, jag har ett eget.", "No thanks, I have my own. (wrong form)", 0, "“Påse” is an en-word, so it's “en egen”."],
      ] },
    { who: "A new acquaintance", say: "Pratar du svenska?", en: "Do you speak Swedish?",
      opts: [
        ["Lite grann! Jag lär mig fortfarande.", "A little! I'm still learning.", 1, "“Lite grann” = a little bit. Saying you're learning invites patience."],
        ["Ja, lite grann. Jag håller på att lära!", "Yes, a little. I'm in the middle of teaching!", 0, "“Lära” without “mig” sounds like teaching. Learning is “lära sig”: “jag håller på att lära mig”."],
        ["Ja, lite grann. Jag håller på att lära dig!", "Yes, a little. I'm teaching you!", 0, "“Lära dig” means teach you. Learning is “lära mig”."],
      ] },
    { who: "A colleague", say: "Kan du skicka rapporten innan fyra?", en: "Can you send the report before four?",
      cue: "You think you heard “innan fyra” but want to be sure.",
      opts: [
        ["Menar du klockan fyra i dag?", "Do you mean four o'clock today?", 1, "Confirming times and dates is smart, especially at work."],
        ["Ja, jag skickar fyra rapporter.", "Yes, I'll send four reports.", 0, "“Innan fyra” means before four o'clock, not four reports."],
        ["Menar du efter klockan fyra?", "Do you mean after four o'clock?", 0, "“Innan” means before, so asking about “efter” (after) shows you misheard."],
      ] },
  ],
  builds: [
    { en: "Can you speak a bit more slowly?", sv: "Kan du prata lite långsammare?", extra: ["långsam", "mer"] },
    { en: "I don't quite understand.", sv: "Jag förstår inte riktigt.", extra: ["förstå", "rätt"] },
    { en: "How do you say “deadline” in Swedish?", sv: "Hur säger man deadline på svenska?", extra: ["vad", "i"] },
  ],
  gaps: [],
  talk: {
    title: "På stationen", scene: "At Helsingborg Central. A station worker gives you information, fast. Use your rescue phrases to get what you need.",
    who: "Mats, a station worker", persona: "Kind but speaks quickly, uses a few Skåne expressions, gives details like track numbers and delays.",
    goals: ["Find out which track your train leaves from", "Ask him to repeat or slow down at least once", "Check that you understood the key detail", "Thank him"],
    open: "Hej! Vart ska du?", open_en: "Hi! Where are you headed?",
    hint: "Say where you're going: “Jag ska till Göteborg.”",
  },
};

/* ───────────── A2 · Götaland ───────────── */

STOPS.goteborg = {
  city: "Göteborg", level: "A2", reg: "casual", glyph: "ship",
  theme: "Småprat", en: "Small talk: weather, weekends, hobbies",
  intro: "Keep a light conversation going: comment on the weather, talk about your weekend and show interest.",
  culture: "Weather talk is the safest opener in Sweden, and Gothenburgers are famous for joking about their rain.",
  phrases: [
    ["Vilket väder!", "What weather!", "Works for sunshine and storms. Your tone does the work."],
    ["Vad gjorde du i helgen?", "What did you do at the weekend?"],
    ["Jag var ute och gick i skärgården.", "I was out walking in the archipelago.", "“Var ute och gick” = was out walking. A very Swedish construction."],
    ["Det låter mysigt!", "That sounds cosy!"],
    ["Vad gör du på fritiden?", "What do you do in your free time?"],
    ["Jag gillar att laga mat och spela padel.", "I like cooking and playing padel.", "Padel is a national obsession."],
    ["Har du några planer för helgen?", "Do you have any plans for the weekend?"],
    ["Nej, vad kul!", "Oh, how fun!", "“Nej” isn't “no” here. It signals happy surprise."],
  ],
  replies: [
    { who: "A neighbour in the stairwell", say: "Usch, vilket regn i dag!", en: "Ugh, what rain today!",
      opts: [
        ["Ja, verkligen! Typiskt Göteborg.", "Yes, really! Typical Gothenburg.", 1, "Agree and add a small comment. Classic weather talk."],
        ["Tack, detsamma! Typiskt Göteborg.", "Thanks, same to you! Typical Gothenburg.", 0, "“Detsamma” returns a wish. “Usch” is a complaint, so agree with it instead."],
        ["Ja, vilket regn i går!", "Yes, what rain yesterday!", 0, "She's talking about today's rain. “I går” is yesterday."],
      ] },
    { who: "A colleague on Monday", say: "Vad gjorde du i helgen?", en: "What did you do at the weekend?",
      opts: [
        ["Jag var på en konsert i lördags. Och du?", "I went to a concert on Saturday. And you?", 1, "Past tense + “i lördags” (last Saturday) + you ask back."],
        ["Jag ska på en konsert i helgen. Och du?", "I'm going to a concert this weekend. And you?", 0, "“Ska” is future, but the weekend is over. Use the past: “Jag var på…”."],
        ["Jag har varit på en konsert i lördags.", "I have been to a concert last Saturday.", 0, "With a finished time like “i lördags”, Swedish uses the past tense: “Jag var på en konsert”."],
      ] },
    { who: "A friend", say: "Jag ska åka till Marstrand i helgen!", en: "I'm going to Marstrand this weekend!",
      opts: [
        ["Vad härligt! Vad ska du göra där?", "How lovely! What are you going to do there?", 1, "React with interest, then ask a follow-up question."],
        ["Åh, vad kul! Har du badat?", "Oh, how fun! Have you been swimming?", 0, "They haven't gone yet. Ask about the plan: “Ska du bada?”"],
        ["Åh, vad kul! Ska du bad?", "Oh, how fun! Will you bath?", 0, "After “ska” comes the infinitive: “Ska du bada?”."],
      ] },
    { who: "Someone at a party", say: "Vad gör du på fritiden?", en: "What do you do in your free time?",
      opts: [
        ["Jag spelar padel och lagar mat. Och du?", "I play padel and cook. And you?", 1, "Two hobbies and a question back. Smooth."],
        ["Jag gör padel och lagar mat. Och du?", "I do padel and cook. And you?", 0, "You “spela” (play) padel, you don't “göra” it."],
        ["Jag är fri på lördag och söndag. Och du?", "I'm free on Saturday and Sunday. And you?", 0, "That says when you're free, not what you do in your free time."],
      ] },
    { who: "A colleague", say: "Har du några planer för helgen?", en: "Any plans for the weekend?",
      opts: [
        ["Inget speciellt, bara ta det lugnt. Du då?", "Nothing special, just take it easy. What about you?", 1, "“Ta det lugnt” = take it easy. “Du då?” = what about you?"],
        ["Inget speciell, bara ta det lugnt. Du då?", "Nothing special, just take it easy. What about you? (wrong form)", 0, "With “inget” the adjective takes -t: “inget speciellt”."],
        ["Ja, jag ska planera helgen nästa vecka.", "Yes, I'll plan the weekend next week.", 0, "A bit late for this weekend! And it doesn't say what you'll do."],
      ] },
    { who: "A friend", say: "Jag har fått nytt jobb!", en: "I've got a new job!",
      opts: [
        ["Nej, vad roligt! Grattis!", "Oh, how great! Congrats!", 1, "“Nej, vad roligt!” shows delighted surprise."],
        ["Nej, vad tråkigt! Grattis!", "Oh, how sad! Congrats!", 0, "“Vad tråkigt” means how sad (or boring). For good news, say “Vad roligt!”."],
        ["Jaså? Varför har du fått det?", "Really? Why did you get it?", 0, "Asking why they got it sounds like you doubt them. Congratulate first."],
      ] },
  ],
  builds: [
    { en: "What did you do at the weekend?", sv: "Vad gjorde du i helgen?", extra: ["gör", "till"] },
    { en: "That sounds cosy!", sv: "Det låter mysigt!", extra: ["ser", "mysig"] },
    { en: "On Saturday I went to a concert.", sv: "I lördags gick jag på konsert.", alt: ["Jag gick på konsert i lördags."], extra: ["går", "till"],
      note: "Time first, verb second, then the subject: “I lördags gick jag…”" },
  ],
  gaps: [
    { sv: "Jag ___ på bio i går.", en: "I went to the cinema yesterday.", a: "gick", opts: ["gick", "går", "ska gå"], why: "“I går” (yesterday) needs the past tense: “gick”." },
  ],
  talk: {
    title: "Småprat på spårvagnen", scene: "On a Gothenburg tram you bump into Linnea, a friend of a friend. Chat until your stop.",
    who: "Linnea", persona: "Relaxed Gothenburger who loves the archipelago and padel, jokes about the rain.",
    goals: ["Comment on the weather", "Say what you did last weekend (past tense)", "Ask about her hobbies and react with interest", "End the chat when you reach your stop"],
    open: "Nej men hej! Vilket väder, va? Det har regnat hela veckan.", open_en: "Oh, hi! What weather, huh? It's rained all week.",
    hint: "Agree about the weather: “Ja, verkligen! …”",
  },
};

STOPS.jonkoping = {
  city: "Jönköping", level: "A2", reg: "pro", glyph: "match",
  theme: "Boka och ändra", en: "Booking & rescheduling",
  intro: "Book a meeting, suggest times, move it politely and confirm. On the phone and by email.",
  culture: "Swedes often answer the phone with their name: “Hej, det är Johanna.” Do the same when you call.",
  phrases: [
    ["Skulle vi kunna boka ett möte nästa vecka?", "Could we book a meeting next week?"],
    ["Passar det på tisdag klockan tio?", "Does Tuesday at ten suit you?"],
    ["Det passar bra.", "That works well."],
    ["Tyvärr kan jag inte då.", "Unfortunately I can't then."],
    ["Skulle det gå att flytta mötet till torsdag?", "Would it be possible to move the meeting to Thursday?", "“Skulle det gå att…?” is a soft, polite way to ask for a change."],
    ["Jag skickar en kalenderinbjudan.", "I'll send a calendar invite."],
    ["Kan vi ses digitalt i stället?", "Can we meet online instead?", "“Digitalt” or “på Teams” both work."],
    ["Jag återkommer så snart som möjligt.", "I'll get back to you as soon as possible.", "“Återkomma” = get back to someone. A workplace essential."],
  ],
  replies: [
    { who: "A client on the phone", say: "Hej, jag skulle vilja boka ett möte med dig. När passar det?", en: "Hi, I'd like to book a meeting with you. When suits you?",
      opts: [
        ["Absolut! Passar det på onsdag klockan nio?", "Of course! Does Wednesday at nine suit you?", 1, "Propose a concrete time. Efficient and friendly."],
        ["Absolut! Det passar mig, tack så mycket.", "Of course! That suits me, thanks a lot.", 0, "Polite, but it doesn't answer “när?” (when). Suggest a time."],
        ["Absolut! Jag passar på onsdag klockan nio.", "Of course! I'll seize the moment on Wednesday at nine.", 0, "The subject should be “det”: “Passar det på onsdag?”. “Jag passar på” means I'll take the chance."],
      ] },
    { who: "A colleague in a chat", say: "Kan vi flytta vårt möte till fredag?", en: "Can we move our meeting to Friday?",
      opts: [
        ["Absolut, fredag förmiddag funkar för mig.", "Sure, Friday morning works for me.", 1, "“Funkar” = works. Relaxed but professional."],
        ["Nej, våra möten är alltid på torsdagar.", "No, our meetings are always on Thursdays.", 0, "Rigid and unhelpful when someone asks to reschedule."],
        ["Absolut, jag flyttar till fredag förmiddag.", "Sure, I'm moving to Friday morning.", 0, "“Jag flyttar till…” sounds like you're moving house. Say “fredag funkar” or “vi flyttar det”."],
      ] },
    { who: "A receptionist", say: "Tyvärr är doktorn fullbokad på måndag.", en: "Unfortunately the doctor is fully booked on Monday.",
      opts: [
        ["Okej. Finns det någon tid senare i veckan?", "Okay. Is there a time later in the week?", 1, "Ask for alternatives with “Finns det någon tid…?”"],
        ["Okej, då kommer jag på måndag ändå.", "Okay, then I'll come on Monday anyway.", 0, "Ignores “fullbokad” (fully booked)."],
        ["Okej. Finns det någon tid förra veckan?", "Okay. Is there a time last week?", 0, "“Förra veckan” is last week. You mean “senare i veckan” or “nästa vecka”."],
      ] },
    { who: "Your manager", say: "Jag hinner tyvärr inte i dag. Kan vi ta det i morgon i stället?", en: "Unfortunately I don't have time today. Can we do it tomorrow instead?",
      opts: [
        ["Absolut. Säg bara när det passar dig.", "Of course. Just say when suits you.", 1, "Flexible and moves things forward."],
        ["Inga problem. Vilken tid passade dig?", "No problem. What time suited you?", 0, "“Passade” is past tense. For tomorrow, ask “Vilken tid passar dig?”."],
        ["Inga problem. Vilken tid passar du?", "No problem. What time do you suit?", 0, "The time suits you: “passar dig”. “Passar du” means “do you suit?”."],
      ] },
    { who: "A partner company, by email", say: "Tack för ditt mejl. Vi återkommer under veckan.", en: "Thanks for your email. We'll get back to you during the week.",
      opts: [
        ["Tack! Jag ser fram emot att höra från er.", "Thanks! I look forward to hearing from you.", 1, "“Se fram emot” = look forward to. “Er” = you (plural, the company)."],
        ["Tack! Jag återkommer till er under veckan.", "Thanks! I'll get back to you during the week.", 0, "They're getting back to you, not the other way round."],
        ["Tack! Jag ser fram emot att höra er.", "Thanks! I look forward to hearing you.", 0, "You “höra från” someone who gets in touch. “Höra er” means listening to them."],
      ] },
    { who: "A colleague", say: "Ska vi ses på kontoret eller digitalt?", en: "Shall we meet at the office or online?",
      opts: [
        ["Digitalt passar mig bäst, om det går bra.", "Online suits me best, if that's okay.", 1, "A clear preference, softened with “om det går bra”."],
        ["Ja, gärna! Det låter jättebra för mig.", "Yes, gladly! That sounds great to me.", 0, "It's an either-or question, so “ja” doesn't choose."],
        ["Jag ses digitalt, om det går bra för dig.", "I meet each other online, if that's okay with you.", 0, "“Ses” is reciprocal and needs “vi”: “Vi ses digitalt”."],
      ] },
  ],
  builds: [
    { en: "Does Tuesday at ten work?", sv: "Passar det på tisdag klockan tio?", extra: ["passa", "i"] },
    { en: "Could we move the meeting to Thursday?", sv: "Skulle vi kunna flytta mötet till torsdag?", extra: ["möte", "på"] },
    { en: "I'll get back to you as soon as possible.", sv: "Jag återkommer så snart som möjligt.", extra: ["kommer", "mer"] },
  ],
  gaps: [
    { sv: "Tyvärr ___ jag inte på fredag.", en: "Unfortunately I can't on Friday.", a: "kan", opts: ["kan", "vill", "måste"], why: "“Kan inte” = can't. “Vill inte” would mean you don't want to, which sounds rude." },
  ],
  talk: {
    general: {
      title: "Boka om mötet", scene: "You call Johanna, a project manager at a partner company in Jönköping, to move Thursday's meeting. Find a new time that works for both.",
      who: "Johanna, project manager", persona: "Efficient, polite and busy. Offers a couple of alternatives and likes clear confirmations.",
      goals: ["Explain that you need to move the meeting", "Suggest a new day and time", "Agree on meeting in person or online", "Confirm and say you'll send an invite"],
      open: "Hej, det är Johanna Lind.", open_en: "Hi, this is Johanna Lind.",
      hint: "Say who you are and why you call: “Hej, det är… Jag ringer om vårt möte på torsdag.”",
    },
    life: {
      title: "Boka möte med kliniken", scene: "You call the medical clinic at Ryhov hospital in Jönköping to book a short meeting with the chief physician to present new study data.",
      who: "Eva, medical secretary", persona: "Polite but protective of the doctors' time. Asks what the meeting is about and how long it takes.",
      goals: ["Say who you are and why you're calling", "Ask to book a meeting with the chief physician", "Agree on a day and time, or a digital meeting", "Confirm the details and thank her"],
      open: "Medicinkliniken på Ryhov, det är Eva.", open_en: "Medical clinic at Ryhov, this is Eva.",
      hint: "Introduce yourself and your company: “Hej, jag heter… och ringer från…”",
    },
  },
};

STOPS.linkoping = {
  city: "Linköping", level: "A2", reg: "casual", glyph: "plane",
  theme: "Hemma hos", en: "Invitations & visiting",
  intro: "Accept or decline invitations, behave like a perfect guest and thank your host the Swedish way.",
  culture: "Take your shoes off indoors, arrive on time, and say “Tack för senast” the next time you see your host.",
  phrases: [
    ["Vill du komma på middag på lördag?", "Would you like to come for dinner on Saturday?"],
    ["Ja, gärna! Vad ska jag ta med?", "Yes, I'd love to! What should I bring?"],
    ["Tyvärr kan jag inte, men tack för inbjudan!", "Unfortunately I can't, but thanks for the invite!"],
    ["Ska jag ta av mig skorna?", "Should I take my shoes off?", "In Sweden you almost always take your shoes off indoors."],
    ["Vad gott det här är!", "This is delicious!"],
    ["Får jag ta lite till?", "May I have a bit more?"],
    ["Tack för maten!", "Thanks for the food!", "Said at the end of every meal, even at home."],
    ["Tack för senast!", "Thanks for last time!", "Said the next time you see or message your host. Forgetting it is a classic faux pas."],
  ],
  replies: [
    { who: "A colleague", say: "Vi har lite folk hemma på fredag. Vill du komma?", en: "We're having a few people over on Friday. Do you want to come?",
      opts: [
        ["Ja, gärna! Vad ska jag ta med?", "Yes, I'd love to! What should I bring?", 1, "Warm yes plus the classic guest question."],
        ["Ja, jag kommer på fredag till jobbet.", "Yes, I'm coming to work on Friday.", 0, "That's about work, not the party."],
        ["Ja, gärna! Vad ska jag ta av?", "Yes, I'd love to! What should I take off?", 0, "“Ta av” means take off. The guest question is “Vad ska jag ta med?” (what should I bring?)."],
      ] },
    { who: "Your host at the door", say: "Välkommen! Kom in, kom in!", en: "Welcome! Come in, come in!",
      opts: [
        ["Tack så mycket! Vad fint ni har det.", "Thanks so much! What a lovely home you have.", 1, "Thanks plus a compliment on their home: a perfect arrival."],
        ["Tack! Ska jag ta på mig skorna?", "Thanks! Should I put my shoes on?", 0, "“Ta på mig” means put on. In Swedish homes you take them off: “ta av mig skorna”."],
        ["Tack! Ska jag ta av skorna mig?", "Thanks! Should I take off the shoes myself?", 0, "The reflexive comes before the object: “ta av mig skorna”."],
      ] },
    { who: "Your host at dinner", say: "Hur smakar det?", en: "How does it taste?",
      opts: [
        ["Jättegott! Har du lagat det själv?", "Delicious! Did you cook it yourself?", 1, "Compliment + question: perfect dinner talk."],
        ["Det smakar som mat. Har du köpt det?", "It tastes like food. Did you buy it?", 0, "Faint praise at best, and asking if they bought it can sting."],
        ["Det smakar bra, men lite konstigt.", "It tastes good, but a bit strange.", 0, "“Konstigt” (strange) is not a compliment at the dinner table."],
      ] },
    { who: "Your host", say: "Vill du ha mer potatis?", en: "Would you like more potatoes?",
      opts: [
        ["Ja tack, gärna lite till.", "Yes please, a little more.", 1, "“Lite till” = a little more."],
        ["Nej, potatisen är inte så god.", "No, the potatoes aren't that good.", 0, "Insulting the potatoes, in Sweden!"],
        ["Ja tack, jag vill gärna ha en mer.", "Yes please, I'd like one more.", 0, "“En mer” isn't Swedish. Say “en till” or “lite till”."],
      ] },
    { who: "Last weekend's host", say: "Hej! Kul att du kunde komma i lördags!", en: "Hi! Great that you could come on Saturday!",
      opts: [
        ["Tack för senast! Det var jättetrevligt.", "Thanks for last time! It was really nice.", 1, "“Tack för senast” is the essential thank-you after a visit."],
        ["Varsågod! Det var så lite så.", "You're welcome! It was nothing.", 0, "That's how a host answers thanks. As the guest, you thank them: “Tack för senast!”."],
        ["Tack för senast! Det blir jättetrevligt.", "Thanks for last time! It will be really nice.", 0, "The party is over, so use the past: “Det var jättetrevligt”."],
      ] },
    { who: "A friend", say: "Ska vi grilla hos mig på söndag?", en: "Shall we barbecue at my place on Sunday?",
      opts: [
        ["Åh, vad synd, jag är bortrest då. Kanske nästa gång?", "Oh, what a shame, I'm away then. Maybe next time?", 1, "Decline + reason + another time = a polite no."],
        ["Nej, jag vill inte grilla hos dig på söndag.", "No, I don't want to barbecue at your place on Sunday.", 0, "Sounds like you don't like their place. Give a reason and suggest another time."],
        ["Åh, vad synd, jag är bortrest då. Kanske förra gången?", "Oh, what a shame, I'm away then. Maybe last time?", 0, "“Förra gången” means last time. For another chance, say “nästa gång”."],
      ] },
  ],
  builds: [
    { en: "What should I bring?", sv: "Vad ska jag ta med?", extra: ["tar", "till"] },
    { en: "Thanks for the food!", sv: "Tack för maten!", extra: ["mat", "till"] },
    { en: "Unfortunately I can't on Saturday.", sv: "Tyvärr kan jag inte på lördag.", alt: ["Jag kan tyvärr inte på lördag."], extra: ["vill", "lördags"],
      note: "After “Tyvärr” comes the verb: “Tyvärr kan jag…”" },
  ],
  gaps: [
    { sv: "Tack för ___!", cue: "You meet last weekend's host again.", en: "Thanks for last time!", a: "senast", opts: ["senast", "sedan", "maten"], why: "“Tack för senast” is the fixed phrase for thanking a host afterwards. “Tack för maten” is for the table, right after the meal." },
  ],
  talk: {
    title: "Middag hos Anders", scene: "You're invited to dinner at your colleague Anders's flat in Linköping. Arrive, make conversation, compliment the food and leave politely.",
    who: "Anders, your host", persona: "Warm host, proud of his grandmother's meatball recipe, keeps offering more food.",
    goals: ["Greet him and thank him for the invitation", "Compliment the food", "Accept or decline more food politely", "Thank him for the meal"],
    open: "Hej, välkommen! Häng av dig jackan, maten är snart klar.", open_en: "Hi, welcome! Hang up your jacket, dinner's almost ready.",
    hint: "Thank him for inviting you: “Tack för att jag fick komma!”",
  },
};

STOPS.norrkoping = {
  city: "Norrköping", level: "A2", reg: "pro", glyph: "wave",
  theme: "Fikarummet", en: "Small talk with colleagues",
  intro: "Chat in the break room: how work is going, holiday plans, gentle opinions, and how to leave politely.",
  culture: "July is holiday month: whole offices empty out. “Ska du vara ledig i sommar?” is the go-to question from May.",
  phrases: [
    ["Hur går det med projektet?", "How's the project going?"],
    ["Det rullar på.", "It's ticking along.", "A relaxed way to say things are fine."],
    ["Det har varit mycket den här veckan.", "It's been a lot this week."],
    ["Har du hunnit ta någon semester?", "Have you managed to take any holiday?"],
    ["Vi ska till fjällen i vinter.", "We're going to the mountains this winter."],
    ["Vad tycker du om det nya kontoret?", "What do you think of the new office?"],
    ["Nu måste jag tyvärr gå på ett möte.", "Now I unfortunately have to go to a meeting."],
    ["Vi hörs!", "Talk soon!"],
  ],
  replies: [
    { who: "A colleague by the coffee machine", say: "Hur går det med allt?", en: "How's everything going?",
      opts: [
        ["Det rullar på! Mycket nu, men kul. Och du?", "It's ticking along! Busy now, but fun. And you?", 1, "Relaxed, honest and you ask back."],
        ["Jag går bra, tack! Mycket just nu. Och du?", "I walk well, thanks! Busy right now. And you?", 0, "Things go well (“det går bra”), you don't: “jag går bra” means you walk well."],
        ["Allt går bra, men jag går nu. Hej då!", "Everything's fine, but I'm off now. Bye!", 0, "Abrupt. Small talk at the coffee machine deserves more than a goodbye."],
      ] },
    { who: "A colleague", say: "Har du några planer för sommaren?", en: "Any plans for the summer?",
      opts: [
        ["Ja, vi ska hyra en stuga i Småland. Och du?", "Yes, we're renting a cabin in Småland. And you?", 1, "Answer plus a question back."],
        ["Ja, vi hyrde en stuga i Småland. Och du?", "Yes, we rented a cabin in Småland. And you?", 0, "“Hyrde” is past tense, but the summer hasn't happened yet: “vi ska hyra”."],
        ["Ja, sommaren är oftast varm i Småland.", "Yes, the summer is usually warm in Småland.", 0, "True, maybe, but it says nothing about your plans."],
      ] },
    { who: "Your manager in the kitchen", say: "Det har varit en tung vecka, va?", en: "It's been a heavy week, hasn't it?",
      opts: [
        ["Ja, verkligen. Men skönt att vi blev klara.", "Yes, really. But nice that we got it done.", 1, "Agree, then end on a positive note. Very Swedish."],
        ["Nej, inte alls. Jag har knappt gjort något.", "No, not at all. I've hardly done anything.", 0, "Contradicting your manager and admitting you've hardly worked: two own goals."],
        ["Ja, jag har burit tunga lådor hela veckan.", "Yes, I've carried heavy boxes all week.", 0, "“En tung vecka” is a hard week, not one with heavy lifting."],
      ] },
    { who: "A colleague", say: "Vad tycker du om det nya kontoret?", en: "What do you think of the new office?",
      opts: [
        ["Jag gillar det! Ljust och fint, men lite högljutt ibland.", "I like it! Bright and nice, but a bit loud sometimes.", 1, "A balanced opinion: positive with a gentle “men”."],
        ["Jag tycker om kontoret, men inte om det nya.", "I like the office, but not the new one.", 0, "There's only one office: the new one. The answer contradicts itself."],
        ["Jag gillar den! Ljus och fin, men lite högljudd ibland.", "I like it! Bright and nice, but a bit loud sometimes. (wrong form)", 0, "“Kontoret” is an ett-word, so it's “det” and “ljust och fint”."],
      ] },
    { who: "A chatty colleague", say: "…och sen åkte vi vidare till Gotland, och där var det…", en: "…and then we went on to Gotland, and there it was…",
      cue: "You have to leave for a meeting.",
      opts: [
        ["Vad härligt! Du, jag måste tyvärr springa. Berätta mer sen!", "How lovely! Listen, I'm afraid I have to run. Tell me more later!", 1, "“Du, …” gets attention softly and “Berätta mer sen” keeps it warm."],
        ["Kan du sluta prata nu? Jag har faktiskt ett möte om fem minuter.", "Can you stop talking now? I actually have a meeting in five minutes.", 0, "Very rude, even with a good reason."],
        ["Vad härligt! Jag har inget möte förrän i morgon, så berätta mer!", "How lovely! I don't have a meeting until tomorrow, so tell me more!", 0, "But you do have a meeting to get to. Excuse yourself warmly instead."],
      ] },
    { who: "A colleague", say: "Ska vi ta en fika?", en: "Shall we grab a fika?",
      opts: [
        ["Gärna! Jag tar bara med mig min kopp.", "Sure! I'll just grab my cup.", 1, "Warm yes with a natural detail."],
        ["Nej, jag fikade i går, så det räcker.", "No, I had fika yesterday, so that's enough.", 0, "As if one a week were enough!"],
        ["Gärna! Jag tar bara mig med min kopp.", "Sure! I just take me with my cup.", 0, "The particle comes first: “Jag tar bara med mig min kopp”."],
      ] },
  ],
  builds: [
    { en: "How's the project going?", sv: "Hur går det med projektet?", extra: ["projekt", "till"] },
    { en: "Now I unfortunately have to go.", sv: "Nu måste jag tyvärr gå.", extra: ["går", "gick"],
      note: "“Nu” first, so the verb “måste” comes before “jag”." },
    { en: "It's been a lot this week.", sv: "Det har varit mycket den här veckan.", extra: ["vara", "vecka"] },
  ],
  gaps: [
    { sv: "Det ___ på!", cue: "The project is going fine.", en: "It's ticking along!", a: "rullar", opts: ["rullar", "springer", "flyger"], why: "“Det rullar på” is a fixed expression for things moving along fine." },
  ],
  talk: {
    general: {
      title: "Fikarummet", scene: "It's 3 pm at your office in Norrköping: fika time. Sara from another team joins you in the break room.",
      who: "Sara, a colleague", persona: "Sociable and curious. Talks about her summer cabin and has opinions about the new open-plan office.",
      goals: ["Answer how your week has been", "Ask about her plans or weekend", "Share an opinion about something at work", "Leave politely for a meeting"],
      open: "Hej! Äntligen fika. Hur har veckan varit för dig?", open_en: "Hi! Finally fika. How has your week been?",
      hint: "Describe your week: “Det har varit mycket, men…”",
    },
    life: {
      title: "Fika med regulatory", scene: "Fika at a life-science company in Norrköping. Henrik from regulatory affairs joins you, just after a big submission.",
      who: "Henrik, regulatory affairs", persona: "Dry humour, exhausted after a submission to the Medical Products Agency, loves his allotment garden.",
      goals: ["Answer how your week has been", "Ask about his plans or weekend", "Share an opinion about something at work", "Leave politely for a meeting"],
      open: "Hej! Skönt med fika. Vi lämnade in ansökan till Läkemedelsverket i går, så jag är helt slut.", open_en: "Hi! Fika is welcome. We submitted the application to the Medical Products Agency yesterday, so I'm exhausted.",
      hint: "React with sympathy: “Oj, vad mycket! Grattis till…”",
    },
  },
};
