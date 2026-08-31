"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin, Ticket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { aveEva, formatEventDate } from "@/data/ave-eva";

/**
 * Landing-page callout for the current production.
 *
 * The nav highlights Ave Eva with a pill, but that is behind the hamburger on
 * mobile, so the show would be invisible to a phone visitor until they opened
 * the menu. This puts it directly under the hero instead.
 */
export function AveEvaCallout() {
  return (
    <Section
      id="ave-eva"
      variant="alternate"
      size="md"
      className="border-y border-primary/20"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:gap-8 sm:text-left"
      >
        <Link href="/ave-eva" className="shrink-0" aria-hidden tabIndex={-1}>
          <Image
            src={aveEva.poster.src}
            width={aveEva.poster.width}
            height={aveEva.poster.height}
            alt=""
            className="h-40 w-auto border border-primary/30 shadow-[0_8px_30px_rgba(0,0,0,0.5)] sm:h-44"
            sizes="120px"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center gap-2 border border-primary/20 bg-primary/10 px-3 py-1 font-accent text-xs font-semibold uppercase tracking-wider text-primary">
            <Ticket className="h-3.5 w-3.5" />
            {aveEva.billing}
          </span>

          <h2 className="font-display mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            <Link
              href="/ave-eva"
              className="text-gradient-gold transition-opacity hover:opacity-80"
            >
              {aveEva.title}
            </Link>
          </h2>
          <p className="mt-1 font-accent text-sm uppercase tracking-[0.2em] text-primary">
            {aveEva.strapline}
          </p>
          <p className="mt-3 text-text-muted">{aveEva.tagline}</p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-text-muted sm:justify-start">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-primary" />
              <time dateTime={aveEva.date}>{formatEventDate(aveEva.date)}</time>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" />
              {aveEva.venue}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            <a
              href={aveEva.ticketsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="uppercase tracking-wider whitespace-nowrap">
                <Ticket className="h-4 w-4" />
                Buy Tickets
              </Button>
            </a>
            <Link href="/ave-eva">
              <Button
                variant="outline"
                className="uppercase tracking-wider whitespace-nowrap"
              >
                Learn More
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
