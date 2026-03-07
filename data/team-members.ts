import type { TeamMember } from "@/types";

export const teamMembers: TeamMember[] = [
  // Sopranos
  {
    id: "faith-kisio",
    name: "Faith Kisio",
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
    id: "kathleen-jean-pierre",
    name: "Kathleen Jean-Pierre",
    voicePart: "soprano",
    roles: ["singer"],
  },
  {
    id: "tania",
    name: "Tania",
    voicePart: "soprano",
    roles: ["singer"],
  },
  {
    id: "terry",
    name: "Terry",
    voicePart: "soprano",
    roles: ["singer"],
  },
  {
    id: "laura",
    name: "Laura",
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
    id: "brittany-mungara",
    name: "Brittany Mungara",
    voicePart: "soprano",
    roles: ["singer"],
  },
  {
    id: "bernadine",
    name: "Bernadine",
    voicePart: "soprano",
    roles: ["singer"],
  },

  // Altos
  {
    id: "frida-ombogo",
    name: "Frida Ombogo",
    voicePart: "alto",
    roles: ["singer", "cor"],
    isCORMember: true,
  },
  {
    id: "madeline-kanyadudi",
    name: "Madeline Kanyadudi",
    voicePart: "alto",
    roles: ["singer"],
  },
  {
    id: "olga",
    name: "Olga",
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
    id: "leah",
    name: "Leah",
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
    id: "irush",
    name: "Irush",
    voicePart: "tenor",
    roles: ["singer", "cor"],
    isCORMember: true,
  },
  {
    id: "jm",
    name: "JM",
    voicePart: "tenor",
    roles: ["singer"],
  },
  {
    id: "jerome",
    name: "Jerome",
    voicePart: "tenor",
    roles: ["singer"],
  },
  {
    id: "ryan",
    name: "Ryan",
    voicePart: "tenor",
    roles: ["singer"],
  },
  {
    id: "karoli",
    name: "Karoli",
    voicePart: "tenor",
    roles: ["singer"],
  },

  // Basses
  {
    id: "sam-kariuki",
    name: "Sam Kariuki",
    voicePart: "bass",
    roles: ["singer", "conductor", "cor"],
    isCORMember: true,
  },
  {
    id: "jamo",
    name: "Jamo",
    voicePart: "bass",
    roles: ["singer"],
  },
  {
    id: "michael-makonnen",
    name: "Michael Makonnen",
    voicePart: "bass",
    roles: ["singer"],
  },
  {
    id: "dave",
    name: "Dave",
    voicePart: "bass",
    roles: ["singer"],
  },
  {
    id: "barry",
    name: "Barry",
    voicePart: "bass",
    roles: ["singer"],
  },
  {
    id: "anto",
    name: "Anto",
    voicePart: "bass",
    roles: ["singer"],
  },
  {
    id: "bob-odero",
    name: "Bob Odero",
    voicePart: "bass",
    roles: ["singer", "cor"],
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
