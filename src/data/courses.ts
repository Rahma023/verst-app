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
  syllabus?: Lesson[];
};
