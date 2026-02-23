"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  Download,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import {
  categoryLabels,
  getAdjacentMusings,
  getMusingById,
} from "@/data/musings";

const categoryColors: Record<string, string> = {
  liturgy: "bg-primary/10 text-primary",
  reflection: "bg-secondary/10 text-secondary-dark",
  monthly: "bg-accent/10 text-accent",
};

function renderContent(content: string) {
  const blocks = content.split("\n\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    // Block quote: lines starting with "> "
    if (block.startsWith("> ")) {
      // Collect consecutive block quote lines
      const quoteBlocks: string[] = [];
      while (i < blocks.length && blocks[i].startsWith("> ")) {
        quoteBlocks.push(blocks[i].replace(/^> /, ""));
        i++;
      }
      elements.push(
        <blockquote
          key={`bq-${i}`}
          className="border-l-4 border-primary/40 pl-6 my-6 text-text-muted italic"
        >
          {quoteBlocks.map((line) => (
            <p
              key={line.slice(0, 60)}
              className="mb-2 last:mb-0 leading-relaxed"
            >
              {renderInline(line)}
            </p>
          ))}
        </blockquote>,
      );
      continue;
    }

    // Attribution: lines starting with "-- "
    if (block.startsWith("-- ")) {
      elements.push(
        <p
          key={`attr-${i}`}
          className="text-right text-sm text-text-muted mb-6 italic"
        >
          {renderInline(block.replace(/^-- /, "\u2014 "))}
        </p>,
      );
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={`p-${i}`} className="text-text-muted leading-relaxed mb-6">
        {renderInline(block)}
      </p>,
    );
    i++;
  }

  return elements;
}

function renderInline(text: string): React.ReactNode[] {
  // Split on *text* for italics
  const segments = text.split(/\*([^*]+)\*/);
  if (segments.length === 1) return [text];

  return segments.map((segment, idx) =>
    idx % 2 === 1 ? (
      <em key={`em-${segment.slice(0, 30)}`}>{segment}</em>
    ) : segment.length > 0 ? (
      segment
    ) : null,
  );
}

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

  const { prev, next } = getAdjacentMusings(id);

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
            {musing.pdfUrl && (
              <div className="mt-4">
                <a
                  href={musing.pdfUrl}
                  download
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary-dark border border-primary/30 hover:border-primary/60 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </a>
              </div>
            )}
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
            {renderContent(musing.content)}
          </div>

          {/* Series Navigation */}
          {(prev || next) && (
            <nav className="mt-12 pt-8 border-t border-border">
              <div className="flex items-stretch justify-between gap-4">
                {prev ? (
                  <Link
                    href={`/musings/${prev.id}`}
                    className="flex-1 group p-4 border border-border hover:border-primary/40 transition-colors"
                  >
                    <span className="flex items-center gap-1 text-xs text-text-muted uppercase tracking-wider mb-1">
                      <ArrowLeft className="h-3 w-3" />
                      Previous
                    </span>
                    <span className="text-sm font-medium text-text group-hover:text-primary transition-colors">
                      {prev.title}
                    </span>
                  </Link>
                ) : (
                  <div className="flex-1" />
                )}
                {next ? (
                  <Link
                    href={`/musings/${next.id}`}
                    className="flex-1 group p-4 border border-border hover:border-primary/40 transition-colors text-right"
                  >
                    <span className="flex items-center justify-end gap-1 text-xs text-text-muted uppercase tracking-wider mb-1">
                      Next
                      <ArrowRight className="h-3 w-3" />
                    </span>
                    <span className="text-sm font-medium text-text group-hover:text-primary transition-colors">
                      {next.title}
                    </span>
                  </Link>
                ) : (
                  <div className="flex-1" />
                )}
              </div>
            </nav>
          )}

          <div className="mt-8 pt-8 border-t border-border">
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
