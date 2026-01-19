export type Theme = "african" | "traditional";

export type VoicePart =
  | "soprano"
  | "alto"
  | "tenor"
  | "bass"
  | "instrumentalist";

export type TeamRole = "singer" | "conductor" | "instrumentalist" | "cor";

export interface TeamMember {
  id: string;
  name: string;
  voicePart: VoicePart;
  roles: TeamRole[];
  instrument?: string;
  isCORMember?: boolean;
}

export type MassSection =
  | "introit"
  | "kyrie"
  | "gloria"
  | "responsorial"
  | "alleluia"
  | "offertory"
  | "sanctus"
  | "agnus-dei"
  | "communion"
  | "recessional";

export interface Song {
  id: string;
  title: string;
  composer?: string;
  tradition: "gregorian" | "classical" | "african" | "contemporary";
  massSection: MassSection;
  language?: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  psalm: string;
  mission: string;
  musicalExpression: string;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  location: {
    venue: string;
    description: string;
  };
  founded: {
    date: string;
    place: string;
  };
  socialLinks: {
    platform: string;
    url: string;
  }[];
}

export interface NavItem {
  label: string;
  href: string;
}
