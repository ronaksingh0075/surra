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
        ["Jag tänker att cykla är bra.", "I'm thinking that cycling is good.", 0, "For opinions use “tycker”: “Jag tycker att det är bra.”"],
        ["Ja, jag håller med dig om.", "Yes, I agree with you about.", 0, "“Om” needs an object: “Jag håller med dig om det.”"],
      ] },
    { who: "A friend", say: "Alla borde flytta till landet. Staden är så stressig.", en: "Everyone should move to the countryside. The city is so stressful.",
      opts: [
        ["Jag ser det lite annorlunda. Jag gillar att ha allt nära.", "I see it a bit differently. I like having everything close by.", 1, "Soft disagreement plus a reason. The Swedish way."],
        ["Du har fel.", "You're wrong.", 0, "Far too blunt for Swedish small talk."],
        ["Jag ser annorlunda.", "I see differently.", 0, "Missing “det”: “Jag ser det annorlunda.”"],
      ] },
    { who: "A friend", say: "Tror du att det blir sol i helgen?", en: "Do you think it'll be sunny this weekend?",
      opts: [
        ["Jag tror det, men man vet aldrig.", "I think so, but you never know.", 1, "“Tro” for a guess about the future. Correct."],
        ["Jag tycker att det blir sol.", "In my opinion it'll be sunny.", 0, "The weather isn't a matter of taste. Use “tror”."],
        ["Jag tror så.", "I think so.", 0, "A literal translation of “I think so”. Swedish says “Jag tror det”."],
      ] },
    { who: "A friend", say: "Är det bättre att hyra eller köpa lägenhet?", en: "Is it better to rent or buy a flat?",
      opts: [
        ["Det beror på hur länge man ska bo där.", "It depends on how long you'll live there.", 1, "“Det beror på” + the condition. Thoughtful."],
        ["Det beror.", "It depends.", 0, "“Bero” needs “på”: “Det beror på.”"],
        ["Ja, det är bättre.", "Yes, it's better.", 0, "Either-or question: “yes” doesn't choose."],
      ] },
    { who: "A colleague", say: "Jag tycker att den nya filmen var ganska tråkig.", en: "I thought the new film was pretty boring.",
      opts: [
        ["Verkligen? Jag tyckte att den var spännande!", "Really? I thought it was exciting!", 1, "Friendly disagreement. Past tense “tyckte” since you've seen it."],
        ["Verkligen? Jag tyckte att den var spännad!", "Really? I thought it was excit!", 0, "“Spännande” (exciting) never changes form."],
        ["Jag tycker att du är tråkig.", "I think you're boring.", 0, "Ouch: that's about the person, not the film."],
      ] },
    { who: "A friend in a discussion", say: "Men tänk på miljön! Flyg är ju sämst.", en: "But think of the environment! Flying is the worst, you know.",
      opts: [
        ["Där har du en poäng. Jag försöker ta tåget när jag kan.", "You've got a point there. I try to take the train when I can.", 1, "Concede a point gracefully, then add your angle."],
        ["Där har du en punkt.", "There you have a full stop.", 0, "A point in an argument is a “poäng”. “Punkt” is a dot or full stop."],
        ["Ja, miljön är sämst.", "Yes, the environment is the worst.", 0, "Mixes it up: it's flying that's the worst."],
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
        ["Ja, jag skulle vilja ta på tidsplanen.", "Yes, I'd like to put on the timeline.", 0, "“Ta på” = put on (clothes). You “ta upp” a topic."],
        ["Ja, dagordningen är bra.", "Yes, the agenda is good.", 0, "Says yes but adds nothing."],
      ] },
    { who: "A colleague presenting", say: "…så vi behöver nog skjuta lanseringen till efter sommaren.", en: "…so we'll probably need to push the launch to after the summer.",
      cue: "You want to check what this means for your work.",
      opts: [
        ["Om jag förstår dig rätt, påverkar det även budgeten för hösten?", "If I understand you correctly, does that also affect the autumn budget?", 1, "Paraphrase and check the consequences. A strong meeting move."],
        ["Om jag förstår dig rätt, det påverkar även budgeten?", "If I understand you right, it affects the budget too?", 0, "After a fronted “om”-clause the verb comes next: “påverkar det”."],
        ["Skjut inte!", "Don't shoot!", 0, "“Skjuta” here means postpone."],
      ] },
    { who: "A colleague", say: "Vi borde satsa mer på sociala medier.", en: "We should invest more in social media.",
      opts: [
        ["Intressant. Kan du utveckla det lite?", "Interesting. Could you elaborate a little?", 1, "Hear it out before you judge."],
        ["Varför säger du det?", "Why do you say that?", 0, "Can sound confrontational in a Swedish meeting. Ask them to elaborate instead."],
        ["Det tycker inte jag.", "I don't think so.", 0, "Rejecting an idea before hearing it shuts the discussion down."],
      ] },
    { who: "Meeting chair", say: "Någon behöver sammanställa kundfeedbacken till nästa vecka. Vem tar det?", en: "Someone needs to compile the customer feedback by next week. Who'll take it?",
      opts: [
        ["Jag kan ta det, om jag får hjälp med datan.", "I can take it, if I get help with the data.", 1, "Volunteer with a clear condition."],
        ["Jag tar det inte.", "I'm not taking it.", 0, "Refusing without a reason."],
        ["Vem tar vad?", "Who takes what?", 0, "Just echoes the question."],
      ] },
    { who: "A colleague, going off-topic", say: "…och apropå det, vi borde också byta CRM-system!", en: "…and speaking of which, we should also switch CRM systems!",
      opts: [
        ["Bra poäng, men kan vi återkomma till det på nästa möte? Vi har lite ont om tid.", "Good point, but can we come back to that next meeting? We're a bit short on time.", 1, "Park it politely with “återkomma till det”."],
        ["Nej, sluta.", "No, stop.", 0, "Rude."],
        ["Ja, vi byter i dag.", "Yes, we'll switch today.", 0, "Agreeing to a big change in passing derails the agenda."],
      ] },
    { who: "Meeting chair at the end", say: "Okej, ska vi sammanfatta?", en: "Okay, shall we summarise?",
      opts: [
        ["Ja. Jag tar kundanalysen till fredag, och Lisa bokar nästa möte.", "Yes. I'll do the customer analysis by Friday, and Lisa books the next meeting.", 1, "Who does what by when. Exactly what a summary needs."],
        ["Ja. Jag tar kundanalysen till fredag, och Lisa bokar nästa mötet.", "Yes. I'll do the analysis by Friday, and Lisa books the next the meeting.", 0, "After “nästa” Swedish uses the indefinite form: “nästa möte”."],
        ["Ja, sammanfatta.", "Yes, summarise.", 0, "A curt order that summarises nothing."],
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
        ["Ni är dåliga.", "You're bad.", 0, "Starting with an insult rarely gets results."],
      ] },
    { who: "Customer service", say: "Jag ser att paketet är försenat. Tyvärr vet jag inte när det kommer.", en: "I can see the parcel is delayed. Unfortunately I don't know when it'll arrive.",
      opts: [
        ["Jag förstår att det inte är ditt fel, men vad kan ni göra åt det?", "I understand it's not your fault, but what can you do about it?", 1, "Empathy plus a push for action: firm but friendly."],
        ["Okej, hej då.", "Okay, bye.", 0, "Giving up too easily."],
        ["Det är ditt fel!", "It's your fault!", 0, "Blaming the person on the phone won't help."],
      ] },
    { who: "Your landlord", say: "Vi kan skicka en rörmokare nästa vecka.", en: "We can send a plumber next week.",
      cue: "Your kitchen sink is leaking right now.",
      opts: [
        ["Det läcker ganska mycket, så finns det någon möjlighet att någon kommer tidigare?", "It's leaking quite a lot, so is there any chance someone could come sooner?", 1, "Explain the urgency, then a soft request: “finns det någon möjlighet…”."],
        ["Nästa vecka passar perfekt.", "Next week is perfect.", 0, "Accepting a week of leaking!"],
        ["Kom nu, annars flyttar jag!", "Come now or I'm moving out!", 0, "Threats escalate fast."],
      ] },
    { who: "A shop assistant", say: "Har du kvar kvittot?", en: "Do you still have the receipt?",
      opts: [
        ["Ja, här är det. Jag köpte jackan för två veckor sedan.", "Yes, here it is. I bought the jacket two weeks ago.", 1, "“För två veckor sedan” = two weeks ago."],
        ["Ja, här är det. Jag köpte jackan sedan två veckor.", "Yes, here it is. I bought the jacket since two weeks.", 0, "“Ago” is “för … sedan”: “för två veckor sedan”."],
        ["Ja, jag har kvar jackan.", "Yes, I still have the jacket.", 0, "You were asked about the receipt."],
      ] },
    { who: "Customer service", say: "Vi kan erbjuda dig ett presentkort på 200 kronor.", en: "We can offer you a gift card for 200 kronor.",
      opts: [
        ["Tack, men jag skulle hellre vilja ha pengarna tillbaka.", "Thanks, but I'd rather have my money back.", 1, "“Hellre” = rather. A polite counter-request."],
        ["Tack, men jag skulle hellre vilja ha pengarna bak.", "Thanks, but I'd rather have the money behind.", 0, "“Back” here is “tillbaka”. “Bak” means behind."],
        ["Nej, jag vill inte.", "No, I don't want to.", 0, "Refusing without saying what you want instead."],
      ] },
    { who: "Customer service", say: "Då återbetalar vi beloppet inom fem arbetsdagar.", en: "Then we'll refund the amount within five working days.",
      opts: [
        ["Perfekt, tack! Kan du bekräfta det via mejl?", "Perfect, thanks! Can you confirm that by email?", 1, "Always get it in writing."],
        ["Perfekt, tack! Kan du konfirmera det via mejl?", "Perfect, thanks! Can you confirm (in church) by email?", 0, "“Konfirmera” is the church confirmation. Use “bekräfta”."],
        ["Fem dagar är för kort.", "Five days is too short.", 0, "That's good news, not a problem."],
      ] },
  ],
  builds: [
    { en: "I'm calling about my order.", sv: "Jag ringer angående min beställning.", extra: ["mitt", "ringde"] },
    { en: "Can I get my money back?", sv: "Kan jag få pengarna tillbaka?", alt: ["Kan jag få tillbaka pengarna?"], extra: ["pengar", "ta"] },
    { en: "Unfortunately something has gone wrong.", sv: "Det har tyvärr blivit något fel.", alt: ["Tyvärr har det blivit något fel."], extra: ["bli", "någon"] },
  ],
  gaps: [
    { sv: "Jag skulle vilja ___ den här tröjan, den har ett hål.", en: "I'd like to return this sweater as faulty, it has a hole.", a: "reklamera", opts: ["reklamera", "reklam", "klaga"], why: "“Reklamera” = return a faulty item. “Klaga” needs “på” and isn't about returning." },
    { sv: "Jag ringer ___ fakturan jag fick i går.", en: "I'm calling about the invoice I got yesterday.", a: "angående", opts: ["angående", "hos", "åt"], why: "“Angående” = regarding. Standard in calls and emails." },
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
        ["Ja, jag hittade dig.", "Yes, I found you.", 0, "Slightly creepy!"],
        ["Nej, men jag är här nu.", "No, but I'm here now.", 0, "A grumpy start. Keep the small talk positive."],
      ] },
    { who: "Interviewer", say: "Berätta lite om dig själv.", en: "Tell me a little about yourself.",
      opts: [
        ["Jag har en bakgrund inom bioteknik och har jobbat med marknadsanalys de senaste tre åren.", "I have a background in biotech and have worked with market analysis for the last three years.", 1, "Background plus recent experience. A clear opening."],
        ["Jag har en bakgrund inom bioteknik och jobbade med marknadsanalys de senaste tre åren.", "I have a background in biotech and worked with market analysis the last three years.", 0, "“De senaste tre åren” runs up to now, so use the perfect: “har jobbat”."],
        ["Jag gillar pizza och Netflix.", "I like pizza and Netflix.", 0, "Too personal and off-topic for an opener."],
      ] },
    { who: "Interviewer", say: "Varför söker du just den här tjänsten?", en: "Why are you applying for this particular role?",
      opts: [
        ["Det som lockar mig är att få jobba nära kunderna i en växande organisation.", "What attracts me is working close to the customers in a growing organisation.", 1, "Specific motivation linked to the role."],
        ["Det som attraherar mig är lönen.", "What attracts me is the salary.", 0, "“Attrahera” sounds physical, and leading with salary doesn't sell you."],
        ["För att jag behöver ett jobb.", "Because I need a job.", 0, "Honest, but it doesn't sell you."],
      ] },
    { who: "Interviewer", say: "Vad skulle du säga är din största svaghet?", en: "What would you say is your biggest weakness?",
      opts: [
        ["Jag har ibland svårt att säga nej, så nu jobbar jag med att prioritera tydligare.", "I sometimes find it hard to say no, so now I'm working on prioritising more clearly.", 1, "An honest weakness plus what you're doing about it."],
        ["Jag har inga svagheter.", "I have no weaknesses.", 0, "Sounds arrogant, especially in Sweden."],
        ["Jag är för perfekt.", "I'm too perfect.", 0, "A cliché interviewers see through."],
      ] },
    { who: "Interviewer", say: "Ge ett exempel på när du har löst en svår situation.", en: "Give an example of when you solved a difficult situation.",
      opts: [
        ["I min förra roll fick vi en försenad leverans precis innan en lansering. Då…", "In my previous role we got a delayed delivery right before a launch. Then…", 1, "Start a concrete story: situation, action, result."],
        ["I min förra roll vi fick en försenad leverans precis innan en lansering.", "In my previous role we got a delayed delivery before a launch.", 0, "Something first, verb second: “I min förra roll fick vi…”."],
        ["Jag löser alltid allt.", "I always solve everything.", 0, "Vague and boastful."],
      ] },
    { who: "Interviewer", say: "Har du några frågor till oss?", en: "Do you have any questions for us?",
      opts: [
        ["Ja, hur ser en vanlig arbetsdag ut i teamet?", "Yes, what does a typical day look like in the team?", 1, "Always have a question ready."],
        ["Ja, hur ser ut en vanlig arbetsdag?", "Yes, how looks a typical day?", 0, "The particle stays after the subject: “Hur ser en vanlig arbetsdag ut?”"],
        ["Nej.", "No.", 0, "A missed chance to show interest."],
      ] },
  ],
  builds: [
    { en: "Tell me a little about yourself.", sv: "Berätta lite om dig själv.", extra: ["mig", "din"] },
    { en: "One of my strengths is that I'm structured.", sv: "En av mina styrkor är att jag är strukturerad.", extra: ["min", "styrka"] },
    { en: "What are the next steps in the process?", sv: "Vilka är nästa steg i processen?", extra: ["vilken", "processer"] },
  ],
  gaps: [
    { sv: "I min förra roll ___ jag för budgeten.", en: "In my previous role I was responsible for the budget.", a: "ansvarade", opts: ["ansvarade", "ansvarar", "ansvar"], why: "A previous role takes the past tense. Notice the word order too: “I min förra roll ansvarade jag…”." },
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
        ["Nej, det var i förrgår.", "No, it was the day before yesterday.", 0, "Taken literally. It's an idiom for “long time no see”."],
        ["Ja, det var i går.", "Yes, it was yesterday.", 0, "Taken literally."],
      ] },
    { who: "A colleague", say: "Det kanske inte är världens bästa idé att boka resan redan nu…", en: "It might not be the world's best idea to book the trip already…",
      cue: "What do they really mean?",
      opts: [
        ["Okej, du menar att vi borde vänta lite?", "Okay, you mean we should wait a bit?", 1, "Understatement decoded: “maybe not the best idea” means don't. Checking shows you caught it."],
        ["Toppen, då bokar jag direkt!", "Great, I'll book right away!", 0, "Missed the hint. They're advising against it."],
        ["Vilken är världens bästa idé då?", "What's the world's best idea, then?", 0, "Taken literally."],
      ] },
    { who: "A friend", say: "Du kommer väl på mitt kalas på lördag?", en: "You're coming to my party on Saturday, right?",
      opts: [
        ["Klart jag gör! Vad vill du ha i present?", "Of course I am! What would you like as a present?", 1, "“Klart jag gör” = of course I am."],
        ["Ja, jag kommer nog.", "Yes, I'll probably come.", 0, "“Nog” sounds unsure, so your friend may feel you're not keen."],
        ["Klart jag kommer väl!", "Of course I'm coming, I suppose!", 0, "“Väl” in a statement adds doubt. Drop it."],
      ] },
    { who: "Your neighbour", say: "Det är ju lite kallt i trapphuset nuförtiden…", en: "It's a bit cold in the stairwell these days, isn't it…",
      cue: "A hint that someone keeps leaving the door open. Maybe you?",
      opts: [
        ["Ja, det har jag också märkt. Jag ska se till att dörren stängs ordentligt.", "Yes, I've noticed too. I'll make sure the door closes properly.", 1, "Respond to the hint without drama."],
        ["Nej, det är varmt.", "No, it's warm.", 0, "Contradicts instead of picking up the hint."],
        ["Varför säger du ju?", "Why do you say “ju”?", 0, "Analysing the word misses the message."],
      ] },
    { who: "A friend, after you suggest a plan", say: "Mm, jo… kanske.", en: "Mm, well… maybe.",
      cue: "Your friend doesn't sound keen.",
      opts: [
        ["Du verkar inte helt övertygad. Ska vi hitta på något annat?", "You don't seem convinced. Shall we do something else?", 1, "Read the hesitation and offer an alternative."],
        ["Bra, då kör vi!", "Great, let's go!", 0, "Steamrolling a lukewarm “kanske”."],
        ["Kanske är inte ett svar.", "Maybe isn't an answer.", 0, "Too confrontational."],
      ] },
    { who: "A colleague", say: "Det blir nog bra, ska du se.", en: "It'll probably be fine, you'll see.",
      opts: [
        ["Tack, det hoppas jag verkligen.", "Thanks, I really hope so.", 1, "Accept the comfort graciously."],
        ["Ska jag se vad?", "See what?", 0, "“Ska du se” is a fixed reassuring phrase, not an instruction to look."],
        ["Nog är inte säkert.", "Probably isn't certain.", 0, "Picking at the word instead of taking the kindness."],
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
        ["Det ligger lite över vad vi hade tänkt oss. Finns det något utrymme i priset?", "That's a bit above what we had in mind. Is there any room in the price?", 1, "Signal the gap softly and open the door."],
        ["Det ligger lite ovanför vad vi hade tänkt oss.", "That lies a bit up above what we had in mind.", 0, "“Ovanför” is physical position. Prices “ligger över”."],
        ["Okej, vi betalar.", "Okay, we'll pay.", 0, "Accepting the first offer leaves money on the table."],
      ] },
    { who: "A client", say: "Kan ni sänka priset med tio procent?", en: "Can you lower the price by ten percent?",
      opts: [
        ["Det kan vi göra, under förutsättning att ni tecknar ett tvåårsavtal.", "We can do that, on condition that you sign a two-year contract.", 1, "Trade, don't give: a concession for a condition."],
        ["Ja, vi sänker med tjugo procent.", "Yes, we'll lower it by twenty percent.", 0, "Giving away more than they asked for!"],
        ["Under förutsättning kan vi göra det.", "On condition we can do it.", 0, "Unfinished: “under förutsättning att…” needs the condition."],
      ] },
    { who: "Your manager, in a salary talk", say: "Vad har du för löneanspråk?", en: "What are your salary expectations?",
      opts: [
        ["Utifrån min erfarenhet och marknadsläget tänker jag mig runt 48 000 i månaden.", "Based on my experience and the market, I'm thinking around 48,000 a month.", 1, "Anchor with reasoning. “Utifrån” = based on."],
        ["Så mycket som möjligt.", "As much as possible.", 0, "Vague, and a bit cheeky."],
        ["Jag vet inte, vad tycker du?", "I don't know, what do you think?", 0, "Hands over the anchor."],
      ] },
    { who: "A supplier", say: "Det här är verkligen vår smärtgräns.", en: "This really is our absolute limit.",
      opts: [
        ["Jag förstår. Låt mig stämma av med min chef, så återkommer jag i morgon.", "I understand. Let me check with my manager and I'll get back to you tomorrow.", 1, "Buy time without caving."],
        ["Smärta? Har du ont?", "Pain? Are you hurting?", 0, "Taken literally: “smärtgräns” is the bottom line."],
        ["Då sänker ni lite till.", "Then you'll go a bit lower.", 0, "Ignores their signal and may end the talks."],
      ] },
    { who: "A client", say: "Om ni kan leverera i februari i stället för mars så är vi intresserade.", en: "If you can deliver in February instead of March, we're interested.",
      opts: [
        ["Februari blir tufft, men om vi får en del av betalningen i förskott kan vi försöka.", "February will be tough, but if we get part of the payment in advance we can try.", 1, "A conditional concession."],
        ["Om vi får betalning i förskott, vi kan försöka.", "If we get payment in advance, we can try.", 0, "After a fronted “om”-clause the verb comes next: “kan vi försöka”."],
        ["Februari är omöjligt, punkt.", "February is impossible, full stop.", 0, "Rigid: closes the door instead of trading."],
      ] },
    { who: "The other party, near the end", say: "Okej, 420 000 och leverans i mars. Hur låter det?", en: "Okay, 420,000 and delivery in March. How does that sound?",
      opts: [
        ["Det låter rimligt. Då har vi en överenskommelse!", "That sounds reasonable. Then we have a deal!", 1, "Close clearly."],
        ["Jag hör inget.", "I can't hear anything.", 0, "Taken literally: “Hur låter det?” asks for your view."],
        ["Det låter som pengar.", "It sounds like money.", 0, "Taken literally."],
      ] },
  ],
  builds: [
    { en: "Let me check with my manager.", sv: "Låt mig stämma av med min chef.", extra: ["mitt", "låter"] },
    { en: "We can meet halfway.", sv: "Vi kan mötas på halva vägen.", extra: ["möta", "halv"] },
    { en: "Would you consider a longer contract?", sv: "Skulle ni kunna tänka er ett längre avtal?", extra: ["en", "långt"] },
  ],
  gaps: [
    { sv: "___ att ni betalar i förskott kan vi sänka priset.", en: "On condition that you pay in advance, we can lower the price.", a: "Under förutsättning", opts: ["Under förutsättning", "Trots", "Eftersom"], why: "“Under förutsättning att” = on condition that. (“Eftersom att” isn't standard Swedish.)" },
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
        ["Oj, berätta!", "Oh, tell me!", 1, "Short and eager: invites the story."],
        ["Nej, jag tror inte.", "No, I don't believe.", 0, "Taken literally."],
        ["Vad hände i morgon?", "What happened tomorrow?", 0, "Wrong time word."],
      ] },
    { who: "A friend telling a story", say: "…och plötsligt stod det en älg mitt på vägen!", en: "…and suddenly there was a moose in the middle of the road!",
      opts: [
        ["Nej, men vad säger du! Hur gick det?", "No way! What happened?", 1, "React with surprise, then ask what happened."],
        ["Vad sa du?", "What did you say?", 0, "That asks them to repeat. The reaction is “Vad säger du!”."],
        ["Okej. Och?", "Okay. And?", 0, "Sounds bored. Show some emotion!"],
      ] },
    { who: "A colleague", say: "Visste du att Storsjöodjuret faktiskt var fridlyst på 80-talet?", en: "Did you know the Storsjö monster was actually a protected species in the 80s?",
      opts: [
        ["Nej, det hade jag ingen aning om!", "No, I had no idea!", 1, "“Ingen aning” = no idea."],
        ["Nej, det hade jag ingen idé om!", "No, I had no idea about that!", 0, "A literal translation. In Swedish it's “ingen aning”."],
        ["Ja, jag var där.", "Yes, I was there.", 0, "An odd claim."],
      ] },
    { who: "A friend", say: "Hur var resan till fjällen?", en: "How was the trip to the mountains?",
      opts: [
        ["Helt fantastisk! Det började med att vi missade tåget, men till slut…", "Fantastic! It started with us missing the train, but in the end…", 1, "Hook plus structure: start, twist, ending."],
        ["Helt fantastisk! Det började med att vi missar tåget, men…", "Fantastic! It started with us miss the train, but…", 0, "Mixed tenses: “började” is past, so “missade”."],
        ["Den var.", "It was.", 0, "Unfinished."],
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
        ["Det var en chock! Jag minns att det var mörk redan klockan tre.", "It was a shock! I remember it was dark at three.", 0, "With “det” the adjective takes -t: “det var mörkt”."],
        ["Min första vinter är i Sverige.", "My first winter is in Sweden.", 0, "Present tense: it already happened."],
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
        ["Bra fråga. Det beror främst av högre råvarupriser.", "Good question. It mainly depends of higher prices.", 0, "It's “bero på”, not “bero av”."],
        ["Jag vet inte, nästa fråga.", "I don't know, next question.", 0, "Dismissive."],
      ] },
    { who: "A colleague in the audience", say: "Har ni siffror på hur många nya kunder ni fick i Norge?", en: "Do you have figures on how many new customers you got in Norway?",
      opts: [
        ["Det har jag inte här just nu, men jag mejlar dem till dig efter mötet.", "I don't have them here right now, but I'll email them to you after the meeting.", 1, "Honest, with a concrete follow-up."],
        ["Det har jag inte här, men jag mejlar dem dig efter mötet.", "I don't have them, but I'll email them you after the meeting.", 0, "Needs “till”: “mejlar dem till dig”."],
        ["Ungefär en miljon, tror jag.", "About a million, I think.", 0, "Guessing numbers in a presentation can backfire."],
      ] },
    { who: "The chair", say: "Du har fem minuter kvar.", en: "You have five minutes left.",
      opts: [
        ["Tack! Då hoppar jag direkt till sammanfattningen.", "Thanks! Then I'll skip straight to the summary.", 1, "Adapt and signpost."],
        ["Tack! Då hoppar jag direkt på sammanfattningen.", "Thanks! Then I'll jump on the summary.", 0, "“Hoppa till” = skip to. “Hoppa på” = jump on, or attack."],
        ["Jag behöver tjugo minuter till.", "I need twenty more minutes.", 0, "Not how it works."],
      ] },
    { who: "Your manager, afterwards", say: "Vad tyckte du själv om hur det gick?", en: "What did you think yourself of how it went?",
      opts: [
        ["Överlag bra, men jag hade kunnat lägga mindre tid på bakgrunden.", "Good overall, but I could have spent less time on the background.", 1, "A balanced self-assessment. Appreciated at Swedish workplaces."],
        ["Överlag bra, men jag hade kunnat lägga mindre tid i bakgrunden.", "Good overall, but I could have spent less time in the background.", 0, "You “lägga tid på” something. “I bakgrunden” = in the background."],
        ["Perfekt, som vanligt.", "Perfect, as usual.", 0, "Sounds arrogant."],
      ] },
    { who: "A sceptical audience member", say: "Är inte de här prognoserna lite väl optimistiska?", en: "Aren't these forecasts a bit too optimistic?",
      opts: [
        ["Det är en rimlig invändning. Vi har räknat på ett försiktigare scenario också. Vill du att jag visar det?", "That's a fair objection. We've also calculated a more cautious scenario. Do you want me to show it?", 1, "Validate the objection, then offer evidence."],
        ["Du är väl optimistisk själv.", "You're rather optimistic yourself.", 0, "Turning it personal."],
        ["Nej.", "No.", 0, "Shuts down a reasonable concern."],
      ] },
    { who: "Audience member", say: "Kan du förklara den där grafen en gång till?", en: "Can you explain that graph one more time?",
      opts: [
        ["Absolut. Den blå linjen visar försäljningen och den gröna kostnaderna.", "Of course. The blue line shows sales and the green one costs.", 1, "Patient and clear."],
        ["Grafen förklarar sig själv.", "The graph explains itself.", 0, "A brush-off."],
        ["Nej, vi har ingen tid.", "No, we don't have time.", 0, "Dismissive."],
      ] },
  ],
  builds: [
    { en: "That leads me on to the next point.", sv: "Det leder mig vidare till nästa punkt.", extra: ["leda", "på"] },
    { en: "Sales increased by twelve percent.", sv: "Försäljningen ökade med tolv procent.", extra: ["på", "ökar"] },
    { en: "Let me think for a second.", sv: "Låt mig fundera en sekund.", extra: ["låter", "på"] },
  ],
  gaps: [
    { sv: "Kostnaderna minskade ___ fem procent jämfört med i fjol.", en: "Costs decreased by five percent compared with last year.", a: "med", opts: ["med", "på", "av"], why: "A change “by” a percentage takes “med”." },
    { sv: "___ kan man säga att projektet var en framgång.", en: "In summary, one can say the project was a success.", a: "Sammanfattningsvis", opts: ["Sammanfattningsvis", "Sammanfattning", "Sammanfatta"], why: "“Sammanfattningsvis” is the adverb. Then the verb comes second: “kan man”." },
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
        ["Jag förstår att det är bråttom, men jag ser en risk med att gå ut innan materialet är granskat. Skulle onsdag kunna fungera?", "I understand it's urgent, but I see a risk in going out before the material is reviewed. Could Wednesday work?", 1, "Acknowledge, name the risk, offer an alternative."],
        ["Det är en dålig idé.", "That's a bad idea.", 0, "Too blunt upward, and no alternative."],
        ["Okej, absolut!", "Okay, absolutely!", 0, "Agreeing against your judgement helps no one."],
      ] },
    { who: "A colleague", say: "Hur tyckte du att min presentation gick?", en: "How did you think my presentation went?",
      cue: "It ran too long and lost the audience.",
      opts: [
        ["Innehållet var starkt, men jag tror att du hade vunnit på att korta ner den lite. Mot slutet tappade vi nog några.", "The content was strong, but I think you'd have gained from shortening it. Towards the end we probably lost a few people.", 1, "Strength first, then specific, softened feedback."],
        ["Den var för lång och tråkig.", "It was too long and boring.", 0, "Honest but harsh."],
        ["Jättebra!", "Great!", 0, "Kind but unhelpful. They asked."],
      ] },
    { who: "Someone in your team", say: "Varför fick jag inte projektledarrollen?", en: "Why didn't I get the project lead role?",
      opts: [
        ["Jag förstår att du är besviken. Jag vill vara ärlig mot dig: vi behövde någon med mer erfarenhet av budgetansvar. Ska vi prata om hur du kan bygga upp det?", "I understand you're disappointed. I want to be honest with you: we needed someone with more budget experience. Shall we talk about how you can build that?", 1, "Empathy, an honest reason and a path forward."],
        ["Det bestämde inte jag.", "I didn't decide that.", 0, "Dodging responsibility."],
        ["Du var inte tillräckligt bra.", "You weren't good enough.", 0, "Crushing and vague."],
      ] },
    { who: "A client", say: "Det här är andra gången leveransen är sen. Vi är mycket missnöjda.", en: "This is the second time the delivery is late. We're very dissatisfied.",
      opts: [
        ["Det har ni all rätt att vara, och jag ber om ursäkt. Jag har tittat på orsaken och vill gå igenom vad vi gör för att det inte ska hända igen.", "You have every right to be, and I apologise. I've looked at the cause and want to go through what we're doing so it doesn't happen again.", 1, "Validate, apologise, show action."],
        ["Det är inte vårt fel, det är speditören.", "It's not our fault, it's the carrier.", 0, "Blame-shifting makes clients angrier."],
        ["Okej, nästa gång blir det kanske bättre.", "Okay, maybe it'll be better next time.", 0, "Vague and unconvincing."],
      ] },
    { who: "Your manager, giving you feedback", say: "Jag upplever att du ibland tar över i mötena.", en: "I feel that you sometimes take over in meetings.",
      opts: [
        ["Tack för att du säger det, det tar jag till mig. Har du ett konkret exempel?", "Thanks for saying so, I'll take that on board. Do you have a concrete example?", 1, "Receive it, then ask for specifics."],
        ["Nej, det gör jag inte.", "No, I don't.", 0, "Defensive."],
        ["Andra pratar för lite.", "Others talk too little.", 0, "Deflecting."],
      ] },
    { who: "Your team, waiting for news", say: "Fick vi något besked från investerarna?", en: "Did we hear back from the investors?",
      opts: [
        ["Tyvärr har vi inte fått det besked vi hoppades på. Men vi har fått värdefull feedback, och jag vill gå igenom den med er.", "Unfortunately we didn't get the answer we hoped for. But we've had valuable feedback and I want to go through it with you.", 1, "Clear bad news with a constructive frame."],
        ["Nej. Det är kört.", "No. It's over.", 0, "Abrupt and demoralising."],
        ["Vi pratar om det sen.", "We'll talk about it later.", 0, "Avoiding it breeds anxiety."],
      ] },
  ],
  builds: [
    { en: "I'll take that on board.", sv: "Det tar jag till mig.", alt: ["Jag tar till mig det."], extra: ["tog", "av"] },
    { en: "How do you see it yourself?", sv: "Hur ser du själv på det?", alt: ["Hur ser du på det själv?"], extra: ["dig", "om"] },
    { en: "I want to be honest with you.", sv: "Jag vill vara ärlig mot dig.", extra: ["är", "din"] },
  ],
  gaps: [
    { sv: "Du hade ___ på att korta ner presentationen.", en: "You would have benefited from shortening the presentation.", a: "vunnit", opts: ["vunnit", "vinna", "vann"], why: "“Hade vunnit på att…” = would have gained from. A soft, very Swedish way to give feedback." },
    { sv: "Jag förstår resonemanget. ___ ser jag en risk.", en: "I understand the reasoning. At the same time, I see a risk.", a: "Samtidigt", opts: ["Samtidigt", "Fast", "Trots"], why: "“Samtidigt” is an adverb, so the verb comes next: “ser jag”. “Fast” would need “fast jag ser”." },
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
        ["Ja, landsbygden är död.", "Yes, the countryside is dead.", 0, "Just echoes: no discussion."],
        ["Stockholm är för stort.", "Stockholm is too big.", 0, "Beside the point."],
      ] },
    { who: "A debate partner", say: "En fyradagarsvecka skulle förstöra ekonomin.", en: "A four-day week would wreck the economy.",
      opts: [
        ["Jag skulle vilja nyansera det lite. Försöken med kortare arbetstid på Island tyder på att produktiviteten kan hållas uppe.", "I'd like to nuance that a little. The shorter-hours trials in Iceland suggest productivity can be maintained.", 1, "Nuance with evidence instead of a flat no."],
        ["Försöken på Island tyder att produktiviteten kan hållas uppe.", "The trials in Iceland suggest productivity can be kept up.", 0, "It's “tyda på”: “tyder på att…”."],
        ["Nej, du har fel, punkt.", "No, you're wrong, full stop.", 0, "Shuts the debate down."],
      ] },
    { who: "A friend", say: "Så du menar alltså att vi borde förbjuda mobiler i skolan?", en: "So you're saying we should ban mobile phones in school?",
      opts: [
        ["Inte riktigt. Jag menar att man måste ta hänsyn till både koncentrationen och elevernas behov av att nå sina föräldrar.", "Not quite. I mean that you have to take into account both concentration and pupils' need to reach their parents.", 1, "Correct the misreading and restate your position precisely."],
        ["Inte riktigt. Jag menar att man måste ta hänsyn för både koncentrationen och…", "Not quite. I mean you must take consideration for both concentration and…", 0, "It's “ta hänsyn till”, not “för”."],
        ["Ja, alltså, nej.", "Yes, I mean, no.", 0, "Confusing."],
      ] },
    { who: "A debate partner", say: "Det är ju självklart att alla borde få jobba hemifrån.", en: "It's obvious that everyone should be allowed to work from home.",
      opts: [
        ["Jag håller delvis med. Det talar mycket för flexibiliteten, men man måste också ta hänsyn till hur nya medarbetare lär sig.", "I partly agree. A lot speaks for the flexibility, but you also have to consider how new employees learn.", 1, "“Delvis” = partly. Agree in part, then add a consideration."],
        ["Jag håller delvis med, men man måste ta hänsyn till hur nya medarbetare lär.", "I partly agree, but you have to consider how new employees teach.", 0, "“Lära” needs “sig” when it means learn: “lär sig”."],
        ["Självklart!", "Obviously!", 0, "No nuance at all."],
      ] },
    { who: "A friend, after a long debate", say: "Vi kommer nog aldrig att bli överens om det här.", en: "We'll probably never agree on this.",
      opts: [
        ["Nej, där är vi nog oense. Men vi kan väl enas om att frågan är viktig?", "No, that's probably where we disagree. But surely we can agree the question matters?", 1, "Accept the disagreement and find common ground."],
        ["Jo, för jag har rätt.", "Yes we will, because I'm right.", 0, "Not exactly gracious."],
        ["Bra, då slutar vi prata.", "Fine, then we stop talking.", 0, "Ends the relationship along with the debate."],
      ] },
    { who: "A podcast host", say: "Hur tror du att Norrbotten kommer att se ut om tjugo år?", en: "What do you think Norrbotten will look like in twenty years?",
      opts: [
        ["Mycket talar för att den gröna industrin kommer att förändra regionen, men det beror på om man lyckas locka människor att flytta hit.", "Much suggests that green industry will transform the region, but it depends on whether people can be attracted to move here.", 1, "A hedged prediction with a condition."],
        ["Jag tror att det blir kallt.", "I think it'll be cold.", 0, "Too shallow for the question."],
        ["Norrbotten är långt norrut.", "Norrbotten is far north.", 0, "A fact, not an answer."],
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
        ["Jag hör vad du säger, och det är viktigt att vi lär oss av det. Vad var det som gick fel förra gången?", "I hear what you're saying, and it's important we learn from it. What went wrong last time?", 1, "Validate, then turn scepticism into input."],
        ["Det var då, nu är nu.", "That was then, this is now.", 0, "Dismissive."],
        ["Då struntar vi i det.", "Then we'll drop it.", 0, "Caving instantly."],
      ] },
    { who: "Your team", say: "Vi har diskuterat i en timme. Vad gör vi nu?", en: "We've been discussing for an hour. What do we do now?",
      opts: [
        ["Jag vill att vi landar i ett beslut. Jag föreslår alternativ B, med en utvärdering efter tre månader. Har någon starka invändningar?", "I want us to land on a decision. I propose option B, with a review after three months. Does anyone have strong objections?", 1, "Drive to a decision while leaving room for objections."],
        ["Vi tar ett nytt möte.", "Let's book another meeting.", 0, "Kicking the can down the road."],
        ["Ni bestämmer.", "You decide.", 0, "Abdicating."],
      ] },
    { who: "A cautious colleague", say: "Jag känner mig inte trygg med att lansera hela systemet på en gång.", en: "I don't feel comfortable launching the whole system at once.",
      opts: [
        ["Det förstår jag. Kan vi testa det i liten skala först, till exempel på ett kontor?", "I understand. Can we test it on a small scale first, for example in one office?", 1, "Lower the risk with a pilot."],
        ["Det förstår jag. Kan vi testa det i en liten skala först?", "I understand. Can we test it in a small scale first?", 0, "The fixed phrase is “i liten skala”, with no article."],
        ["Det måste du bli.", "You'll have to be.", 0, "Steamrolling."],
      ] },
    { who: "Senior leadership", say: "Varför ska vi prioritera det här just nu?", en: "Why should we prioritise this right now?",
      opts: [
        ["Det ligger helt i linje med vår strategi, och om vi väntar riskerar vi att tappa marknadsandelar till konkurrenterna.", "It's fully in line with our strategy, and if we wait we risk losing market share to competitors.", 1, "Link to strategy plus the cost of waiting."],
        ["Det ligger helt i linje till vår strategi.", "It lies fully in line to our strategy.", 0, "The phrase is “i linje med”."],
        ["För att jag tycker det.", "Because I think so.", 0, "Not a business case."],
      ] },
    { who: "A project member", say: "Vem ska äga den här frågan?", en: "Who should own this issue?",
      opts: [
        ["Jag tar ansvar för att den drivs framåt, men jag behöver stöd från ekonomiavdelningen.", "I'll take responsibility for driving it forward, but I need support from the finance department.", 1, "Ownership plus a named dependency."],
        ["Jag tar ansvar att den drivs framåt.", "I take responsibility that it's driven forward.", 0, "The phrase is “ta ansvar för att…”."],
        ["Ingen vet.", "Nobody knows.", 0, "Leaves it hanging."],
      ] },
    { who: "A frustrated team member", say: "Det känns som att ledningen aldrig lyssnar på oss.", en: "It feels like management never listens to us.",
      opts: [
        ["Det är en viktig signal. Berätta mer: vad skulle få dig att känna att ni blir hörda?", "That's an important signal. Tell me more: what would make you feel you're being heard?", 1, "Open up rather than defend."],
        ["Det stämmer inte.", "That's not true.", 0, "Defensive."],
        ["Prata med HR.", "Talk to HR.", 0, "Passing the buck."],
      ] },
  ],
  builds: [
    { en: "Let's turn it around.", sv: "Låt oss vända på det.", extra: ["vänder", "om"] },
    { en: "Who do we need to get on board?", sv: "Vem behöver vi få med oss?", extra: ["vad", "er"] },
    { en: "I want us to land on a decision today.", sv: "Jag vill att vi landar i ett beslut i dag.", alt: ["I dag vill jag att vi landar i ett beslut."], extra: ["landa", "en"] },
  ],
  gaps: [
    { sv: "Vad skulle ___ för att du ska känna dig trygg?", en: "What would it take for you to feel comfortable?", a: "krävas", opts: ["krävas", "kräva", "krävs"], why: "After “skulle” comes an infinitive, here the passive “krävas”." },
    { sv: "Det här ligger helt i ___ med vår strategi.", en: "This is fully in line with our strategy.", a: "linje", opts: ["linje", "led", "rad"], why: "“I linje med” = in line with." },
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
        ["Lugn, det är ingen ko på isen. Deadline är först på fredag.", "Relax, no rush. The deadline isn't until Friday.", 1, "“Ingen ko på isen” = no need to panic."],
        ["Lugn, det finns en ko på isen.", "Relax, there's a cow on the ice.", 0, "That would mean there IS a problem!"],
        ["Ta det med en nypa salt.", "Take it with a pinch of salt.", 0, "That means be sceptical, not calm down."],
      ] },
    { who: "A friend at a hockey match", say: "Vi har typ vunnit redan, det är bara fem minuter kvar!", en: "We've basically won already, there are only five minutes left!",
      opts: [
        ["Ropa inte hej förrän du är över bäcken!", "Don't celebrate too early!", 1, "Exactly the idiom for premature celebration."],
        ["Det sitter i ryggmärgen.", "It's second nature.", 0, "Wrong idiom."],
        ["Nu är det kört!", "Now it's game over!", 0, "That means you've lost, the opposite."],
      ] },
    { who: "A colleague", say: "Hon fick jobbet direkt, utan intervju, för att hennes pappa äger företaget.", en: "She got the job straight away, without an interview, because her dad owns the company.",
      opts: [
        ["Hon gled in på en räkmacka, alltså.", "So she had it handed to her.", 1, "“Glida in på en räkmacka” = get something without effort."],
        ["Hon slog två flugor i en smäll.", "She killed two birds with one stone.", 0, "That's about achieving two things at once."],
        ["Det är ingen ko på isen.", "No rush.", 0, "Doesn't fit."],
      ] },
    { who: "A friend", say: "Tåget är inställt igen. Vad gör vi nu?", en: "The train's cancelled again. What do we do now?",
      opts: [
        ["Det är bara att gilla läget. Ska vi ta en fika medan vi väntar?", "We'll just have to accept it. Shall we have a fika while we wait?", 1, "Accept it and make the best of it."],
        ["Vi glider in på en räkmacka.", "We'll have it handed to us.", 0, "The opposite of what's happening."],
        ["Ropa inte hej!", "Don't shout hey!", 0, "A fragment of the wrong idiom."],
      ] },
    { who: "A colleague", say: "Hur kan du skriva rapporter så snabbt?", en: "How can you write reports so fast?",
      opts: [
        ["Jag har gjort det i tio år. Det sitter i ryggmärgen nu.", "I've done it for ten years. It's second nature now.", 1, "Exactly what “sitter i ryggmärgen” means."],
        ["Jag tar det med en nypa salt.", "I take it with a pinch of salt.", 0, "Wrong idiom."],
        ["Nu är det kört.", "Now it's game over.", 0, "Doesn't fit."],
      ] },
    { who: "A friend", say: "Jag läste att man blir smartare av att äta choklad varje dag!", en: "I read that you get smarter from eating chocolate every day!",
      opts: [
        ["Haha, det skulle jag ta med en nypa salt.", "Haha, I'd take that with a pinch of salt.", 1, "Polite scepticism with humour."],
        ["Det sitter i ryggmärgen.", "It's second nature.", 0, "Wrong idiom."],
        ["Då är det ingen ko på isen.", "Then there's no rush.", 0, "Doesn't fit."],
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
