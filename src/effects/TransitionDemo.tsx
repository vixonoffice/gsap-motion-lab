import { TransitionLink, type Variant } from "@/components/PageTransition";

const variants: { variant: Variant; title: string; text: string; to: string; label: string }[] = [
  { variant: "wipe", title: "Wipe", text: "One panel slides up over the page, then keeps going.", to: "/effects/text-reveal", label: "Line text reveal" },
  { variant: "curtain", title: "Curtain", text: "Five columns close from the centre and open from the edges.", to: "/effects/stacking-cards", label: "Stacking cards" },
  { variant: "iris", title: "Iris", text: "A circle grows from exactly where you clicked.", to: "/effects/flip-grid", label: "Flip image grid" },
];

export default function TransitionDemo() {
  return (
    <section className="bg-ink px-4 py-20 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1500px]">
        <p className="eyebrow">Pick a variant, then click</p>
        <ul className="mt-10 grid gap-4 md:grid-cols-12">
          {variants.map((v, i) => (
            <li key={v.variant} className="md:col-span-4">
              <TransitionLink
                href={v.to}
                variant={v.variant}
                label={v.label}
                className="group flex min-h-[18rem] flex-col justify-between rounded-[2rem] border border-line p-6 transition-colors duration-500 hover:bg-accent hover:text-ink sm:min-h-[26rem] sm:p-8"
              >
                <span className="eyebrow group-hover:!text-ink">Variant {String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="display block text-[clamp(3rem,5.6vw,5.8rem)]">{v.title}</span>
                  <span className="mt-4 block max-w-xs text-[1rem] leading-relaxed text-mute group-hover:text-ink">{v.text}</span>
                  <span className="mt-6 inline-block font-mono text-sm">&rarr; {v.label}</span>
                </span>
              </TransitionLink>
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-xl text-mute">
          The previous / next links at the bottom of every effect page use the same component, so you have been seeing it since the first click.
        </p>
      </div>
    </section>
  );
}
