"use server";

import {
  emailButton,
  emailHeading,
  emailMetaStrip,
  emailParagraph,
  escapeHtml,
  sendEmail,
} from "@/lib/email";
import { createClient } from "@/lib/supabase/server";

const SITE = "https://verst-app.vercel.app";

type EnrolmentEmailResult = { ok: true } | { ok: false; error: string };

/**
 * Sends the "you're enrolled" confirmation email. Called from the enrol modal
 * after the enrolments row inserts successfully. Soft-fails — if email
 * sending breaks (network, Resend outage), the enrolment still stands.
 */
export async function sendEnrolmentEmail(moduleId: string): Promise<EnrolmentEmailResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) return { ok: false, error: "No signed-in user with an email." };

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", user.id)
      .maybeSingle<{ full_name: string | null }>();

    const { data: mod } = await supabase
      .from("modules")
      .select("code, title, lesson_count")
      .eq("id", moduleId)
      .maybeSingle<{ code: string; title: string; lesson_count: number }>();

    const firstName = (profile?.full_name ?? "").split(" ")[0] || "there";
    const moduleCode = mod?.code ?? "?";
    const moduleTitle = mod?.title ?? "your module";
    const lessonCount = mod?.lesson_count ?? 0;

    // Find the first lesson to deep-link
    const { data: firstLesson } = await supabase
      .from("lessons")
      .select("id, code")
      .eq("module_id", moduleId)
      .order("order_index", { ascending: true })
      .limit(1)
      .maybeSingle<{ id: string; code: string }>();

    const startHref = firstLesson
      ? `${SITE}/lesson/${firstLesson.id}`
      : `${SITE}/program/${moduleId}`;

    const body = [
      emailHeading(`You're in, ${escapeHtml(firstName)}.`),
      emailParagraph(
        `You're enrolled in <strong>Module ${escapeHtml(moduleCode)} — ${escapeHtml(moduleTitle)}</strong>. The full syllabus is on your dashboard and the first lesson is one click away.`,
      ),
      emailMetaStrip([
        ["Module", `${moduleCode} — ${moduleTitle}`],
        ["Lessons", `${lessonCount}`],
        ["Pass mark", "80%"],
        ["Certificate", "Yes — publicly verifiable"],
      ]),
      emailButton(startHref, "Start the first lesson"),
      emailParagraph(
        `Every lesson comes with slides, an audio narration, and an AI tutor sitting beside the player. If the AI can't answer something, your assigned tutor will — usually within 24 hours.`,
      ),
      emailParagraph(
        `Stuck or curious? Reply to this email and a human reads it.`,
      ),
    ].join("\n");

    await sendEmail({
      to: user.email,
      subject: `You're enrolled in Module ${moduleCode} — ${moduleTitle}`,
      body,
      text: `You're enrolled in Module ${moduleCode} — ${moduleTitle}. Start your first lesson: ${startHref}`,
    });

    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[sendEnrolmentEmail] failed:", msg);
    return { ok: false, error: msg };
  }
}
