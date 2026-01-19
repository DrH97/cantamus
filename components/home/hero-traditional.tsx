"use client";

import { motion } from "framer-motion";
import { BookOpen, Calendar, Music2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/data/site-config";

export function HeroTraditional() {
  return (
    <div className="relative min-h-[calc(100vh-var(--header-height))] flex items-center pattern-traditional overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1920&q=80"
          alt=""
          fill
          className="object-cover opacity-15"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/90 via-obsidian/80 to-obsidian" />
      </div>

      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary z-10" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="p-2 bg-primary/10 border border-primary/20">
                <Music2 className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                Sacred Music Ministry
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl font-bold tracking-tight md:text-7xl text-gradient-gold"
            >
              {siteConfig.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-xl text-secondary"
            >
              {siteConfig.musicalExpression}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 p-6 bg-surface/80 backdrop-blur-sm border border-border"
            >
              <blockquote className="text-lg italic text-text">
                &ldquo;{siteConfig.tagline}&rdquo;
              </blockquote>
              <cite className="block mt-2 text-sm text-primary font-semibold not-italic tracking-wide">
                &mdash; {siteConfig.psalm}
              </cite>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link href="/music">
                <Button size="lg" className="gap-2 uppercase tracking-wider">
                  <BookOpen className="h-5 w-5" />
                  View Repertoire
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 uppercase tracking-wider"
                >
                  <Calendar className="h-5 w-5" />
                  Schedule & Events
                </Button>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden border border-border">
                <Image
                  src="https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&q=80"
                  alt="Cathedral interior"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />

                {/* Decorative frame */}
                <div className="absolute inset-4 border border-primary/20" />

                {/* Overlay content */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="text-lg text-text-muted">
                    Directing hearts to experience
                  </p>
                  <p className="text-3xl font-bold text-primary mt-1">
                    True Beauty
                  </p>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent/10 border border-accent/20 -z-10" />
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 border border-primary/20 -z-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
