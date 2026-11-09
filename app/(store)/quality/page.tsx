import type { Metadata } from "next";
import { Prose } from "@/components/site/Prose";

export const metadata: Metadata = {
  title: "Our Quality",
  description: "How Green Lara talks about selection, handling, and packaging.",
};

export default function Page() {
  return (
    <Prose
      eyebrow="Our Quality"
      title="Pure Ingredients. Thoughtful Choices."
      lede="Quality is a practice of selection, careful handling, and responsible packaging. The specifics should be written for each product, not assumed."
    >
      <p>
        A grain is worth buying when you know what it is, how it is packed, and how to store it. Green Lara leaves room for those notes on every product: origin when it is known, pack format, and storage.
      </p>
      <p>
        This site does not display certifications, organic seals, or sourcing guarantees that have not been supplied. The organic range is a catalogue section you can document. Add a certification only when you have one.
      </p>
      <p>
        Packaging is described as food-grade and suited to the weight selected. Update that line when your actual bags, shelf life, and packing process are confirmed.
      </p>
    </Prose>
  );
}
