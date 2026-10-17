/* ================= Surra: life-science track =================
   An extra "lab" lesson at the work stops, shown when the work focus includes life sciences.
   With the Life sciences focus, two of these replies also appear in each stop's Respond lesson.
   LIFE_FACTS adds a life-science signpost to five cities on the map. */
const LIFE = {
  lund: {
    title: 'Labbet', en: 'In the lab', level: 'A1',
    intro: 'Your first week in a lab at Medicon Village: safety gear, equipment and asking for help.',
    phrases: [
      ['Var hänger labbrockarna?', 'Where do the lab coats hang?', 'En labbrock = a lab coat. Labbet = the lab.'],
      ['Du måste ha skyddsglasögon här inne.', 'You have to wear safety glasses in here.', '“Här inne” = in here. Safety comes first in Swedish labs.'],
      ['Var finns handskarna?', 'Where are the gloves?'],
      ['Jag jobbar med kvalitetskontroll.', 'I work in quality control.', '“Jobba med” is how you describe what you do.'],
      ['Kan du visa mig hur maskinen fungerar?', 'Can you show me how the machine works?'],
      ['Säg till om du behöver hjälp!', 'Let me know if you need help!', '“Säg till” = let me know. You will hear it every day.'],
    ],
    replies: [
      { who: 'A lab colleague', say: 'Har du gått säkerhetsgenomgången?', en: 'Have you done the safety briefing?', opts: [
        ['Ja, i går. Den var bra.', 'Yes, yesterday. It was good.', 1, 'Yes plus when: simple and complete.'],
        ['Ja, jag gick till labbet i går.', 'Yes, I walked to the lab yesterday.', 0, '“Gå en genomgång” means attending a briefing, not walking somewhere.'],
        ['Ja, i morgon. Den var bra.', 'Yes, tomorrow. It was good.', 0, '“I morgon” (tomorrow) clashes with “var” (was). Yesterday is “i går”.']] },
      { who: 'Your lab manager', say: 'Du måste ha handskar på dig här.', en: 'You need to wear gloves here.', opts: [
        ['Okej! Var finns de?', 'Okay! Where are they?', 1, 'Agree and ask where. Perfect.'],
        ['Okej, jag tar på mig skorna.', "Okay, I'll put my shoes on.", 0, 'They said “handskar” (gloves), not shoes.'],
        ['Nej, jag måste inte.', "No, I don't have to.", 0, 'Here “måste” is a lab rule, not a suggestion. Agree, then ask where the gloves are.']] },
      { who: 'A colleague at the bench', say: 'Vad jobbar du med?', en: 'What do you work with?', opts: [
        ['Jag jobbar med kvalitetskontroll.', 'I work in quality control.', 1, '“Jobba med” plus your area.'],
        ['Jag jobbar på måndagar och tisdagar.', 'I work on Mondays and Tuesdays.', 0, "That's when, not what."],
        ['Jag jobbar med en kollega från Lund.', 'I work with a colleague from Lund.', 0, '“Jobba med” plus a field says what you do, not who you work with.']] },
      { who: 'Your new mentor', say: 'Säg till om du behöver hjälp!', en: 'Let me know if you need help!', opts: [
        ['Tack, det är snällt!', "Thanks, that's kind!", 1, 'Warm and natural.'],
        ['Jag säger ingenting till någon.', "I won't say anything to anyone.", 0, "“Säg till” means let me know. This sounds like you're promising to keep a secret."],
        ['Tack, det är snällt av mig!', "Thanks, that's kind of me!", 0, 'It was kind of them: “det är snällt av dig”.']] },
    ],
    builds: [
      { en: 'Where are the safety glasses?', sv: 'Var finns skyddsglasögonen?', alt: ['Var är skyddsglasögonen?'], extra: ['är', 'handskar'] },
      { en: 'I work in quality control.', sv: 'Jag jobbar med kvalitetskontroll.', extra: ['i', 'jobb'] },
    ],
  },
  jonkoping: {
    title: 'Kliniken', en: 'Booking with the clinic', level: 'A2',
    intro: 'Set up a meeting with a hospital clinic, move it when plans change and arrange sample deliveries.',
    phrases: [
      ['Jag skulle vilja boka ett möte med överläkaren.', "I'd like to book a meeting with the senior consultant.", '“Jag skulle vilja” = I would like. Polite and very common.'],
      ['Passar det på tisdag förmiddag?', 'Does Tuesday morning suit you?', '“Passar det…?” = does it work for you?'],
      ['Kan vi flytta mötet till nästa vecka?', 'Can we move the meeting to next week?'],
      ['Hur lång tid har du?', 'How much time do you have?'],
      ['Jag skickar en kallelse via mejl.', "I'll send an invitation by email.", 'En kallelse = a meeting invitation.'],
      ['När kan ni ta emot proverna?', 'When can you receive the samples?', 'Ett prov = a sample (or a test). Proverna = the samples.'],
    ],
    replies: [
      { who: "The clinic's secretary", say: 'Överläkaren har tid på torsdag klockan tio. Passar det?', en: 'The senior consultant is free on Thursday at ten. Does that suit you?', opts: [
        ['Ja, torsdag klockan tio passar bra.', 'Yes, Thursday at ten works well.', 1, 'Repeating the time confirms it. Clear and polite.'],
        ['Ja, torsdag klockan tio passar inte bra.', "Yes, Thursday at ten doesn't suit well.", 0, '“Ja” and “passar inte” contradict each other.'],
        ['Ja, jag har tid i tio minuter på torsdag.', 'Yes, I have time for ten minutes on Thursday.', 0, "“Klockan tio” is the time (ten o'clock), not ten minutes."]] },
      { who: 'A nurse coordinator', say: 'Hur lång tid behöver ni?', en: 'How much time do you need?', opts: [
        ['Ungefär en halvtimme räcker.', 'About half an hour is enough.', 1, '“Räcker” = is enough. Very useful.'],
        ['Vi kommer ungefär halv tre.', "We'll come at about half past two.", 0, "That's when you'll arrive. They asked how long you need."],
        ['Vi behöver en lång tid, tack.', 'We need a long time, thanks.', 0, 'Vague: give an actual length, like “en halvtimme”. Swedish also says “lång tid” without “en”.']] },
      { who: 'The senior consultant, by email', say: 'Tyvärr måste jag ställa in vårt möte i morgon.', en: 'Unfortunately I have to cancel our meeting tomorrow.', opts: [
        ['Inga problem! Ska vi hitta en ny tid?', 'No problem! Shall we find a new time?', 1, 'Understanding, and it moves things forward.'],
        ['Varför då? Det är väldigt dåligt av dig.', "Why? That's very bad of you.", 0, 'Far too blunt for a busy doctor.'],
        ['Inga problem! Vi ses i morgon då.', 'No problem! See you tomorrow then.', 0, "Tomorrow's meeting is the one being cancelled, so “vi ses i morgon” misses the point."]] },
      { who: "The clinic's lab", say: 'Vi kan ta emot proverna på måndag.', en: 'We can receive the samples on Monday.', opts: [
        ['Perfekt, då skickar vi dem på fredag.', "Perfect, then we'll send them on Friday.", 1, 'Confirms and plans ahead. “Då” = then.'],
        ['Perfekt, då tar vi emot dem på måndag.', "Perfect, then we'll receive them on Monday.", 0, 'They receive the samples. You send them.'],
        ['Perfekt, då skickade vi dem på fredag.', 'Perfect, then we sent them on Friday.', 0, '“Skickade” is past tense. For a plan, use the present: “då skickar vi dem”.']] },
    ],
    builds: [
      { en: 'Can we move the meeting to Wednesday?', sv: 'Kan vi flytta mötet till onsdag?', extra: ['möte', 'på'] },
      { en: 'Does Tuesday morning suit you?', sv: 'Passar det på tisdag förmiddag?', alt: ['Passar tisdag förmiddag?'], extra: ['är', 'eftermiddag'] },
    ],
  },
  norrkoping: {
    title: 'Fika på företaget', en: 'Coffee break at the company', level: 'A2',
    intro: 'Small talk at a pharma company: departments, inspections and how the validation went.',
    phrases: [
      ['Vilken avdelning sitter du på?', 'Which department are you in?', 'Swedes “sit” in a department: sitta på = be based in.'],
      ['Jag sitter på market access.', "I'm in market access.", 'Many teams keep their English names, even in Swedish.'],
      ['Vi har en inspektion nästa vecka.', 'We have an inspection next week.'],
      ['Hur gick valideringen?', 'How did the validation go?', '“Hur gick…?” = how did … go? Great for follow-ups.'],
      ['Det är mycket att göra just nu.', "There's a lot to do right now."],
      ['Ska vi ta en fika efter mötet?', 'Shall we have a fika after the meeting?'],
    ],
    replies: [
      { who: 'A colleague from QA', say: 'Vilken avdelning sitter du på?', en: 'Which department are you in?', opts: [
        ['Jag sitter på market access, sedan i måndags.', "I'm in market access, since Monday.", 1, 'Department plus a detail keeps the chat going.'],
        ['Jag sitter på en stol vid fönstret, tror jag.', "I'm sitting on a chair by the window, I think.", 0, 'Literally true, but “sitta på” a department means working there!'],
        ['Jag sitter på market access, sedan på måndag.', "I'm in market access, since on Monday.", 0, '“Sedan på måndag” mixes since with next Monday. Last Monday is “i måndags”.']] },
      { who: 'Someone from regulatory', say: 'Vi har en inspektion från Läkemedelsverket nästa vecka.', en: 'We have an inspection from the Medical Products Agency next week.', opts: [
        ['Oj, då har ni mycket att göra! Lycka till.', 'Oh, then you have a lot to do! Good luck.', 1, 'Empathy plus good luck: perfect fika talk.'],
        ['Oj, då har ni lite att göra! Lycka till.', 'Oh, then you have little to do! Good luck.', 0, '“Lite att göra” means not much to do. An inspection means “mycket”.'],
        ['Skönt, då har jag ingen inspektion nästa vecka.', "Great, then I don't have an inspection next week.", 0, 'Makes it about you.']] },
      { who: 'A lab colleague', say: 'Hur gick valideringen i går?', en: 'How did the validation go yesterday?', opts: [
        ['Helt okej, ett av testerna måste göras om.', 'Fine overall, one of the tests has to be redone.', 1, 'An honest update. “Göras om” = be redone.'],
        ['Bra, men vi måste upprepa en test.', 'Good, but we have to repeat a test.', 0, '“Test” is an ett-word: “ett test”.'],
        ['Bra, men vi måste upprepade ett test.', 'Good, but we have to repeated a test.', 0, 'After “måste” comes the infinitive: “måste upprepa”.']] },
      { who: 'Your manager, passing by', say: 'Det är mycket nu, va?', en: "It's a lot right now, isn't it?", opts: [
        ['Ja, verkligen, men det är roligt.', "Yes, really, but it's fun.", 1, 'Agree with a positive twist: very Swedish.'],
        ['Nej, jag har ingenting att göra just nu.', 'No, I have nothing to do right now.', 0, 'Not what you want your manager to hear!'],
        ['Ja, det är mycket folk här nu.', 'Yes, there are a lot of people here now.', 0, "“Det är mycket nu” means it's busy at work, not crowded."]] },
    ],
    builds: [
      { en: 'Which department are you in?', sv: 'Vilken avdelning sitter du på?', extra: ['vilket', 'är'] },
      { en: 'How did the validation go?', sv: 'Hur gick valideringen?', extra: ['går', 'validering'] },
    ],
  },
  vasteras: {
    title: 'Lanseringsmötet', en: 'The launch meeting', level: 'B1',
    intro: 'A cross-functional launch meeting: status updates, a manufacturing deviation and who owns what.',
    phrases: [
      ['Kan vi stämma av status för lanseringen?', 'Can we check in on the status of the launch?', '“Stämma av” = check in, align. Office Swedish loves it.'],
      ['Vi ligger två veckor efter tidsplanen.', "We're two weeks behind schedule.", '“Ligga efter” = be behind.'],
      ['Vem äger den här frågan?', 'Who owns this issue?', '“Äga en fråga” = be responsible for a topic.'],
      ['Tillverkningen har rapporterat en avvikelse.', 'Manufacturing has reported a deviation.', 'En avvikelse = a deviation, a key GMP word.'],
      ['Vi behöver ett godkännande från QA innan vi går vidare.', 'We need approval from QA before we move on.'],
      ['Jag tar med mig den frågan och återkommer.', "I'll take that question with me and get back to you.", '“Återkomma” = get back to someone.'],
    ],
    replies: [
      { who: 'The launch lead', say: 'Hur ligger vi till med förpackningsmaterialet?', en: 'Where are we with the packaging material?', opts: [
        ['Texten är klar, men vi väntar fortfarande på tryckeriet.', "The text is done, but we're still waiting for the printers.", 1, "Status plus what's blocking it."],
        ['Det ligger på bordet i mötesrummet, tror jag.', "It's lying on the table in the meeting room, I think.", 0, '“Hur ligger vi till?” means how are we doing, not where it lies!'],
        ['Texten är klar, men vi väntar fortfarande för tryckeriet.', "The text is done, but we're still waiting for (the sake of) the printers.", 0, 'You wait “på” something: “vi väntar på tryckeriet”.']] },
      { who: 'Someone from supply', say: 'Tillverkningen har rapporterat en avvikelse i batch 12.', en: 'Manufacturing has reported a deviation in batch 12.', opts: [
        ['Påverkar det lanseringsdatumet?', 'Does that affect the launch date?', 1, 'The question everyone in the room is thinking.'],
        ['Vad bra! Då är batch 12 klar.', 'Great! Then batch 12 is done.', 0, 'A deviation is a problem, not good news.'],
        ['Då struntar vi i den och kör som vanligt.', "Then we'll ignore it and carry on as usual.", 0, 'Never ignore a deviation.']] },
      { who: 'The project manager', say: 'Vem tar ansvar för kontakten med regionerna?', en: 'Who takes responsibility for contact with the regions?', opts: [
        ['Jag kan ta det, eftersom jag redan har kontakterna.', 'I can take that, since I already have the contacts.', 1, 'Volunteer with a reason: confident but grounded.'],
        ['Det finns många regioner, så det tar lång tid.', 'There are many regions, so it takes a long time.', 0, "True, but it doesn't say who takes it."],
        ['Jag kan ta det, eftersom jag har redan kontakterna.', 'I can take that, since I have already the contacts.', 0, 'In a clause starting with “eftersom”, the adverb goes before the verb: “eftersom jag redan har”.']] },
      { who: 'The medical director', say: 'Kan du återkomma med en uppdaterad tidsplan?', en: 'Can you get back to us with an updated timeline?', opts: [
        ['Absolut, jag skickar den senast på fredag.', "Absolutely, I'll send it by Friday at the latest.", 1, 'Commit to a deadline. “Senast” = at the latest.'],
        ['Absolut, jag kommer tillbaka hit på fredag.', "Absolutely, I'll come back here on Friday.", 0, "That's physically returning, not sending a timeline."],
        ['Absolut, jag skickar den tidigast på fredag.', "Absolutely, I'll send it on Friday at the earliest.", 0, '“Tidigast” means at the earliest, which promises nothing. Commit with “senast” (at the latest).']] },
    ],
    builds: [
      { en: "We're two weeks behind schedule.", sv: 'Vi ligger två veckor efter tidsplanen.', extra: ['före', 'vecka'] },
      { en: 'Who owns this issue?', sv: 'Vem äger den här frågan?', extra: ['vad', 'det'] },
    ],
  },
  uppsala: {
    title: 'Leveransen', en: 'The delivery', level: 'B1',
    intro: 'A reagent delivery arrives wrong and warm. Call the supplier, make a complaint and update your lab manager.',
    phrases: [
      ['Leveransen stämmer inte med beställningen.', "The delivery doesn't match the order.", '“Stämma med” = match.'],
      ['Antikropparna kom varma, så kylkedjan har brutits.', 'The antibodies arrived warm, so the cold chain has been broken.', 'Kylkedjan = the cold chain.'],
      ['Vi vill reklamera de här reagenserna.', 'We want to make a complaint about these reagents.', '“Reklamera” = claim faulty goods.'],
      ['Kan ni skicka ett analyscertifikat för batchen?', 'Can you send a certificate of analysis for the batch?', 'Ett analyscertifikat = a CoA.'],
      ['Vi behöver en ersättningsleverans så snart som möjligt.', 'We need a replacement delivery as soon as possible.'],
      ['Hur lång tid tar det att få ett svar?', 'How long does it take to get an answer?'],
    ],
    replies: [
      { who: "The supplier's customer service", say: 'Vad kan jag hjälpa dig med i dag?', en: 'How can I help you today?', opts: [
        ['Vi fick fel antikroppar i vår leverans i går.', 'We got the wrong antibodies in our delivery yesterday.', 1, 'States the problem clearly, and when.'],
        ['Jag vill bara prata lite om antikroppar i allmänhet.', 'I just want to chat a bit about antibodies in general.', 0, "Customer service won't have time for that."],
        ['Vi fick fel antikroppar i vår leverans i morgon.', 'We got the wrong antibodies in our delivery tomorrow.', 0, '“I morgon” is tomorrow, but “fick” is past. The delivery came “i går”.']] },
      { who: 'Customer service', say: 'Har du ordernumret till hands?', en: 'Do you have the order number to hand?', opts: [
        ['Ja, det är 4471-B. Vänta, jag dubbelkollar.', "Yes, it's 4471-B. Wait, I'll double-check.", 1, 'Gives the number and stays careful.'],
        ['Nej, mina händer är tomma, men jag har en penna.', 'No, my hands are empty, but I have a pen.', 0, '“Till hands” means available, not literally in your hands!'],
        ['Ja, det är 4471-B. Vänta, jag dubbelkollar dig.', "Yes, it's 4471-B. Wait, I'll double-check you.", 0, 'You double-check the number, not the person: “jag dubbelkollar”.']] },
      { who: 'Customer service', say: 'Det låter som att kylkedjan har brutits. Vill du ha en ersättning?', en: 'It sounds like the cold chain has been broken. Would you like a replacement?', opts: [
        ['Ja tack, gärna med expressleverans.', 'Yes please, with express delivery if possible.', 1, '“Gärna” makes a request softer and polite.'],
        ['Nej tack, vi använder dem ändå i labbet.', "No thanks, we'll use them in the lab anyway.", 0, 'A bad idea once the cold chain is broken!'],
        ['Kylkedjan är inte vårt problem, det är ert.', "The cold chain isn't our problem, it's yours.", 0, "Blaming them won't get you a replacement any faster."]] },
      { who: 'Your lab manager', say: 'Fick du något svar från leverantören?', en: 'Did you get any answer from the supplier?', opts: [
        ['Ja, de skickar en ny leverans på torsdag och krediterar oss.', "Yes, they're sending a new delivery on Thursday and crediting us.", 1, 'A full update: what, when and the refund.'],
        ['Ja, de svarade i går. Det var ett väldigt trevligt samtal faktiskt.', 'Yes, they answered yesterday. It was actually a very nice conversation.', 0, 'Pleasant, but what did they say? Your manager needs the outcome.'],
        ['Jag har inte ringt dem än, men det löser sig.', "I haven't called them yet, but it'll work out.", 0, 'Not reassuring for a lab manager.']] },
    ],
    builds: [
      { en: 'We want to complain about these reagents.', sv: 'Vi vill reklamera de här reagenserna.', extra: ['reklam', 'den'] },
      { en: "The delivery doesn't match the order.", sv: 'Leveransen stämmer inte med beställningen.', extra: ['till', 'beställning'] },
    ],
  },
  stockholm: {
    title: 'Intervjun inom life science', en: 'The life-science interview', level: 'B1',
    intro: 'An interview at a pharma company in Solna: your background, your motivation and the questions to ask back.',
    phrases: [
      ['Jag har erfarenhet av lanseringar på den nordiska marknaden.', 'I have experience of launches in the Nordic market.'],
      ['I mitt examensarbete undersökte jag hur labb inför digitala verktyg.', 'In my thesis I examined how labs adopt digital tools.', 'Examensarbete = degree thesis. Undersöka = examine.'],
      ['Jag trivs bäst när jag får arbeta tvärfunktionellt.', "I'm happiest when I get to work cross-functionally.", '“Trivas” = to thrive, to feel at home. A key interview word.'],
      ['Vi kartlade de viktigaste opinionsbildarna i regionen.', 'We mapped the most important opinion leaders in the region.', 'Opinionsbildare = KOLs.'],
      ['Jag lär mig snabbt och antar gärna nya utmaningar.', 'I learn quickly and happily take on new challenges.'],
      ['Vad ser ni som den största utmaningen för teamet?', "What do you see as the team's biggest challenge?", 'A strong question to ask them at the end.'],
    ],
    replies: [
      { who: 'The hiring manager', say: 'Berätta lite om dig själv.', en: 'Tell me a little about yourself.', opts: [
        ['Jag har en master i life science och har jobbat med lanseringar.', "I have a master's in life science and have worked on launches.", 1, 'Education plus relevant experience: a solid opener.'],
        ['Jag är född på en tisdag och jag har alltid gillat helger mest.', "I was born on a Tuesday and I've always liked weekends best.", 0, 'Charming, but not what they need.'],
        ['Det mesta står redan i mitt CV, så det kan du läsa där.', 'Most of it is already in my CV, so you can read it there.', 0, 'Sounds unwilling. Always answer in your own words.']] },
      { who: 'The hiring manager', say: 'Varför vill du jobba hos oss?', en: 'Why do you want to work with us?', opts: [
        ['Ni utvecklar behandlingar som verkligen gör skillnad för patienter.', 'You develop treatments that really make a difference for patients.', 1, 'Patient impact is what life-science companies want to hear.'],
        ['Ni ligger nära min lägenhet, och jag har hört att lönerna är bra.', "You're close to my flat, and I've heard the salaries are good.", 0, 'Honest, maybe, but not convincing.'],
        ['Ni utvecklar behandlingar som verkligen gör skillnad på patienter.', 'You develop treatments that really treat patients differently.', 0, '“Göra skillnad på” means treating people differently. You mean “göra skillnad för patienter”.']] },
      { who: 'The team lead', say: 'Hur skulle du hantera en kollega som inte håller deadlines?', en: "How would you handle a colleague who doesn't meet deadlines?", opts: [
        ['Jag skulle prata med personen och försöka förstå vad som står i vägen.', "I'd talk to the person and try to understand what's in the way.", 1, 'Calm, curious and collaborative: very Swedish workplace.'],
        ['Jag skulle gå direkt till chefen och klaga, utan att säga något först.', "I'd go straight to the manager and complain, without saying anything first.", 0, "Skipping the colleague isn't well seen in Swedish workplaces."],
        ['Jag skulle prata med personen och försöka förstå vad står i vägen.', "I'd talk to the person and try to understand what stands in the way.", 0, 'When “vad” is the subject of an indirect question, add “som”: “vad som står i vägen”.']] },
      { who: 'The hiring manager', say: 'Har du några frågor till oss?', en: 'Do you have any questions for us?', opts: [
        ['Ja, vad ser ni som teamets största utmaning det närmaste året?', "Yes, what do you see as the team's biggest challenge in the coming year?", 1, 'Thoughtful and forward-looking.'],
        ['Nej, inga frågor. Ni har redan förklarat allt så bra.', "No, no questions. You've already explained everything so well.", 0, 'Flattering, but it can seem uninterested. Always ask one.'],
        ['Ja, hur mycket semester får jag, och när kan jag ta ut den?', 'Yes, how much holiday do I get, and when can I take it?', 0, 'Fair to know, but not as your only question in round one.']] },
    ],
    builds: [
      { en: 'I learn quickly.', sv: 'Jag lär mig snabbt.', extra: ['läser', 'snabb'] },
      { en: 'I have experience of launches.', sv: 'Jag har erfarenhet av lanseringar.', extra: ['med', 'lansering'] },
    ],
  },
  sundsvall: {
    title: 'Upphandlingen', en: 'The tender', level: 'B2',
    intro: "Negotiate with a region's procurement team: price, value, supply security and deadlines.",
    phrases: [
      ['Vårt anbud omfattar både läkemedlet och utbildning för personalen.', 'Our bid covers both the medicine and training for the staff.', 'Ett anbud = a bid in a tender.'],
      ['Vi kan erbjuda en rabatt under förutsättning att avtalet löper i tre år.', 'We can offer a discount provided that the agreement runs for three years.', '“Under förutsättning att” = provided that.'],
      ['Hur viktar ni pris mot kvalitet i utvärderingen?', 'How do you weigh price against quality in the evaluation?'],
      ['Det ligger tyvärr utanför vårt mandat.', "Unfortunately that's outside our mandate."],
      ['Kan vi mötas på halva vägen?', 'Can we meet halfway?'],
      ['Vi behöver stämma av med vår prissättningsavdelning först.', 'We need to check with our pricing department first.'],
    ],
    replies: [
      { who: "The region's procurement officer", say: 'Ert pris ligger högre än konkurrentens.', en: "Your price is higher than your competitor's.", opts: [
        ['Det stämmer, men vårt anbud inkluderar utbildning och support.', "That's right, but our bid includes training and support.", 1, 'Acknowledge, then reframe on value.'],
        ['Det stämmer, men det beror på att deras läkemedel är sämre.', "That's right, but that's because their medicine is worse.", 0, 'Badmouthing a competitor rarely works.'],
        ['Det stämmer inte, vårt pris är faktiskt lägst på marknaden.', "That's not right, our price is actually the lowest on the market.", 0, 'Denying their own price comparison damages trust.']] },
      { who: 'The procurement officer', say: 'Kan ni sänka priset med tio procent?', en: 'Can you lower the price by ten percent?', opts: [
        ['Det kan vi, under förutsättning att avtalet förlängs till tre år.', 'We can, provided the agreement is extended to three years.', 1, 'A concession for a concession: classic negotiation.'],
        ['Nej, aldrig i livet. Vårt pris är redan alldeles för lågt.', 'No, not on your life. Our price is already far too low.', 0, 'Too blunt: it closes the door.'],
        ['Det kan vi, under förutsättning att avtalet förkortas till ett år.', 'We can, provided the agreement is shortened to one year.', 0, 'A discount for a shorter contract gives value away twice. Ask for something in return.']] },
      { who: 'A pharmacist on the drug committee', say: 'Hur säkerställer ni leveranssäkerheten?', en: 'How do you ensure security of supply?', opts: [
        ['Vi har två tillverkningsanläggningar och säkerhetslager i Sverige.', 'We have two manufacturing sites and safety stock in Sweden.', 1, 'Concrete facts build trust.'],
        ['Vi hoppas att det går bra, det har det alltid gjort hittills.', 'We hope it goes well, it always has so far.', 0, 'Hope is not a supply strategy.'],
        ['Det är inte vår sak, det får apoteken lösa själva.', "That's not our business, the pharmacies will have to sort it out.", 0, "It's exactly what they need to know."]] },
      { who: 'The procurement officer', say: 'Vi behöver ett svar senast i morgon.', en: 'We need an answer by tomorrow at the latest.', opts: [
        ['Jag förstår. Jag stämmer av internt i dag och återkommer i morgon.', "I understand. I'll check internally today and get back to you tomorrow.", 1, 'Respect the deadline and commit to a time.'],
        ['Det hinner vi inte. Ni får vänta till nästa vecka.', "We won't make it. You'll have to wait until next week.", 0, 'Ignores their deadline. Offer a plan instead.'],
        ['Jag förstår. Jag stämmer av internt i dag och återkommer i övermorgon.', "I understand. I'll check internally today and get back to you the day after tomorrow.", 0, '“I övermorgon” is the day after tomorrow, which misses their deadline.']] },
    ],
    builds: [
      { en: 'Can we meet halfway?', sv: 'Kan vi mötas på halva vägen?', extra: ['träffas', 'halv'] },
      { en: "That's outside our mandate.", sv: 'Det ligger utanför vårt mandat.', extra: ['inom', 'vår'] },
    ],
  },
  umea: {
    title: 'Resultatdragningen', en: 'Presenting the results', level: 'B2',
    intro: 'Present launch and study results to colleagues, handle tough questions and summarise clearly.',
    phrases: [
      ['Som ni ser i grafen har förskrivningen ökat stadigt sedan lanseringen.', 'As you can see in the graph, prescribing has risen steadily since the launch.', 'Förskrivning = prescribing.'],
      ['Studien visar en statistiskt signifikant förbättring.', 'The study shows a statistically significant improvement.'],
      ['Resultaten är preliminära, så vi ska vara försiktiga med slutsatserna.', 'The results are preliminary, so we should be careful with the conclusions.'],
      ['Låt mig sammanfatta de tre viktigaste punkterna.', 'Let me summarise the three most important points.'],
      ['Det är en bra fråga, och jag återkommer med exakta siffror.', "That's a good question, and I'll come back with the exact figures."],
      ['Nästa steg är att utvärdera effekten i fler regioner.', 'The next step is to evaluate the effect in more regions.'],
    ],
    replies: [
      { who: 'A sceptical colleague', say: 'Hur vet vi att ökningen beror på kampanjen?', en: 'How do we know the increase is due to the campaign?', opts: [
        ['Vi vet inte säkert, men ökningen syns bara där vi körde kampanjen.', "We don't know for sure, but the increase only shows where we ran the campaign.", 1, 'Honest about uncertainty, backed by evidence.'],
        ['Det är väl självklart, den kom ju precis efter kampanjen.', "It's obvious, isn't it? It came right after the campaign.", 0, "Coming after the campaign doesn't prove the campaign caused it."],
        ['Vi vet det säkert, eftersom ökningen syns i alla regioner, även utan kampanj.', 'We know for sure, because the increase shows in all regions, even without a campaign.', 0, 'An increase in regions without the campaign points away from the campaign, not towards it.']] },
      { who: 'The country manager', say: 'Kan du sammanfatta det viktigaste på en minut?', en: 'Can you sum up the key points in a minute?', opts: [
        ['Absolut. Vi ligger före budget och nästa steg är fler regioner.', "Absolutely. We're ahead of budget and the next step is more regions.", 1, 'Crisp points: exactly what was asked.'],
        ['Nej, det går inte. Det tar minst en timme att gå igenom allt.', "No, it can't be done. It takes at least an hour to go through everything.", 0, 'Learn the one-minute version!'],
        ['Absolut. Allt är lika viktigt, så jag börjar från början.', "Absolutely. Everything is equally important, so I'll start from the beginning.", 0, "That's not a summary."]] },
      { who: 'A medical advisor', say: 'Är resultaten statistiskt signifikanta?', en: 'Are the results statistically significant?', opts: [
        ['Ja, för det primära effektmåttet, men inte för de sekundära.', 'Yes, for the primary endpoint, but not for the secondary ones.', 1, 'Precise and transparent.'],
        ['Ja, de är väldigt bra och patienterna är mycket nöjda.', "Yes, they're very good and the patients are very happy.", 0, "Doesn't answer the statistical question."],
        ['Ja, effekten är signifikant, det vill säga väldigt stor.', 'Yes, the effect is significant, that is, very big.', 0, 'In statistics “signifikant” means unlikely to be chance, not big.']] },
      { who: 'Someone at the back of the room', say: 'Har ni jämfört med förra året?', en: 'Have you compared with last year?', opts: [
        ['Bra fråga. Inte här, men jag skickar en jämförelse efter mötet.', "Good question. Not here, but I'll send a comparison after the meeting.", 1, 'Admit the gap and offer a follow-up.'],
        ['Det spelar ingen roll, förra året var ju ett helt annat år.', "It doesn't matter, last year was a completely different year.", 0, 'Sounds dismissive in front of everyone.'],
        ['Förra året jobbade jag inte här, så det vet jag inget om.', "Last year I didn't work here, so I don't know anything about that.", 0, 'Maybe true, but not helpful.']] },
    ],
    builds: [
      { en: 'Let me summarise the most important points.', sv: 'Låt mig sammanfatta de viktigaste punkterna.', extra: ['jag', 'viktig'] },
      { en: 'The results are preliminary.', sv: 'Resultaten är preliminära.', extra: ['resultat', 'var'] },
    ],
  },
  lulea: {
    title: 'Hälsoekonomin', en: 'Health economics', level: 'C1',
    intro: 'TLV has questioned your price. Disagree diplomatically, defend the model and propose a way forward.',
    phrases: [
      ['TLV bedömer att kostnaden per vunnet kvalitetsjusterat levnadsår är för hög.', 'TLV judges that the cost per QALY gained is too high.', 'TLV decides which medicines are subsidised in Sweden.'],
      ['Vi delar inte riktigt den bedömningen, och vi skulle gärna förklara varför.', "We don't quite share that assessment, and we'd be glad to explain why."],
      ['Den hälsoekonomiska modellen bygger på antaganden som vi kan förtydliga.', 'The health economic model rests on assumptions that we can clarify.'],
      ['Vi är öppna för ett riskdelningsavtal.', "We're open to a risk-sharing agreement.", 'Riskdelning = risk sharing, common in Nordic market access.'],
      ['Låt oss fokusera på vad som är bäst för patienterna.', "Let's focus on what's best for the patients."],
      ['Jag förstår er utgångspunkt, men jag ser det något annorlunda.', 'I understand your starting point, but I see it somewhat differently.', 'A diplomatic way to disagree.'],
    ],
    replies: [
      { who: 'A TLV investigator', say: 'Vår bedömning är att priset inte är kostnadseffektivt.', en: 'Our assessment is that the price is not cost-effective.', opts: [
        ['Jag förstår er bedömning. Får vi visa hur modellen ser ut med längre uppföljningsdata?', 'I understand your assessment. May we show how the model looks with longer follow-up data?', 1, 'Acknowledge, then offer new evidence: diplomatic and constructive.'],
        ['Då har ni nog räknat fel någonstans, för vår modell visar något helt annat.', "Then you've probably miscalculated somewhere, because our model shows something completely different.", 0, 'Accusations close doors with authorities.'],
        ['Jag förstår er bedömning. Får vi visa hur modellen ser ut med kortare uppföljningsdata?', 'I understand your assessment. May we show how the model looks with shorter follow-up data?', 0, 'Shorter follow-up means less evidence, not more. New evidence comes from longer follow-up.']] },
      { who: 'A regional health economist', say: 'Era antaganden om behandlingslängd känns optimistiska.', en: 'Your assumptions about treatment duration feel optimistic.', opts: [
        ['Det är en rimlig invändning. Vi kan köra en känslighetsanalys med kortare behandlingstid.', "That's a fair objection. We can run a sensitivity analysis with a shorter treatment duration.", 1, 'Concedes the point and offers rigour.'],
        ['Alla antaganden är väl lite optimistiska, det är ju så modeller fungerar.', "All assumptions are a bit optimistic, that's how models work.", 0, 'Undermines your own model.'],
        ['Det är en rimlig invändning. Vi kan köra en känslighetsanalys med längre behandlingstid.', "That's a fair objection. We can run a sensitivity analysis with a longer treatment duration.", 0, 'A longer duration makes the model even more optimistic. The objection calls for a shorter one.']] },
      { who: 'Your general manager', say: 'Hur ska vi gå vidare efter beskedet?', en: 'How should we proceed after the decision?', opts: [
        ['Jag föreslår att vi begär ett möte, kompletterar underlaget och öppnar för riskdelning.', 'I suggest we request a meeting, supplement the dossier and open up for risk sharing.', 1, 'A clear, three-part plan.'],
        ['Vi får väl vänta och se vad som händer. Sånt här brukar oftast lösa sig av sig självt.', "I suppose we'll wait and see what happens. Things like this usually sort themselves out.", 0, 'Too passive for market access.'],
        ['Jag föreslår att vi drar tillbaka produkten från Sverige och satsar på andra marknader.', 'I suggest we withdraw the product from Sweden and focus on other markets.', 0, 'A drastic overreaction.']] },
      { who: 'A patient organisation representative', say: 'Patienterna har väntat länge. Varför tar det så lång tid?', en: 'Patients have waited a long time. Why is it taking so long?', opts: [
        ['Jag förstår frustrationen. Vi gör allt vi kan för att nå en lösning så snart som möjligt.', "I understand the frustration. We're doing everything we can to reach a solution as soon as possible.", 1, 'Empathy first, then commitment, without blaming anyone.'],
        ['Det är faktiskt TLV:s fel. De är alldeles för långsamma och byråkratiska med allt.', "It's actually TLV's fault. They're far too slow and bureaucratic about everything.", 0, 'Public blame rarely helps the dialogue.'],
        ['Sådana här processer tar tid, och det får patienterna tyvärr acceptera, helt enkelt.', 'Processes like these take time, and patients will simply have to accept that.', 0, 'True, but it sounds cold to patients.']] },
    ],
    builds: [
      { en: "We're open to a risk-sharing agreement.", sv: 'Vi är öppna för ett riskdelningsavtal.', extra: ['öppen', 'en'] },
      { en: 'I see it somewhat differently.', sv: 'Jag ser det något annorlunda.', alt: ['Jag ser det lite annorlunda.'], extra: ['annan', 'lite'] },
    ],
  },
  gallivare: {
    title: 'Det digitala labbet', en: 'The digital lab', level: 'C1',
    intro: 'Lead a QC lab from paper notebooks to an electronic system: handle doubts, satisfy QA and win the team over.',
    phrases: [
      ['Vi inför ett elektroniskt labbjournalsystem till hösten.', "We're introducing an electronic lab notebook system this autumn.", 'Införa = introduce, implement.'],
      ['Jag förstår att det känns ovant i början.', 'I understand it feels unfamiliar at first.'],
      ['Vi börjar med ett pilotprojekt i en av grupperna.', "We'll start with a pilot project in one of the groups."],
      ['Det är viktigt att förändringen förankras hos dem som berörs.', "It's important that the change is anchored with those affected.", 'Förankra = build support before deciding.'],
      ['Vilka farhågor har ni inför bytet?', 'What concerns do you have about the switch?', 'Farhågor = worries, concerns.'],
      ['Vi utvärderar efter tre månader och justerar vid behov.', "We'll evaluate after three months and adjust as needed."],
    ],
    replies: [
      { who: 'An experienced lab technician', say: 'Varför ska vi byta? Pappersjournalen har fungerat i tjugo år.', en: 'Why should we switch? The paper notebook has worked for twenty years.', opts: [
        ['Det har den, och er erfarenhet är viktig. Men det nya systemet minskar risken för fel.', 'It has, and your experience matters. But the new system reduces the risk of errors.', 1, 'Respect their experience, then give a concrete reason.'],
        ['För att jag har bestämt det, och ledningen tycker likadant, så det är inget att diskutera.', "Because I've decided so, and management agrees, so there's nothing to discuss.", 0, 'Top-down orders rarely work in Swedish workplaces.'],
        ['Papper är gammaldags, och ingen använder sånt längre i ett modernt labb.', 'Paper is old-fashioned, and nobody uses it in a modern lab any more.', 0, "Dismissive of people who've done good work."]] },
      { who: 'A worried researcher', say: 'Jag är rädd att det kommer att ta mer tid än det sparar.', en: "I'm afraid it'll take more time than it saves.", opts: [
        ['Det är en befogad farhåga. Därför börjar vi med en pilot och mäter tidsåtgången.', "That's a justified concern. That's why we're starting with a pilot and measuring the time it takes.", 1, "Validate the worry, then show how you'll test it."],
        ['Det kommer inte att hända. Det har leverantören lovat oss, så du kan vara helt lugn.', "That won't happen. The supplier has promised us, so you can relax.", 0, 'Dismisses the concern without evidence.'],
        ['Det är en befogad farhåga. Därför hoppar vi över piloten och kör igång direkt.', "That's a justified concern. That's why we're skipping the pilot and starting straight away.", 0, 'Skipping the pilot is the opposite of testing the worry.']] },
      { who: 'The QA manager', say: 'Hur säkerställer vi att data förblir spårbara?', en: 'How do we ensure the data stays traceable?', opts: [
        ['Systemet har fullständig ändringshistorik, och vi validerar det enligt GMP innan vi går live.', "The system has a full audit trail, and we'll validate it according to GMP before going live.", 1, "Speaks QA's language: audit trail, validation, GMP."],
        ['Det löser IT-avdelningen åt oss när vi har gått live, så det behöver vi inte tänka på nu.', "The IT department will sort it out once we've gone live, so we don't need to think about it now.", 0, "Sounds like you haven't thought about it, and QA will notice."],
        ['Systemet har fullständig ändringshistorik, så vi behöver inte validera det enligt GMP.', "The system has a full audit trail, so we don't need to validate it according to GMP.", 0, "An audit trail doesn't replace validation. QA will want both."]] },
      { who: 'Your site director', say: 'Hur får vi med oss hela organisationen?', en: 'How do we get the whole organisation on board?', opts: [
        ['Genom att involvera nyckelpersoner tidigt, utbilda ordentligt och visa resultat.', 'By involving key people early, training properly and showing results.', 1, 'A credible change plan in one sentence.'],
        ['Vi skickar ett tydligt mejl till alla om att systemet gäller från och med måndag.', "We'll send a clear email to everyone that the system applies from Monday.", 0, 'Information is not the same as buy-in.'],
        ['Genom att involvera nyckelpersoner sent, när allt redan är bestämt och klart.', 'By involving key people late, when everything is already decided.', 0, 'Involving people once everything is decided is how resistance grows. Involve them early.']] },
    ],
    builds: [
      { en: 'We start with a pilot project.', sv: 'Vi börjar med ett pilotprojekt.', extra: ['en', 'började'] },
      { en: 'I understand it feels unfamiliar.', sv: 'Jag förstår att det känns ovant.', extra: ['ovan', 'som'] },
    ],
  },
};

