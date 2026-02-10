"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Music } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { getMassProgram } from "@/data/masses";
import {
  massSectionLabels,
  massSectionOrder,
  repertoire,
  traditionLabels,
} from "@/data/repertoire";
import { siteConfig } from "@/data/site-config";

function formatDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function MassProgramPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = use(params);
  const program = getMassProgram(date);

  if (!program) {
    notFound();
  }

  const sortedSongs = [...program.songs].sort(
    (a, b) =>
      massSectionOrder.indexOf(a.massSection) -
      massSectionOrder.indexOf(b.massSection),
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
            const song = repertoire.find((s) => s.id === entry.songId);
            if (!song) return null;
            const lyrics = entry.lyrics ?? song.lyrics;

            return (
              <motion.div
                key={entry.songId}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card>
                  <CardContent>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-flex items-center bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wider uppercase text-primary border border-primary/20">
                        {massSectionLabels[entry.massSection]}
                      </span>
                      <span className="inline-flex items-center bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary-foreground border border-secondary/20">
                        {traditionLabels[song.tradition]}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-text">
                      {song.title}
                    </h3>
                    {song.composer && (
                      <p className="text-sm text-text-muted mt-1">
                        {song.composer}
                      </p>
                    )}
                    {lyrics && (
                      <p className="mt-4 text-text-muted whitespace-pre-line leading-relaxed">
                        {lyrics}
                      </p>
                    )}
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
