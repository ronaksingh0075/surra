/* Surra curriculum — B1–C1 stops. Same shapes as data_a.js. */

/* ───────────── B1 · Svealand ───────────── */

STOPS.orebro = {
  city: "Örebro", level: "B1", reg: "casual", glyph: "castle",
  theme: "Åsikter", en: "Opinions: agreeing & disagreeing",
  intro: "Say what you think with a reason, disagree softly and know when to use tycka, tro and tänka.",
  culture: "Swedes prize consensus. Disagreement is fine, but it comes wrapped: “Jag ser det lite annorlunda” beats “Du har fel”.",
  phrases: [
    ["Jag tycker att…", "I think that… (opinion)", "“Tycka” is for opinions, “tro” for beliefs and guesses, “tänka” for the act of thinking."],
    ["Jag tror att det blir regn.", "I think (believe) it'll rain."],
    ["Det håller jag med om.", "I agree with that.", "Object first, then the verb. Very natural."],
    ["Jag ser det lite annorlunda.", "I see it a bit differently."],
    ["Det beror på.", "It depends."],
    ["Å ena sidan… å andra sidan…", "On the one hand… on the other hand…"],
    ["Jag är inte helt säker på det.", "I'm not entirely sure about that."],
    ["Där har du en poäng.", "You've got a point there."],
  ],
  replies: [
    { who: "A friend", say: "Jag tycker att man ska cykla mer i stan. Vad tycker du?", en: "I think people should cycle more in town. What do you think?",
      opts: [
        ["Det håller jag med om. Det är både billigare och snabbare.", "I agree with that. It's both cheaper and faster.", 1, "Agree, then give a reason."],
        ["Jag tänker att det är både billigare och snabbare.", "I'm thinking that it's both cheaper and faster.", 0, "For opinions use “tycker”: “Jag tycker att…”. “Tänka” is the act of thinking."],
        ["Ja, jag håller med dig om. Det är billigare och snabbare.", "Yes, I agree with you about. It's cheaper and faster.", 0, "“Om” needs an object: “Jag håller med dig om det”."],
      ] },
    { who: "A friend", say: "Alla borde flytta till landet. Staden är så stressig.", en: "Everyone should move to the countryside. The city is so stressful.",
      opts: [
        ["Jag ser det lite annorlunda. Jag gillar att ha allt nära.", "I see it a bit differently. I like having everything close by.", 1, "Soft disagreement plus a reason. The Swedish way."],
        ["Du har helt fel. Staden är inte alls stressig, tvärtom.", "You're completely wrong. The city isn't stressful at all, quite the opposite.", 0, "Far too blunt for Swedish small talk."],
        ["Jag ser lite annorlunda. Jag gillar att ha allt nära.", "I see a bit differently. I like having everything close by.", 0, "Missing “det”: “Jag ser det lite annorlunda”."],
      ] },
    { who: "A friend", say: "Tror du att det blir sol i helgen?", en: "Do you think it'll be sunny this weekend?",
      opts: [
        ["Förhoppningsvis! Men man vet aldrig med vädret.", "Hopefully! But you never know with the weather.", 1, "A hopeful guess, hedged the Swedish way."],
        ["Jag tycker det, men man vet aldrig.", "In my opinion, yes, but you never know.", 0, "The weather isn't a matter of taste: use “tro” for a guess."],
        ["Jag tror så, men man vet aldrig.", "I believe so, but you never know.", 0, "A literal translation of “I think so”. Swedish says “Jag tror det”."],
      ] },
    { who: "A friend", say: "Är det bättre att hyra eller köpa lägenhet?", en: "Is it better to rent or buy a flat?",
      opts: [
        ["Svårt att säga. Hur länge tänker du bo kvar?", "Hard to say. How long are you planning to stay?", 1, "Hard to say, plus the question that decides it. Thoughtful."],
        ["Det beror hur länge man ska bo där.", "It depends how long you'll live there.", 0, "“Bero” needs “på”: “Det beror på hur länge…”."],
        ["Det beror för hur länge man ska bo där.", "It depends for how long you'll live there.", 0, "“Bero” takes “på”: “Det beror på hur länge…”."],
      ] },
    { who: "A colleague", say: "Jag tycker att den nya filmen var ganska tråkig.", en: "I thought the new film was pretty boring.",
      opts: [
        ["Verkligen? Jag tyckte att den var spännande!", "Really? I thought it was exciting!", 1, "Friendly disagreement. Past tense “tyckte” since you've seen it."],
        ["Verkligen? Jag tyckte att den var spännad!", "Really? I thought it was excit!", 0, "“Spännande” (exciting) never changes form."],
        ["Verkligen? Jag tänkte att den var spännande!", "Really? I was thinking it was exciting!", 0, "For your opinion of a film you've seen, use “tyckte”, not “tänkte”."],
      ] },
    { who: "A friend in a discussion", say: "Men tänk på miljön! Flyg är ju sämst.", en: "But think of the environment! Flying is the worst, you know.",
      opts: [
        ["Där har du en poäng. Jag försöker ta tåget när jag kan.", "You've got a point there. I try to take the train when I can.", 1, "Concede a point gracefully, then add your angle."],
        ["Där har du en punkt. Jag försöker ta tåget när jag kan.", "There you have a full stop. I try to take the train when I can.", 0, "A point in an argument is a “poäng”. “Punkt” is a dot or full stop."],
        ["Ja, miljön är sämst. Jag tar flyget när jag kan.", "Yes, the environment is the worst. I fly when I can.", 0, "Mixes it up: it's flying that's the worst, and then you say you fly whenever you can."],
      ] },
  ],
  builds: [
    { en: "I see it a bit differently.", sv: "Jag ser det lite annorlunda.", extra: ["annan", "om"] },
    { en: "I agree with that.", sv: "Det håller jag med om.", alt: ["Jag håller med om det."], extra: ["håll", "till"] },
    { en: "I'm not entirely sure about that.", sv: "Jag är inte helt säker på det.", alt: ["Det är jag inte helt säker på."], extra: ["säkert", "om"] },
  ],
  gaps: [
    { sv: "Jag ___ att det blir regn i morgon.", en: "I think it'll rain tomorrow.", a: "tror", opts: ["tror", "tycker", "tänker"], why: "A guess about facts or the future takes “tro”. “Tycka” is for opinions." },
    { sv: "Vad ___ du om maten?", en: "What do you think of the food?", a: "tycker", opts: ["tycker", "tror", "tänker"], why: "Asking for an opinion takes “tycka”." },
  ],
  talk: {
    title: "Fikadebatt", scene: "At a café in Örebro, your friend Oskar brings up a hot local topic: should the city close the centre to cars?",
    who: "Oskar, a friend", persona: "Opinionated but friendly, enjoys playing devil's advocate, drives a car to work.",
    goals: ["Give your opinion with a reason", "Disagree politely at least once", "Acknowledge a good point he makes", "Find something you agree on"],
    open: "Har du hört? Kommunen vill stänga av centrum för biltrafik. Helt galet, tycker jag. Vad tycker du?", open_en: "Have you heard? The council wants to close the centre to cars. Totally crazy, I think. What do you think?",
    hint: "Give your view with a reason: “Jag tycker att… eftersom…”",
  },
};

STOPS.vasteras = {
  city: "Västerås", level: "B1", reg: "pro", glyph: "cucumber",
  theme: "Mötet", en: "Meetings",
  intro: "Get a word in, check you understood, ask people to elaborate, park side-tracks and close with clear owners.",
  culture: "“Stämma av” (check in, align) might be the most-used verb in Swedish offices. Meetings aim for everyone on board.",
  phrases: [
    ["Ska vi sätta igång?", "Shall we get started?"],
    ["Får jag flika in en sak?", "May I jump in with something?", "“Flika in” = interject briefly. Polite in meetings."],
    ["Om jag förstår dig rätt, menar du att…", "If I understand you correctly, you mean that…"],
    ["Kan du utveckla det lite?", "Could you elaborate a little?"],
    ["Jag vill bara stämma av en sak.", "I just want to check one thing.", "“Stämma av” = check, align. Extremely common at work."],
    ["Vem tar det?", "Who'll take that (task)?"],
    ["Kan vi återkomma till det?", "Can we come back to that?"],
    ["Ska vi sammanfatta?", "Shall we summarise?"],
  ],
  replies: [
    { who: "Meeting chair", say: "Vi har en del att gå igenom i dag. Har någon något att lägga till på dagordningen?", en: "We have quite a bit to go through today. Does anyone have anything to add to the agenda?",
      opts: [
        ["Ja, jag skulle vilja ta upp tidsplanen kort.", "Yes, I'd like to bring up the timeline briefly.", 1, "“Ta upp” = bring up a topic. Concise and concrete."],
        ["Ja, jag skulle vilja ta på tidsplanen kort.", "Yes, I'd like to put on the timeline briefly.", 0, "“Ta på” means put on (clothes). You “ta upp” a topic."],
        ["Ja, dagordningen ser bra ut, inget att tillägga.", "Yes, the agenda looks good, nothing to add.", 0, "Starts with “ja” but adds nothing. If you have nothing to add, say “Nej, det ser bra ut”."],
      ] },
    { who: "A colleague presenting", say: "…så vi behöver nog skjuta lanseringen till efter sommaren.", en: "…so we'll probably need to push the launch to after the summer.",
      cue: "You want to check what this means for your work.",
      opts: [
        ["Om jag förstår dig rätt, påverkar det även budgeten för hösten?", "If I understand you correctly, does that also affect the autumn budget?", 1, "Paraphrase and check the consequences. A strong meeting move."],
        ["Om jag förstår dig rätt, det påverkar även budgeten för hösten?", "If I understand you right, it affects the autumn budget too?", 0, "After a fronted “om”-clause the verb comes next: “påverkar det”."],
        ["Okej, då lanserar vi före sommaren som planerat.", "Okay, then we'll launch before the summer as planned.", 0, "They just said the launch moves to after the summer."],
      ] },
    { who: "A colleague", say: "Vi borde satsa mer på sociala medier.", en: "We should invest more in social media.",
      opts: [
        ["Spännande tanke. Hur skulle det se ut i praktiken?", "Exciting thought. What would that look like in practice?", 1, "Hear it out before you judge."],
        ["Intressant. Kan du utveckla dig lite?", "Interesting. Could you develop yourself a little?", 0, "“Utveckla dig” means develop yourself. You want them to expand on the idea: “utveckla det”."],
        ["Intressant. Kan du utvecklas det lite?", "Interesting. Could you be developed it a little?", 0, "“Utvecklas” is passive. You want “utveckla det”."],
      ] },
    { who: "Meeting chair", say: "Någon behöver sammanställa kundfeedbacken till nästa vecka. Vem tar det?", en: "Someone needs to compile the customer feedback by next week. Who'll take it?",
      opts: [
        ["Det tar jag gärna! Kan Lisa hjälpa mig med datan?", "I'll gladly take it! Can Lisa help me with the data?", 1, "Volunteer, and line up the help you need."],
        ["Jag kan ta det, om jag får hjälpa med datan.", "I can take it, if I get to help with the data.", 0, "“Får hjälpa” means you get to help. You want “får hjälp” (get help)."],
        ["Jag kan ta det, om jag får hjälp av datan.", "I can take it, if I get help from the data.", 0, "“Hjälp av” means help from someone. You need help with the data: “hjälp med datan”."],
      ] },
    { who: "A colleague, going off-topic", say: "…och apropå det, vi borde också byta CRM-system!", en: "…and speaking of which, we should also switch CRM systems!",
      opts: [
        ["Bra poäng, men kan vi återkomma till det nästa gång?", "Good point, but can we come back to that next time?", 1, "Park it politely with “återkomma till det”."],
        ["Nej, sluta prata om CRM nu. Det är inte alls viktigt.", "No, stop talking about CRM now. It's not important at all.", 0, "Rude, and it dismisses a colleague in front of everyone."],
        ["Bra poäng, då byter vi CRM-system redan i dag!", "Good point, then we'll switch CRM systems today!", 0, "Agreeing to a big change in passing derails the agenda."],
      ] },
    { who: "Meeting chair at the end", say: "Okej, ska vi sammanfatta?", en: "Okay, shall we summarise?",
      opts: [
        ["Ja. Jag tar kundanalysen till fredag, och Lisa bokar nästa möte.", "Yes. I'll do the customer analysis by Friday, and Lisa books the next meeting.", 1, "Who does what by when. Exactly what a summary needs."],
        ["Ja. Jag tar kundanalysen till fredag, och Lisa bokar nästa mötet.", "Yes. I'll do the analysis by Friday, and Lisa books the next the meeting.", 0, "After “nästa” Swedish uses the indefinite form: “nästa möte”."],
        ["Ja. Vi har pratat mycket, och alla har haft bra idéer.", "Yes. We've talked a lot, and everyone's had good ideas.", 0, "Pleasant, but it doesn't say who does what by when."],
      ] },
  ],
  builds: [
    { en: "Can you elaborate a little?", sv: "Kan du utveckla det lite?", extra: ["utvecklar", "mer"] },
    { en: "I just want to check one thing.", sv: "Jag vill bara stämma av en sak.", extra: ["ett", "stämmer"] },
    { en: "Can we come back to that next week?", sv: "Kan vi återkomma till det nästa vecka?", extra: ["på", "veckan"] },
  ],
  gaps: [
    { sv: "Får jag ___ in en sak?", en: "May I jump in with something?", a: "flika", opts: ["flika", "flicka", "fika"], why: "“Flika in” = interject. (A “flicka” is a girl, and “fika” is the coffee break.)" },
    { sv: "Jag vill bara ___ av en sak med dig.", en: "I just want to check one thing with you.", a: "stämma", opts: ["stämma", "stämpla", "ställa"], why: "“Stämma av” = check, align." },
  ],
  talk: {
    general: {
      title: "Projektmötet", scene: "The weekly project meeting in Västerås. Maria runs it. The project is behind schedule.",
      who: "Maria, project manager (also voices colleagues)", persona: "Structured and friendly, wants decisions. Sometimes lets colleague Per go off-topic so you can steer back.",
      goals: ["Give a short status update", "Ask a clarifying question or paraphrase someone", "Volunteer for or assign a task with a deadline", "Help summarise the decisions"],
      open: "Okej, ska vi sätta igång? Vi börjar med en snabb statusuppdatering. Vill du börja?", open_en: "Okay, shall we get started? Let's begin with a quick status update. Do you want to start?",
      hint: "Give a status: “Ja, gärna. Från min sida…”",
    },
    life: {
      title: "Lanseringsmötet", scene: "A launch-readiness meeting for a new medicine in the Nordics. Maria, the brand lead, chairs. The reimbursement decision from TLV is delayed.",
      who: "Maria, brand lead (also voices medical and market access colleagues)", persona: "Structured and pragmatic. Asks for clear owners and dates, lets the market access lead ramble about TLV.",
      goals: ["Give a short status update", "Ask a clarifying question or paraphrase someone", "Volunteer for or assign a task with a deadline", "Help summarise the decisions"],
      open: "Okej, ska vi köra igång? TLV-beslutet har dragit ut på tiden, så vi behöver se över tidsplanen. Vill du börja med statusen från din sida?", open_en: "Okay, shall we kick off? The TLV decision has been delayed, so we need to review the timeline. Do you want to start with the status from your side?",
      hint: "Give a status: “Ja. Från min sida ser det ut så här…”",
    },
  },
};

