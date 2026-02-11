"use client";

import { motion } from "framer-motion";
import { Calendar, Music, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/data/site-config";

function GeometricAccent() {
  return (
    <svg
      className="absolute top-[15%] right-[5%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] opacity-[0.06] animate-rotate-slow"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "var(--primary)" }} />
          <stop offset="100%" style={{ stopColor: "var(--secondary)" }} />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#gold-gradient)" strokeWidth="0.5">
        <polygon points="100,10 190,100 100,190 10,100" />
        <polygon points="100,30 170,100 100,170 30,100" />
        <polygon points="100,50 150,100 100,150 50,100" />
        <polygon points="100,70 130,100 100,130 70,100" />
        <circle cx="100" cy="100" r="90" />
        <circle cx="100" cy="100" r="70" />
        <circle cx="100" cy="100" r="50" />
        <line x1="100" y1="10" x2="100" y2="190" />
        <line x1="10" y1="100" x2="190" y2="100" />
        <line x1="30" y1="30" x2="170" y2="170" />
        <line x1="170" y1="30" x2="30" y2="170" />
      </g>
    </svg>
  );
}

export function HeroAfrican() {
  return (
    <div className="relative min-h-[calc(100vh-var(--header-height))] flex items-center pattern-african overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1920&q=80"
          alt=""
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/95 to-obsidian/70" />
      </div>

      {/* Animated top border */}
      <div className="absolute top-0 left-0 right-0 h-[3px] shimmer-gold z-10" />

      {/* Glow orbs */}
      <div className="absolute -top-[200px] -right-[100px] w-[600px] h-[600px] rounded-full bg-royal-purple/40 blur-[120px] animate-pulse-glow" />
      <div className="absolute -bottom-[200px] -left-[100px] w-[600px] h-[600px] rounded-full bg-deep-purple/40 blur-[120px] animate-pulse-glow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px]" />

      {/* Geometric accent */}
      <GeometricAccent />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8"
            >
              <span className="inline-flex items-center gap-3 px-5 py-2.5 text-[0.8rem] font-semibold tracking-[0.1em] uppercase text-primary bg-primary/10 border border-primary/30">
                <Music className="h-4 w-4" />
                Catholic Chorale from Nairobi, Kenya
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-6xl font-bold tracking-tight md:text-8xl"
            >
              <span className="text-gradient-gold">Cantamus</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-6 border-l-[3px] border-primary pl-5"
            >
              <p className="text-xl italic text-text-muted md:text-2xl">
                &ldquo;{siteConfig.tagline}&rdquo;
              </p>
              <p className="mt-2 text-sm font-medium tracking-[0.05em] text-primary">
                {siteConfig.psalm}
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.45,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-8 text-lg text-text-muted max-w-xl leading-relaxed"
            >
              Where ancient Gregorian chant meets the timeless elegance of
              Classical masterworks and the vibrant pulse of African tradition.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link href="/artists">
                <Button size="lg" className="gap-2.5 uppercase tracking-wider">
                  <Users className="h-5 w-5" />
                  Meet the Choir
                </Button>
              </Link>
              <Link href="/events">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2.5 uppercase tracking-wider"
                >
                  <Calendar className="h-5 w-5" />
                  Schedule & Events
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Featured image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden border border-primary/20">
                <Image
                  src="https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&q=80"
                  alt="Sacred music performance"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-obsidian/50 to-transparent" />

                {/* Decorative frame */}
                <div className="absolute inset-4 border border-primary/30" />
              </div>

              {/* Accent elements */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 border border-primary/20 -z-10" />
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-royal-purple/20 border border-royal-purple/20 -z-10" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
