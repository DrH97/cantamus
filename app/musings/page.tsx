"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Calendar, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Section, SectionHeader } from "@/components/ui/section";
import { categoryLabels, musings } from "@/data/musings";

const categoryColors: Record<string, string> = {
  liturgy: "bg-primary/10 text-primary",
  reflection: "bg-secondary/10 text-secondary-dark",
  monthly: "bg-accent/10 text-accent",
};

export default function MusingsPage() {
  return (
    <>
      {/* Hero Section */}
      <Section size="md" className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1920&q=80"
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
              <BookOpen className="h-4 w-4" />
              Liturgical Reflections
            </span>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-gradient-gold">
              Musings
            </h1>
            <p className="mt-6 text-xl text-text-muted">
              Thoughts on liturgy, sacred music, and the rhythm of the
              liturgical year
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Musings List */}
      <Section size="lg">
        <SectionHeader
          title="Latest Writings"
          subtitle="Liturgical write-ups and monthly reflections from the Cantamus community"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
          {musings.map((musing, index) => (
            <motion.div
              key={musing.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link href={`/musings/${musing.id}`} className="block h-full">
                <Card className="h-full hover:shadow-lg transition-shadow group">
                  <CardContent>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${categoryColors[musing.category]}`}
                      >
                        {categoryLabels[musing.category]}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-text-muted">
                        <Calendar className="h-3 w-3" />
                        <time dateTime={musing.date}>
                          {new Date(musing.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </time>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-text mb-2 group-hover:text-primary transition-colors">
                      {musing.title}
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed mb-4">
                      {musing.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-text-muted">
                        <User className="h-3 w-3" />
                        <span>{musing.author}</span>
                      </div>
                      <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        Read more <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>
    </>
  );
}
