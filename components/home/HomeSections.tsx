"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Package, Search, Sprout, Truck } from "lucide-react";
import type { Category } from "@/lib/types";
import { categoryImage } from "@/lib/catalogue";
import { easeOutSmooth, FadeIn, StaggerGrid, StaggerItem } from "@/components/site/Motion";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="overflow-hidden">
      <div className="container-page grid items-center gap-10 py-12 lg:grid-cols-12 lg:py-16">
        <div className="lg:col-span-5">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOutSmooth }}
            className="text-xs tracking-[0.22em] text-muted uppercase"
          >
            Green Lara · Spices &amp; Pulses
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: reduce ? 0 : 0.08, ease: easeOutSmooth }}
            className="mt-4 font-serif text-5xl leading-[1.02] text-forest sm:text-6xl lg:text-[4.4rem]"
          >
            Pure Flavour Begins With <span className="italic text-olive">Every Spice &amp; Pulse.</span>
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: reduce ? 0 : 0.18, ease: easeOutSmooth }}
            className="mt-6 max-w-md text-base leading-7 text-muted sm:text-lg"
          >
            Discover aromatic whole spices, freshly ground masalas, and wholesome pulses and lentils, carefully selected for everyday kitchens.
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: reduce ? 0 : 0.28, ease: easeOutSmooth }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link href="/shop" className="btn btn-dark hover:-translate-y-0.5">
              Explore Products
            </Link>
            <Link href="/about" className="btn btn-line hover:-translate-y-0.5">
              Discover Our Story
            </Link>
          </motion.div>
        </div>
        <div className="grid grid-cols-12 gap-3 lg:col-span-7 lg:gap-4">
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, delay: reduce ? 0 : 0.12, ease: easeOutSmooth }}
            className="group relative col-span-8 aspect-[4/5] overflow-hidden rounded-[2rem] bg-sand shadow-soft"
          >
            <Image
              src={categoryImage.wholeSpices}
              alt="An editorial arrangement of whole Indian spices including cardamom, cinnamon, cloves, and peppercorns"
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 70vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          </motion.div>
          <div className="col-span-4 grid gap-3 lg:gap-4">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: reduce ? 0 : 0.22, ease: easeOutSmooth }}
              className="group relative min-h-36 overflow-hidden rounded-[1.5rem] bg-sand shadow-soft"
            >
              <Image
                src={categoryImage.turmeric}
                alt="Golden turmeric powder and dried turmeric roots"
                fill
                sizes="20vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              />
            </motion.div>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: reduce ? 0 : 0.32, ease: easeOutSmooth }}
              className="group relative min-h-36 overflow-hidden rounded-[1.5rem] bg-sand shadow-soft"
            >
              <Image
                src={categoryImage.kabuliChana}
                alt="Kabuli chickpeas in a handmade ceramic bowl"
                fill
                sizes="20vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CategorySection({ categories }: { categories: Category[] }) {
  const reduce = useReducedMotion();
  return (
    <section className="container-page py-16 md:py-24">
      <FadeIn className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs tracking-[0.2em] text-muted uppercase">The pantry</p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">Shop by Category</h2>
        </div>
        <Link href="/shop" className="text-sm underline decoration-olive underline-offset-4 transition-colors hover:text-olive">
          View the full shop
        </Link>
      </FadeIn>
      <div className="mt-10 grid grid-cols-2 items-stretch gap-3 sm:gap-5 lg:grid-cols-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            className="h-full"
            initial={reduce ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: reduce ? 0 : index * 0.08, ease: easeOutSmooth }}
            whileHover={reduce ? undefined : { y: -4 }}
          >
            <Link
              href={`/shop/${category.slug}`}
              className="group flex h-full flex-col rounded-[1.5rem] bg-white/55 p-2.5 transition-shadow duration-300 hover:bg-white hover:shadow-soft sm:p-3.5"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.1rem] bg-sand">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(min-width: 1024px) 22vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
              </div>
              <div className="flex flex-1 flex-col px-1 pt-3.5 pb-1">
                <h3 className="line-clamp-2 min-h-[2.6rem] font-serif text-lg leading-tight sm:min-h-[3.2rem] sm:text-2xl">
                  {category.name}
                </h3>
                <p className="mt-2 line-clamp-3 min-h-[3.5rem] text-xs leading-5 text-muted sm:min-h-[4.2rem] sm:text-sm sm:leading-6">
                  {category.description}
                </p>
                <span className="mt-auto inline-flex w-fit items-center gap-2 rounded-full border border-forest/20 px-3.5 py-2 text-[11px] tracking-[0.16em] text-forest uppercase transition duration-300 group-hover:border-forest group-hover:bg-forest group-hover:text-cream">
                  Explore
                  <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>→</span>
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const reasons = [
  {
    icon: Search,
    title: "Carefully Selected Harvests",
    text: "Every spice and pulse is chosen for aroma, colour, and clean cooking quality, with clear details before you buy.",
  },
  {
    icon: Sprout,
    title: "Quality-Focused Sourcing",
    text: "Selection and handling matter. Origin and harvest notes can be added to each product as they are confirmed.",
  },
  {
    icon: Package,
    title: "Aroma-Lock Packaging",
    text: "Orders are sealed to protect natural spice oils and keep pulses dry and fresh in transit.",
  },
  {
    icon: Truck,
    title: "Reliable Delivery",
    text: "Coverage and timelines are confirmed at checkout. Charges shown are sample estimates.",
  },
];

