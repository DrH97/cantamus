import type { MassSection, Song } from "@/types";

export const repertoire: Song[] = [
  // Prelude
  {
    id: "prelude-magnificat-1",
    title: "Magnificat",
    tradition: "classical",
    massSection: "prelude",
    language: "Latin",
    lyrics: "Magnificat anima mea dominum",
  },

  // Introit
  {
    id: "introit-antiphon-1",
    title: "Be My Protector",
    tradition: "gregorian",
    massSection: "introit",
    language: "English",
    lyrics:
      "Be my protector, O God, a mighty stronghold to save me.\nFor you are my rock, my stronghold.\nLead me, guide me, for the sake of your name.",
  },
  {
    id: "introit-gregorian-1",
    title: "Introibo ad Altare Dei",
    composer: "Gregorian Chant",
    tradition: "gregorian",
    massSection: "introit",
    language: "Latin",
  },
  {
    id: "introit-african-1",
    title: "Mungu Wetu Baba",
    tradition: "african",
    massSection: "introit",
    language: "Swahili",
    lyrics:
      "Mungu wetu Baba, tunakuja kwako\nTunakuja kwako, ee Baba\nUtupokee sisi, watoto wako\nTunakuja kwako, ee Baba",
  },

  // Kyrie
  {
    id: "kyrie-gregorian-1",
    title: "Kyrie XVI",
    composer: "Gregorian Chant",
    tradition: "gregorian",
    massSection: "kyrie",
    language: "Greek/Latin",
  },
  {
    id: "kyrie-classical-1",
    title: "Kyrie in D Minor",
    composer: "W.A. Mozart",
    tradition: "classical",
    massSection: "kyrie",
    language: "Greek",
  },
  {
    id: "kyrie-african-1",
    title: "Bwana Utuhurumie",
    tradition: "african",
    massSection: "kyrie",
    language: "Swahili",
    lyrics:
      "Bwana utuhurumie, Bwana utuhurumie\nKristu utuhurumie, Kristu utuhurumie\nBwana utuhurumie, Bwana utuhurumie",
  },

  // Gloria
  {
    id: "gloria-african-1",
    title: "Sifa kwa Mungu",
    tradition: "african",
    massSection: "gloria",
    language: "Swahili",
    lyrics:
      "Sifa kwa Mungu juu mbinguni, na amani duniani, kote,\nKwa watu wenye mapenzi mema (Sifa!)\nSifa kwa Mungu juu mbinguni, na amani duniani, kote,\nKwa watu wenye mapenzi mema\n\nTunakusifu, tunakuheshimu,\ntwakuabudu Mungu, wetu.\nTwakutukuza, tunakushukuru, kwa\n'jili ya utukufu wako. (Sifa!)\n\nEe Mungu Baba, Mfalme wa mbingu,\nEe Mungu Baba Mwenyezi.\nEe Bwana Yesu, Mwana wa pekee,\nMwana kondoo, Mwana wa Baba.\n(Sifa!)\n\nUondoaye dhambi za dunia,\ntwaomba utuhurumie.\nUondoaye dhambi za dunia\nulipokee ombi letu. (Sifa)\n\nUketiye kuume kwa Baba,\ntwaomba utuhurumie.\nUondoaye dhambi za dunia,\nulipokee ombi letu. (Sifa!)\n\nNa pamoja, na pamoja, pamoja na\nRoho Mtakatifu,\nKatika utukufu wa Mungu Baba.\nAmina. (Sifa!)",
  },
  {
    id: "gloria-gregorian-1",
    title: "Gloria XV",
    composer: "Gregorian Chant",
    tradition: "gregorian",
    massSection: "gloria",
    language: "Latin",
  },
  {
    id: "gloria-classical-1",
    title: "Gloria in Excelsis Deo",
    composer: "A. Vivaldi",
    tradition: "classical",
    massSection: "gloria",
    language: "Latin",
    lyrics:
      "Gloria in excelsis Deo\nEt in terra pax hominibus bonae voluntatis\nLaudamus te, benedicimus te\nAdoramus te, glorificamus te\nGratias agimus tibi propter magnam gloriam tuam",
  },

  // Responsorial Psalm
  {
    id: "responsorial-1",
    title: "Psalm 119:1–2, 4–5, 17–18, 33–34",
    tradition: "contemporary",
    massSection: "responsorial",
    language: "English",
  },
  {
    id: "responsorial-african-1",
    title: "Bwana Ni Mchungaji Wangu",
    tradition: "african",
    massSection: "responsorial",
    language: "Swahili",
    lyrics:
      "Bwana ni mchungaji wangu\nSitapungukiwa na kitu\nKatika malisho mema hunilaza\nPenye maji ya utulivu huniongoza",
  },

  // Alleluia
  {
    id: "alleluia-gregorian-1",
    title: "Alleluia",
    tradition: "gregorian",
    massSection: "alleluia",
    language: "Latin",
  },

  // Offertory
  {
    id: "offertory-contemporary-1",
    title: "Take Our Bread",
    tradition: "contemporary",
    massSection: "offertory",
    language: "English",
    lyrics:
      "Take our bread, we ask you,\nTake our hearts, we love you,\nTake our lives, oh Father,\nWe are yours, we are yours.\n\nYours as we stand at the table you set,\nYours as we eat the bread our hearts can't forget.\nWe are the signs of your life with us yet;\nWe are yours, we are yours.\n\nYour holy people stand washed in your blood,\nSpirit-filled, yet hungry, we await your food.\nWe are poor, but we brought ourselves the best we could.\nWe are yours, we are yours.",
  },
  {
    id: "offertory-african-2",
    title: "Tshela Moya",
    tradition: "african",
    massSection: "offertory",
    language: "Sotho",
    lyrics:
      "Tshela moya, tshela moya, tshela moya o halelalang\nMonhadi, Messiah, tshela moya o halalelang",
  },
  {
    id: "offertory-classical-1",
    title: "Ave Verum Corpus",
    composer: "W.A. Mozart",
    tradition: "classical",
    massSection: "offertory",
    language: "Latin",
  },
  {
    id: "offertory-african-1",
    title: "Pokea Sadaka Zetu",
    tradition: "african",
    massSection: "offertory",
    language: "Swahili",
    lyrics:
      "Pokea sadaka zetu, Ee Bwana\nPokea sadaka zetu, tunazoleta\nNi ishara ya upendo wetu\nPokea sadaka zetu, Ee Bwana",
  },

  // Sanctus
  {
    id: "sanctus-emmanuel-1",
    title: "Sanctus (Messe de l'Emmanuel)",
    tradition: "classical",
    massSection: "sanctus",
    language: "Latin",
    lyrics:
      "Sanctus, Sanctus, Sanctus\nDominus Deus Sabaoth.\nPleni sunt coeli et terra\nGloria tua.\nHosanna in excelsis.\nBenedictus qui venit in nomine Domini.\nHosanna in excelsis.",
  },
  {
    id: "sanctus-gregorian-1",
    title: "Sanctus XVIII",
    composer: "Gregorian Chant",
    tradition: "gregorian",
    massSection: "sanctus",
    language: "Latin",
  },
  {
    id: "sanctus-classical-1",
    title: "Sanctus (Missa Brevis)",
    composer: "G.P. da Palestrina",
    tradition: "classical",
    massSection: "sanctus",
    language: "Latin",
    lyrics:
      "Sanctus, Sanctus, Sanctus\nDominus Deus Sabaoth\nPleni sunt caeli et terra gloria tua\nHosanna in excelsis\nBenedictus qui venit in nomine Domini\nHosanna in excelsis",
  },

  // Mysterium Fidei
  {
    id: "mysterium-fidei-neri-1",
    title: "Mysterium Fidei (Mass of St Philip Neri)",
    tradition: "classical",
    massSection: "mysterium-fidei",
    language: "English",
    lyrics:
      "Save us, Saviour of the world, for by your cross and resurrection, you have set us free",
  },

  // Amen
  {
    id: "amen-neri-1",
    title: "Amen (Mass of St Philip Neri)",
    tradition: "classical",
    massSection: "amen",
    language: "Latin",
    lyrics: "Amen",
  },

  // Agnus Dei
  {
    id: "agnus-dei-emmanuel-1",
    title: "Agnus Dei (Messe de l'Emmanuel)",
    tradition: "classical",
    massSection: "agnus-dei",
    language: "Latin",
    lyrics:
      "Agnus Dei, qui tollis peccata mundi, miserere nobis.\nAgnus Dei, qui tollis peccata mundi, miserere nobis.\nAgnus Dei, qui tollis peccata mundi, dona nobis pacem.",
  },
  {
    id: "agnus-dei-gregorian-1",
    title: "Agnus Dei XVIII",
    composer: "Gregorian Chant",
    tradition: "gregorian",
    massSection: "agnus-dei",
    language: "Latin",
  },
  {
    id: "agnus-dei-african-1",
    title: "Mwana Kondoo wa Mungu",
    tradition: "african",
    massSection: "agnus-dei",
    language: "Swahili",
    lyrics:
      "Mwana Kondoo wa Mungu\nUnayeondoa dhambi za ulimwengu\nUtuhurumie\nMwana Kondoo wa Mungu\nUnayeondoa dhambi za ulimwengu\nUtupe amani",
  },

  // Communion
  {
    id: "communion-gregorian-1",
    title: "Panis Angelicus",
    tradition: "classical",
    massSection: "communion",
    language: "Latin",
  },
  {
    id: "communion-african-1",
    title: "Chakula cha Roho",
    tradition: "african",
    massSection: "communion",
    language: "Swahili",
    lyrics:
      "Chakula cha roho yangu\nNi mwili wa Kristu\nKinywaji cha roho yangu\nNi damu ya Kristu\nNjooni mle, njooni mnywe\nChakula cha uzima",
  },

  // Recessional
  {
    id: "recessional-african-2",
    title: "Ee Maria Mama Yetu Mwema",
    tradition: "african",
    massSection: "recessional",
    language: "Swahili",
    lyrics:
      "Ee Mama yetu Maria, twaomba sana ee mama usituache gizani kwa mwanao tuombee (x2)\n\n1. Mama yetu Maria utusikilize,\nsisi wana wako tunaposumbuka\nMaisha yetu mama hayana furaha,\ntujaze neema tupate faraja.\n\n2. Utuombee kwake mwanao mpendwa,\natutie nguvu tushinde maovu.\nDunia ina giza, dunia ni ngumu,\nbila nguvu zako hatuwezi kitu.\n\n3. Tuombee Maria, tuombee mama,\nili wana wako tufike mbinguni",
  },
  {
    id: "recessional-1",
    title: "Salve Regina",
    composer: "Gregorian Chant",
    tradition: "gregorian",
    massSection: "recessional",
    language: "Latin",
  },
  {
    id: "recessional-african-1",
    title: "Twende na Amani",
    tradition: "african",
    massSection: "recessional",
    language: "Swahili",
    lyrics:
      "Twende na amani, twende na amani\nKutangaza habari njema\nTwende na amani, twende na amani\nKwa jina la Bwana",
  },
];

export const massSectionLabels: Record<MassSection, string> = {
  prelude: "Prelude",
  introit: "Introit",
  kyrie: "Kyrie",
  gloria: "Gloria",
  responsorial: "Responsorial Psalm",
  alleluia: "Alleluia",
  offertory: "Offertory",
  sanctus: "Sanctus",
  "mysterium-fidei": "Mysterium Fidei",
  amen: "Amen",
  "agnus-dei": "Agnus Dei",
  communion: "Communion",
  recessional: "Recessional",
  reprise: "Reprise",
};

export const massSectionOrder: MassSection[] = [
  "prelude",
  "introit",
  "kyrie",
  "gloria",
  "responsorial",
  "alleluia",
  "offertory",
  "sanctus",
  "mysterium-fidei",
  "amen",
  "agnus-dei",
  "communion",
  "recessional",
  "reprise",
];

export const traditionLabels: Record<string, string> = {
  gregorian: "Gregorian",
  classical: "Classical",
  african: "African",
  contemporary: "Contemporary",
};

export const getSongsByMassSection = (section: MassSection) =>
  repertoire.filter((song) => song.massSection === section);

export const getSongsByTradition = (tradition: string) =>
  repertoire.filter((song) => song.tradition === tradition);