STOPS.uppsala = {
  city: "Uppsala", level: "B1", reg: "mixed", glyph: "book",
  theme: "Problem & klagomål", en: "Complaints & problem-solving",
  intro: "Explain a problem clearly, stay friendly but firm, push for a solution and get it in writing.",
  culture: "Swedish consumer law is strong: you can “reklamera” faulty goods for up to three years. Calm and firm works best.",
  phrases: [
    ["Jag ringer angående min beställning.", "I'm calling about my order."],
    ["Det har tyvärr blivit något fel.", "Unfortunately something has gone wrong."],
    ["Jag skulle vilja reklamera den här jackan.", "I'd like to return this jacket as faulty.", "“Reklamera” = make a complaint about a faulty product."],
    ["Vad kan ni göra åt det?", "What can you do about it?"],
    ["Jag förstår att det inte är ditt fel, men…", "I understand it's not your fault, but…"],
    ["Kan jag få pengarna tillbaka?", "Can I get my money back?"],
    ["Hur lång tid tar det?", "How long will it take?"],
    ["Kan du bekräfta det via mejl?", "Can you confirm that by email?"],
  ],
  replies: [
    { who: "Customer service on the phone", say: "Kundtjänst, Mikaela. Vad kan jag hjälpa dig med?", en: "Customer service, Mikaela. How can I help you?",
      opts: [
        ["Hej! Jag ringer angående en beställning som inte har kommit.", "Hi! I'm calling about an order that hasn't arrived.", 1, "Name the issue clearly with “angående”."],
        ["Hej! Jag ringer angående en beställning som har inte kommit.", "Hi! I'm calling about an order that has not arrived.", 0, "In a subordinate clause “inte” goes before the verb: “som inte har kommit”."],
        ["Hej! Varför kommer era paket alltid så sent? Det är dåligt.", "Hi! Why do your parcels always arrive so late? It's bad.", 0, "Starting with an accusation rarely gets results. State the issue first."],
      ] },
    { who: "Customer service", say: "Jag ser att paketet är försenat. Tyvärr vet jag inte när det kommer.", en: "I can see the parcel is delayed. Unfortunately I don't know when it'll arrive.",
      opts: [
        ["Jag förstår att det inte är ditt fel, men vad kan ni göra åt det?", "I understand it's not your fault, but what can you do about it?", 1, "Empathy plus a push for action: firm but friendly."],
        ["Okej, då väntar jag bara. Tack ändå för hjälpen och hej då!", "Okay, then I'll just wait. Thanks for the help anyway, bye!", 0, "Giving up too easily."],
        ["Jag förstår att det är ditt fel, men vad kan ni göra åt det?", "I understand it's your fault, but what can you do about it?", 0, "Without “inte” you're saying it IS their fault."],
      ] },
    { who: "Your landlord", say: "Vi kan skicka en rörmokare nästa vecka.", en: "We can send a plumber next week.",
      cue: "Your kitchen sink is leaking right now.",
      opts: [
        ["Det läcker mycket. Finns det någon möjlighet att någon kommer tidigare?", "It's leaking a lot. Is there any chance someone could come sooner?", 1, "Explain the urgency, then a soft request: “finns det någon möjlighet…”."],
        ["Okej, nästa vecka passar perfekt. Tack så mycket för hjälpen, hej då!", "Okay, next week is perfect. Thanks a lot for the help, bye!", 0, "Accepting a week of leaking!"],
        ["Det läcker mycket, så ni måste komma nu direkt, annars flyttar jag!", "It's leaking a lot, so you have to come right now, or I'm moving out!", 0, "Threats escalate fast."],
      ] },
    { who: "A shop assistant", say: "Har du kvar kvittot?", en: "Do you still have the receipt?",
      opts: [
        ["Ja, här är det. Jag köpte jackan för två veckor sedan.", "Yes, here it is. I bought the jacket two weeks ago.", 1, "“För två veckor sedan” = two weeks ago."],
        ["Ja, här är det. Jag köpte jackan sedan två veckor.", "Yes, here it is. I bought the jacket since two weeks.", 0, "“Ago” is “för … sedan”: “för två veckor sedan”."],
        ["Ja, jag har kvar jackan, men jag har tappat kvittot.", "Yes, I still have the jacket, but I've lost the receipt.", 0, "You start with “ja”, but they asked about the receipt, which you've lost."],
      ] },
    { who: "Customer service", say: "Vi kan erbjuda dig ett presentkort på 200 kronor.", en: "We can offer you a gift card for 200 kronor.",
      opts: [
        ["Tack, men jag skulle hellre vilja ha pengarna tillbaka.", "Thanks, but I'd rather have my money back.", 1, "“Hellre” = rather. A polite counter-request."],
        ["Tack, men jag skulle hellre vilja ha pengarna bak.", "Thanks, but I'd rather have the money behind.", 0, "“Back” here is “tillbaka”. “Bak” means behind."],
        ["Nej, jag vill inte ha ert presentkort. Det är för lite.", "No, I don't want your gift card. It's too little.", 0, "Refusing without saying what you want instead."],
      ] },
    { who: "Customer service", say: "Då återbetalar vi beloppet inom fem arbetsdagar.", en: "Then we'll refund the amount within five working days.",
      opts: [
        ["Perfekt, tack! Kan du bekräfta det via mejl?", "Perfect, thanks! Can you confirm that by email?", 1, "Always get it in writing."],
        ["Perfekt, tack! Kan du konfirmera det via mejl?", "Perfect, thanks! Can you confirm (in church) by email?", 0, "“Konfirmera” is the church confirmation. Use “bekräfta”."],
        ["Fem arbetsdagar är alldeles för kort tid för mig.", "Five working days is far too short for me.", 0, "A quick refund is good news, not a problem."],
      ] },
  ],
  builds: [
    { en: "I'm calling about my order.", sv: "Jag ringer angående min beställning.", extra: ["mitt", "ringde"] },
    { en: "Can I get my money back?", sv: "Kan jag få pengarna tillbaka?", alt: ["Kan jag få tillbaka pengarna?"], extra: ["pengar", "ta"] },
    { en: "Unfortunately something has gone wrong.", sv: "Det har tyvärr blivit något fel.", alt: ["Tyvärr har det blivit något fel."], extra: ["bli", "någon"] },
  ],
  gaps: [
    { sv: "Jag skulle vilja ___ den här tröjan, den har ett hål.", en: "I'd like to return this sweater as faulty, it has a hole.", a: "reklamera", opts: ["reklamera", "reklamation", "reklam"], why: "“Reklamera” = return a faulty item. “Reklamation” is the noun, and “reklam” means advertising." },
    { sv: "Jag ringer ___ fakturan jag fick i går.", en: "I'm calling about the invoice I got yesterday.", a: "angående", opts: ["angående", "omkring", "bredvid"], why: "“Angående” = regarding. Standard in calls and emails. “Omkring” means around and “bredvid” beside." },
  ],
  talk: {
    title: "Kylskåpet är trasigt", scene: "The fridge in your rented flat in Uppsala has stopped working. Call the property manager and get it fixed quickly.",
    who: "Lennart, property manager", persona: "Busy and a bit bureaucratic. First suggests filing a form online and waiting two weeks, but responds to friendly persistence.",
    goals: ["Explain the problem clearly", "Show understanding but push for a faster solution", "Agree on concrete next steps and a time", "Ask for written confirmation"],
    open: "Fastighetsservice, Lennart.", open_en: "Property services, Lennart speaking.",
    hint: "Say who you are and the problem: “Hej, jag bor på… och mitt kylskåp har slutat fungera.”",
  },
};

