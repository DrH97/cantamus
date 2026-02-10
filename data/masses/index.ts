import type { MassProgram } from "@/types";
import { mass20260215 } from "./2026-02-15";

const massPrograms: MassProgram[] = [mass20260215];

export function getMassProgram(date: string): MassProgram | undefined {
  return massPrograms.find((p) => p.date === date);
}

export function hasMassProgram(date: string): boolean {
  return massPrograms.some((p) => p.date === date);
}
