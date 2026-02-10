"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Heart, MapPin, Music } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Section, SectionHeader } from "@/components/ui/section";
import { getThirdSundays, services } from "@/data/events";
import { hasMassProgram } from "@/data/masses";
import { siteConfig } from "@/data/site-config";

const now = new Date();
const upcomingDates = getThirdSundays(now.getFullYear(), 6);

const serviceIcons: Record<string, typeof Calendar> = {
  weddings: Heart,
  concerts: Music,
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function toDateSlug(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function EventsPage() {
  return (
    <>
      {/* Hero Section */}
      <Section size="md" className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1920&q=80"
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
              <Calendar className="h-4 w-4" />
              Events
            </span>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-gradient-gold">
              Events
            </h1>
            <p className="mt-6 text-xl text-text-muted">
              Upcoming Masses, weddings, and concerts
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Calendar Section */}
      <Section size="lg">
        <SectionHeader
          title="Upcoming Masses"
          subtitle="Young Professionals' Mass — every 3rd Sunday of the month"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingDates.map((date, index) => (
            <motion.div
              key={date.toISOString()}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center bg-primary/10 border border-primary/20">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-text">
                        {formatDate(date)}
                      </h4>
                      <p className="text-sm text-text-muted mt-1">
                        Young Professionals&apos; Mass
                      </p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-text-muted">
                        <MapPin className="h-3 w-3" />
                        <span>{siteConfig.location.venue}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-text-muted">
                        <Clock className="h-3 w-3" />
                        <span>5:00 PM</span>
                      </div>
                      {hasMassProgram(toDateSlug(date)) && (
                        <Link href={`/events/${toDateSlug(date)}`}>
                          <Button className="mt-3 uppercase tracking-wider text-xs">
                            <Music className="h-3 w-3 mr-1" />
                            View Program
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Services Section */}
      <Section variant="alternate" size="lg">
        <SectionHeader
          title="Services"
          subtitle="We are available for weddings and concerts"
        />
        <div className="grid gap-8 md:grid-cols-2">
          {services.map((service, index) => {
            const Icon = serviceIcons[service.id] ?? Music;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Card className="h-full" padding="lg">
                  <CardContent>
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center bg-primary/10 border border-primary/20 group-hover:border-primary/40 transition-colors">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-text text-center">
                      {service.title}
                    </h3>
                    <p className="text-text-muted text-center mb-6">
                      {service.description}
                    </p>
                    <div className="text-center">
                      {service.link ? (
                        <Link href={service.link.href}>
                          <Button className="uppercase tracking-wider">
                            {service.link.label}
                          </Button>
                        </Link>
                      ) : (
                        <p className="text-sm text-text-muted italic">
                          Get in touch to discuss your event
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Section>
    </>
  );
}