STOPS.stockholm = {
  city: "Stockholm", level: "B1", reg: "pro", glyph: "crown",
  theme: "Intervjun", en: "The job interview",
  intro: "Present yourself, explain why you want the role, tell a concrete story and ask good questions back.",
  culture: "Swedish interviews value modesty and teamwork. Concrete examples beat big claims, and “vi” often wins over “jag”.",
  phrases: [
    ["Berätta lite om dig själv.", "Tell me a little about yourself."],
    ["Jag har en bakgrund inom…", "I have a background in…"],
    ["Det som lockar mig med tjänsten är…", "What attracts me to the role is…"],
    ["En av mina styrkor är att jag är strukturerad.", "One of my strengths is that I'm structured."],
    ["Jag har ibland svårt att säga nej.", "I sometimes find it hard to say no.", "A classic, honest weakness. Pair it with what you do about it."],
    ["I min förra roll ansvarade jag för…", "In my previous role I was responsible for…"],
    ["Hur ser en vanlig arbetsdag ut?", "What does a typical working day look like?"],
    ["Vilka är nästa steg i processen?", "What are the next steps in the process?"],
  ],
  replies: [
    { who: "Interviewer", say: "Välkommen! Hittade du hit utan problem?", en: "Welcome! Did you find your way here OK?",
      opts: [
        ["Ja tack, det gick bra. Fint kontor ni har!", "Yes thanks, it went fine. Nice office you have!", 1, "Short, friendly small talk with a compliment."],
        ["Ja tack, jag hittade dig utan problem!", "Yes thanks, I found you without any problem!", 0, "“Hitta dig” sounds like you tracked the interviewer down. You found your way: “Det gick bra”."],
        ["Nej, det var hemskt, jag gick vilse tre gånger.", "No, it was awful, I got lost three times.", 0, "A grumpy start. Keep the small talk short and positive."],
      ] },
    { who: "Interviewer", say: "Berätta lite om dig själv.", en: "Tell me a little about yourself.",
      opts: [
        ["Jag har en bakgrund inom bioteknik och har jobbat med marknadsanalys de senaste tre åren.", "I have a background in biotech and have worked with market analysis for the last three years.", 1, "Background plus recent experience. A clear opening."],
        ["Jag har en bakgrund inom bioteknik och jobbade med marknadsanalys de senaste tre åren.", "I have a background in biotech and worked with market analysis the last three years.", 0, "“De senaste tre åren” runs up to now, so use the perfect: “har jobbat”."],
        ["Jag gillar pizza och Netflix, och på helgerna spelar jag mycket padel.", "I like pizza and Netflix, and at weekends I play a lot of padel.", 0, "Too personal and off-topic for an opener."],
      ] },
    { who: "Interviewer", say: "Varför söker du just den här tjänsten?", en: "Why are you applying for this particular role?",
      opts: [
        ["Det som lockar mig är att få jobba nära kunderna.", "What attracts me is getting to work close to the customers.", 1, "Specific motivation linked to the role."],
        ["Det som lockar mig är lönen och att jag bor nära kontoret.", "What attracts me is the salary and that I live near the office.", 0, "Leading with salary and location doesn't sell you. Link your answer to the role."],
        ["För att jag behöver ett jobb, och ni var först med att svara.", "Because I need a job, and you were the first to reply.", 0, "Honest, but it doesn't sell you."],
      ] },
    { who: "Interviewer", say: "Vad skulle du säga är din största svaghet?", en: "What would you say is your biggest weakness?",
      opts: [
        ["Jag har svårt att säga nej, så nu övar jag på att prioritera.", "I find it hard to say no, so now I'm practising prioritising.", 1, "An honest weakness plus what you're doing about it."],
        ["Jag har faktiskt inga svagheter, det säger alla mina kollegor.", "I actually have no weaknesses, all my colleagues say so.", 0, "Sounds arrogant, especially in Sweden."],
        ["Jag är nog för perfekt och jobbar alldeles för mycket, tyvärr.", "I'm probably too perfect and work far too much, unfortunately.", 0, "A cliché interviewers see through."],
      ] },
    { who: "Interviewer", say: "Ge ett exempel på när du har löst en svår situation.", en: "Give an example of when you solved a difficult situation.",
      opts: [
        ["I min förra roll fick vi en försenad leverans precis innan en lansering. Då…", "In my previous role we got a delayed delivery right before a launch. Then…", 1, "Start a concrete story: situation, action, result."],
        ["I min förra roll vi fick en försenad leverans precis innan en lansering.", "In my previous role we got a delayed delivery before a launch.", 0, "Something first, verb second: “I min förra roll fick vi…”."],
        ["Jag löser alltid alla problem, så det har aldrig varit svårt för mig.", "I always solve every problem, so it's never been hard for me.", 0, "Vague and boastful. Tell one concrete story."],
      ] },
    { who: "Interviewer", say: "Har du några frågor till oss?", en: "Do you have any questions for us?",
      opts: [
        ["Gärna. Vad gör att folk trivs i teamet?", "Yes, please. What makes people enjoy working in the team?", 1, "Always have a question ready."],
        ["Ja, hur ser ut en vanlig arbetsdag i teamet?", "Yes, how looks a typical day in the team?", 0, "The particle stays after the subject: “Hur ser en vanlig arbetsdag ut?”."],
        ["Ja, hur ser en vanlig arbetsdag ut på teamet?", "Yes, what does a typical day look like on the team?", 0, "You're “i” a team: “i teamet”."],
      ] },
  ],
  builds: [
    { en: "Tell me a little about yourself.", sv: "Berätta lite om dig själv.", extra: ["mig", "din"] },
    { en: "One of my strengths is that I'm structured.", sv: "En av mina styrkor är att jag är strukturerad.", extra: ["min", "styrka"] },
    { en: "What are the next steps in the process?", sv: "Vilka är nästa steg i processen?", extra: ["vilken", "processer"] },
  ],
  gaps: [
    { sv: "I min förra roll ___ jag för budgeten.", en: "In my previous role I was responsible for the budget.", a: "ansvarade", opts: ["ansvarade", "ansvarar", "ansvarat"], why: "A previous role takes the past tense, and “ansvarat” would need “har”. Notice the word order too: “I min förra roll ansvarade jag…”." },
    { sv: "Det som ___ mig med tjänsten är teamet.", en: "What attracts me to the role is the team.", a: "lockar", opts: ["lockar", "locker", "lockas"], why: "“Locka” = attract. Present tense: “lockar”." },
  ],
  talk: {
    general: {
      title: "Jobbintervjun", scene: "A job interview for a business analyst role at a company in Stockholm, with Annika, the hiring manager.",
      who: "Annika, hiring manager", persona: "Professional and warm. Asks follow-up questions and values concrete examples and teamwork.",
      goals: ["Present yourself briefly", "Explain why you want the role", "Give a concrete example from your experience", "Ask a question about the job or the next steps"],
      open: "Hej och välkommen! Slå dig ner. Vill du ha något att dricka innan vi börjar?", open_en: "Hi and welcome! Have a seat. Would you like something to drink before we start?",
      hint: "Accept or decline politely: “Ja tack, gärna ett glas vatten.”",
    },
    life: {
      title: "Intervju i Solna", scene: "A job interview for a launch excellence role at a pharmaceutical company in Solna, with Annika, the Nordic commercial director.",
      who: "Annika, Nordic commercial director", persona: "Sharp and friendly. Asks about launches, stakeholder work and data-driven decisions.",
      goals: ["Present yourself briefly", "Explain why you want the role", "Give a concrete example from your experience", "Ask a question about the job or the next steps"],
      open: "Hej och välkommen till oss! Slå dig ner. Vill du ha en kopp kaffe innan vi sätter igång?", open_en: "Hi and welcome! Have a seat. Would you like a cup of coffee before we get going?",
      hint: "Accept politely: “Ja tack, gärna!”",
    },
  },
};

/* ───────────── B2 · Norrland ───────────── */

STOPS.gavle = {
  city: "Gävle", level: "B2", reg: "casual", glyph: "goat",
  theme: "Mellan raderna", en: "Reading between the lines",
  intro: "Master ju, väl and nog, decode Swedish understatement and answer hints without drama.",
  culture: "“Det kanske inte är världens bästa idé” is a firm no. Swedish understatement says a lot by saying little.",
  phrases: [
    ["Det är ju så.", "That's just how it is (as we both know).", "“Ju” = as you know. It signals shared knowledge."],
    ["Du kommer väl på festen?", "You're coming to the party, right?", "“Väl” asks for confirmation, hopefully."],
    ["Det blir nog bra.", "It'll probably be fine.", "“Nog” = probably. It softens a prediction."],
    ["Det är klart att jag hjälper till!", "Of course I'll help!"],
    ["Det kanske inte är världens bästa idé.", "It might not be the world's best idea.", "Swedish understatement: this means it's a bad idea."],
    ["Jag är lite osäker på om…", "I'm a bit unsure whether…"],
    ["Lagom är bäst.", "Just right is best.", "The famous Swedish ideal of moderation."],
    ["Det var inte igår!", "Long time no see!", "Literally: that wasn't yesterday."],
  ],
  replies: [
    { who: "An old friend", say: "Det var inte igår! Hur är det med dig?", en: "Long time no see! How are you?",
      opts: [
        ["Nej, verkligen inte! Bara bra, tack. Själv då?", "No, really not! Just fine, thanks. And yourself?", 1, "Play along with the idiom, answer, bounce it back."],
        ["Nej, det var i förrgår! Bara bra, tack. Själv då?", "No, it was the day before yesterday! Just fine, thanks. And yourself?", 0, "Taken literally. “Det var inte igår” is an idiom for long time no see."],
        ["Jo, det var i går! Bara bra, tack. Själv då?", "Yes it was, yesterday! Just fine, thanks. And yourself?", 0, "Taken literally, and it contradicts them."],
      ] },
    { who: "A colleague", say: "Det kanske inte är världens bästa idé att boka resan redan nu…", en: "It might not be the world's best idea to book the trip already…",
      cue: "What do they really mean?",
      opts: [
        ["Du tycker alltså att vi ska avvakta?", "So you think we should hold off?", 1, "Understatement decoded: “maybe not the best idea” means don't. Checking shows you caught it."],
        ["Toppen, då bokar jag den direkt i kväll!", "Great, then I'll book it right away tonight!", 0, "Missed the hint. They're advising against it."],
        ["Toppen, då bokar jag den direkt i morgon!", "Great, then I'll book it first thing tomorrow!", 0, "Still missed the hint: they're advising against booking at all."],
      ] },
    { who: "A friend", say: "Du kommer väl på mitt kalas på lördag?", en: "You're coming to my party on Saturday, right?",
      opts: [
        ["Klart jag gör! Vad vill du ha i present?", "Of course I am! What would you like as a present?", 1, "“Klart jag gör” = of course I am."],
        ["Ja, jag kommer nog. Vad vill du ha i present?", "Yes, I'll probably come. What would you like as a present?", 0, "“Nog” sounds unsure, so your friend may feel you're not keen."],
        ["Klart jag kommer väl! Vad vill du ha i present?", "Of course I'm coming, I suppose! What would you like as a present?", 0, "“Väl” in a statement adds doubt. Drop it."],
      ] },
    { who: "Your neighbour", say: "Det är ju lite kallt i trapphuset nuförtiden…", en: "It's a bit cold in the stairwell these days, isn't it…",
      cue: "A hint that someone keeps leaving the door open. Maybe you?",
      opts: [
        ["Ja, det har jag märkt. Jag ska se till att dörren stängs.", "Yes, I've noticed. I'll make sure the door gets closed.", 1, "Respond to the hint without drama."],
        ["Nej, jag tycker att det är ganska varmt i trapphuset.", "No, I think it's quite warm in the stairwell.", 0, "Contradicts instead of picking up the hint."],
        ["Ja, det är kallt. Du borde ta på dig en tjockare jacka.", "Yes, it's cold. You should put on a thicker jacket.", 0, "Misses the hint entirely, and advice on their clothes won't win friends."],
      ] },
    { who: "A friend, after you suggest a plan", say: "Mm, jo… kanske.", en: "Mm, well… maybe.",
      cue: "Your friend doesn't sound keen.",
      opts: [
        ["Du verkar inte helt övertygad. Ska vi hitta på något annat?", "You don't seem convinced. Shall we do something else?", 1, "Read the hesitation and offer an alternative."],
        ["Bra, då kör vi! Jag bokar biljetterna direkt i kväll.", "Great, let's go! I'll book the tickets tonight.", 0, "Steamrolling a lukewarm “kanske”."],
        ["Kanske är inget svar. Säg ja eller nej, så vi kan bestämma.", "Maybe isn't an answer. Say yes or no, so we can decide.", 0, "Too confrontational."],
      ] },
    { who: "A colleague", say: "Det blir nog bra, ska du se.", en: "It'll probably be fine, you'll see.",
      opts: [
        ["Tack, det hoppas jag verkligen.", "Thanks, I really hope so.", 1, "Accept the comfort graciously."],
        ["Vad ska jag se? Jag förstår inte.", "What should I see? I don't understand.", 0, "“Ska du se” is a fixed reassuring phrase, not an instruction to look."],
        ["Tack, det hoppas jag verkligen inte.", "Thanks, I really hope not.", 0, "Adding “inte” turns it into the opposite of what you mean."],
      ] },
  ],
  builds: [
    { en: "You're coming to the party, right?", sv: "Du kommer väl på festen?", extra: ["ju", "i"] },
    { en: "It'll probably be fine.", sv: "Det blir nog bra.", extra: ["bli", "blivit"] },
    { en: "Of course I'll help!", sv: "Det är klart att jag hjälper till!", alt: ["Klart att jag hjälper till!"], extra: ["hjälpa", "med"] },
  ],
  gaps: [
    { sv: "Du har ___ hört om Kiruna, staden som flyttar?", en: "You've heard about Kiruna, the town that's moving, right?", a: "väl", opts: ["väl", "ju", "nog"], why: "“Väl” in a question asks the listener to confirm." },
    { sv: "Vi har ___ pratat om det här förut, så du vet vad jag tycker.", en: "We've talked about this before, as you know, so you know what I think.", a: "ju", opts: ["ju", "väl", "nog"], why: "“Ju” marks something you both already know." },
    { sv: "Hon är ___ hemma nu, men jag är inte säker.", en: "She's probably home now, but I'm not sure.", a: "nog", opts: ["nog", "ju", "väl"], why: "“Nog” = probably." },
  ],
  talk: {
    title: "Helgplanerna", scene: "Your friend Ebba in Gävle is planning a weekend trip with you, but she's very Swedish about saying what she really thinks.",
    who: "Ebba, a friend", persona: "Polite and indirect. Uses understatement and the particles ju, väl and nog. Never says no directly, only hints.",
    goals: ["Suggest a plan for the weekend", "Notice and respond to at least one hint", "Use ju, väl or nog yourself", "Agree on a plan you both like"],
    open: "Mm, helgen ja… Du hade väl tänkt något, eller?", open_en: "Mm, the weekend, yes… You had something in mind, didn't you?",
    hint: "Suggest something: “Ja, jag tänkte att vi kanske kunde…”",
  },
};

