"use client";

import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Calendar, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { categoryLabels, getMusingById } from "@/data/musings";

const categoryColors: Record<string, string> = {
  liturgy: "bg-primary/10 text-primary",
  reflection: "bg-secondary/10 text-secondary-dark",
  monthly: "bg-accent/10 text-accent",
};

export default function MusingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const musing = getMusingById(id);

  if (!musing) {
    notFound();
  }

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
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold tracking-wider uppercase mb-6 border border-primary/20 ${categoryColors[musing.category]}`}
            >
              <BookOpen className="h-4 w-4" />
              {categoryLabels[musing.category]}
            </span>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl text-gradient-gold">
              {musing.title}
            </h1>
            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-text-muted">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <time dateTime={musing.date}>
                  {new Date(musing.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{musing.author}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Content */}
      <Section size="lg">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="prose prose-lg max-w-none">
            {musing.content.split("\n\n").map((paragraph) => (
              <p
                key={musing.id}
                className="text-text-muted leading-relaxed mb-6"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <Link href="/musings">
              <Button variant="outline" className="uppercase tracking-wider">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Musings
              </Button>
            </Link>
          </div>
        </motion.article>
      </Section>
    </>
  );
}
