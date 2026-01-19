import type { NavItem, SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Cantamus",
  tagline: "In the presence of the angels, I will sing your praise my God",
  psalm: "Psalm 137/138",
  mission: "Direct hearts to experience & encounter True Beauty",
  musicalExpression: "Confluence of Gregorian, Classical & African Traditions",
  contact: {
    name: "Lu Kimari",
    email: "imagodei.kenya@gmail.com",
    phone: "+254 11 55 99 275",
  },
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
  { label: "About", href: "/about" },
  { label: "Artists", href: "/artists" },
  { label: "Music", href: "/music" },
  { label: "Contact", href: "/contact" },
];
