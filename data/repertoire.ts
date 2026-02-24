import type { MassSection } from "@/types";

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
