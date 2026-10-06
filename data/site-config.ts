import type { NavItem, SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Cantamus",
  tagline: "In the presence of the angels, I will sing your praise my God",
  psalm: "Psalm 137/138",
  mission: "Direct hearts to experience & encounter True Beauty",
  musicalExpression: "Confluence of Gregorian, Classical & African Traditions",
  location: {
    venue: "St Austin's Church, Nairobi",
    description: "Young Professionals' Mass (monthly)",
  },
  founded: {
    date: "August 2021",
    place: "Strathmore University",
  },
  socialLinks: [
    {
      platform: "YouTube",
      url: "https://youtube.com/@cantamuskenya",
    },
    {
      platform: "Instagram",
      url: "https://instagram.com/cantamuskenya",
    },
    {
      platform: "Spotify",
      url: "https://open.spotify.com/artist/cantamus",
    },
  ],
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Music", href: "/music" },
  { label: "Artists", href: "/artists" },
  { label: "Musings", href: "/musings" },
  { label: "Events", href: "/events" },
  { label: "About", href: "/about" },
];