STOPS.sundsvall = {
  city: "Sundsvall", level: "B2", reg: "pro", glyph: "columns",
  theme: "Förhandla", en: "Negotiating",
  intro: "Anchor your position, trade concessions with conditions, hold firm under pressure and close the deal.",
  culture: "Swedish negotiators dislike theatrics. Facts, calm and “under förutsättning att…” get further than bluffing.",
  phrases: [
    ["Vad har ni för budget?", "What's your budget?"],
    ["Det ligger lite över vad vi hade tänkt oss.", "That's a bit above what we had in mind."],
    ["Skulle ni kunna tänka er att…?", "Would you consider…?"],
    ["Under förutsättning att leveransen sker i mars kan vi gå med på det.", "On condition that delivery happens in March, we can agree to that."],
    ["Vi kan mötas på halva vägen.", "We can meet halfway."],
    ["Det är vår smärtgräns.", "That's our absolute limit.", "Literally “pain threshold”: the bottom line."],
    ["Låt mig stämma av med min chef.", "Let me check with my manager."],
    ["Då har vi en överenskommelse.", "Then we have a deal."],
  ],
  replies: [
    { who: "A supplier", say: "Vårt pris är 450 000 kronor för hela projektet.", en: "Our price is 450,000 kronor for the whole project.",
      opts: [
        ["Det ligger lite över vad vi tänkt oss. Finns det utrymme i priset?", "That's a bit above what we had in mind. Is there room in the price?", 1, "Signal the gap softly and open the door."],
        ["Det ligger lite ovanför vad vi tänkt oss. Finns det utrymme i priset?", "That lies a bit up above what we had in mind. Is there room in the price?", 0, "“Ovanför” is a physical position. Prices “ligger över”."],
        ["Okej, det låter rimligt. Då skriver vi på avtalet i dag.", "Okay, that sounds reasonable. Then we'll sign the contract today.", 0, "Accepting the first offer leaves money on the table."],
      ] },
    { who: "A client", say: "Kan ni sänka priset med tio procent?", en: "Can you lower the price by ten percent?",
      opts: [
        ["Det kan vi göra, under förutsättning att ni tecknar ett tvåårsavtal.", "We can do that, on condition that you sign a two-year contract.", 1, "Trade, don't give: a concession for a condition."],
        ["Ja, självklart, vi kan till och med sänka det med tjugo procent.", "Yes, of course, we can even lower it by twenty percent.", 0, "Giving away more than they asked for!"],
        ["Det kan vi göra, under förutsättning ni tecknar ett tvåårsavtal.", "We can do that, on condition you sign a two-year contract.", 0, "The phrase is “under förutsättning att…”: it needs “att”."],
      ] },
    { who: "Your manager, in a salary talk", say: "Vad har du för löneanspråk?", en: "What are your salary expectations?",
      opts: [
        ["Utifrån min erfarenhet tänker jag mig runt 48 000 i månaden.", "Based on my experience, I'm thinking around 48,000 a month.", 1, "Anchor with reasoning. “Utifrån” = based on."],
        ["Så mycket som möjligt, helst mer än alla andra i teamet.", "As much as possible, preferably more than everyone else in the team.", 0, "Vague, and a bit cheeky."],
        ["Utifrån min erfarenhet tänker jag mig runt 48 000 i året.", "Based on my experience, I'm thinking around 48,000 a year.", 0, "Swedish salaries are discussed per month. 48 000 a year would be a tiny ask!"],
      ] },
    { who: "A supplier", say: "Det här är verkligen vår smärtgräns.", en: "This really is our absolute limit.",
      opts: [
        ["Jag förstår. Låt mig stämma av med min chef, så hörs vi i morgon.", "I understand. Let me check with my manager, and we'll talk tomorrow.", 1, "Buy time without caving."],
        ["Smärtgräns? Har du ont någonstans? Ska jag ringa en läkare?", "Pain limit? Are you hurting somewhere? Should I call a doctor?", 0, "Taken literally: “smärtgräns” is their bottom line."],
        ["Jag förstår. Då sänker ni bara lite till, så är vi överens.", "I understand. Then you'll just go a bit lower, and we have a deal.", 0, "Ignores their signal and may end the talks."],
      ] },
    { who: "A client", say: "Om ni kan leverera i februari i stället för mars så är vi intresserade.", en: "If you can deliver in February instead of March, we're interested.",
      opts: [
        ["Februari blir tufft, men om vi får en del av betalningen i förskott kan vi försöka.", "February will be tough, but if we get part of the payment in advance we can try.", 1, "A conditional concession."],
        ["Februari blir tufft, men om vi får en del av betalningen i förskott, vi kan försöka.", "February will be tough, but if we get part of the payment in advance, we can try.", 0, "After a fronted “om”-clause the verb comes next: “kan vi försöka”."],
        ["Februari är helt omöjligt för oss, punkt. Mars eller ingenting.", "February is completely impossible for us, full stop. March or nothing.", 0, "Rigid: closes the door instead of trading."],
      ] },
    { who: "The other party, near the end", say: "Okej, 420 000 och leverans i mars. Hur låter det?", en: "Okay, 420,000 and delivery in March. How does that sound?",
      opts: [
        ["Det kan vi gå med på. Då är vi överens!", "We can go along with that. Then we're agreed!", 1, "Close clearly."],
        ["Det låter rimligt. Då har vi en överenskommelse om april!", "That sounds reasonable. Then we have a deal on April!", 0, "They offered delivery in March. Closing on the wrong terms causes trouble later."],
        ["Det låter rimligt. Då har vi ingen överenskommelse!", "That sounds reasonable. Then we have no deal!", 0, "“Rimligt” and “ingen överenskommelse” contradict each other."],
      ] },
  ],
  builds: [
    { en: "Let me check with my manager.", sv: "Låt mig stämma av med min chef.", extra: ["mitt", "låter"] },
    { en: "We can meet halfway.", sv: "Vi kan mötas på halva vägen.", extra: ["möta", "halv"] },
    { en: "Would you consider a longer contract?", sv: "Skulle ni kunna tänka er ett längre avtal?", extra: ["en", "långt"] },
  ],
  gaps: [
    { sv: "Under ___ att ni betalar i förskott kan vi sänka priset.", en: "On condition that you pay in advance, we can lower the price.", a: "förutsättning", opts: ["förutsättning", "förutsättningen", "förutsägelse"], why: "“Under förutsättning att” = on condition that. The fixed phrase has no article, and “förutsägelse” means prediction." },
    { sv: "Det ligger lite ___ vad vi hade tänkt oss.", en: "That's a bit above what we had in mind.", a: "över", opts: ["över", "ovan", "upp"], why: "“Ligga över” = be above a price or level." },
  ],
  talk: {
    general: {
      title: "Avtalet", scene: "You're buying consultancy services for your company in Sundsvall. Jonas, the supplier's sales manager, wants a bigger deal than your budget allows.",
      who: "Jonas, sales manager", persona: "Friendly but persistent. Starts high, mentions his “smärtgräns”, open to trades.",
      goals: ["State your budget or position", "Make a conditional offer (“under förutsättning att…”)", "Hold firm under pressure at least once", "Close with a clear agreement or next step"],
      open: "Hej! Kul att ses. Ni har tittat på vårt förslag. Vad tänker ni?", open_en: "Hi! Good to see you. You've looked at our proposal. What are your thoughts?",
      hint: "Signal the gap: “Vi gillar förslaget, men priset ligger lite över…”",
    },
    life: {
      title: "Upphandlingen", scene: "You represent a pharmaceutical company negotiating a hospital contract for a new medicine with Malin, procurement officer at Region Västernorrland in Sundsvall.",
      who: "Malin, regional procurement officer", persona: "Methodical and budget-focused. Asks for discounts and real-world evidence, open to a risk-sharing deal.",
      goals: ["State your position on price", "Make a conditional offer (“under förutsättning att…”)", "Hold firm under pressure at least once", "Close with a clear agreement or next step"],
      open: "Välkommen! Vi har läst ert anbud. Priset ligger tyvärr en bit över vår budget. Hur ser ni på det?", open_en: "Welcome! We've read your bid. Unfortunately the price is somewhat above our budget. How do you see that?",
      hint: "Acknowledge, then add value: “Jag förstår. Samtidigt visar våra data att…”",
    },
  },
};

