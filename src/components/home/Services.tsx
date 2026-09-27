import type { CSSProperties, ReactNode } from "react";
import { HATCH, IntersectionRule } from "@/components/layout/Intersection";
import { BuildIn } from "./BuildIn";
import { SERVICES as SERVICE_COPY } from "@/data/services";

// What I do, below the featured work: a centred heading on the margin hatch, then
// one ruled cell per service. Lives inside the home page's Intersection frame,
// so its rules are the same dashed IntersectionRule the rest of the page uses.
//
// Each service has a small illustration built from tiles, like an app icon
// scene: HTML boxes for the surfaces (so they take the theme's card and border
// tokens and real shadows) with the detail drawn inside them. The first time an
// illustration scrolls into view it builds itself up piece by piece (BuildIn +
// the .b-* classes in global.css; --d is each piece's delay). Hovering the cell
// then fans the tiles apart a little. Reduced motion skips both.

const SELECT = "#3B82F6"; // design-tool selection blue, legible in both themes
// The mock UI inside the tiles: a violet-to-sky hero and pastel cards, echoing
// the Mahaana app. Saturated enough to read on both the light and dark card.
const HERO = "linear-gradient(135deg, #8B5CF6, #38BDF8)";
const PASTEL = ["#C4B5FD", "#FCD34D", "#6EE7B7"];
const BUTTON = "#7C3AED";

const MOVE = "transition-transform duration-500 ease-out motion-reduce:transition-none";

/** Delay for a build-up piece, in ms. */
const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/**
 * A browser frame under a design-tool selection, a phone behind it, and the
 * cursor. Builds as: frame, its lines and cards, the phone, then the selection
 * draws round the frame and the cursor flies in and clicks.
 */
