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

export interface Song {
  id: string;
  title: string;
  composer?: string;
  tradition: "gregorian" | "classical" | "african" | "contemporary";
  tags?: string[];
  link?: string;
  scoreUrl?: string;
  language?: string;
  lyrics?: string;
}

export interface MassProgramSong {
  /** Slug of a row in mass_sections; admins can add more. */
  massSection: string;
  songId: string;
  lyrics?: string;
}

export interface MassProgram {
  date: string;
  title?: string;
  songs: MassProgramSong[];
}

export interface SiteConfig {
  name: string;
  tagline: string;
  psalm: string;
  mission: string;
  musicalExpression: string;
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

export interface Musing {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: "liturgy" | "reflection" | "monthly";
  pdfUrl?: string;
}

export interface NavItem {
  label: string;
  href: string;
  /** Renders the item as a highlighted call-out pill in the nav. */
  highlight?: boolean;
}