STOPS.ostersund = {
  city: "Östersund", level: "B2", reg: "casual", glyph: "monster",
  theme: "Berätta", en: "Storytelling & reacting",
  intro: "Tell a story with a hook and a shape, and react to other people's stories like a Swede.",
  culture: "Östersund's lake Storsjön has its own monster, Storsjöodjuret. Locals tell the story with a perfectly straight face.",
  phrases: [
    ["Du kommer aldrig att tro vad som hände!", "You'll never believe what happened!"],
    ["Det började med att…", "It started with…"],
    ["Och plötsligt…", "And suddenly…"],
    ["Till slut…", "In the end…"],
    ["Nej, men vad säger du!", "No way!", "Literally “what are you saying” but it's a reaction, not a question."],
    ["Hur gick det sen?", "What happened next?"],
    ["Det hade jag ingen aning om!", "I had no idea!"],
    ["Vilken tur att…", "How lucky that…"],
  ],
  replies: [
    { who: "A friend", say: "Du kommer aldrig att tro vad som hände i går!", en: "You'll never believe what happened yesterday!",
      opts: [
        ["Oj, nu blir jag nyfiken. Berätta!", "Oh, now I'm curious. Tell me!", 1, "Eager and curious: it invites the story."],
        ["Nej, jag tror inte på det du säger.", "No, I don't believe what you're saying.", 0, "Taken literally. “Du kommer aldrig att tro…” just builds excitement."],
        ["Oj, berätta! Vad kommer att hända?", "Oh, tell me! What's going to happen?", 0, "It happened yesterday, so ask “Vad hände?”, not about the future."],
      ] },
    { who: "A friend telling a story", say: "…och plötsligt stod det en älg mitt på vägen!", en: "…and suddenly there was a moose in the middle of the road!",
      opts: [
        ["Nej, men vad säger du! Hur gick det?", "No way! What happened?", 1, "React with surprise, then ask what happened."],
        ["Vad sa du? Kan du säga det igen?", "What did you say? Can you say it again?", 0, "That asks them to repeat. The reaction is “Vad säger du!”."],
        ["Nej, men vad säger du! Hur går det?", "No way! How's it going?", 0, "The story happened in the past, so ask “Hur gick det?”."],
      ] },
    { who: "A colleague", say: "Visste du att Storsjöodjuret faktiskt var fridlyst på 80-talet?", en: "Did you know the Storsjö monster was actually a protected species in the 80s?",
      opts: [
        ["Nej, det visste jag inte! Berätta mer.", "No, I didn't know that! Tell me more.", 1, "Surprise plus curiosity keeps them talking."],
        ["Nej, det hade jag ingen idé om!", "No, I had no idea about that!", 0, "A literal translation. In Swedish it's “ingen aning”."],
        ["Nej, det hade jag ingen aning för!", "No, I had no clue for that!", 0, "It's “ingen aning om”, not “för”."],
      ] },
    { who: "A friend", say: "Hur var resan till fjällen?", en: "How was the trip to the mountains?",
      opts: [
        ["Helt fantastisk! Det började med att vi missade tåget, men till slut…", "Fantastic! It started with us missing the train, but in the end…", 1, "Hook plus structure: start, twist, ending."],
        ["Helt fantastisk! Det började med att vi missar tåget, men till slut…", "Fantastic! It started with us miss the train, but in the end…", 0, "Mixed tenses: “började” is past, so “missade”."],
        ["Den var bra, tack. Vi åkte dit, vi åt och sen åkte vi hem igen.", "It was good, thanks. We went there, we ate and then we went home again.", 0, "Flat: it tells nothing. A hook and a twist make a story."],
      ] },
    { who: "A friend", say: "…så till slut hittade vi plånboken i snön!", en: "…so in the end we found the wallet in the snow!",
      opts: [
        ["Vilken tur att ni hittade den!", "How lucky that you found it!", 1, "“Vilken tur att…” = how lucky that…"],
        ["Vilken tur som ni hittade den!", "Such luck which you found it!", 0, "It's “vilken tur att…”, not “som”."],
        ["Vilken tur att ni tappade den!", "How lucky you lost it!", 0, "Not quite the right sentiment."],
      ] },
    { who: "A friend", say: "Hur var din första vinter i Sverige?", en: "How was your first winter in Sweden?",
      opts: [
        ["Det var en chock! Jag minns att det var mörkt redan klockan tre.", "It was a shock! I remember it was dark already at three.", 1, "A reaction plus a vivid detail: good storytelling."],
        ["Det var en chock! Jag minns att det var mörk redan klockan tre.", "It was a shock! I remember it was dark at three. (wrong form)", 0, "With “det” the adjective takes -t: “det var mörkt”."],
        ["Det är en chock! Jag minns att det är mörkt redan klockan tre.", "It's a shock! I remember it's dark already at three.", 0, "The winter is over, so use the past: “Det var en chock”."],
      ] },
  ],
  builds: [
    { en: "What happened next?", sv: "Hur gick det sen?", extra: ["går", "vad"] },
    { en: "I had no idea!", sv: "Det hade jag ingen aning om!", alt: ["Jag hade ingen aning om det!"], extra: ["hadde", "någon"] },
    { en: "And suddenly the bus stopped.", sv: "Och plötsligt stannade bussen.", extra: ["stannar", "buss"],
      note: "“Och” doesn't count: “plötsligt” takes first place, so the verb comes next." },
  ],
  gaps: [
    { sv: "I går kväll ___ vi en älg vid vägen.", en: "Last night we saw a moose by the road.", a: "såg", opts: ["såg", "ser", "sett"], why: "“I går kväll” is the past, so “såg”. Notice the verb in second place." },
    { sv: "Det började ___ att vi missade bussen.", en: "It started with us missing the bus.", a: "med", opts: ["med", "på", "av"], why: "“Börja med att…” = start with (doing something)." },
  ],
  talk: {
    title: "Berättarkväll", scene: "Around the fire at a cabin outside Östersund, your friend Nils swaps stories. React to his and tell one of your own.",
    who: "Nils, a friend", persona: "A great storyteller from Jämtland who exaggerates a little and loves big reactions. Tells a moose story and teases about the lake monster.",
    goals: ["React with surprise or interest to his story", "Ask a follow-up question", "Tell a short story of your own with a beginning and an end", "Use a sequencing word (först, sen, plötsligt, till slut)"],
    open: "Har jag berättat om när jag nästan körde på en älg utanför Brunflo?", open_en: "Have I told you about when I almost hit a moose outside Brunflo?",
    hint: "Invite the story: “Nej! Berätta!”",
  },
};

STOPS.umea = {
  city: "Umeå", level: "B2", reg: "pro", glyph: "birch",
  theme: "Presentera", en: "Presenting & Q&A",
  intro: "Signpost your talk, describe numbers precisely and handle tough questions calmly.",
  culture: "A presentation at a Swedish workplace is often called a “dragning”. Expect direct, fact-based questions.",
  phrases: [
    ["Jag tänkte börja med en kort bakgrund.", "I thought I'd start with a short background."],
    ["Som ni ser i grafen…", "As you can see in the graph…"],
    ["Försäljningen ökade med tolv procent jämfört med förra året.", "Sales increased by twelve percent compared with last year."],
    ["Det leder mig vidare till nästa punkt.", "That leads me on to the next point."],
    ["Sammanfattningsvis…", "In summary…"],
    ["Bra fråga! Låt mig fundera en sekund.", "Good question! Let me think for a second."],
    ["Det har jag inte siffrorna på just nu, men jag återkommer.", "I don't have the figures on that right now, but I'll get back to you."],
    ["Finns det några frågor?", "Are there any questions?"],
  ],
  replies: [
    { who: "A board member", say: "Varför minskade marginalen under tredje kvartalet?", en: "Why did the margin decrease in the third quarter?",
      opts: [
        ["Bra fråga. Det beror främst på högre råvarupriser, men vi ser en återhämtning nu.", "Good question. It's mainly due to higher raw material prices, but we're seeing a recovery now.", 1, "Acknowledge, explain the main cause, end looking forward."],
        ["Bra fråga. Det beror främst av högre råvarupriser, men vi ser en återhämtning nu.", "Good question. It mainly depends of higher raw material prices, but we're seeing a recovery now.", 0, "It's “bero på”, not “bero av”."],
        ["Jag vet faktiskt inte, men det är inte så viktigt. Nästa fråga?", "I don't actually know, but it's not that important. Next question?", 0, "Dismissive."],
      ] },
    { who: "A colleague in the audience", say: "Har ni siffror på hur många nya kunder ni fick i Norge?", en: "Do you have figures on how many new customers you got in Norway?",
      opts: [
        ["Inte här, men jag tar fram dem och mejlar dig i eftermiddag.", "Not here, but I'll pull them together and email you this afternoon.", 1, "Honest, with a concrete follow-up."],
        ["Det har jag inte här just nu, men jag mejlar dem dig efter mötet.", "I don't have them here right now, but I'll email them you after the meeting.", 0, "Needs “till”: “mejlar dem till dig”."],
        ["Det har jag inte här just nu, men jag mejlar dem för dig efter mötet.", "I don't have them here right now, but I'll email them on your behalf after the meeting.", 0, "“För dig” means on your behalf. Emailing to someone is “till dig”."],
      ] },
    { who: "The chair", say: "Du har fem minuter kvar.", en: "You have five minutes left.",
      opts: [
        ["Tack, då kortar jag ner och går direkt till slutsatserna.", "Thanks, then I'll cut it short and go straight to the conclusions.", 1, "Adapt and signpost."],
        ["Tack! Då hoppar jag direkt på sammanfattningen.", "Thanks! Then I'll jump on the summary.", 0, "“Hoppa till” = skip to. “Hoppa på” = jump on, or attack."],
        ["Tack! Då hoppar jag direkt över sammanfattningen.", "Thanks! Then I'll skip the summary altogether.", 0, "“Hoppa över” means skip: with five minutes left, the summary is the part to keep."],
      ] },
    { who: "Your manager, afterwards", say: "Vad tyckte du själv om hur det gick?", en: "What did you think yourself of how it went?",
      opts: [
        ["Bra på det stora hela, men bakgrunden tog för lång tid.", "Good on the whole, but the background took too long.", 1, "A balanced self-assessment. Appreciated at Swedish workplaces."],
        ["Överlag bra, men jag hade kunnat lägga mindre tid i bakgrunden.", "Good overall, but I could have spent less time in the background.", 0, "You “lägga tid på” something. “I bakgrunden” = in the background."],
        ["Överlag bra, men jag hade kunnat lägga mindre tid över bakgrunden.", "Good overall, but I could have spent less time over the background.", 0, "You “lägga tid på” something: “mindre tid på bakgrunden”."],
      ] },
    { who: "A sceptical audience member", say: "Är inte de här prognoserna lite väl optimistiska?", en: "Aren't these forecasts a bit too optimistic?",
      opts: [
        ["Det är en rimlig invändning. Vi har räknat på ett försiktigare scenario också.", "That's a fair objection. We've also calculated a more cautious scenario.", 1, "Validate the objection, then offer evidence."],
        ["Du är väl lite väl pessimistisk själv, eller hur? Det ser ju bra ut.", "You're being a bit too pessimistic yourself, aren't you? It looks good.", 0, "Turning it personal."],
        ["Nej, prognoserna är helt korrekta. Vi har räknat noga på allt, så lita på oss.", "No, the forecasts are completely correct. We've calculated everything carefully, so trust us.", 0, "Shuts down a reasonable concern."],
      ] },
    { who: "Audience member", say: "Kan du förklara den där grafen en gång till?", en: "Can you explain that graph one more time?",
      opts: [
        ["Absolut. Den blå linjen visar försäljningen och den gröna kostnaderna.", "Of course. The blue line shows sales and the green one costs.", 1, "Patient and clear."],
        ["Grafen förklarar sig själv, så den behöver ingen förklaring.", "The graph explains itself, so it doesn't need an explanation.", 0, "A brush-off."],
        ["Jag har redan förklarat den en gång, så försök lyssna lite bättre nu.", "I've already explained it once, so try to listen a bit better now.", 0, "Blaming the audience is a quick way to lose the room."],
      ] },
  ],
  builds: [
    { en: "That leads me on to the next point.", sv: "Det leder mig vidare till nästa punkt.", extra: ["leda", "på"] },
    { en: "Sales increased by twelve percent.", sv: "Försäljningen ökade med tolv procent.", extra: ["på", "ökar"] },
    { en: "Let me think for a second.", sv: "Låt mig fundera en sekund.", extra: ["låter", "på"] },
  ],
  gaps: [
    { sv: "Kostnaderna minskade ___ fem procent jämfört med i fjol.", en: "Costs decreased by five percent compared with last year.", a: "med", opts: ["med", "på", "av"], why: "A change “by” a percentage takes “med”." },
    { sv: "___ kan man säga att projektet var en framgång.", en: "In summary, one can say the project was a success.", a: "Sammanfattningsvis", opts: ["Sammanfattningsvis", "Sammanfattningsvist", "Sammanfattning"], why: "“Sammanfattningsvis” is the adverb, with no -t at the end. Then the verb comes second: “kan man”." },
  ],
  talk: {
    general: {
      title: "Kvartalsdragningen", scene: "You've just presented quarterly results to the management team at a company in Umeå. Now it's Q&A with Birgitta, the CFO.",
      who: "Birgitta, CFO", persona: "Precise and sceptical. Asks for numbers and challenges assumptions, but she's fair.",
      goals: ["Answer a question clearly with a reason", "Handle a sceptical comment calmly", "Admit something you don't know and promise a follow-up", "Close the Q&A with a short summary"],
      open: "Tack för en tydlig dragning. Jag har några frågor. Först: varför ökade kostnaderna så mycket i september?", open_en: "Thanks for a clear presentation. I have a few questions. First: why did costs rise so much in September?",
      hint: "Explain the main cause: “Bra fråga. Det beror främst på…”",
    },
    life: {
      title: "Lanseringsuppföljningen", scene: "You've presented the first months of a new medicine's launch to the Nordic leadership team in Umeå. Q&A with Birgitta, the medical director.",
      who: "Birgitta, medical director", persona: "Scientifically rigorous. Asks about prescribing by region, real-world data and safety signals.",
      goals: ["Answer a question clearly with a reason", "Handle a sceptical comment calmly", "Admit something you don't know and promise a follow-up", "Close the Q&A with a short summary"],
      open: "Tack för dragningen! Jag undrar över förskrivningen: varför går den så mycket långsammare i Region Norrbotten?", open_en: "Thanks for the presentation! I'm wondering about prescribing: why is it so much slower in Region Norrbotten?",
      hint: "Give a reason: “Bra fråga. Det beror delvis på…”",
    },
  },
};

