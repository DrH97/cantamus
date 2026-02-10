"use client";

import { motion } from "framer-motion";
import { ExternalLink, Music, Play } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Section, SectionHeader } from "@/components/ui/section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getSongsByMassSection,
  massSectionLabels,
  massSectionOrder,
  traditionLabels,
} from "@/data/repertoire";
import { siteConfig } from "@/data/site-config";
import type { MassSection } from "@/types";

const traditionColors: Record<string, string> = {
  gregorian: "bg-primary/10 text-primary",
  classical: "bg-secondary/10 text-secondary-dark",
  african: "bg-accent/10 text-accent",
  contemporary: "bg-text-muted/10 text-text-muted",
};

export default function MusicPage() {
  return (
    <>
      {/* Hero Section */}
      <Section size="md" className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=1920&q=80"
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
              Our Repertoire
            </span>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-gradient-gold">
              Sacred Music
            </h1>
            <p className="mt-6 text-xl text-text-muted">
              {siteConfig.musicalExpression}
            </p>
          </motion.div>
        </div>
      </Section>

      <Section size="lg">
        <SectionHeader
          title="Repertoire by Mass Section"
          subtitle="Songs organized by their place in the liturgy"
        />
        <Tabs defaultValue="introit" className="w-full">
          <div className="flex justify-center mb-8 overflow-x-auto pb-2">
            <TabsList className="flex-wrap justify-center">
              {massSectionOrder.slice(0, 5).map((section) => (
                <TabsTrigger key={section} value={section}>
                  {massSectionLabels[section]}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <div className="flex justify-center mb-8 overflow-x-auto pb-2">
            <TabsList className="flex-wrap justify-center">
              {massSectionOrder.slice(5).map((section) => (
                <TabsTrigger key={section} value={section}>
                  {massSectionLabels[section]}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {massSectionOrder.map((section) => {
            const songs = getSongsByMassSection(section as MassSection);
            return (
              <TabsContent key={section} value={section}>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {songs.map((song, index) => (
                    <motion.div
                      key={song.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="h-full hover:shadow-md transition-shadow">
                        <CardContent>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-text truncate">
                                {song.title}
                              </h4>
                              {song.composer && (
                                <p className="text-sm text-text-muted">
                                  {song.composer}
                                </p>
                              )}
                            </div>
                            <span
                              className={`flex-shrink-0 px-2 py-1 text-xs font-medium rounded ${traditionColors[song.tradition]}`}
                            >
                              {traditionLabels[song.tradition]}
                            </span>
                          </div>
                          {song.language && (
                            <p className="mt-2 text-xs text-text-muted">
                              Language: {song.language}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                {songs.length === 0 && (
                  <p className="text-center text-text-muted py-8">
                    No songs listed for this section yet.
                  </p>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </Section>

      <Section variant="alternate" size="lg">
        <SectionHeader
          title="Listen to Our Music"
          subtitle="Find us on your favorite streaming platforms"
        />
        <div className="flex flex-wrap justify-center gap-4">
          {siteConfig.socialLinks.map((link, index) => (
            <motion.a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Card className="w-48 text-center hover:shadow-lg transition-all group-hover:border-primary">
                <CardContent>
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Play className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium text-text group-hover:text-primary transition-colors">
                    {link.platform}
                  </h3>
                  <div className="flex items-center justify-center gap-1 mt-2 text-xs text-text-muted">
                    <span>Listen Now</span>
                    <ExternalLink className="h-3 w-3" />
                  </div>
                </CardContent>
              </Card>
            </motion.a>
          ))}
        </div>
      </Section>

      {/* CTA Section */}
      <Section size="lg" className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1920&q=80"
            alt=""
            fill
            className="object-cover opacity-10"
          />
        </div>
        <div className="relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold md:text-4xl mb-4">
              Experience Live
            </h2>
            <p className="text-lg text-text-muted max-w-2xl mx-auto mb-8">
              Join us at the Young Professionals&apos; Mass at St Austin&apos;s
              Church, Nairobi, to experience our music in its fullest expression
              during the sacred liturgy.
            </p>
            <a href="/about">
              <Button size="lg" className="uppercase tracking-wider">
                Learn More
              </Button>
            </a>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
