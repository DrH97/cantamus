import type { TeamMember } from "@/types";

export const teamMembers: TeamMember[] = [
  // Sopranos
  {
    id: "brittany-mungara",
    name: "Brittany Mungara",
    voicePart: "soprano",
    roles: ["singer"],
  },
  {
    id: "kathleen-jean-pierre",
    name: "Kathleen Jean-Pierre",
    voicePart: "soprano",
    roles: ["singer"],
  },
  {
    id: "faith-kisio",
    name: "Faith Kisio",
    voicePart: "soprano",
    roles: ["singer"],
  },
  {
    id: "marion-kimathi",
    name: "Marion Kimathi",
    voicePart: "soprano",
    roles: ["singer"],
  },
  {
    id: "nyandia-maina",
    name: "Nyandia Maina",
    voicePart: "soprano",
    roles: ["singer"],
  },
  {
    id: "njoki-fernandes",
    name: "Njoki Fernandes",
    voicePart: "soprano",
    roles: ["singer"],
  },

  // Altos
  {
    id: "chiri-ngelechei",
    name: "Chiri Ngelechei",
    voicePart: "alto",
    roles: ["singer"],
  },
  {
    id: "lynette-muema",
    name: "Lynette Muema",
    voicePart: "alto",
    roles: ["singer"],
  },
  {
    id: "frida-ombogo",
    name: "Frida Ombogo",
    voicePart: "alto",
    roles: ["singer"],
  },
  {
    id: "maryann-gitonga",
    name: "Maryann Gitonga",
    voicePart: "alto",
    roles: ["singer"],
  },
  {
    id: "madeline-kanyadudi",
    name: "Madeline Kanyadudi",
    voicePart: "alto",
    roles: ["singer"],
  },
  {
    id: "rahab-khisa",
    name: "Rahab Khisa",
    voicePart: "alto",
    roles: ["singer"],
  },
  {
    id: "monty-njaaga",
    name: "Monty Njaaga",
    voicePart: "alto",
    roles: ["singer"],
  },

  // Tenors
  {
    id: "david-ngethe",
    name: "David Ng'ethe",
    voicePart: "tenor",
    roles: ["singer"],
  },
  {
    id: "michael-makonnen",
    name: "Michael Makonnen",
    voicePart: "tenor",
    roles: ["singer"],
  },

  // Basses
  {
    id: "bob-odero",
    name: "Bob Odero",
    voicePart: "bass",
    roles: ["singer", "cor"],
    isCORMember: true,
  },
  {
    id: "james-mburu",
    name: "James Mburu",
    voicePart: "bass",
    roles: ["singer"],
  },
  {
    id: "sam-kariuki",
    name: "Sam Kariuki",
    voicePart: "bass",
    roles: ["singer", "conductor", "cor"],
    isCORMember: true,
  },

  // Instrumentalists
  {
    id: "irenee-vunabandi",
    name: "Irénée Vunabandi",
    voicePart: "instrumentalist",
    roles: ["instrumentalist"],
    instrument: "Piano",
  },
  {
    id: "raphael-kariuki",
    name: "Raphael Kariuki",
    voicePart: "instrumentalist",
    roles: ["instrumentalist"],
    instrument: "Percussion",
  },
];

export const voicePartLabels: Record<string, string> = {
  soprano: "Sopranos",
  alto: "Altos",
  tenor: "Tenors",
  bass: "Basses",
  instrumentalist: "Instrumentalists",
};

export const getMembersByVoicePart = (voicePart: string) =>
  teamMembers.filter((member) => member.voicePart === voicePart);

export const getCORMembers = () =>
  teamMembers.filter((member) => member.isCORMember);

export const getConductors = () =>
  teamMembers.filter((member) => member.roles.includes("conductor"));