/* ───────────── C1 · Norrbotten ───────────── */

STOPS.lulea = {
  city: "Luleå", level: "C1", reg: "pro", glyph: "anchor",
  theme: "Diplomati", en: "Feedback, disagreement & bad news",
  intro: "Disagree upward, give and receive hard feedback and deliver bad news without losing trust.",
  culture: "Swedish feedback is often wrapped in softeners like “jag upplever att…” and “du hade vunnit på att…”. Learn to hear the message inside.",
  phrases: [
    ["Får jag ge dig lite feedback på dragningen?", "May I give you some feedback on the presentation?"],
    ["Jag uppskattar verkligen ditt engagemang, samtidigt som…", "I really appreciate your commitment, while at the same time…"],
    ["Jag vill vara ärlig mot dig.", "I want to be honest with you."],
    ["Jag förstår resonemanget, men jag ser en risk med att…", "I understand the reasoning, but I see a risk in…"],
    ["Hur ser du själv på det?", "How do you see it yourself?"],
    ["Tyvärr har vi inte fått det besked vi hoppades på.", "Unfortunately we haven't received the answer we hoped for."],
    ["Det tar jag till mig.", "I'll take that on board."],
    ["Vad skulle hjälpa dig framåt?", "What would help you move forward?"],
  ],
  replies: [
    { who: "Your manager", say: "Jag vill att vi kör igång kampanjen redan på måndag.", en: "I want us to kick off the campaign already on Monday.",
      cue: "You think the material isn't ready. Disagree diplomatically.",
      opts: [
        ["Jag förstår att det är bråttom, men materialet är inte granskat. Skulle onsdag fungera?", "I understand it's urgent, but the material hasn't been reviewed. Could Wednesday work?", 1, "Acknowledge, name the risk, offer an alternative."],
        ["Det är faktiskt en dålig idé. Materialet är inte klart än, och det borde du veta.", "It's actually a bad idea. The material isn't ready yet, and you should know that.", 0, "Too blunt upwards, and no alternative."],
        ["Okej, absolut! Jag ser ingen risk alls, så vi kör igång på måndag precis som du vill.", "Okay, absolutely! I see no risk at all, so we'll kick off on Monday just as you want.", 0, "Agreeing against your judgement helps no one."],
      ] },
    { who: "A colleague", say: "Hur tyckte du att min presentation gick?", en: "How did you think my presentation went?",
      cue: "It ran too long and lost the audience.",
      opts: [
        ["Innehållet var starkt, men du hade vunnit på att korta ner den lite.", "The content was strong, but you'd have gained from shortening it a little.", 1, "Strength first, then specific, softened feedback."],
        ["Den var för lång och faktiskt ganska tråkig, om jag ska vara helt ärlig.", "It was too long and actually quite boring, if I'm completely honest.", 0, "Honest but harsh."],
        ["Jättebra! Jag skulle inte ändra någonting, den var perfekt.", "Great! I wouldn't change a thing, it was perfect.", 0, "Kind but unhelpful. They asked, and it ran too long."],
      ] },
    { who: "Someone in your team", say: "Varför fick jag inte projektledarrollen?", en: "Why didn't I get the project lead role?",
      opts: [
        ["Jag förstår att du är besviken. Vi behövde mer budgetvana. Ska vi prata om hur du bygger upp den?", "I understand you're disappointed. We needed more budget experience. Shall we talk about how you can build it up?", 1, "Empathy, an honest reason and a path forward."],
        ["Det var faktiskt inte jag som bestämde det, så du får nog ta det med ledningen i stället.", "It actually wasn't me who decided it, so you'll have to take it up with management instead.", 0, "Dodging responsibility."],
        ["Du var helt enkelt inte tillräckligt bra den här gången, men det kommer säkert fler chanser.", "You simply weren't good enough this time, but there'll surely be more chances.", 0, "Crushing and vague."],
      ] },
    { who: "A client", say: "Det här är andra gången leveransen är sen. Vi är mycket missnöjda.", en: "This is the second time the delivery is late. We're very dissatisfied.",
      opts: [
        ["Det har ni all rätt att vara, och jag ber om ursäkt. Låt mig visa vad vi gör för att det inte ska hända igen.", "You have every right to be, and I apologise. Let me show you what we're doing so it doesn't happen again.", 1, "Validate, apologise, show action."],
        ["Det förstår jag, men det är faktiskt inte vårt fel. Det är speditören som har slarvat igen, tyvärr.", "I understand, but it's actually not our fault. It's the carrier who's been careless again, unfortunately.", 0, "Blame-shifting makes clients angrier."],
        ["Det har ni all rätt att vara. Vi får väl hoppas att det blir bättre nästa gång, helt enkelt.", "You have every right to be. We'll just have to hope it gets better next time.", 0, "Vague and unconvincing."],
      ] },
    { who: "Your manager, giving you feedback", say: "Jag upplever att du ibland tar över i mötena.", en: "I feel that you sometimes take over in meetings.",
      opts: [
        ["Okej, det har jag inte tänkt på. Kan du ge ett exempel?", "Okay, I hadn't thought about that. Can you give an example?", 1, "Receive it, then ask for specifics."],
        ["Tack för att du säger det, men problemet är att de andra pratar för lite.", "Thanks for saying so, but the problem is that the others talk too little.", 0, "Deflecting."],
        ["Tack för att du säger det, men problemet är att du pratar för lite.", "Thanks for saying so, but the problem is that you talk too little.", 0, "Deflecting onto your manager. Bold, but not wise."],
      ] },
    { who: "Your team, waiting for news", say: "Fick vi något besked från investerarna?", en: "Did we hear back from the investors?",
      opts: [
        ["Tyvärr inte det vi hoppades på, men vi fick värdefull feedback som jag vill gå igenom med er.", "Unfortunately not what we hoped for, but we got valuable feedback that I want to go through with you.", 1, "Clear bad news with a constructive frame."],
        ["Nej, det är kört. Vi kan lika gärna lägga ner hela projektet och börja om från noll.", "No, it's over. We might as well shut down the whole project and start from scratch.", 0, "Abrupt and demoralising."],
        ["Det tar vi en annan gång. Jag vill inte sänka stämningen i dag, så fokusera på jobbet.", "Let's take that another time. I don't want to dampen the mood today, so focus on work.", 0, "Avoiding it breeds anxiety."],
      ] },
  ],
  builds: [
    { en: "I'll take that on board.", sv: "Det tar jag till mig.", alt: ["Jag tar till mig det."], extra: ["tog", "av"] },
    { en: "How do you see it yourself?", sv: "Hur ser du själv på det?", alt: ["Hur ser du på det själv?"], extra: ["dig", "om"] },
    { en: "I want to be honest with you.", sv: "Jag vill vara ärlig mot dig.", extra: ["är", "din"] },
  ],
  gaps: [
    { sv: "Du hade ___ på att korta ner presentationen.", en: "You would have benefited from shortening the presentation.", a: "vunnit", opts: ["vunnit", "vinna", "vann"], why: "“Hade vunnit på att…” = would have gained from. A soft, very Swedish way to give feedback." },
    { sv: "Jag förstår resonemanget. ___ ser jag en risk.", en: "I understand the reasoning. At the same time, I see a risk.", a: "Samtidigt", opts: ["Samtidigt", "Fastän", "Trots att"], why: "“Samtidigt” is an adverb, so the verb comes next: “ser jag”. “Fastän” and “trots att” start a clause: “fastän jag ser…”." },
  ],
  talk: {
    general: {
      title: "Det svåra samtalet", scene: "You lead a small team at a company in Luleå. Viktor, a skilled team member, has missed several deadlines lately. Have the feedback conversation.",
      who: "Viktor, team member", persona: "Competent, a bit defensive at first. Has stress at home he hasn't mentioned and opens up if treated with respect.",
      goals: ["Open the conversation and name the issue clearly", "Listen and show empathy", "Agree on concrete changes or support", "End on a constructive note"],
      open: "Hej, du ville prata med mig? Är det något särskilt?", open_en: "Hi, you wanted to talk to me? Is it anything in particular?",
      hint: "Open warmly but clearly: “Ja, tack för att du tog dig tid. Jag ville prata om…”",
    },
    life: {
      title: "Beskedet från TLV", scene: "You're the commercial lead at a pharmaceutical company. TLV has rejected reimbursement for your new medicine in its current form. Tell Helena, the medical lead who worked hard on the dossier, and plan the next steps.",
      who: "Helena, medical lead", persona: "Dedicated and upset by the setback. Asks hard questions, then gradually turns to solutions like a resubmission or a new health-economic model.",
      goals: ["Deliver the bad news clearly and kindly", "Acknowledge her work and feelings", "Answer a hard question honestly", "Agree on next steps together"],
      open: "Hej! Har vi hört något från TLV?", open_en: "Hi! Have we heard anything from TLV?",
      hint: "Prepare her: “Ja… Tyvärr har vi inte fått det besked vi hoppades på.”",
    },
  },
};

