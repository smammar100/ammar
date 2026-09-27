"use client";

import { useEffect } from "react";

// WebMCP (document.modelContext.registerTool): tools an AI agent in the browser
// can call to learn about Ammar and draft an enquiry to him. Registered on
// load, so agents and Lighthouse's Agentic Browsing audits see them. Browsers
// without WebMCP skip this entirely. In Chrome it currently needs the WebMCP
// origin trial (see the origin-trial meta tag in the root layout).
//
// Every tool is read-only: they fetch the site's own profile
// (/agent/profile.json) and return it. draft_project_inquiry only composes an
// email; the person sends it themselves.

type Tool = {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: { readOnlyHint?: boolean };
  execute: (input: Record<string, unknown>) => Promise<unknown>;
};
type ModelContext = { registerTool: (tool: Tool, options?: { signal?: AbortSignal }) => Promise<void> };

type Profile = {
  name: string;
  headline: string;
  summary: string;
  availability: string;
  location: Record<string, unknown>;
  contact: { email: string; inquiryTips: string[] };
  links: Record<string, unknown>;
  services: { name: string; description: string }[];
  skills: Record<string, string[]>;
  experience: unknown[];
  education: unknown[];
  projects: { slug: string; title: string; client: string | null; summary: string; url: string }[];
  lab: unknown[];
};

let profile: Promise<Profile> | null = null;
const getProfile = () => (profile ??= fetch("/agent/profile.json").then((r) => r.json() as Promise<Profile>));

export function WebMcpTools({ caseStudies }: { caseStudies: string[] }) {
  useEffect(() => {
    const context = ((document as unknown as { modelContext?: ModelContext }).modelContext ??
      (navigator as unknown as { modelContext?: ModelContext }).modelContext) as ModelContext | undefined;
    if (!context?.registerTool) return;
    const controller = new AbortController();

    const tools: Tool[] = [
      {
        name: "get_profile",
        title: "Ammar's profile",
        description:
          "Who Syed Mohammad Ammar is: product designer and design engineer in Karachi (remote). Returns his summary, availability, services, skills, experience, education, location and contact details.",
        inputSchema: { type: "object", properties: {} },
        annotations: { readOnlyHint: true },
        execute: async () => {
          const p = await getProfile();
          const { projects, lab, ...rest } = p;
          return { ...rest, caseStudies: projects.map((w) => ({ slug: w.slug, title: w.title, url: w.url })), labPieces: lab.length };
        },
      },
      {
        name: "list_case_studies",
        title: "List case studies",
        description: "Lists Ammar's case studies: client, title, his role, a summary, outcomes and the page URL for each.",
        inputSchema: { type: "object", properties: {} },
        annotations: { readOnlyHint: true },
        execute: async () => (await getProfile()).projects,
      },
      {
        name: "get_case_study",
        title: "Get a case study",
        description: "Details of one of Ammar's case studies: role, summary, outcomes, skills and the page URL.",
        inputSchema: {
          type: "object",
          properties: {
            slug: { type: "string", enum: caseStudies, description: "Which case study. Use list_case_studies to see them." },
          },
          required: ["slug"],
        },
        annotations: { readOnlyHint: true },
        execute: async ({ slug }) => {
          const found = (await getProfile()).projects.find((w) => w.slug === slug);
          return found ?? { error: `No case study "${String(slug)}". Known: ${caseStudies.join(", ")}.` };
        },
      },
      {
        name: "list_lab_experiments",
        title: "List Lab experiments",
        description: "Lists the interactive components and experiments Ammar has designed and built, with links.",
        inputSchema: { type: "object", properties: {} },
        annotations: { readOnlyHint: true },
        execute: async () => (await getProfile()).lab,
      },
      {
        name: "draft_project_inquiry",
        title: "Draft an enquiry to Ammar",
        description:
          "Drafts an email to Ammar about a project or role, and returns the address, subject, body and a mailto link. It sends nothing: the person reviews and sends it.",
        inputSchema: {
          type: "object",
          properties: {
            sender_name: { type: "string", description: "Who is writing." },
            company: { type: "string", description: "Company or team, if any." },
            needs: { type: "string", enum: ["product design", "web development", "both"], description: "What they need from Ammar." },
            summary: { type: "string", description: "What they're building and what they want help with." },
            timeline: { type: "string", description: "When they'd like to start or ship." },
          },
          required: ["sender_name", "needs", "summary"],
        },
        annotations: { readOnlyHint: true },
        execute: async (input) => {
          const { contact } = await getProfile();
          const name = String(input.sender_name ?? "").trim();
          const company = String(input.company ?? "").trim();
          const subject = `New project: ${String(input.needs)}${company ? ` for ${company}` : ""}`;
          const body = [
            "Hi Ammar,",
            "",
            String(input.summary ?? "").trim(),
            "",
            `What we need: ${String(input.needs)}.`,
            input.timeline ? `Timeline: ${String(input.timeline).trim()}.` : "",
            "",
            `${name}${company ? `, ${company}` : ""}`,
          ]
            .filter((line, i, all) => line !== "" || all[i - 1] !== "")
            .join("\n");
          return {
            to: contact.email,
            subject,
            body,
            mailto: `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
            note: "Nothing was sent. Show this draft to the person so they can send it.",
          };
        },
      },
    ];

    for (const tool of tools) {
      // Wrapped: older builds may throw synchronously or not return a promise.
      Promise.resolve()
        .then(() => context.registerTool(tool, { signal: controller.signal }))
        .catch(() => {
          // Registration can fail (an older WebMCP build, or a duplicate after
          // a fast remount); the site works the same without it.
        });
    }
    return () => controller.abort();
  }, [caseStudies]);

  return null;
}
