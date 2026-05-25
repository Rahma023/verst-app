import type { IconName } from "@/components/icon";
import type { ClimateVizVariant } from "@/components/climate-viz";

export type LessonState = "content" | "qa" | "planned";
export type ModuleStatus = "live" | "in-production" | "recording" | "planned";
export type Section = "A" | "B";

export type Lesson = {
  id: string;
  t: string;
  dur: string;
  state: LessonState;
};

export type Course = {
  id: string;
  code: string;
  section: Section;
  title: string;
  sub: string;
  cat: string;
  dur: string;
  lvl: "Beginner" | "Intermediate" | "Advanced";
  cert: boolean;
  price: string;
  inst: string;
  instRole: string;
  visual: ClimateVizVariant;
  glassIcon: IconName;
  progress: number;
  lessons: number;
  mods: number;
  status: ModuleStatus;
  syllabus: Lesson[];
};

export const COURSES: Course[] = [
  {
    id: "a1", code: "A.1", section: "A",
    title: "Foundations of AI for Climate",
    sub: "A practitioner's primer to the AI stack used in climate work.",
    cat: "AI Foundations", dur: "~4 weeks · 28 h", lvl: "Beginner", cert: true, price: "Free",
    inst: "Asha Kimani", instRole: "GIS / MRV · Kenya",
    visual: "grid", glassIcon: "sparkle", progress: 0, lessons: 5, mods: 1, status: "in-production",
    syllabus: [
      { id: "A.1.1", t: "What AI actually is — and isn't", dur: "5 h", state: "content" },
      { id: "A.1.2", t: "Machine learning vs. statistics vs. heuristics", dur: "6 h", state: "content" },
      { id: "A.1.3", t: "Large language models for climate", dur: "6 h", state: "content" },
      { id: "A.1.4", t: "Data ethics & climate justice in AI", dur: "5 h", state: "content" },
      { id: "A.1.5", t: "Choosing an AI tool for your project", dur: "6 h", state: "content" },
    ],
  },
  {
    id: "a2", code: "A.2", section: "A",
    title: "AI for Carbon Monitoring & MRV",
    sub: "Remote sensing, satellite imagery, and ML-driven measurement.",
    cat: "MRV", dur: "~5 weeks · 35 h", lvl: "Intermediate", cert: true, price: "$49",
    inst: "Asha Kimani", instRole: "GIS / MRV · Kenya",
    visual: "map", glassIcon: "globe", progress: 0, lessons: 6, mods: 1, status: "in-production",
    syllabus: [
      { id: "A.2.1", t: "Satellite imagery basics for climate", dur: "6 h", state: "content" },
      { id: "A.2.2", t: "Computer vision for land-cover detection", dur: "6 h", state: "content" },
      { id: "A.2.3", t: "Forest carbon estimation with ML", dur: "6 h", state: "content" },
      { id: "A.2.4", t: "Soil carbon — sensors + models", dur: "6 h", state: "content" },
      { id: "A.2.5", t: "Continuous MRV pipelines", dur: "6 h", state: "content" },
      { id: "A.2.6", t: "Auditing AI-generated MRV data", dur: "5 h", state: "content" },
    ],
  },
  {
    id: "a3", code: "A.3", section: "A",
    title: "AI for Climate Modelling & Adaptation",
    sub: "From digital twins to early-warning systems.",
    cat: "Adaptation", dur: "~4 weeks · 28 h", lvl: "Advanced", cert: true, price: "$49",
    inst: "Dr. Lerato Sithole", instRole: "Climate Scientist · S. Africa",
    visual: "wave", glassIcon: "chart", progress: 0, lessons: 5, mods: 1, status: "planned",
    syllabus: [
      { id: "A.3.1", t: "Climate model ensembles, explained", dur: "5 h", state: "planned" },
      { id: "A.3.2", t: "ML downscaling for African regions", dur: "6 h", state: "planned" },
      { id: "A.3.3", t: "Drought, flood & wildfire forecasting", dur: "6 h", state: "planned" },
      { id: "A.3.4", t: "Digital twins for cities", dur: "6 h", state: "planned" },
      { id: "A.3.5", t: "Designing AI-driven early-warning systems", dur: "5 h", state: "planned" },
    ],
  },
  {
    id: "a4", code: "A.4", section: "A",
    title: "Generative AI for Sustainability Teams",
    sub: "Practical LLM workflows for ESG, reporting and project ops.",
    cat: "AI Applications", dur: "~3 weeks · 21 h", lvl: "Beginner", cert: true, price: "Free",
    inst: "Tunde Aiyetan", instRole: "Sustainability Director",
    visual: "stack", glassIcon: "wand", progress: 0, lessons: 4, mods: 1, status: "planned",
    syllabus: [
      { id: "A.4.1", t: "Prompting for sustainability work", dur: "5 h", state: "planned" },
      { id: "A.4.2", t: "Drafting ESG and TCFD reports with AI", dur: "6 h", state: "planned" },
      { id: "A.4.3", t: "RAG over your methodology library", dur: "5 h", state: "planned" },
      { id: "A.4.4", t: "Governance, hallucinations & disclosure", dur: "5 h", state: "planned" },
    ],
  },
  {
    id: "m1", code: "I", section: "B",
    title: "Introduction to Carbon Markets",
    sub: "The foundation. How the world prices climate.",
    cat: "Foundations", dur: "~6 weeks · 42 h", lvl: "Beginner", cert: true, price: "Free",
    inst: "Dr. Amaka Eze", instRole: "UNFCCC Observer",
    visual: "orbit", glassIcon: "globe", progress: 22, lessons: 6, mods: 1, status: "live",
    syllabus: [
      { id: "1.1", t: "The Science of Climate Change", dur: "7 h", state: "qa" },
      { id: "1.2", t: "Key Terminologies in Climate Science & Carbon Markets", dur: "7 h", state: "qa" },
      { id: "1.3", t: "Carbon Markets Ecosystem", dur: "7 h", state: "content" },
      { id: "1.4", t: "Carbon Offsets Project Types", dur: "7 h", state: "content" },
      { id: "1.5", t: "Carbon Credit Pricing", dur: "7 h", state: "content" },
      { id: "1.6", t: "Innovations in Carbon Markets", dur: "7 h", state: "content" },
    ],
  },
  {
    id: "m2", code: "II", section: "B",
    title: "Organizational Level GHG Accounting",
    sub: "ISO 14064-1 — the full scope of emissions you own.",
    cat: "Corporate Reporting", dur: "~5 weeks · 35 h", lvl: "Intermediate", cert: true, price: "Free",
    inst: "Tunde Aiyetan", instRole: "Sustainability Director",
    visual: "stack", glassIcon: "users", progress: 0, lessons: 5, mods: 1, status: "live",
    syllabus: [
      { id: "2.1", t: "Foundational Concepts (ISO 14064-1:2018)", dur: "7 h", state: "content" },
      { id: "2.2", t: "Scope 1 Emissions", dur: "7 h", state: "content" },
      { id: "2.3", t: "Scope 2 Emissions", dur: "7 h", state: "content" },
      { id: "2.4", t: "Scope 3 Emissions", dur: "7 h", state: "content" },
      { id: "2.5", t: "Carbon Neutrality (ISO 14068-1:2023)", dur: "7 h", state: "content" },
    ],
  },
  {
    id: "m3", code: "III", section: "B",
    title: "Project Level GHG Accounting",
    sub: "ISO 14064-2 — building a real, verifiable carbon project.",
    cat: "Project Development", dur: "~6 weeks · 42 h", lvl: "Intermediate", cert: true, price: "$49",
    inst: "Kwame Mensah", instRole: "Project Developer · Ghana",
    visual: "leaf", glassIcon: "leaf", progress: 0, lessons: 6, mods: 1, status: "in-production",
    syllabus: [
      { id: "3.1", t: "Foundational Concepts (ISO 14064-2:2018)", dur: "7 h", state: "content" },
      { id: "3.2", t: "Carbon Methodology", dur: "7 h", state: "content" },
      { id: "3.3", t: "Carbon Project Cycle", dur: "7 h", state: "content" },
      { id: "3.4", t: "Additionality of Carbon Projects", dur: "7 h", state: "content" },
      { id: "3.5", t: "Quantifying GHG Reductions", dur: "7 h", state: "content" },
      { id: "3.6", t: "Monitoring, Reporting & Verification Systems", dur: "7 h", state: "content" },
    ],
  },
  {
    id: "m4", code: "IV", section: "B",
    title: "Carbon Finance",
    sub: "From the climate-finance stack to a signed offtake.",
    cat: "Finance", dur: "~5 weeks · 35 h", lvl: "Advanced", cert: true, price: "$49",
    inst: "Naledi Mokoena", instRole: "Climate Finance Lead",
    visual: "map", glassIcon: "chart", progress: 0, lessons: 5, mods: 1, status: "recording",
    syllabus: [
      { id: "4.1", t: "Global Landscape of Climate Finance", dur: "7 h", state: "content" },
      { id: "4.2", t: "Types of Carbon Finance", dur: "7 h", state: "content" },
      { id: "4.3", t: "Investment Structures", dur: "7 h", state: "content" },
      { id: "4.4", t: "Benefit-Sharing Mechanisms", dur: "7 h", state: "content" },
      { id: "4.5", t: "Carbon Pricing", dur: "7 h", state: "content" },
    ],
  },
  {
    id: "m5", code: "V", section: "B",
    title: "Article 6 of the Paris Agreement",
    sub: "The global rulebook — from Kyoto to corresponding adjustments.",
    cat: "Policy", dur: "~6 weeks · 42 h", lvl: "Advanced", cert: true, price: "$49",
    inst: "Dr. Lerato Sithole", instRole: "Climate Policy · S. Africa",
    visual: "wave", glassIcon: "flag", progress: 0, lessons: 6, mods: 1, status: "live",
    syllabus: [
      { id: "5.1", t: "Nationally Determined Contributions (NDCs)", dur: "7 h", state: "content" },
      { id: "5.2", t: "Kyoto Protocol", dur: "7 h", state: "content" },
      { id: "5.3", t: "Article 6.2", dur: "7 h", state: "content" },
      { id: "5.4", t: "Article 6.4", dur: "7 h", state: "content" },
      { id: "5.5", t: "Article 6.8", dur: "7 h", state: "content" },
      { id: "5.6", t: "Global Stocktake", dur: "7 h", state: "content" },
    ],
  },
];