STOPS.jokkmokk = {
  city: "Jokkmokk", level: "C1", reg: "casual", glyph: "antlers",
  theme: "Samhällsdebatt", en: "Debating with nuance",
  intro: "Concede, counter, add nuance and find common ground on the questions Swedes argue about.",
  culture: "Jokkmokk's winter market has been held every February since 1605: Sámi crafts, reindeer and some of the coldest days of the year.",
  phrases: [
    ["Visserligen…, men…", "Admittedly…, but…", "Concede first, then counter. The backbone of a nuanced argument."],
    ["Jag skulle vilja nyansera bilden lite.", "I'd like to add some nuance to the picture."],
    ["Det är inte så svartvitt.", "It's not that black and white."],
    ["Man måste också ta hänsyn till…", "One also has to take into account…"],
    ["Enligt min mening…", "In my opinion…"],
    ["Det talar för att…", "That suggests that…"],
    ["Där är vi nog oense.", "That's probably where we disagree."],
    ["Vi kan väl enas om att…", "Surely we can agree that…"],
  ],
  replies: [
    { who: "A friend at the winter market", say: "Landsbygden dör ju. Alla unga flyttar till Stockholm.", en: "The countryside is dying, you know. All the young people move to Stockholm.",
      opts: [
        ["Det är inte så svartvitt. Visserligen flyttar många, men distansarbete har fått en del att flytta tillbaka.", "It's not that black and white. Admittedly many move, but remote work has made some move back.", 1, "Nuance, a concession and a counter-example."],
        ["Ja, landsbygden är redan helt död. Snart bor alla unga i Stockholm, och sen är det slut.", "Yes, the countryside is already completely dead. Soon all the young people will live in Stockholm, and then it's over.", 0, "Just echoes: no discussion."],
        ["Det är inte så svartvitt. Visserligen flyttar många, men distansarbete har fått en del att flytta dit.", "It's not that black and white. Admittedly many move, but remote work has made some move there.", 0, "“Dit” points to Stockholm, which supports their claim. The counter-example is people moving back: “flytta tillbaka”."],
      ] },
    { who: "A debate partner", say: "En fyradagarsvecka skulle förstöra ekonomin.", en: "A four-day week would wreck the economy.",
      opts: [
        ["Jag skulle vilja nyansera det. Försöken på Island tyder på att produktiviteten kan hållas uppe.", "I'd like to nuance that. The trials in Iceland suggest productivity can be maintained.", 1, "Nuance with evidence instead of a flat no."],
        ["Jag skulle vilja nyansera det. Försöken på Island tyder att produktiviteten kan hållas uppe.", "I'd like to nuance that. The trials in Iceland suggest productivity can be maintained. (wrong form)", 0, "It's “tyda på”: “tyder på att…”."],
        ["Nej, där har du helt fel, och det vet alla som har läst på lite grann.", "No, you're completely wrong there, and anyone who's read up a little knows it.", 0, "Shuts the debate down."],
      ] },
    { who: "A friend", say: "Så du menar alltså att vi borde förbjuda mobiler i skolan?", en: "So you're saying we should ban mobile phones in school?",
      opts: [
        ["Inte riktigt. Man måste ta hänsyn till både koncentrationen och behovet av att nå föräldrarna.", "Not quite. You have to consider both concentration and the need to reach parents.", 1, "Correct the misreading and restate your position precisely."],
        ["Inte riktigt. Man måste ta hänsyn för både koncentrationen och behovet av att nå föräldrarna.", "Not quite. You have to take consideration for both concentration and the need to reach parents.", 0, "It's “ta hänsyn till”, not “för”."],
        ["Ja, alltså, nej, eller jo, det beror lite på hur man ser på det.", "Yes, I mean, no, or yes, it depends a bit on how you look at it.", 0, "Confusing: restate your position clearly."],
      ] },
    { who: "A debate partner", say: "Det är ju självklart att alla borde få jobba hemifrån.", en: "It's obvious that everyone should be allowed to work from home.",
      opts: [
        ["Jag håller delvis med. Flexibiliteten är bra, men man måste ta hänsyn till hur nya medarbetare lär sig.", "I partly agree. The flexibility is good, but you have to consider how new employees learn.", 1, "“Delvis” = partly. Agree in part, then add a consideration."],
        ["Jag håller delvis med. Flexibiliteten är bra, men man måste ta hänsyn till hur nya medarbetare lär.", "I partly agree. The flexibility is good, but you have to consider how new employees teach.", 0, "“Lära” needs “sig” when it means learn: “lär sig”."],
        ["Självklart! Det finns inga nackdelar alls med att jobba hemifrån.", "Obviously! There are no downsides at all to working from home.", 0, "No nuance at all."],
      ] },
    { who: "A friend, after a long debate", say: "Vi kommer nog aldrig att bli överens om det här.", en: "We'll probably never agree on this.",
      opts: [
        ["Nej, men det är ju okej. Vi får enas om att vi är oense.", "No, but that's fine. We'll have to agree to disagree.", 1, "Accept the disagreement gracefully: Swedes “enas om att vara oense”."],
        ["Jo, det kommer vi, för till slut kommer du att inse att jag har rätt.", "Yes we will, because in the end you'll realise I'm right.", 0, "Not exactly gracious."],
        ["Jo, det kommer vi, för till slut kommer du att inse att du har fel.", "Yes we will, because in the end you'll realise you're wrong.", 0, "The same claim from the other side: still not gracious."],
      ] },
    { who: "A podcast host", say: "Hur tror du att Norrbotten kommer att se ut om tjugo år?", en: "What do you think Norrbotten will look like in twenty years?",
      opts: [
        ["Den gröna industrin förändrar nog regionen, men det beror på om fler vill flytta hit.", "Green industry will probably transform the region, but it depends on whether more people want to move here.", 1, "A hedged prediction with a condition."],
        ["Jag tror att det blir ungefär som nu, fast med lite mer snö och lite kallare vintrar.", "I think it'll be about the same as now, but with a bit more snow and colder winters.", 0, "Too shallow for the question."],
        ["Norrbotten ligger långt norrut och har mycket snö, så det blir nog precis likadant som i dag.", "Norrbotten is far north and has a lot of snow, so it'll probably be exactly like today.", 0, "A fact, not an answer to the question."],
      ] },
  ],
  builds: [
    { en: "It's not that black and white.", sv: "Det är inte så svartvitt.", extra: ["svart", "vit"] },
    { en: "Admittedly it's expensive, but it's worth it.", sv: "Visserligen är det dyrt, men det är värt det.", alt: ["Det är visserligen dyrt, men det är värt det."], extra: ["värd", "dyr"] },
    { en: "That's probably where we disagree.", sv: "Där är vi nog oense.", extra: ["vara", "ens"] },
  ],
  gaps: [
    { sv: "___ är det dyrt, men på sikt lönar det sig.", en: "Admittedly it's expensive, but in the long run it pays off.", a: "Visserligen", opts: ["Visserligen", "Fast", "Även om"], why: "“Visserligen” is an adverb, so the verb follows: “är det”. “Fast” and “även om” start clauses and wouldn't invert." },
    { sv: "Man måste också ta ___ till miljön.", en: "One also has to take the environment into account.", a: "hänsyn", opts: ["hänsyn", "hand", "hjälp"], why: "“Ta hänsyn till” = take into account." },
  ],
  talk: {
    title: "Debatten på marknaden", scene: "At Jokkmokk's winter market a local radio reporter pulls you into a live street debate: do small towns in the far north have a future?",
    who: "Sanna, radio reporter", persona: "Lively. Challenges every answer with a counter-argument and wants nuance and examples.",
    goals: ["State a nuanced position", "Concede a point with “visserligen” or “delvis”", "Back up an argument with an example", "Find common ground or sum up your view"],
    open: "Hej! Du är live i P4 Norrbotten! Snabb fråga: har småorter som Jokkmokk en framtid, eller flyttar alla unga söderut?", open_en: "Hi! You're live on P4 Norrbotten! Quick question: do small towns like Jokkmokk have a future, or are all the young people moving south?",
    hint: "Start with nuance: “Det är inte så svartvitt. Visserligen…”",
  },
};

