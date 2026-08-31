"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Crown,
  MapPin,
  Sparkles,
  Ticket,
  Users,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Section, SectionHeader } from "@/components/ui/section";
import { aveEva, formatEventDate } from "@/data/ave-eva";

const archetypeIcons = [Sparkles, Users, Crown];

export function AveEvaClient() {
  const eventDate = formatEventDate(aveEva.date);

  return (
    <>
      {/* Hero */}
      <Section size="lg" className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={aveEva.poster.src}
            alt=""
            fill
            className="object-cover opacity-15 blur-2xl scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        </div>
        <div className="absolute inset-0 pattern-african opacity-30" />
        <div className="relative mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <span className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 text-sm font-semibold tracking-wider uppercase font-accent text-primary mb-6 border border-primary/20">
              <Ticket className="h-4 w-4" />
              {aveEva.billing}
            </span>
            <h1 className="font-display text-5xl font-bold tracking-tight md:text-6xl text-gradient-gold">
              {aveEva.title}
            </h1>
            <p className="mt-4 font-accent text-lg uppercase tracking-[0.2em] text-primary">
              {aveEva.strapline}
            </p>
            <p className="mt-6 text-xl text-text-muted">{aveEva.tagline}</p>
            <p className="mt-3 text-sm text-text-muted">
              Presented by {aveEva.presenter}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-text-muted lg:justify-start">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary" />
                <time dateTime={aveEva.date}>{eventDate}</time>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" />
                Doors open {aveEva.doorsOpen}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                {aveEva.venue}
              </span>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <a
                href={aveEva.ticketsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="uppercase tracking-wider">
                  <Ticket className="h-4 w-4" />
                  Buy Tickets
                </Button>
              </a>
              <a href="#tickets">
                <Button
                  size="lg"
                  variant="outline"
                  className="uppercase tracking-wider"
                >
                  See Prices
                </Button>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto w-full max-w-xs sm:max-w-sm"
          >
            <Image
              src={aveEva.poster.src}
              width={aveEva.poster.width}
              height={aveEva.poster.height}
              alt={`${aveEva.title} poster`}
              className="h-auto w-full border border-primary/20 shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_60px_var(--gold-glow)]"
              priority
              sizes="(min-width: 1024px) 24rem, (min-width: 640px) 24rem, 20rem"
            />
          </motion.div>
        </div>
      </Section>

      {/* The production */}
      <Section variant="alternate" size="lg">
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            title="The Production"
            subtitle="Salvation history told from the inside"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6 text-lg leading-relaxed text-text-muted"
          >
            <p>
              <span className="text-text font-semibold">Ave Eva</span> is a
              musical written from the point of view of the Blessed Virgin Mary.
              It follows her through her traditional archetypal roles of Virgin,
              Mother and Warrior Queen, and through the temptation she meets at
              each stage of that journey.
            </p>
            <p>
              Alongside her, the cast embodies the three Persons of the Blessed
              Trinity — the Father, the Son and the Holy Spirit — so that the
              drama is played out between heaven and earth rather than only
              within one woman&apos;s story.
            </p>
            <blockquote className="border-l-2 border-primary pl-6 italic text-text">
              The music that accompanies each stage of the play expresses the
              psyche of the main protagonists. It is a daring mix of the sacred
              and the secular, the African and the European.
            </blockquote>
          </motion.div>
        </div>
      </Section>

      {/* Three archetypes */}
      <Section size="lg">
        <SectionHeader
          title="Three Faces of One Woman"
          subtitle="Each act meets Mary at a different stage — and at a different temptation"
        />
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {aveEva.archetypes.map((archetype, index) => {
            const Icon = archetypeIcons[index] ?? Sparkles;
            return (
              <motion.div
                key={archetype.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full text-center group">
                  <CardContent>
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-semibold text-text mb-3">
                      {archetype.name}
                    </h3>
                    <p className="text-text-muted leading-relaxed">
                      {archetype.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* Tickets */}
      <Section id="tickets" variant="alternate" size="lg">
        <SectionHeader title="Tickets" subtitle={aveEva.audience} />
        <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
          {aveEva.tickets.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card
                className={`h-full text-center ${
                  tier.featured ? "border-primary" : ""
                }`}
              >
                <CardContent>
                  <p className="text-sm font-semibold tracking-wider uppercase font-accent text-primary">
                    {tier.name}
                  </p>
                  <p className="mt-4 text-4xl font-bold text-text">
                    <span className="text-lg align-top text-text-muted mr-1">
                      {tier.currency}
                    </span>
                    {tier.price.toLocaleString("en-KE")}
                  </p>
                  <p className="mt-3 text-sm text-text-muted">{tier.note}</p>
                  <a
                    href={aveEva.ticketsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-6"
                  >
                    <Button
                      variant={tier.featured ? "primary" : "outline"}
                      className="w-full uppercase tracking-wider"
                    >
                      Buy Now
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-text-muted">
          Tickets are sold through TikoHUB.
        </p>
      </Section>

      {/* Practical details */}
      <Section size="lg">
        <div className="max-w-3xl mx-auto">
          <SectionHeader title="Getting There" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardContent>
                <p className="text-xs font-semibold tracking-wider uppercase font-accent text-primary mb-2">
                  When
                </p>
                <p className="text-text">
                  <time dateTime={aveEva.date}>{eventDate}</time>
                </p>
                <p className="text-text-muted text-sm mt-1">
                  Doors open at {aveEva.doorsOpen}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-xs font-semibold tracking-wider uppercase font-accent text-primary mb-2">
                  Where
                </p>
                <p className="text-text">{aveEva.venue}</p>
                <p className="text-text-muted text-sm mt-1">{aveEva.city}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
