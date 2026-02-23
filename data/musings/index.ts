import type { Musing } from "@/types";
import { dec } from "./01-dec";
import { jan } from "./02-jan";
import { feb } from "./03-feb";
import { mar } from "./04-mar";
import { apr } from "./05-apr";
import { may } from "./06-may";
import { jun } from "./07-jun";
import { jul } from "./08-jul";
import { aug } from "./09-aug";
import { sep } from "./10-sep";
import { oct } from "./11-oct";
import { nov } from "./12-nov";
import { introduction } from "./introduction";

export const musings: Musing[] = [
  introduction,
  dec,
  jan,
  feb,
  mar,
  apr,
  may,
  jun,
  jul,
  aug,
  sep,
  oct,
  nov,
];

/** Monthly articles in series order (excludes introduction) */
const monthlySeries: Musing[] = musings.filter((m) => m.category === "monthly");

export const categoryLabels: Record<Musing["category"], string> = {
  liturgy: "Liturgy",
  reflection: "Reflection",
  monthly: "Monthly Musing",
};

export const getMusingById = (id: string) =>
  musings.find((musing) => musing.id === id);

export const getMusingsByCategory = (category: Musing["category"]) =>
  musings.filter((musing) => musing.category === category);

export function getAdjacentMusings(id: string) {
  const index = monthlySeries.findIndex((m) => m.id === id);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? monthlySeries[index - 1] : null,
    next: index < monthlySeries.length - 1 ? monthlySeries[index + 1] : null,
  };
}
