"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, MessageSquare, Phone, Send } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/data/site-config";
import { cn } from "@/lib/utils";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Form submitted:", data);
    setIsSubmitted(true);
    reset();
  };

  return (
    <>
      {/* Hero Section */}
      <Section size="xl" className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1920&q=80"
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
              <MessageSquare className="h-4 w-4" />
              Get in Touch
            </span>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-gradient-gold">
              Contact Us
            </h1>
            <p className="mt-6 text-xl text-text-muted">
              We&apos;d love to hear from you
            </p>
          </motion.div>
        </div>
      </Section>

      <Section variant="alternate" size="lg">
        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full">
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-text">Email</h3>
                </div>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-text-muted hover:text-primary transition-colors"
                >
                  {siteConfig.contact.email}
                </a>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="h-full">
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-text">Phone</h3>
                </div>
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                  className="text-text-muted hover:text-primary transition-colors"
                >
                  {siteConfig.contact.phone}
                </a>
                <p className="text-sm text-text-muted mt-1">
                  Contact: {siteConfig.contact.name}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full">
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-text">Location</h3>
                </div>
                <p className="text-text-muted">{siteConfig.location.venue}</p>
                <p className="text-sm text-text-muted mt-1">
                  {siteConfig.location.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Section>

      <Section size="lg">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-text mb-6">
                  Send us a Message
                </h2>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                      <Send className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold text-text mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-text-muted mb-4">
                      Thank you for reaching out. We&apos;ll get back to you
                      soon.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setIsSubmitted(false)}
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-text mb-2"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          {...register("name", {
                            required: "Name is required",
                          })}
                          className={cn(
                            "w-full px-4 py-3 rounded-lg border bg-surface text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all",
                            errors.name ? "border-red-500" : "border-border",
                          )}
                          placeholder="Your name"
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-text mb-2"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address",
                            },
                          })}
                          className={cn(
                            "w-full px-4 py-3 rounded-lg border bg-surface text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all",
                            errors.email ? "border-red-500" : "border-border",
                          )}
                          placeholder="your@email.com"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-text mb-2"
                      >
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        {...register("subject", {
                          required: "Subject is required",
                        })}
                        className={cn(
                          "w-full px-4 py-3 rounded-lg border bg-surface text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all",
                          errors.subject ? "border-red-500" : "border-border",
                        )}
                        placeholder="What is this about?"
                      />
                      {errors.subject && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.subject.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-text mb-2"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        {...register("message", {
                          required: "Message is required",
                          minLength: {
                            value: 10,
                            message: "Message must be at least 10 characters",
                          },
                        })}
                        className={cn(
                          "w-full px-4 py-3 rounded-lg border bg-surface text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none",
                          errors.message ? "border-red-500" : "border-border",
                        )}
                        placeholder="Tell us more..."
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      isLoading={isSubmitting}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section
        variant="alternate"
        size="lg"
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920&q=80"
            alt=""
            fill
            className="object-cover opacity-10"
          />
        </div>
        <div className="relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold md:text-4xl mb-4">
              Join Us at Mass
            </h2>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">
              Experience our music live at the Young Professionals&apos; Mass.
              We gather monthly at St Austin&apos;s Church, Nairobi, to lift our
              voices in praise.
            </p>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
