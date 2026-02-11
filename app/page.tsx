"use client";

import { motion } from "framer-motion";
import { Calendar, Heart, Music, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HeroAfrican } from "@/components/home/hero-african";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardIcon } from "@/components/ui/card";
import {
  Section,
  SectionDivider,
  SectionHeader,
} from "@/components/ui/section";
import { siteConfig } from "@/data/site-config";

export default function HomePage() {
  return (
    <>
      <HeroAfrican />

      <SectionDivider />

      <Section variant="alternate" size="lg">
        <SectionHeader title="Our Mission" subtitle={siteConfig.mission} />
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              icon: Music,
              title: "Sacred Music",
              description:
                "Bringing together Gregorian chant, Classical masterpieces, and vibrant African traditions to elevate the liturgy.",
            },
            {
              icon: Heart,
              title: "True Beauty",
              description:
                "Directing hearts to experience and encounter True Beauty through the art of sacred music.",
            },
            {
              icon: Users,
              title: "Community",
              description:
                "A family of voices united in faith, serving the Young Professionals' Mass at St Austin's Church, Nairobi.",
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group"
            >
              <Card className="h-full text-center" padding="lg">
                <CardIcon>
                  <item.icon />
                </CardIcon>
                <h3 className="mb-3 text-xl font-semibold text-text">
                  {item.title}
                </h3>
                <CardContent>{item.description}</CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section variant="dark" size="lg">
        <SectionHeader
          title="Our Musical Traditions"
          subtitle="A confluence of sacred musical heritage"
        />
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              tradition: "Gregorian",
              description:
                "The ancient chant tradition of the Church, with its meditative melodies and sacred Latin texts that have echoed through cathedrals for over a millennium.",
              gradient: "from-primary to-secondary",
              image:
                "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&q=80",
            },
            {
              tradition: "Classical",
              description:
                "Timeless works from Mozart, Palestrina, Vivaldi, and other masters of sacred polyphony that lift the soul to contemplate the divine.",
              gradient: "from-secondary to-primary-dark",
              image:
                "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&q=80",
            },
            {
              tradition: "African",
              description:
                "Vibrant rhythms and Swahili texts that celebrate our Kenyan heritage and African spirituality, bringing life and joy to worship.",
              gradient: "from-royal-purple to-deep-purple",
              image:
                "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80",
            },
          ].map((item, index) => (
            <motion.div
              key={item.tradition}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative overflow-hidden bg-surface border border-border transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.tradition}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent" />
                <div
                  className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${item.gradient}`}
                />
              </div>

              {/* Content */}
              <div className="p-6 relative">
                <div
                  className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${item.gradient} transition-all duration-400 group-hover:w-1.5`}
                />
                <h3 className="text-2xl font-semibold text-text mb-3 relative z-10">
                  {item.tradition}
                </h3>
                <p className="text-text-muted leading-relaxed relative z-10">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section variant="accent" size="lg">
        <div className="flex flex-col items-center text-center relative">
          {/* Decorative pattern background */}
          <div className="absolute inset-0 opacity-5">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <pattern
                id="diamond-pattern"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M10 0L20 10L10 20L0 10Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-primary"
                />
              </pattern>
              <rect width="100%" height="100%" fill="url(#diamond-pattern)" />
            </svg>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10"
          >
            <Calendar className="h-16 w-16 text-primary mb-6 mx-auto drop-shadow-[0_0_20px_var(--gold-glow)]" />
            <h2 className="text-4xl font-bold md:text-5xl mb-6">
              Join Us at Mass
            </h2>
            <p className="text-xl text-text-muted max-w-2xl mb-2">
              {siteConfig.location.venue}
            </p>
            <p className="text-primary font-medium tracking-wide mb-10">
              {siteConfig.location.description}
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
