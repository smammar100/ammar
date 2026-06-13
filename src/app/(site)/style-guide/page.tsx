import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Style Guide — Syed Mohammad Ammar",
  description: "Markdown element reference for styling",
};

const codeBlock = `// Code block example
const theme = localStorage.getItem("theme");
if (theme === "dark") {
  document.documentElement.classList.add("dark");
}`;

export default function Page() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-6 text-4xl font-medium tracking-tight sm:text-5xl">
        Markdown Style Guide
      </h1>
      <p className="mb-12 text-lg text-muted-foreground">
        A kitchen sink of all prose elements to verify typography and styling.
      </p>

      <div className="prose">
        <h2>Heading 2 — Section Title</h2>
        <p>This is a standard paragraph. Body text should be comfortable to read at length, with good line-height and a muted color that provides contrast without harshness. Here&apos;s some <strong>bold text</strong> and some <em>italic text</em> and a <a href="#">link to somewhere</a>.</p>

        <h3>Heading 3 — Subsection Title</h3>
        <p>Subsection headings should be clearly smaller than H2s but still stand out from body text. They create hierarchy within a section.</p>

        <h2>Blockquotes</h2>
        <p>Used for challenge statements, callouts, and highlighted quotes:</p>
        <blockquote>
          <p>How might we help first-time users complete an order on their own, without rebuilding their cart from scratch?</p>
        </blockquote>

        <h2>Lists</h2>
        <h3>Unordered List</h3>
        <ul>
          <li>Save+ pots for goal-based saving</li>
          <li>Investment dashboards across mobile and web</li>
          <li>ETF comparison tools for first-time investors</li>
        </ul>

        <h3>Ordered List</h3>
        <ol>
          <li>Competitor analysis across the delivery landscape</li>
          <li>Usability testing with 5 users across 2 core tasks</li>
          <li>A design system to speed up build cycles</li>
        </ol>

        <h3>List with Bold Labels</h3>
        <ul>
          <li><strong>Who:</strong> Product team pod (designer, product manager, tech lead, 3-4 engineers)</li>
          <li><strong>How Long:</strong> ~3 months (initial discovery to production)</li>
          <li><strong>What Tools:</strong> Figma for UI design. Code-based prototyping.</li>
        </ul>

        <h2>Images</h2>
        <p>Images should have rounded corners, a subtle border, and vertical spacing:</p>
        {/* TODO(ammar): swap in a real project image once project thumbnails exist (see TODOs in src/content/projects/*.mdx) */}
        <img src="/images/textures/debut_light.png" alt="Placeholder texture demonstrating prose image styling" />

        <h2>Inline Code and Code Blocks</h2>
        <p>Use inline <code>code</code> for referencing variables, filenames like <code>CLAUDE.md</code>, or short technical terms.</p>
        <pre><code dangerouslySetInnerHTML={{ __html: codeBlock }} /></pre>

        <h2>Horizontal Rules</h2>
        <p>Used to separate major sections:</p>
        <hr />
        <p>Content continues after the rule.</p>

        <h2>Bold and Emphasis Combinations</h2>
        <ul>
          <li><strong>Investment Calculator:</strong> A Webflow calculator that lifted conversion 20% by letting visitors model returns before signing up.</li>
          <li><strong>Component Libraries:</strong> Figma libraries that cut design-to-dev turnaround 35% across the product team.</li>
          <li><strong>App Store Receipts:</strong> 10,000+ downloads with a 4.8★+ iOS rating and <em>4.0★+ on Android</em>.</li>
        </ul>

        <h2>Links</h2>
        <p>Links should use the accent color with an underline offset: <a href="#">Presentation Slides</a>, <a href="#">Prototype</a>, <a href="#">UI Screens</a>, and <a href="#">Design System</a>.</p>

        <h2>Nested Content</h2>
        <p>A paragraph before the blockquote.</p>
        <blockquote>
          <p>Impact: +34% order acceptance rate after user interviews and usability testing</p>
        </blockquote>
        <p>A paragraph after the blockquote, continuing the narrative with additional context and detail about what happened next.</p>
      </div>
    </article>
  );
}