function DesignIcon() {
  return (
    <div aria-hidden="true" className="relative h-24 w-36">
      {/* Phone, tilted behind */}
      <div
        className={`b-slide absolute top-0 left-[84px] h-[82px] w-[44px] rotate-[8deg] rounded-[11px] border border-border bg-card p-[5px] shadow-sm group-hover:translate-x-1.5 group-hover:rotate-[12deg] ${MOVE}`}
        style={d(520)}
      >
        <div className="mx-auto mb-1.5 h-1 w-3 rounded-full bg-foreground/15" />
        <div className="b-grow mb-1 h-4 rounded-[4px]" style={{ background: HERO, ...d(700) }} />
        <div className="b-grow mb-1 h-2 rounded-[3px]" style={{ backgroundColor: PASTEL[1], ...d(760) }} />
        <div className="b-grow mb-1 h-2 rounded-[3px]" style={{ backgroundColor: PASTEL[2], ...d(820) }} />
        <div className="b-pop mt-2 h-2.5 rounded-full" style={{ backgroundColor: BUTTON, ...d(900) }} />
      </div>

      {/* Browser frame with its selection box */}
      <div className={`absolute top-3 left-1 -rotate-[3deg] group-hover:-translate-x-1 group-hover:-rotate-[5deg] ${MOVE}`}>
        <div
          className="b-rise relative h-[60px] w-[84px] overflow-hidden rounded-lg border border-border bg-card shadow-md"
          style={d(0)}
        >
          <div className="flex h-3 items-center gap-[3px] border-b border-border px-1.5">
            <span className="size-[3px] rounded-full bg-foreground/25" />
            <span className="size-[3px] rounded-full bg-foreground/25" />
            <span className="size-[3px] rounded-full bg-foreground/25" />
          </div>
          <div className="p-1.5">
            <div className="b-grow mb-1 h-1.5 w-10 rounded-full bg-foreground/60" style={d(240)} />
            <div className="b-grow mb-1.5 h-1 w-14 rounded-full bg-foreground/15" style={d(320)} />
            <div className="grid grid-cols-3 gap-1">
              {PASTEL.map((color, i) => (
                <div key={color} className="b-pop h-5 rounded-[3px]" style={{ backgroundColor: color, ...d(400 + i * 80) }} />
              ))}
            </div>
          </div>
        </div>
        {/* Selection: a 1.5px box a few px outside the frame, with handles */}
        <div className="b-draw absolute -inset-[4px] rounded-[3px] border-[1.5px]" style={{ borderColor: SELECT, ...d(1000) }}>
          {["-top-[4px] -left-[4px]", "-top-[4px] -right-[4px]", "-bottom-[4px] -left-[4px]", "-right-[4px] -bottom-[4px]"].map((pos, i) => (
            <span
              key={pos}
              className={`b-pop absolute size-[7px] rounded-[2px] border-[1.5px] bg-white ${pos}`}
              style={{ borderColor: SELECT, ...d(1250 + i * 60) }}
            />
          ))}
        </div>
        <span
          className="b-pop absolute -top-[17px] left-[-4px] rounded-[3px] px-1 py-px font-mono text-[7px] leading-none font-medium text-white"
          style={{ backgroundColor: SELECT, ...d(1300) }}
        >
          Frame
        </span>
      </div>

      {/* Cursor, pointing at the frame's corner */}
      <svg
        viewBox="0 0 20 20"
        className={`b-fly absolute top-[58px] left-[70px] size-6 drop-shadow-md group-hover:-translate-x-1 group-hover:-translate-y-1 ${MOVE}`}
        style={d(1400)}
      >
        <path
          d="M3 2.5 16.5 9.2l-6 1.6-2.4 5.8Z"
          className="fill-foreground stroke-background"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/** Syntax-coloured lines for the editor: [colour, width in px] per token. */
const CODE: { indent: number; parts: [string, number][] }[] = [
  { indent: 0, parts: [["#C084FC", 10], ["#E4E4E7", 16]] },
  { indent: 1, parts: [["#60A5FA", 12], ["#E4E4E7", 8], ["#4ADE80", 14]] },
  { indent: 2, parts: [["#F472B6", 18], ["#71717A", 10]] },
  { indent: 1, parts: [["#60A5FA", 9], ["#FBBF24", 16]] },
  { indent: 0, parts: [["#C084FC", 8]] },
];
// Typing rhythm: a beat per line, a little quicker per token within it.
const LINE_START = 220;
const LINE_GAP = 150;
const TOKEN_GAP = 60;
const CARET_AT = LINE_START + CODE.length * LINE_GAP;

/**
 * A code editor in front of the page it renders. Builds as: the editor, then
 * the code types out line by line, the caret lands, and the page it renders
 * slides in behind with its header, copy and button.
 */
function DevIcon() {
  return (
    <div aria-hidden="true" className="relative h-24 w-36">
      {/* The rendered page, tilted behind */}
      <div
        className={`b-slide absolute top-0 left-[58px] h-[62px] w-[76px] rotate-[7deg] overflow-hidden rounded-lg border border-border bg-card shadow-sm group-hover:translate-x-1.5 group-hover:rotate-[11deg] ${MOVE}`}
        style={d(CARET_AT - 150)}
      >
        <div className="flex h-3 items-center gap-[3px] border-b border-border px-1.5">
          <span className="size-[3px] rounded-full bg-foreground/25" />
          <span className="size-[3px] rounded-full bg-foreground/25" />
          <span className="size-[3px] rounded-full bg-foreground/25" />
        </div>
        <div className="b-grow h-5" style={{ background: HERO, ...d(CARET_AT + 50) }} />
        <div className="flex flex-col items-center p-1.5">
          <div className="b-grow mb-1 h-1.5 w-11 rounded-full bg-foreground/60" style={d(CARET_AT + 200)} />
          <div className="b-grow mb-1.5 h-1 w-14 rounded-full bg-foreground/15" style={d(CARET_AT + 260)} />
          <div className="b-pop h-2.5 w-8 rounded-full" style={{ backgroundColor: BUTTON, ...d(CARET_AT + 360) }} />
        </div>
      </div>

      {/* Editor, in front. Always dark, like an editor is. */}
      <div
        className={`b-rise absolute top-6 left-1 h-[64px] w-[88px] -rotate-[4deg] overflow-hidden rounded-lg bg-[#18181B] shadow-lg ring-1 ring-black/40 dark:ring-white/10 group-hover:-translate-x-1 group-hover:-rotate-[7deg] ${MOVE}`}
        style={d(0)}
      >
        <div className="flex h-3 items-center gap-[3px] px-1.5">
          <span className="size-[4px] rounded-full bg-[#FF5F57]" />
          <span className="size-[4px] rounded-full bg-[#FEBC2E]" />
          <span className="size-[4px] rounded-full bg-[#28C840]" />
        </div>
        <div className="space-y-[5px] px-2 pt-1">
          {CODE.map((line, i) => (
            <div key={i} className="flex items-center gap-[3px]" style={{ paddingLeft: line.indent * 6 }}>
              {line.parts.map(([color, width], j) => (
                <span
                  key={j}
                  className="b-grow h-[3px] rounded-full"
                  style={{ width, backgroundColor: color, ...d(LINE_START + i * LINE_GAP + j * TOKEN_GAP) }}
                />
              ))}
              {/* Caret on the last line */}
              {i === CODE.length - 1 && (
                <span className="b-pop ml-0.5 h-[7px] w-px bg-white motion-safe:animate-pulse" style={d(CARET_AT)} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Copy lives in data/services.ts (shared with the agent-facing files); the
// icons are matched to it here.
const ICONS: Record<(typeof SERVICE_COPY)[number]["title"], ReactNode> = {
  "Product Design": <DesignIcon />,
  "Web Development": <DevIcon />,
};
const SERVICES = SERVICE_COPY.map((service) => ({ ...service, icon: ICONS[service.title] }));

export function Services({ padding }: { padding: string }) {
  return (
    <section aria-labelledby="services-heading">
      {/* Heading on the frame's own margin hatch, so the band reads as part of
          the page frame rather than a new texture. */}
      <div className={`relative ${padding} py-16 text-center sm:py-20`}>
        <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${HATCH}`} />
        <h2
          id="services-heading"
          className="relative mx-auto max-w-xl text-balance text-3xl font-medium leading-tight tracking-tight sm:text-4xl"
        >
          Thoughtfully designed. Built to work.
        </h2>
      </div>

      <IntersectionRule />

      {/* Stacked with a rule between on phones; side by side with a dashed
          divider from sm up. */}
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {SERVICES.map((service, i) => (
          <div
            key={service.title}
            className={`group ${padding} py-10 sm:py-12 ${
              i > 0 ? "border-t border-dashed border-(--pattern-fg) sm:border-t-0 sm:border-l" : ""
            }`}
          >
            <BuildIn>{service.icon}</BuildIn>
            <h3 className="mt-8 text-2xl font-medium tracking-tight">{service.title}</h3>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted-foreground">{service.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
