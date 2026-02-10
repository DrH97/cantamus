"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  Heart,
  MapPin,
  Music,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Section, SectionHeader } from "@/components/ui/section";
import { siteConfig } from "@/data/site-config";

const timeline = [
  {
    year: "2021",
    title: "Foundation",
    description:
      "Cantamus was founded in August 2021 at Strathmore University, bringing together young Catholic professionals with a shared love for sacred music.",
  },
  {
    year: "2022",
    title: "Growth",
    description:
      "The choir expanded its repertoire and membership, establishing regular participation in the Young Professionals' Mass at St Austin's Church.",
  },
  {
    year: "2023",
    title: "Community",
    description:
      "Deepened community bonds and musical excellence, with members growing together in faith and friendship.",
  },
  {
    year: "Present",
    title: "Flourishing",
    description:
      "Continuing to serve the Church through beautiful sacred music, blending Gregorian, Classical, and African traditions.",
  },
];

const values = [
  {
    icon: Heart,
    title: "Faith",
    description:
      "Our music is an act of worship, directing hearts to experience and encounter True Beauty.",
  },
  {
    icon: Music,
    title: "Excellence",
    description:
      "We strive for the highest musical standards, honoring the sacred liturgy through careful preparation.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "We are a family united in faith, supporting one another in our spiritual and musical journey.",
  },
  {
    icon: Sparkles,
    title: "Tradition",
    description:
      "We honor the Church's rich musical heritage while celebrating our African roots.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <Section size="md" className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=1920&q=80"
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
              Our Story
            </span>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-gradient-gold">
              About {siteConfig.name}
            </h1>
            <p className="mt-6 text-xl text-text-muted">
              {siteConfig.musicalExpression}
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Mission Section */}
      <Section variant="alternate" size="lg">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold md:text-4xl mb-6">Our Mission</h2>
            <p className="text-lg text-text-muted mb-4">
              <strong className="text-primary">{siteConfig.mission}</strong>
            </p>
            <p className="text-text-muted mb-6">
              Cantamus exists to elevate the sacred liturgy through beautiful
              music that speaks to the soul. We believe that sacred music has
              the power to open hearts to God&apos;s presence and draw people
              closer to Him.
            </p>
            <blockquote className="border-l-4 border-primary pl-4 italic text-text-muted">
              &ldquo;{siteConfig.tagline}&rdquo;
              <cite className="block mt-2 text-sm not-italic text-primary font-medium tracking-wide">
                &mdash; {siteConfig.psalm}
              </cite>
            </blockquote>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-square overflow-hidden border border-border">
              <Image
                src="https://images.unsplash.com/photo-1477233534935-f5e6fe7c1159?w=800&q=80"
                alt="Choir performance"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
              <div className="absolute inset-4 border border-primary/20" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-3">
                  <Target className="h-8 w-8 text-primary" />
                  <p className="text-lg font-semibold text-text">
                    {siteConfig.mission}
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 border border-primary/20 -z-10" />
          </motion.div>
        </div>
      </Section>

      {/* Values Section */}
      <Section size="lg">
        <SectionHeader
          title="Our Values"
          subtitle="The principles that guide our ministry"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Card className="h-full text-center" padding="lg">
                <CardContent>
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center bg-primary/10 border border-primary/20 group-hover:border-primary/40 transition-colors">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-text">
                    {value.title}
                  </h3>
                  <p className="text-sm text-text-muted">{value.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Timeline Section */}
      <Section variant="alternate" size="lg">
        <SectionHeader
          title="Our Journey"
          subtitle="From humble beginnings to a thriving community"
        />
        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-border to-primary hidden md:block" />
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative md:w-1/2 ${
                  index % 2 === 0 ? "md:pr-12" : "md:pl-12 md:ml-auto"
                }`}
              >
                <div
                  className="absolute top-2 hidden md:block"
                  style={{
                    [index % 2 === 0 ? "right" : "left"]: "-6px",
                  }}
                >
                  <div className="w-3 h-3 bg-primary glow-gold-sm" />
                </div>
                <Card>
                  <CardContent>
                    <span className="inline-block px-3 py-1 text-sm font-semibold text-primary bg-primary/10 mb-3 tracking-wider">
                      {item.year}
                    </span>
                    <h3 className="text-xl font-semibold text-text mb-2">
                      {item.title}
                    </h3>
                    <p className="text-text-muted">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Location Cards */}
      <Section size="lg">
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1438032005730-c779502df39b?w=600&q=80"
                  alt="Church"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
              </div>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">Where We Serve</h3>
                </div>
                <p className="text-text-muted mb-2">
                  <strong className="text-text">
                    {siteConfig.location.venue}
                  </strong>
                </p>
                <p className="text-text-muted">
                  {siteConfig.location.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="h-full overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80"
                  alt="University"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
              </div>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">Our Beginning</h3>
                </div>
                <p className="text-text-muted mb-2">
                  <strong className="text-text">
                    Founded {siteConfig.founded.date}
                  </strong>
                </p>
                <p className="text-text-muted">{siteConfig.founded.place}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section variant="alternate" size="lg">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold md:text-4xl mb-4">
              Join Our Community
            </h2>
            <p className="text-lg text-text-muted max-w-2xl mx-auto mb-8">
              Whether you&apos;re a singer looking to serve or someone who
              appreciates sacred music, we&apos;d love to connect with you.
            </p>
            <Link href="/artists">
              <Button size="lg" className="uppercase tracking-wider">
                Meet the Choir
              </Button>
            </Link>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