const LIFE_FACTS = {
  malmo: { t: 'science', h: 'One cluster, two countries', b: 'Malmö sits in Medicon Valley, a life-science cluster spanning Skåne and Greater Copenhagen. Universities, hospitals and companies on both sides of Öresund work together, and many researchers commute across the bridge.', w: ['ett samarbete', 'a collaboration'] },
  lund: { t: 'science', h: 'Ultrasound for the heart', b: 'In 1953, cardiologist Inge Edler and physicist Hellmuth Hertz recorded the movements of a beating heart with ultrasound in Lund. Echocardiography is now used in hospitals all over the world.', w: ['ultraljud', 'ultrasound'] },
  goteborg: { t: 'science', h: 'The pill from Mölndal', b: "Omeprazole, sold as Losec, was developed at Astra Hässle in Mölndal near Gothenburg. Launched in 1988, it became the world's best-selling medicine in the 1990s and changed how stomach ulcers are treated.", w: ['ett läkemedel', 'a medicine'] },
  uppsala: { t: 'science', h: 'Watching side effects worldwide', b: "Uppsala is home to the Swedish Medical Products Agency and the Uppsala Monitoring Centre, which runs WHO's global database of suspected side effects reported from countries around the world.", w: ['en biverkning', 'a side effect'] },
  stockholm: { t: 'science', h: 'The Nobel decision in Solna', b: "The Nobel Prize in Physiology or Medicine is chosen by the Nobel Assembly at Karolinska Institutet. Karolinska is also where the world's first fully implanted pacemaker was fitted, in 1958.", w: ['en pacemaker', 'a pacemaker'] },
};
