/* ================= Surra: "Did you know?" facts — four per stop, unlocked by lessons =================
   t: history | culture | nature | language · h: headline · b: body · w: [Swedish word, English gloss] */
const FACT_THEMES = {
  history: { en: 'History', icon: 'columns' },
  culture: { en: 'Culture & food', icon: 'cup' },
  nature: { en: 'Nature & geography', icon: 'pine' },
  language: { en: 'Language', icon: 'aring' },
};
const FACTS = {
  malmo: [
    { t: 'culture', h: 'Goose night in Skåne', b: "On 10 November, Skåne celebrates Mårtensafton, St Martin's Eve, with roast goose. The brave start with svartsoppa, a dark, spiced soup made with goose blood. It's above all a Skåne tradition.", w: ['en gås', 'a goose'] },
    { t: 'language', h: 'Påg and tös', b: 'Skånska, the southern dialect, says its r at the back of the throat, a bit like Danish, and keeps words of its own. In Skåne a boy is a påg and a girl is a tös.', w: ['en påg, en tös', 'a boy, a girl (in Skåne)'] },
    { t: 'nature', h: 'A bridge that dives under the sea', b: "The Öresund Bridge runs about 8 km from Malmö to Peberholm, an artificial island, then dives into a 4 km tunnel so ships and Copenhagen's planes have room. Left to nature, Peberholm now has hundreds of plant species that arrived on their own.", w: ['en bro', 'a bridge'] },
    { t: 'history', h: 'Danish until 1658', b: 'Malmö was Danish for most of its history. In 1658 the Treaty of Roskilde, Freden i Roskilde in Swedish, handed Skåne to Sweden. Malmöhus, the castle built by Danish kings, still stands by the harbour.', w: ['fred', 'peace'] },
  ],
  ystad: [
    { t: 'language', h: 'Fika is coffee, scrambled', b: "Fika comes from kaffi, an old word for coffee, with its syllables swapped: kaf-fi became fi-ka. It's both a noun and a verb, and Sweden even has a Cinnamon Bun Day, Kanelbullens dag, on 4 October.", w: ['att fika', 'to have a coffee break'] },
    { t: 'history', h: "Sweden's own Stonehenge", b: 'On a cliff near Ystad, 59 standing stones form the outline of a ship 67 metres long. Ales stenar is around 1,400 years old, and nobody knows for sure whose grave or monument it was.', w: ['en sten', 'a stone'] },
    { t: 'culture', h: "Wallander's home town", b: "Henning Mankell set his Kurt Wallander crime novels in Ystad, and fans from around the world still walk the detective's streets. Swedes call a crime novel a deckare, from detektiv, and they read a lot of them.", w: ['en deckare', 'a crime novel'] },
    { t: 'nature', h: 'The storks came back', b: 'White storks once nested on farms all over Skåne, then died out as Swedish breeding birds in the 1950s. A long reintroduction project has brought them back, and their huge nests are a spring sight in Skåne again.', w: ['ett bo', "a nest (bo also means 'to live')"] },
  ],
  lund: [
    { t: 'culture', h: 'Knights that clash on the hour', b: "Lund Cathedral's astronomical clock dates from around 1424. On the hour, two wooden knights clash their swords, and twice a day an organ plays In dulci jubilo while the Three Kings parade past.", w: ['en klocka', 'a clock; also a bell'] },
    { t: 'history', h: 'Church capital of the North', b: 'In 1103 Lund became the seat of an archbishop for the whole of Scandinavia, Norway and Sweden included. For about half a century, this Danish town was the religious capital of the North.', w: ['en domkyrka', 'a cathedral'] },
    { t: 'language', h: 'Bluetooth is named after a Viking', b: "Bluetooth was developed at Ericsson in Lund in the 1990s and named after Harald Blåtand, 'Bluetooth', the Viking king who united Denmark and Norway. Its logo joins his initials, H and B, written in runes.", w: ['en blå tand', 'a blue tooth'] },
    { t: 'nature', h: 'A forest smaller than a farm', b: "Dalby Söderskog, just outside Lund, is one of Sweden's smallest national parks: about 36 hectares of old broadleaf forest. In spring its floor turns white with vitsippor, wood anemones, the flower Swedes treat as spring's real arrival.", w: ['en vitsippa', 'a wood anemone'] },
  ],
  helsingborg: [
    { t: 'nature', h: 'Four kilometres to Denmark', b: "At Helsingborg only about 4 km of sea separate Sweden from Denmark. On a clear day you can see Kronborg Castle in Helsingør: Shakespeare's Elsinore, where Hamlet is set.", w: ['ett sund', 'a strait, a sound'] },
    { t: 'history', h: 'A toll on every ship', b: "From 1429 to 1857 Denmark charged every ship passing between Helsingborg and Helsingør a toll, the Sound Dues. Kärnan, the medieval tower above Helsingborg, is what's left of the castle that guarded the strait.", w: ['en tull', 'a toll; customs'] },
    { t: 'language', h: 'Neighbour languages', b: 'Swedes, Danes and Norwegians often just speak their own languages with each other. Written Danish is easy for Swedes; spoken Danish is famously harder. Swedish even has a word for the skill: grannspråksförståelse.', w: ['ett grannspråk', 'a neighbouring language'] },
    { t: 'culture', h: 'Crayfish, paper hats and songs', b: "In August Swedes throw kräftskivor: crayfish parties with paper hats, moon-faced lanterns and snapsvisor, short songs sung before each shot. The best known is Helan går, 'the whole one goes', for the first shot.", w: ['en kräftskiva', 'a crayfish party'] },
  ],
  goteborg: [
    { t: 'history', h: 'A Dutch-built city', b: "Gustav II Adolf founded Gothenburg in 1621 and hired Dutch experts to build it on marshy ground. That's why the centre has canals and a moat like Amsterdam, and why Dutchmen sat on the first town council.", w: ['en kanal', 'a canal'] },
    { t: 'culture', h: 'The fish church', b: "Gothenburg's fish market, Feskekôrka, opened in 1874 in a hall that looks like a church. The name is dialect for 'fish church', but the only thing worshipped inside is very fresh seafood.", w: ['en fisk', 'a fish'] },
    { t: 'nature', h: 'Islands without cars', b: "Gothenburg's southern archipelago is largely car-free: you take the ferry on an ordinary public-transport ticket and get around on foot or by bike. Skärgård, archipelago, joins skär, a rocky islet, and gård, a yard.", w: ['en skärgård', 'an archipelago'] },
    { t: 'language', h: 'Gött, and terrible puns', b: "West Swedes call anything good gött: “Det var gött!” Gothenburgers are also famous for göteborgsvitsar, puns so bad they're good. Locals treat them as an art form.", w: ['gött', 'nice, great (West Sweden)'] },
  ],
  jonkoping: [
    { t: 'culture', h: 'The candy stick from Gränna', b: "In 1859 a widow, Amalia Eriksson, got permission to bake and sell sweets in Gränna, near Jönköping. Her red-and-white peppermint sticks, polkagrisar, are still pulled by hand in the town's shops today.", w: ['en polkagris', 'a peppermint candy stick'] },
    { t: 'history', h: 'The match capital of the world', b: 'The safety match was invented in Sweden in 1844, and from 1845 the Lundström brothers mass-produced it in Jönköping. For decades, matches from Sweden lit stoves and lamps around the world.', w: ['en tändsticka', 'a match'] },
    { t: 'nature', h: 'A lake you can drink', b: "Vättern, Sweden's second-largest lake, is up to 128 metres deep and famously clear and cold. Towns along its shores take their drinking water straight from the lake.", w: ['en sjö', 'a lake'] },
    { t: 'language', h: 'Words built like blocks', b: "Swedish glues words together. A fridge is a kylskåp, 'cool cupboard'; a hospital is a sjukhus, 'sick house'; a hippo is a flodhäst, 'river horse'. Once you know the parts, long words get much easier.", w: ['ett kylskåp', 'a fridge'] },
  ],
  linkoping: [
    { t: 'culture', h: "Donald Duck at three o'clock", b: 'Every Christmas Eve at 15:00, millions of Swedes sit down to watch the same Disney cartoon special, Kalle Anka. It has aired every year since 1959, and many families plan the whole day around it.', w: ['julafton', 'Christmas Eve'] },
    { t: 'language', h: "Lagom isn't about Vikings", b: "Lagom means 'just right': not too much, not too little. A popular story says Vikings passed a drinking horn laget om, 'around the team'. In fact it comes from lag, law: 'as custom says'.", w: ['lagom', 'just the right amount'] },
    { t: 'history', h: 'Where Sweden builds fighter jets', b: 'Saab has built aircraft in Linköping since the late 1930s, and the Gripen fighter is assembled here today. The Swedish Air Force Museum on the edge of town tells a century of Swedish flight.', w: ['ett flygplan', 'an aeroplane'] },
    { t: 'nature', h: 'A staircase for boats', b: 'The Göta Canal took more than 58,000 workers, most of them soldiers, 22 years to build (1810–1832). At Berg, just north of Linköping, seven locks in a row lift boats nearly 19 metres.', w: ['en sluss', 'a canal lock'] },
  ],
  norrkoping: [
    { t: 'culture', h: 'The king who died after buns', b: 'Semlor, cardamom buns filled with almond paste and whipped cream, belong to Fettisdagen, Shrove Tuesday. In 1771 King Adolf Fredrik died after a huge feast that reportedly ended with 14 of them.', w: ['en semla', 'a cream bun'] },
    { t: 'history', h: "Sweden's Manchester", b: "Waterfalls on the river Motala ström powered Norrköping's textile mills for centuries and earned it the nickname 'Sweden's Manchester'. The mills had closed by 1970; their red-brick halls now hold museums and a university campus.", w: ['en fabrik', 'a factory'] },
    { t: 'language', h: "No word for 'please'", b: "Swedish has no everyday word for 'please'. Tack does the job: “En kaffe, tack.” To plead, you say snälla; on signs you'll see the formal vänligen.", w: ['tack', "thanks; also 'please'"] },
    { t: 'nature', h: 'The old border forest', b: "North of Norrköping rises Kolmården, a forested ridge that for centuries marked the border between Götaland and Svealand. Cross it, and you're in the next region of your journey.", w: ['en gräns', 'a border'] },
  ],
  orebro: [
    { t: 'history', h: 'Sweden chose a French king', b: 'In 1810 a parliament meeting in Örebro elected a French marshal, Jean-Baptiste Bernadotte, as crown prince. He became King Karl XIV Johan, never really mastered Swedish, and his family still reigns.', w: ['en kung', 'a king'] },
    { t: 'culture', h: "Don't think you're special", b: "Jantelagen, the Law of Jante, comes from a 1933 novel by Aksel Sandemose. Its message, 'don't think you're better than anyone', is still used to explain why Swedes dislike bragging.", w: ['jantelagen', 'the Law of Jante'] },
    { t: 'language', h: 'A yes that contradicts', b: "Swedish has a special yes for negative questions. “Har du inte ätit?” “Jo!” means 'Yes, I have!' A plain ja sounds odd there, and English has no single word for it.", w: ['jo', 'yes (to a negative question)'] },
    { t: 'nature', h: 'A land of lakes', b: 'Sweden has roughly 100,000 lakes larger than a hectare. Örebro sits close to Hjälmaren, the fourth largest. On a hot day, Swedes love to doppa sig: take a quick dip.', w: ['att doppa sig', 'to take a dip'] },
  ],
  vasteras: [
    { t: 'history', h: 'The meeting that broke with Rome', b: "At the Riksdag in Västerås in 1527, Gustav Vasa got parliament to hand the Church's wealth to the Crown. It was the start of the Swedish Reformation.", w: ['en kyrka', 'a church'] },
    { t: 'culture', h: 'Dancing like little frogs', b: "At Midsommar, Swedes raise a pole covered in leaves and flowers, eat herring, new potatoes and strawberries, and grown adults hop around the pole singing Små grodorna, 'the little frogs'.", w: ['en midsommarstång', 'a maypole'] },
    { t: 'language', h: "The day Sweden said 'du'", b: "Until the 1960s, Swedes avoided 'you' with strangers and used titles instead: “Vill direktören ha kaffe?” Then came du-reformen, and almost everyone switched to the informal du.", w: ['du', 'you (informal)'] },
    { t: 'nature', h: 'Mälaren used to be the sea', b: "Västerås sits on Mälaren, Sweden's third-largest lake. In Viking times it was an arm of the Baltic, but the land has been rising since the Ice Age and slowly sealed it off. Today it's Stockholm's drinking water.", w: ['en vik', 'a bay, an inlet'] },
  ],
  uppsala: [
    { t: 'history', h: 'Celsius had it upside down', b: 'Anders Celsius, an Uppsala professor, created his temperature scale in 1742, with 0 for boiling water and 100 for freezing. It was flipped the right way round soon after his death.', w: ['en grad', 'a degree'] },
    { t: 'culture', h: 'Caps on at three', b: "On Valborg, 30 April, Uppsala students race home-made rafts down the Fyris river. At 15:00 the university's head waves a cap from the library balcony, and thousands put on their white student caps.", w: ['en studentmössa', 'a student cap'] },
    { t: 'nature', h: 'The man who named nature', b: "Carl Linnaeus, Uppsala's most famous professor, gave plants and animals two-part Latin names, the system scientists still use. He even named our own species: Homo sapiens.", w: ['en blomma', 'a flower'] },
    { t: 'language', h: 'A duck or a spirit?', b: "Swedish words have a melody. Anden said with one tone means 'the duck'; with a falling double tone it means 'the spirit'. Likewise, tomten can be 'the garden plot' or 'Santa'.", w: ['anden', 'the duck, or the spirit'] },
  ],
  stockholm: [
    { t: 'history', h: 'The warship that sank on day one', b: "In 1628 the warship Vasa capsized on her maiden voyage after about 1,300 metres. Raised in 1961 and 98 per cent original, she's now the star of the most visited museum in Scandinavia.", w: ['ett skepp', 'a ship'] },
    { t: 'culture', h: 'Dinner with the laureates', b: "Every 10 December, the anniversary of Alfred Nobel's death, the Nobel Prizes are handed out in Stockholm, followed by a banquet in the City Hall. Only the Peace Prize is awarded in Oslo.", w: ['ett pris', 'a prize; also a price'] },
    { t: 'nature', h: 'A city on 14 islands', b: 'Stockholm is built on 14 islands where Lake Mälaren meets the Baltic. Beyond it lies an archipelago of about 30,000 islands, islets and rocks. The Swedish word for island is just one letter: ö.', w: ['en ö', 'an island'] },
    { t: 'language', h: 'Seven seasick sailors', b: 'The sj-sound in sju, seven, is famously tricky. Try the classic tongue-twister: Sju sjösjuka sjömän sköttes av sju sköna sjuksköterskor. Seven seasick sailors were nursed by seven lovely nurses.', w: ['sju sjösjuka sjömän', 'seven seasick sailors'] },
  ],
  gavle: [
    { t: 'culture', h: 'The goat everyone tries to burn', b: 'Since 1966 Gävle has built a giant straw Yule goat every Advent; the first was 13 metres tall. It has been burned or damaged in 43 of its first 60 years, and its fate makes news around the world.', w: ['en julbock', 'a Yule goat'] },
    { t: 'history', h: "Norrland's oldest town", b: "Gävle got its town charter in 1446, making it the oldest town in Norrland. Its Latin name, Gevalia, became the name of Sweden's best-known coffee, from a company founded here in 1853.", w: ['kaffe', 'coffee'] },
    { t: 'nature', h: 'Where the north begins', b: 'Just south of Gävle runs Limes Norrlandicus, a natural border where oak forests give way to spruce and pine. Many southern plants and animals go no further north.', w: ['en tall', "a pine (not 'tall'!)"] },
    { t: 'language', h: 'Yes, on an in-breath', b: "In Norrland you'll hear yes said while breathing in: a quick, sucked-in ja or jo. It means 'I'm with you, go on', and newcomers often think the speaker is gasping.", w: ['ja', 'yes'] },
  ],
  sundsvall: [
    { t: 'history', h: 'The town that rebuilt in stone', b: "On 25 June 1888 fire swept through Sundsvall. Rich from its sawmills, the town rebuilt its centre in stone and brick, and it's still called Stenstaden, the Stone Town.", w: ['en brand', 'a fire (not a brand!)'] },
    { t: 'culture', h: "The world's smelliest fish?", b: 'Surströmming is Baltic herring fermented until the cans bulge. The season traditionally opens on the third Thursday of August, and the High Coast just north of Sundsvall is its heartland. Open the can outdoors.', w: ['surströmming', 'fermented herring'] },
    { t: 'nature', h: "A coast that's still rising", b: "Pressed down by ice up to 3 km thick, the High Coast is still springing back, about 8 mm a year. Its highest ancient shoreline lies 286 metres above today's sea, the highest in the world. It's a UNESCO World Heritage site.", w: ['en kust', 'a coast'] },
    { t: 'language', h: 'False friends', b: "Some Swedish words look English but aren't. Gift means married, or poison. A semester is a holiday. Fart means speed, so the road sign “Sänk farten” simply says: slow down.", w: ['gift', 'married; also poison'] },
  ],
  ostersund: [
    { t: 'history', h: 'Jämtland used to be Norwegian', b: 'Jämtland belonged to Norway until 1645. Locals still play up their independent streak with the tongue-in-cheek Republic of Jamtland, founded in 1963, complete with its own president and summer festival.', w: ['ett landskap', 'a historical province'] },
    { t: 'culture', h: 'A UNESCO city of food', b: 'In 2010 Östersund became a UNESCO City of Gastronomy, thanks to its mountain food: Arctic char, reindeer, cloudberries and cheese from fäbodar, the summer farms where cattle graze in the hills.', w: ['en fäbod', 'a summer mountain farm'] },
    { t: 'nature', h: "Everyone's right", b: "Allemansrätten, the right of public access, lets you walk, swim, pick berries and pitch a tent for a night on almost any land, even private land. The rule: inte störa, inte förstöra. Don't disturb, don't destroy.", w: ['allemansrätten', 'the right of public access'] },
    { t: 'language', h: 'A wild strawberry patch', b: "A smultronställe, literally 'wild strawberry patch', is a hidden place that's special to you. Ingmar Bergman made the word famous with his 1957 film Smultronstället, Wild Strawberries.", w: ['ett smultronställe', 'a special hidden place'] },
  ],
  umea: [
    { t: 'history', h: 'Gene scissors from Umeå', b: "Emmanuelle Charpentier did key work on the CRISPR-Cas9 'gene scissors' at Umeå University. In 2020 she shared the Nobel Prize in Chemistry with Jennifer Doudna.", w: ['forskning', 'research'] },
    { t: 'culture', h: 'A cheese born of distraction', b: 'Västerbottensost has been made in Burträsk, near Umeå, since 1872. Legend says dairymaid Ulrika Eleonora Lindström kept leaving the vat to meet a suitor, and the extra heating and stirring created its flavour.', w: ['en ost', 'a cheese'] },
    { t: 'nature', h: 'The city of birches', b: "Umeå burned on 25 June 1888, the very same day as Sundsvall. It was rebuilt with wide avenues lined with birch trees to stop future fires spreading, and it's still called the City of Birches.", w: ['en björk', 'a birch'] },
    { t: 'language', h: 'Sambo, särbo and mambo', b: 'Swedish has neat words for modern life. A sambo is a partner you live with without being married; a särbo is one who lives apart. A grown-up still living with mum? Jokingly, a mambo.', w: ['en sambo', 'a live-in partner'] },
  ],
  lulea: [
    { t: 'history', h: 'A town for church Sundays', b: "Gammelstad Church Town near Luleå has over 400 little wooden cottages, built so families from far away could stay overnight when they came to church. It's a UNESCO World Heritage site, and the cottages are still used.", w: ['en kyrkstad', 'a church town'] },
    { t: 'culture', h: 'Light in the darkest month', b: "On 13 December, Lucia processions fill schools, churches and offices: white robes, candles and a crown of lights. Everyone eats lussekatter, saffron buns. Up north, it's a welcome light in the dark.", w: ['ett ljus', 'a light; a candle'] },
    { t: 'nature', h: 'Driving on the sea', b: "Luleå's archipelago has around 1,300 islands. In winter the sea freezes so hard that ice roads are ploughed across it, and people drive out to the islands.", w: ['is', 'ice'] },
    { t: 'language', h: 'Five minority languages', b: "Sweden has five official national minority languages: Finnish, Meänkieli, Sámi, Romani Chib and Yiddish. Meänkieli, 'our language', is spoken in the Torne Valley, north-east of Luleå.", w: ['ett språk', 'a language'] },
  ],
  jokkmokk: [
    { t: 'history', h: "Sápmi's national day", b: "The Sámi homeland, Sápmi, stretches across Norway, Sweden, Finland and Russia. 6 February is Sámi National Day, marking the first Sámi congress in 1917, around the time of Jokkmokk's winter market.", w: ['en same', 'a Sámi person'] },
    { t: 'culture', h: "Clothes that tell where you're from", b: 'The Sámi kolt, or gákti, is bright with colour and braid. Its cut, colours and patterns show which area the wearer comes from, and traditionally even family ties.', w: ['en kolt', 'a Sámi tunic (gákti)'] },
    { t: 'nature', h: "Europe's great wilderness", b: 'West of Jokkmokk lies Laponia, a UNESCO World Heritage site since 1996. Its heart, Sarek National Park, has no roads, no marked trails and dozens of glaciers, and Sámi reindeer herders still use the land.', w: ['ett fjäll', 'a mountain above the tree line'] },
    { t: 'language', h: 'Names from Sámi', b: "Many northern place names are Sámi. Jokkmokk comes from Jåhkåmåhkke, 'river bend', and Kiruna from Giron, the ptarmigan. A big northern river is an älv in Swedish.", w: ['en älv', 'a big river'] },
  ],
  gallivare: [
    { t: 'history', h: 'The Iron Ore Line', b: "Malmbanan, the Iron Ore Line, runs from Luleå through Gällivare and Kiruna to Narvik in Norway. Completed in the early 1900s, it still carries some of Europe's heaviest freight trains.", w: ['järnmalm', 'iron ore'] },
    { t: 'culture', h: 'Berries worth keeping secret', b: 'Cloudberries, hjortron, grow on northern bogs and are prized almost like gold. Good picking spots are family secrets. Warm cloudberry jam over vanilla ice cream is a Swedish classic.', w: ['hjortron', 'cloudberries'] },
    { t: 'nature', h: "The sun that won't set", b: "From the top of Dundret, Gällivare's mountain, you can watch the midnight sun for several weeks around midsummer. In December it's the reverse: the sun barely rises at all.", w: ['midnattssol', 'midnight sun'] },
    { t: 'language', h: 'Orka: a word English lacks', b: "Orka means having the energy or strength to do something. “Jag orkar inte” can mean 'I can't be bothered' or 'I just don't have it in me'. It's one of the most useful words in Swedish.", w: ['att orka', 'to have the energy'] },
  ],
  kiruna: [
    { t: 'history', h: 'Rockets from Lapland', b: 'Esrange Space Center, east of Kiruna, has launched research rockets and balloons since 1966, with a vast empty landing zone to come down in. It is now being prepared to send satellites into orbit.', w: ['en raket', 'a rocket'] },
    { t: 'culture', h: 'A hotel that melts every spring', b: 'Since 1989 the Icehotel in Jukkasjärvi, near Kiruna, has been rebuilt every winter from blocks of Torne River ice. Artists design the rooms, and in spring the winter rooms melt back into the river.', w: ['snö', 'snow'] },
    { t: 'nature', h: "Sweden's highest point moved", b: "Kebnekaise's south peak, capped by a glacier, was long Sweden's highest point. As the ice melted, the rocky north peak, about 2,097 metres, took over around 2019.", w: ['en glaciär', 'a glacier'] },
    { t: 'language', h: 'Mys: the art of cosy', b: 'Mysa means to have a cosy, content time, and mysig means cosy. Candles in the window, blankets on the sofa, and fredagsmys: the cosy Friday night in, very often with tacos.', w: ['mysig', 'cosy'] },
  ],
};