STOPS.gallivare = {
  city: "Gällivare", level: "C1", reg: "pro", glyph: "mountain",
  theme: "Ledarskap", en: "Leading & persuading",
  intro: "Win over sceptics, drive a group to a decision and take ownership, the way Swedish leaders do it.",
  culture: "Swedish leadership is consensus-driven: “förankra” (anchor support) before deciding, or the decision won't hold.",
  phrases: [
    ["Jag vill att vi landar i ett beslut i dag.", "I want us to land on a decision today."],
    ["Vad skulle krävas för att du ska känna dig trygg med det?", "What would it take for you to feel comfortable with that?"],
    ["Låt oss vända på det.", "Let's turn it around."],
    ["Jag hör vad du säger, och…", "I hear what you're saying, and…"],
    ["Det här ligger helt i linje med vår strategi.", "This is fully in line with our strategy."],
    ["Kan vi testa det i liten skala först?", "Can we test it on a small scale first?"],
    ["Vem behöver vi få med oss?", "Who do we need to get on board?"],
    ["Jag tar ansvar för att…", "I'll take responsibility for…"],
  ],
  replies: [
    { who: "A sceptical department head", say: "Vi har testat sånt här förut och det fungerade inte.", en: "We've tried this sort of thing before and it didn't work.",
      opts: [
        ["Jag hör vad du säger, och vi ska lära oss av det. Vad gick fel förra gången?", "I hear what you're saying, and we should learn from it. What went wrong last time?", 1, "Validate, then turn scepticism into input."],
        ["Det var då, och nu är nu. Den här gången kommer det att fungera, lita på mig.", "That was then, and this is now. This time it'll work, trust me.", 0, "Dismissive."],
        ["Okej, då struntar vi helt i det. Det är ingen idé att ens försöka igen.", "Okay, then we'll drop it completely. There's no point even trying again.", 0, "Caving instantly."],
      ] },
    { who: "Your team", say: "Vi har diskuterat i en timme. Vad gör vi nu?", en: "We've been discussing for an hour. What do we do now?",
      opts: [
        ["Jag föreslår alternativ B, med en utvärdering efter tre månader. Har någon starka invändningar?", "I propose option B, with a review after three months. Does anyone have strong objections?", 1, "Drive to a decision while leaving room for objections."],
        ["Vi bokar ett nytt möte nästa vecka och diskuterar vidare, det finns ingen brådska.", "We'll book another meeting next week and keep discussing, there's no rush.", 0, "Kicking the can down the road."],
        ["Jag vet faktiskt inte. Ni får bestämma själva, så kör jag på det som ni tycker är bäst.", "I actually don't know. You decide, and I'll go with whatever you think is best.", 0, "Abdicating."],
      ] },
    { who: "A cautious colleague", say: "Jag känner mig inte trygg med att lansera hela systemet på en gång.", en: "I don't feel comfortable launching the whole system at once.",
      opts: [
        ["Det förstår jag. Kan vi testa det i liten skala först, till exempel på ett kontor?", "I understand. Can we test it on a small scale first, for example in one office?", 1, "Lower the risk with a pilot."],
        ["Det förstår jag. Kan vi testa det i en liten skala först, till exempel på ett kontor?", "I understand. Can we test it in a small scale first, for example in one office?", 0, "The fixed phrase is “i liten skala”, with no article."],
        ["Det måste du bli, för vi lanserar hela systemet på måndag oavsett.", "You'll have to be, because we're launching the whole system on Monday regardless.", 0, "Steamrolling."],
      ] },
    { who: "Senior leadership", say: "Varför ska vi prioritera det här just nu?", en: "Why should we prioritise this right now?",
      opts: [
        ["Det ligger helt i linje med vår strategi, och om vi väntar riskerar vi att tappa marknadsandelar.", "It's fully in line with our strategy, and if we wait we risk losing market share.", 1, "Link to strategy plus the cost of waiting."],
        ["Det ligger helt i linje till vår strategi, och om vi väntar riskerar vi att tappa marknadsandelar.", "It lies fully in line to our strategy, and if we wait we risk losing market share.", 0, "The phrase is “i linje med”."],
        ["För att jag tycker att det är viktigt, och jag har ju jobbat här längst.", "Because I think it's important, and I've worked here the longest.", 0, "Not a business case."],
      ] },
    { who: "A project member", say: "Vem ska äga den här frågan?", en: "Who should own this issue?",
      opts: [
        ["Jag tar ansvar för att den drivs framåt, men jag behöver stöd från ekonomiavdelningen.", "I'll take responsibility for driving it forward, but I need support from the finance department.", 1, "Ownership plus a named dependency."],
        ["Jag tar ansvar att den drivs framåt, men jag behöver stöd från ekonomiavdelningen.", "I take responsibility that it's driven forward, but I need support from finance.", 0, "The phrase is “ta ansvar för att…”."],
        ["Det vet ingen riktigt. Vi får se vem som har tid när det väl blir aktuellt.", "Nobody really knows. We'll see who has time when it comes up.", 0, "Leaves it hanging."],
      ] },
    { who: "A frustrated team member", say: "Det känns som att ledningen aldrig lyssnar på oss.", en: "It feels like management never listens to us.",
      opts: [
        ["Det är en viktig signal. Berätta mer: vad skulle få dig att känna att ni blir hörda?", "That's an important signal. Tell me more: what would make you feel you're being heard?", 1, "Open up rather than defend."],
        ["Det stämmer inte alls. Vi lyssnar hela tiden, ni kanske inte märker det bara.", "That's not true at all. We listen all the time, maybe you just don't notice.", 0, "Defensive."],
        ["Det är en viktig signal. Prata med HR om det, de är bättre på sånt än jag.", "That's an important signal. Talk to HR about it, they're better at that than me.", 0, "Passing the buck."],
      ] },
  ],
  builds: [
    { en: "Let's turn it around.", sv: "Låt oss vända på det.", extra: ["vänder", "om"] },
    { en: "Who do we need to get on board?", sv: "Vem behöver vi få med oss?", extra: ["vad", "er"] },
    { en: "I want us to land on a decision today.", sv: "Jag vill att vi landar i ett beslut i dag.", alt: ["I dag vill jag att vi landar i ett beslut."], extra: ["landa", "en"] },
  ],
  gaps: [
    { sv: "Vad skulle ___ för att du ska känna dig trygg?", en: "What would it take for you to feel comfortable?", a: "krävas", opts: ["krävas", "kräva", "krävs"], why: "After “skulle” comes an infinitive, here the passive “krävas”." },
    { sv: "Det här ligger helt i ___ med vår strategi.", en: "This is fully in line with our strategy.", a: "linje", opts: ["linje", "riktning", "rad"], why: "“I linje med” = in line with. “I riktning med” isn't a Swedish phrase." },
  ],
  talk: {
    general: {
      title: "Förändringen", scene: "You're leading a change at a company in Gällivare: moving the team to a new digital planning tool. Göran is a respected but sceptical senior engineer who can make or break the rollout.",
      who: "Göran, senior engineer", persona: "Thirty years at the company, sceptical of new tools, values respect and practical arguments. Can be won over with a pilot and real influence.",
      goals: ["Explain why the change matters", "Listen to his concerns and acknowledge them", "Offer a concrete compromise", "Agree on a next step with clear ownership"],
      open: "Jaha, så det är du som ska få oss att byta system. Lycka till med det.", open_en: "Right, so you're the one who's going to make us switch systems. Good luck with that.",
      hint: "Disarm him: “Ja, och jag behöver din hjälp för att det ska bli bra.”",
    },
    life: {
      title: "Den nya kanalstrategin", scene: "You lead the launch team for a new medicine. Göran, the long-serving key account manager for Norrbotten, thinks the new omnichannel approach won't work with the region's doctors.",
      who: "Göran, key account manager", persona: "Twenty-five years in pharma sales and deeply trusted by clinicians up north. Sceptical of digital channels, but respect, data and a pilot can win him over.",
      goals: ["Explain why the change matters", "Listen to his concerns and acknowledge them", "Offer a concrete compromise", "Agree on a next step with clear ownership"],
      open: "Jaha, så nu ska vi sälja via mejl och webbinarier i stället för att träffa läkarna. Lycka till med det i Gällivare.", open_en: "Right, so now we're supposed to sell through emails and webinars instead of meeting the doctors. Good luck with that in Gällivare.",
      hint: "Acknowledge his experience: “Jag hör vad du säger, och ingen känner läkarna här bättre än du.”",
    },
  },
};

STOPS.kiruna = {
  city: "Kiruna", level: "C1", reg: "mixed", glyph: "aurora",
  theme: "Flytet", en: "Idioms, humour & flow",
  intro: "The finale: idioms, quick wit and the flow that makes Swedes forget you're speaking your second language.",
  culture: "Kiruna is moving: the iron-ore mine is undermining the old town, so the centre was rebuilt 3 km east and the church was moved in one piece in 2025.",
  phrases: [
    ["Det är ingen ko på isen.", "No rush, no problem.", "Literally: there's no cow on the ice."],
    ["Ropa inte hej förrän du är över bäcken.", "Don't celebrate too early.", "Literally: don't shout hey until you're over the stream."],
    ["Han slog två flugor i en smäll.", "He killed two birds with one stone.", "Literally: two flies with one swat."],
    ["Det är bara att gilla läget.", "You just have to accept the situation."],
    ["Hon gled in på en räkmacka.", "She had it handed to her.", "Literally: she slid in on a shrimp sandwich."],
    ["Ta det med en nypa salt.", "Take it with a pinch of salt."],
    ["Nu är det kört.", "Now it's game over."],
    ["Det sitter i ryggmärgen.", "It's second nature.", "Literally: it sits in the spinal cord."],
  ],
  replies: [
    { who: "A colleague, panicking", say: "Kunden har inte svarat än, vi kommer att missa deadline!", en: "The client hasn't replied yet, we're going to miss the deadline!",
      opts: [
        ["Lugn, ingen ko på isen. Vi har ända till fredag.", "Relax, no need to panic. We have until Friday.", 1, "“Ingen ko på isen” = no need to panic."],
        ["Lugn, det finns en ko på isen. Deadline är först på fredag.", "Relax, there's a cow on the ice. The deadline isn't until Friday.", 0, "“En ko på isen” means there IS a problem. Calm is “ingen ko på isen”."],
        ["Ta det med en nypa salt. Deadline är först på fredag.", "Take it with a pinch of salt. The deadline isn't until Friday.", 0, "That means be sceptical, not calm down."],
      ] },
    { who: "A friend at a hockey match", say: "Vi har typ vunnit redan, det är bara fem minuter kvar!", en: "We've basically won already, there are only five minutes left!",
      opts: [
        ["Ropa inte hej förrän du är över bäcken!", "Don't celebrate too early!", 1, "Exactly the idiom for premature celebration."],
        ["Lugn, det sitter i ryggmärgen hos laget nu.", "Relax, it's second nature for the team now.", 0, "Wrong idiom: that's about skill, not celebrating too early."],
        ["Ropa inte hej förrän du är över bron!", "Don't shout hey until you're over the bridge!", 0, "The idiom is “över bäcken” (the stream), not “bron”."],
      ] },
    { who: "A colleague", say: "Hon fick jobbet direkt, utan intervju, för att hennes pappa äger företaget.", en: "She got the job straight away, without an interview, because her dad owns the company.",
      opts: [
        ["Hon gled in på en räkmacka, alltså.", "So she had it handed to her.", 1, "“Glida in på en räkmacka” = get something without effort."],
        ["Hon slog två flugor i en smäll, alltså.", "So she killed two birds with one stone.", 0, "That's about achieving two things at once."],
        ["Det sitter i ryggmärgen hos henne, alltså.", "So it's second nature to her.", 0, "Wrong idiom: nothing here is a practised skill."],
      ] },
    { who: "A friend", say: "Tåget är inställt igen. Vad gör vi nu?", en: "The train's cancelled again. What do we do now?",
      opts: [
        ["Det är bara att gilla läget. Ska vi ta en fika medan vi väntar?", "We'll just have to accept it. Shall we have a fika while we wait?", 1, "Accept it and make the best of it."],
        ["Vi glider in på en räkmacka. Ska vi ta en fika medan vi väntar?", "We're having it handed to us. Shall we have a fika while we wait?", 0, "The opposite of what's happening."],
        ["Ropa inte hej förrän du är över bäcken. Vi tar en taxi!", "Don't celebrate too early. Let's take a taxi!", 0, "The wrong idiom: nobody is celebrating."],
      ] },
    { who: "A colleague", say: "Hur kan du skriva rapporter så snabbt?", en: "How can you write reports so fast?",
      opts: [
        ["Övning, helt enkelt. Efter tio år går det av bara farten.", "Practice, simply. After ten years it just happens by itself.", 1, "“Av bara farten” = by sheer momentum, without thinking."],
        ["Jag har gjort det i tio år. Jag tar det med en nypa salt nu.", "I've done it for ten years. I take it with a pinch of salt now.", 0, "Wrong idiom: that means being sceptical."],
        ["Jag har gjort det i tio år. Det är ingen ko på isen nu.", "I've done it for ten years. There's no rush now.", 0, "“Ingen ko på isen” means there's no cause for alarm. It doesn't explain your speed."],
      ] },
    { who: "A friend", say: "Jag läste att man blir smartare av att äta choklad varje dag!", en: "I read that you get smarter from eating chocolate every day!",
      opts: [
        ["Haha, det skulle jag ta med en nypa salt.", "Haha, I'd take that with a pinch of salt.", 1, "Polite scepticism with humour."],
        ["Haha, det sitter nog i ryggmärgen hos dig.", "Haha, it's probably second nature to you.", 0, "Wrong idiom."],
        ["Haha, det skulle jag ta med en nypa socker.", "Haha, I'd take that with a pinch of sugar.", 0, "The idiom is “en nypa salt”. Sugar is just chocolate talk."],
      ] },
  ],
  builds: [
    { en: "There's no rush. (idiom)", sv: "Det är ingen ko på isen.", extra: ["en", "kor"] },
    { en: "Take it with a pinch of salt.", sv: "Ta det med en nypa salt.", extra: ["tar", "nyp"] },
    { en: "We killed two birds with one stone. (idiom)", sv: "Vi slog två flugor i en smäll.", extra: ["fåglar", "sten"] },
  ],
  gaps: [
    { sv: "Det är bara att ___ läget.", en: "You just have to accept the situation.", a: "gilla", opts: ["gilla", "tycka", "älska"], why: "A fixed idiom: “gilla läget”." },
    { sv: "Ropa inte hej förrän du är över ___.", en: "Don't celebrate before you're over the stream.", a: "bäcken", opts: ["bäcken", "bron", "berget"], why: "The idiom uses “bäcken”, the stream." },
  ],
  talk: {
    title: "Staden som flyttar", scene: "The final stop! In Kiruna, the town that's moving because of the mine, you're at an after-work with Elsa, a quick-witted local. Keep up with her humour and idioms.",
    who: "Elsa, a local", persona: "Witty and fast-talking, loves idioms and dry humour, works at the town planning office and teases you a little.",
    goals: ["Keep the conversation flowing for several turns", "Use at least one Swedish idiom naturally", "React to her humour or tease back", "Share an opinion about the town move or life up north"],
    open: "Välkommen till Kiruna, staden som inte står still! Bokstavligen. Har du hunnit se nya centrum?", open_en: "Welcome to Kiruna, the town that doesn't stand still! Literally. Have you had time to see the new centre?",
    hint: "Answer and play along: “Ja, det har jag! Det är verkligen…”",
  },
};