export function WhySection() {
  return (
    <section className="bg-sand">
      <div className="container-page py-16 md:py-24">
        <FadeIn>
          <h2 className="font-serif text-4xl md:text-5xl">Why Green Lara?</h2>
        </FadeIn>
        <StaggerGrid className="mt-10 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4" stagger={0.08}>
          {reasons.map((reason) => (
            <StaggerItem key={reason.title}>
              <article className="h-full rounded-[1.5rem] bg-cream p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-forest/8 text-forest">
                  <reason.icon className="h-5 w-5" strokeWidth={1.6} />
                </div>
                <h3 className="mt-5 font-serif text-2xl leading-tight">{reason.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{reason.text}</p>
              </article>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}

export function Editorial() {
  const reduce = useReducedMotion();
  return (
    <section className="container-page py-16 md:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-12">
        <FadeIn className="lg:col-span-5">
          <p className="text-xs tracking-[0.2em] text-muted uppercase">The collection</p>
          <h2 className="mt-3 font-serif text-4xl leading-[1.05] md:text-6xl">
            Nature&apos;s Finest, Selected for You.
          </h2>
          <p className="mt-6 text-base leading-7 text-muted">
            From fragrant green cardamom, Tellicherry pepper, and vibrant turmeric to everyday toor dal, moong, rajma, and chickpeas. A focused pantry of spices and pulses built for real cooking.
          </p>
          <Link href="/shop" className="btn btn-dark mt-8 hover:-translate-y-0.5">
            Browse the collection
          </Link>
        </FadeIn>
        <div className="grid grid-cols-2 gap-3 lg:col-span-7 lg:gap-4">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: easeOutSmooth }}
            className="group relative mt-8 aspect-[3/4] overflow-hidden rounded-[1.6rem] bg-sand shadow-soft"
          >
            <Image
              src={categoryImage.cardamom}
              alt="Fresh green cardamom pods"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              sizes="30vw"
            />
          </motion.div>
          <div className="grid gap-3 lg:gap-4">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: reduce ? 0 : 0.1, ease: easeOutSmooth }}
              className="group relative aspect-[4/3] overflow-hidden rounded-[1.6rem] bg-sand shadow-soft"
            >
              <Image
                src={categoryImage.redChilli}
                alt="Kashmiri red chilli powder and dried red chillies"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                sizes="30vw"
              />
            </motion.div>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: reduce ? 0 : 0.2, ease: easeOutSmooth }}
              className="group relative aspect-[4/3] overflow-hidden rounded-[1.6rem] bg-sand shadow-soft"
            >
              <Image
                src={categoryImage.rajma}
                alt="Red kidney beans"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                sizes="30vw"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function QualityBand() {
  return (
    <section className="container-page py-8 md:py-12">
      <FadeIn>
        <div className="grid overflow-hidden rounded-[2rem] bg-forest shadow-soft lg:grid-cols-2">
          <div className="group relative min-h-80 overflow-hidden">
            <Image
              src={categoryImage.cinnamonCloves}
              alt="Ceylon cinnamon quills, cloves, and star anise"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              sizes="50vw"
            />
          </div>
          <div className="flex flex-col justify-center px-8 py-12 text-cream md:px-12">
            <p className="text-xs tracking-[0.2em] text-olive uppercase">Our standard</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">Pure Ingredients. Thoughtful Choices.</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-cream/75 md:text-base">
              Quality here starts with what is selected, how it is cleaned and milled, and how it is packed to hold its aroma. Those details belong on each product, where they can be updated as real batch information is confirmed.
            </p>
            <Link href="/quality" className="btn btn-olive mt-8 w-fit hover:-translate-y-0.5">
              Read our quality promise
            </Link>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

const sampleNotes = [
  { quote: "The green cardamom and black pepper arrived remarkably fragrant and neatly sealed.", detail: "Sample reviewer · layout preview" },
  { quote: "I stocked up on toor dal, moong, and turmeric for the month and loved how clearly the weights were listed.", detail: "Sample reviewer · layout preview" },
  { quote: "The bulk enquiry form was straightforward for a restaurant spice and pulses order.", detail: "Sample reviewer · layout preview" },
];

export function Testimonials() {
  return (
    <section className="container-page py-16 md:py-24">
      <FadeIn className="max-w-2xl">
        <p className="text-xs tracking-[0.2em] text-muted uppercase">Sample testimonials</p>
        <h2 className="mt-3 font-serif text-4xl md:text-5xl">Words for the table</h2>
        <p className="mt-4 text-sm leading-6 text-muted">
          These notes are sample content for the design. They are not real customer reviews and do not describe real people.
        </p>
      </FadeIn>
      <StaggerGrid className="mt-10 grid gap-4 md:grid-cols-3" stagger={0.09}>
        {sampleNotes.map((note) => (
          <StaggerItem key={note.quote}>
            <figure className="h-full rounded-[1.5rem] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
              <blockquote className="font-serif text-2xl leading-snug">&ldquo;{note.quote}&rdquo;</blockquote>
              <figcaption className="mt-6 text-xs tracking-wide text-muted uppercase">{note.detail}</figcaption>
            </figure>
          </StaggerItem>
        ))}
      </StaggerGrid>
    </section>
  );
}
