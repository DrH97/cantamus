"use client";

import { motion } from "framer-motion";
import { Crown, Mic2, Music, Piano, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Section, SectionHeader } from "@/components/ui/section";
import {
  getCORMembers,
  getConductors,
  getMembersByVoicePart,
  voicePartLabels,
} from "@/data/team-members";

const voiceSections = ["soprano", "alto", "tenor", "bass", "instrumentalist"];

export default function ArtistsPage() {
  const corMembers = getCORMembers();
  const conductors = getConductors();

  return (
    <>
      {/* Hero Section */}
      <Section size="md" className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1920&q=80"
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
              <Users className="h-4 w-4" />
              Our Family
            </span>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-gradient-gold">
              Meet the Artists
            </h1>
            <p className="mt-6 text-xl text-text-muted">
              A family of voices united in faith and song
            </p>
          </motion.div>
        </div>
      </Section>

      {/* COR Team Section */}
      <Section variant="alternate" size="lg">
        <SectionHeader
          title="COR Team"
          subtitle="The leadership guiding our ministry"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {corMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Card className="h-full text-center overflow-hidden">
                <div className="relative h-32 bg-gradient-to-br from-primary/20 via-secondary/10 to-royal-purple/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 flex items-center justify-center bg-surface border-2 border-primary/30 group-hover:border-primary transition-colors">
                      <Crown className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                </div>
                <CardContent>
                  <h3 className="text-lg font-semibold text-text">
                    {member.name}
                  </h3>
                  <p className="text-sm text-text-muted capitalize">
                    {member.voicePart === "instrumentalist"
                      ? member.instrument
                      : member.voicePart}
                  </p>
                  {member.roles.includes("conductor") && (
                    <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 text-xs font-medium text-primary bg-primary/10">
                      <Mic2 className="h-3 w-3" />
                      Conductor
                    </span>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Conductors Section */}
      <Section size="lg">
        <SectionHeader
          title="Conductors"
          subtitle="Leading us in musical worship"
        />
        <div className="flex flex-wrap justify-center gap-6">
          {conductors.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Card className="w-64 text-center overflow-hidden">
                <div className="relative h-40 bg-gradient-to-br from-royal-purple/30 via-primary/20 to-secondary/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 flex items-center justify-center bg-surface border-2 border-primary/30 group-hover:border-primary group-hover:glow-gold-sm transition-all">
                      <Mic2 className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                </div>
                <CardContent>
                  <h3 className="text-xl font-semibold text-text">
                    {member.name}
                  </h3>
                  <p className="text-sm text-text-muted capitalize">
                    {member.voicePart}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Voice Sections */}
      {voiceSections.map((voicePart, sectionIndex) => {
        const members = getMembersByVoicePart(voicePart);
        if (members.length === 0) return null;

        return (
          <Section
            key={voicePart}
            variant={sectionIndex % 2 === 0 ? "alternate" : "default"}
            size="lg"
          >
            <SectionHeader
              title={voicePartLabels[voicePart]}
              subtitle={`${members.length} ${members.length === 1 ? "member" : "members"}`}
            />
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {members.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Card className="h-full">
                    <CardContent className="flex items-center gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center bg-primary/10 border border-primary/20">
                        {voicePart === "instrumentalist" ? (
                          <Piano className="h-5 w-5 text-primary" />
                        ) : (
                          <Music className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-text">{member.name}</h3>
                        {member.instrument && (
                          <p className="text-sm text-text-muted">
                            {member.instrument}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1 mt-1">
                          {member.isCORMember && (
                            <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium text-primary bg-primary/10">
                              COR
                            </span>
                          )}
                          {member.roles.includes("conductor") && (
                            <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium text-secondary bg-secondary/10">
                              Conductor
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Section>
        );
      })}

      {/* CTA Section */}
      <Section
        variant="alternate"
        size="lg"
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&q=80"
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
              Interested in Joining?
            </h2>
            <p className="text-lg text-text-muted max-w-2xl mx-auto mb-8">
              We welcome singers who share our passion for sacred music and
              desire to serve the Church through their voice.
            </p>
            <Link href="/about">
              <Button size="lg" className="uppercase tracking-wider">
                Learn More
              </Button>
            </Link>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
