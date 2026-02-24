"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Music } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/data/site-config";
import type { MassSection } from "@/types";

interface Verse {
  verseNumber: number;
  verseText: string;
  isChorus: boolean;
}

interface ProgramSong {
  id: string;
  massSection: string;
  sortOrder: number;
  lyricsOverride: string | null;
  hymnId: string;
  hymnTitle: string;
  hymnComposer: string | null;
  hymnTradition: string | null;
  hymnLanguage: string | null;
  hymnVerses: Verse[];
}

interface MassProgram {
  id: string;
  date: string;
  title: string | null;
  songs: ProgramSong[];
}

function formatDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const traditionColors: Record<string, string> = {
  gregorian: "bg-primary/10 text-primary",
  classical: "bg-secondary/10 text-secondary-foreground",
  african: "bg-accent/10 text-accent",
  contemporary: "bg-text-muted/10 text-text-muted",
};

export function MassProgramClient({
  program,
  massSectionLabels,
  massSectionOrder,
  traditionLabels,
}: {
  program: MassProgram;
  massSectionLabels: Record<MassSection, string>;
  massSectionOrder: MassSection[];
  traditionLabels: Record<string, string>;
}) {
  const sortedSongs = [...program.songs].sort(
    (a, b) =>
      massSectionOrder.indexOf(a.massSection as MassSection) -
      massSectionOrder.indexOf(b.massSection as MassSection),
  );

  return (
    <>
      {/* Hero Section */}
      <Section size="md" className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1920&q=80"
            alt=""
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        </div>
        <div className="absolute inset-0 pattern-african opacity-30" />
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 text-sm font-semibold tracking-wider uppercase text-primary mb-6 border border-primary/20">
              <Music className="h-4 w-4" />
              Mass Program
            </span>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl text-gradient-gold">
              {program.title ?? "Mass Program"}
            </h1>
            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-text-muted">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <time dateTime={program.date}>{formatDate(program.date)}</time>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{siteConfig.location.venue}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Songs */}
      <Section size="md">
        <div className="max-w-3xl mx-auto space-y-6">
          {sortedSongs.map((entry, index) => {
            const sectionLabel =
              massSectionLabels[entry.massSection as MassSection] ??
              entry.massSection;
            const tradLabel = entry.hymnTradition
              ? (traditionLabels[entry.hymnTradition] ?? entry.hymnTradition)
              : null;

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card>
                  <CardContent>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-flex items-center bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wider uppercase text-primary border border-primary/20">
                        {sectionLabel}
                      </span>
                      {tradLabel && (
                        <span
                          className={`inline-flex items-center px-3 py-1 text-xs font-medium border border-secondary/20 ${
                            entry.hymnTradition
                              ? (traditionColors[entry.hymnTradition] ?? "")
                              : ""
                          }`}
                        >
                          {tradLabel}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-text">
                      {entry.hymnTitle}
                    </h3>
                    {entry.hymnComposer && (
                      <p className="text-sm text-text-muted mt-1">
                        {entry.hymnComposer}
                      </p>
                    )}
                    {entry.lyricsOverride ? (
                      <p className="mt-4 text-text-muted whitespace-pre-line leading-relaxed">
                        {entry.lyricsOverride}
                      </p>
                    ) : entry.hymnVerses.length > 0 ? (
                      <div className="mt-4 space-y-3">
                        {entry.hymnVerses.map((verse) => (
                          <div key={verse.verseNumber}>
                            {verse.isChorus && (
                              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                                Chorus
                              </p>
                            )}
                            <p className="text-text-muted whitespace-pre-line leading-relaxed">
                              {verse.verseText}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Back button */}
        <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-border">
          <Link href="/events">
            <Button variant="outline" className="uppercase tracking-wider">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
          </Link>
        </div>
      </Section>
    </>
  );
}
