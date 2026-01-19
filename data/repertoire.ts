import type { MassSection, Song } from "@/types";

export const repertoire: Song[] = [
  // Introit
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
  },

  // Gloria
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
  },

  // Responsorial Psalm
  {
    id: "responsorial-1",
    title: "Psalm 23 - The Lord Is My Shepherd",
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
  },

  // Alleluia
  {
    id: "alleluia-gregorian-1",
    title: "Alleluia Mode VI",
    composer: "Gregorian Chant",
    tradition: "gregorian",
    massSection: "alleluia",
    language: "Latin",
  },

  // Offertory
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
  },

  // Sanctus
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
  },

  // Agnus Dei
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
  },

  // Communion
  {
    id: "communion-gregorian-1",
    title: "Panis Angelicus",
    composer: "C. Franck",
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
  },

  // Recessional
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
  },
];

export const massSectionLabels: Record<MassSection, string> = {
  introit: "Introit",
  kyrie: "Kyrie",
  gloria: "Gloria",
  responsorial: "Responsorial Psalm",
  alleluia: "Alleluia",
  offertory: "Offertory",
  sanctus: "Sanctus",
  "agnus-dei": "Agnus Dei",
  communion: "Communion",
  recessional: "Recessional",
};

export const massSectionOrder: MassSection[] = [
  "introit",
  "kyrie",
  "gloria",
  "responsorial",
  "alleluia",
  "offertory",
  "sanctus",
  "agnus-dei",
  "communion",
  "recessional",
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
