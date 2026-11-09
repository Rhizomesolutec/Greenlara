"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Package, Search, Sprout, Truck } from "lucide-react";
import type { Category } from "@/lib/types";
import { categoryImage } from "@/lib/catalogue";

export function Hero() {
  const reduce = useReducedMotion();
  const motionProps = reduce
    ? {}
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7 } };

  return (
    <section className="overflow-hidden">
      <div className="container-page grid items-center gap-10 py-12 lg:grid-cols-12 lg:py-16">
        <motion.div className="lg:col-span-5" {...motionProps}>
          <p className="text-xs tracking-[0.22em] text-muted uppercase">Green Lara</p>
          <h1 className="mt-4 font-serif text-5xl leading-[1.02] text-forest sm:text-6xl lg:text-[4.6rem]">
            Goodness Begins With <span className="italic">Every Grain.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-muted sm:text-lg">
            Discover carefully selected grains, wholesome staples, and everyday essentials, brought to you with a commitment to quality and purity.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className="btn btn-dark">Explore Products</Link>
            <Link href="/about" className="btn btn-line">Discover Our Story</Link>
          </div>
        </motion.div>
        <div className="grid grid-cols-12 gap-3 lg:col-span-7 lg:gap-4">
          <div className="relative col-span-8 aspect-[4/5] overflow-hidden rounded-[2rem] bg-sand shadow-soft">
            <Image
              src={categoryImage.mix}
              alt="An arrangement of beans, lentils, and peas"
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 70vw"
              className="object-cover"
            />
          </div>
          <div className="col-span-4 grid gap-3 lg:gap-4">
            <div className="relative min-h-36 overflow-hidden rounded-[1.5rem] bg-sand">
              <Image src={categoryImage.wheat} alt="Wheat grains" fill sizes="20vw" className="object-cover" />
            </div>
            <div className="relative min-h-36 overflow-hidden rounded-[1.5rem] bg-sand">
              <Image src={categoryImage.red} alt="Red rice" fill sizes="20vw" className="object-cover" />
            </div>
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
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs tracking-[0.2em] text-muted uppercase">The pantry</p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">Shop by Category</h2>
        </div>
        <Link href="/shop" className="text-sm underline decoration-olive underline-offset-4">
          View the full shop
        </Link>
      </div>
      <div className="mt-10 grid grid-cols-2 items-stretch gap-3 sm:gap-5 lg:grid-cols-5">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            className="h-full"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: reduce ? 0 : Math.min(index * 0.04, 0.2) }}
          >
            <Link href={`/shop/${category.slug}`} className="group flex h-full flex-col rounded-[1.4rem] bg-transparent p-2 sm:p-3">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.1rem] bg-sand">
                <Image
                  src={category.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 18vw, 50vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex flex-1 flex-col px-1 pt-3 pb-1">
                <h3 className="line-clamp-2 min-h-[2.6rem] font-serif text-lg leading-tight sm:min-h-[3.4rem] sm:text-2xl">{category.name}</h3>
                <p className="mt-2 line-clamp-3 min-h-[3.75rem] text-xs leading-5 text-muted sm:min-h-[4.5rem] sm:text-sm sm:leading-6">{category.description}</p>
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
    title: "Carefully Selected Products",
    text: "Every listing is chosen as an everyday staple, with details you can read before you buy.",
  },
  {
    icon: Sprout,
    title: "Quality-Focused Sourcing",
    text: "Selection and handling matter. Sourcing notes can be added to each product as they are confirmed.",
  },
  {
    icon: Package,
    title: "Fresh and Secure Packaging",
    text: "Orders are packed to protect the grain in transit. Pack formats vary by weight.",
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
        <h2 className="font-serif text-4xl md:text-5xl">Why Green Lara?</h2>
        <div className="mt-10 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {reasons.map((reason) => (
            <article key={reason.title} className="rounded-[1.5rem] bg-cream p-6">
              <reason.icon className="h-5 w-5" strokeWidth={1.5} />
              <h3 className="mt-6 font-serif text-2xl leading-tight">{reason.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{reason.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Editorial() {
  return (
    <section className="container-page py-16 md:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="text-xs tracking-[0.2em] text-muted uppercase">The collection</p>
          <h2 className="mt-3 font-serif text-4xl leading-[1.05] md:text-6xl">
            Nature&apos;s Finest, Selected for You.
          </h2>
          <p className="mt-6 text-base leading-7 text-muted">
            From fragrant rice and traditional millets to whole wheat, lentils, beans, and grains kept for a quieter kind of cooking. The catalogue is wide, and every listing can be edited as the shop grows.
          </p>
          <Link href="/shop" className="btn btn-dark mt-8">Browse the collection</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:col-span-7 lg:gap-4">
          <div className="relative mt-8 aspect-[3/4] overflow-hidden rounded-[1.6rem]">
            <Image src={categoryImage.rice} alt="White rice" fill className="object-cover" sizes="30vw" />
          </div>
          <div className="grid gap-3 lg:gap-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.6rem]">
              <Image src={categoryImage.millet} alt="Millet grains" fill className="object-cover" sizes="30vw" />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.6rem]">
              <Image src={categoryImage.rajma} alt="Kidney beans" fill className="object-cover" sizes="30vw" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function QualityBand() {
  return (
    <section className="container-page py-8 md:py-12">
      <div className="grid overflow-hidden rounded-[2rem] bg-forest lg:grid-cols-2">
        <div className="relative min-h-80">
          <Image src={categoryImage.field} alt="Wheat standing in a field" fill className="object-cover" sizes="50vw" />
        </div>
        <div className="flex flex-col justify-center px-8 py-12 text-cream md:px-12">
          <h2 className="font-serif text-4xl leading-tight md:text-5xl">Pure Ingredients. Thoughtful Choices.</h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-cream/75 md:text-base">
            Quality here starts with what is selected, how it is handled, and how it is packed. Those details belong on each product, where they can be updated as the real information is confirmed.
          </p>
          <Link href="/quality" className="btn btn-olive mt-8 w-fit">Read our quality promise</Link>
        </div>
      </div>
    </section>
  );
}

const sampleNotes = [
  { quote: "The basmati cooked into long, separate grains and the pack arrived neatly sealed.", detail: "Sample reviewer · layout preview" },
  { quote: "I ordered millets for the week and liked how clearly the weights were listed.", detail: "Sample reviewer · layout preview" },
  { quote: "The bulk enquiry form was straightforward for a restaurant order.", detail: "Sample reviewer · layout preview" },
];

export function Testimonials() {
  return (
    <section className="container-page py-16 md:py-24">
      <div className="max-w-2xl">
        <p className="text-xs tracking-[0.2em] text-muted uppercase">Sample testimonials</p>
        <h2 className="mt-3 font-serif text-4xl md:text-5xl">Words for the table</h2>
        <p className="mt-4 text-sm leading-6 text-muted">
          These notes are sample content for the design. They are not real customer reviews and do not describe real people.
        </p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {sampleNotes.map((note) => (
          <figure key={note.quote} className="rounded-[1.5rem] bg-white p-6">
            <blockquote className="font-serif text-2xl leading-snug">&ldquo;{note.quote}&rdquo;</blockquote>
            <figcaption className="mt-6 text-xs tracking-wide text-muted uppercase">{note.detail}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
