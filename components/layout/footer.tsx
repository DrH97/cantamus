import { Mail, MapPin, Music, Phone } from "lucide-react";
import Link from "next/link";
import { navItems, siteConfig } from "@/data/site-config";

export function Footer() {
  return (
    <footer className="bg-obsidian border-t border-border relative pt-4 pb-20">
      {/* Gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-3 text-2xl font-bold text-text transition-colors duration-300 hover:text-primary"
            >
              <Music className="h-7 w-7 text-primary" />
              <span className="tracking-wide">{siteConfig.name}</span>
            </Link>
            <p className="mt-4 max-w-md text-text-muted leading-relaxed">
              Where ancient Gregorian chant meets the timeless elegance of
              Classical masterworks and the vibrant pulse of African tradition.
            </p>
            <div className="mt-5 border-l-2 border-primary pl-4">
              <p className="text-sm italic text-text-muted">
                &ldquo;{siteConfig.tagline}&rdquo;
              </p>
              <p className="text-xs text-primary mt-1 font-medium tracking-wide">
                {siteConfig.psalm}
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-semibold tracking-[0.1em] uppercase text-primary">
              Navigate
            </h3>
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-text-muted transition-colors duration-300 hover:text-text relative inline-block after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-semibold tracking-[0.1em] uppercase text-primary">
              Contact
            </h3>
            <ul className="space-y-4 text-sm text-text-muted">
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-primary" />
                <span className="leading-relaxed">
                  {siteConfig.location.venue}
                  <br />
                  <span className="text-primary/80">
                    {siteConfig.location.description}
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="transition-colors duration-300 hover:text-primary"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                  className="transition-colors duration-300 hover:text-primary"
                >
                  {siteConfig.contact.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-text-muted md:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </p>
          <p>
            Founded {siteConfig.founded.date} at {siteConfig.founded.place}
          </p>
        </div>
      </div>
    </footer>
  );
}
