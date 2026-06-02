"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Icon } from "@/components/icon";
import { submitQuizAttempt, type QuizResult } from "@/app/quiz/[moduleId]/actions";
import type { QuizQuestion, QuizModule } from "@/lib/data/quiz";

type Props = {
  module: QuizModule;
  questions: QuizQuestion[];
};

export function QuizPlayer({ module: mod, questions }: Props) {
  const [step, setStep] = useState(0); // index of current question (or = questions.length to show review screen)
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const total = questions.length;
  const onReview = step === total && !result;
  const onResult = !!result;
  const current = questions[step];

  function selectAnswer(qid: string, idx: number) {
    setAnswers((a) => ({ ...a, [qid]: idx }));
  }

  function next() {
    if (step < total) setStep(step + 1);
  }
  function prev() {
    if (step > 0) setStep(step - 1);
  }

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      const out = await submitQuizAttempt(mod.id, answers);
      if (!out.ok) {
        setError(out.error);
        return;
      }
      setResult(out);
    });
  }

  function reset() {
    setResult(null);
    setAnswers({});
    setStep(0);
    setError(null);
  }

  // -------- RESULT SCREEN --------
  if (onResult && result) {
    return (
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px 80px" }}>
        <section
          style={{
            padding: 36,
            borderRadius: 14,
            background: result.passed ? "var(--forest-2)" : "var(--ink)",
            color: "#fff",
            marginBottom: 28,
            textAlign: "center",
          }}
        >
          <div
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: ".18em",
              fontWeight: 700,
              color: result.passed ? "var(--moss)" : "#9aa19a",
              marginBottom: 12,
            }}
          >
            QUIZ RESULT · MODULE {mod.code}
          </div>
          <div
            style={{ fontSize: 72, fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1 }}
          >
            {result.scorePercent}%
          </div>
          <div style={{ fontSize: 14, color: "#D9DCD3", marginTop: 8 }}>
            {result.correctCount} of {result.totalQuestions} correct
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, marginTop: 18 }}>
            {result.passed ? "You passed 🎉" : "Not quite — try again"}
          </div>
          {result.certificateIssued && (
            <div
              style={{
                marginTop: 16,
                display: "inline-flex",
                gap: 8,
                alignItems: "center",
                padding: "8px 14px",
                background: "rgba(255,255,255,.1)",
                borderRadius: 99,
                fontSize: 13,
              }}
            >
              <Icon name="trophy" size={14} style={{ color: "var(--moss)" }} />
              Certificate issued to your dashboard
            </div>
          )}
        </section>

        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>Question review</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {result.graded.map((g, i) => (
            <article
              key={g.question_id}
              style={{
                padding: 18,
                border: "1px solid var(--line)",
                background: "var(--card)",
                borderRadius: 10,
                borderLeft: `4px solid ${
                  g.is_correct ? "var(--forest)" : "var(--bad)"
                }`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: 8,
                }}
              >
                <span
                  className="mono"
                  style={{ fontSize: 10, color: "var(--ink-3)", letterSpacing: ".1em", fontWeight: 700 }}
                >
                  Q{i + 1}
                </span>
                <span
                  className="mono"
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: ".12em",
                    color: g.is_correct ? "var(--forest)" : "var(--bad)",
                  }}
                >
                  {g.is_correct ? "CORRECT" : "INCORRECT"}
                </span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, lineHeight: 1.4 }}>
                {g.question_text}
              </div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                {g.options.map((opt, optIdx) => {
                  const isCorrect = optIdx === g.correct_index;
                  const isSelected = optIdx === g.selected_index;
                  const bg = isCorrect
                    ? "rgba(0,128,55,.08)"
                    : isSelected
                      ? "rgba(165,58,30,.08)"
                      : "transparent";
                  const color = isCorrect
                    ? "var(--forest)"
                    : isSelected
                      ? "var(--bad)"
                      : "var(--ink-2)";
                  return (
                    <li
                      key={optIdx}
                      style={{
                        padding: "8px 12px",
                        background: bg,
                        borderRadius: 6,
                        fontSize: 13,
                        color,
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      {isCorrect ? <Icon name="check" size={12} /> : isSelected ? <Icon name="x" size={12} /> : <span style={{ width: 12 }} />}
                      {opt}
                    </li>
                  );
                })}
              </ul>
            </article>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 28,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button type="button" className="btn btn-pri btn-lg" onClick={reset}>
            Retake quiz →
          </button>
          <Link href="/dashboard" className="btn btn-ghost btn-lg" style={{ textDecoration: "none" }}>
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  // -------- REVIEW SCREEN (before submit) --------
  if (onReview) {
    const answeredCount = Object.keys(answers).length;
    return (
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px 80px" }}>
        <h2
          className="display"
          style={{ fontSize: "clamp(24px, 3vw, 32px)", marginBottom: 12 }}
        >
          Ready to <em>submit</em>?
        </h2>
        <p style={{ fontSize: 14, color: "var(--ink-2)", marginBottom: 24, lineHeight: 1.55 }}>
          You answered {answeredCount} of {total} questions. You need {60}% (3 of 5) to pass.
          Once you submit, we'll grade and show you what you got right.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {questions.map((q, i) => {
            const answered = answers[q.id] !== undefined;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setStep(i)}
                style={{
                  textAlign: "left",
                  padding: "12px 14px",
                  border: "1px solid var(--line)",
                  borderRadius: 8,
                  background: "var(--card)",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  gap: 14,
                  alignItems: "center",
                }}
              >
                <span
                  className="mono"
                  style={{ fontSize: 11, color: "var(--ink-3)", fontWeight: 700, letterSpacing: ".1em" }}
                >
                  Q{i + 1}
                </span>
                <span style={{ fontSize: 13.5, color: "var(--ink)" }}>
                  {q.question_text.length > 80
                    ? q.question_text.slice(0, 80) + "…"
                    : q.question_text}
                </span>
                <span
                  className="mono"
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: ".1em",
                    color: answered ? "var(--forest)" : "var(--ink-4)",
                  }}
                >
                  {answered ? "ANSWERED" : "SKIPPED"}
                </span>
              </button>
            );
          })}
        </div>

        {error && (
          <div
            style={{
              fontSize: 13,
              color: "var(--bad)",
              background: "rgba(165,58,30,.08)",
              border: "1px solid rgba(165,58,30,.25)",
              borderRadius: 8,
              padding: "10px 14px",
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: 12, justifyContent: "space-between" }}>
          <button type="button" className="btn btn-ghost btn-lg" onClick={() => setStep(total - 1)}>
            ← Back to last question
          </button>
          <button
            type="button"
            className="btn btn-pri btn-lg"
            onClick={handleSubmit}
            disabled={pending}
          >
            {pending ? "Grading…" : "Submit quiz →"}
          </button>
        </div>
      </div>
    );
  }

  // -------- QUESTION SCREEN --------
  if (!current) return null;
  const selected = answers[current.id];

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px 80px" }}>
      {/* progress bar of dots */}
      <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
        {questions.map((q, i) => {
          const answered = answers[q.id] !== undefined;
          const active = i === step;
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => setStep(i)}
              aria-label={`Go to question ${i + 1}`}
              style={{
                flex: 1,
                height: 6,
                borderRadius: 99,
                border: "none",
                background: active
                  ? "var(--forest)"
                  : answered
                    ? "var(--moss)"
                    : "var(--line)",
                cursor: "pointer",
                padding: 0,
              }}
            />
          );
        })}
      </div>

      <div
        className="mono"
        style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: ".14em", fontWeight: 700, marginBottom: 8 }}
      >
        QUESTION {step + 1} OF {total}
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.35, marginBottom: 22, letterSpacing: "-.005em" }}>
        {current.question_text}
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {current.options.map((opt, i) => {
          const isPicked = selected === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => selectAnswer(current.id, i)}
              style={{
                textAlign: "left",
                padding: "14px 16px",
                borderRadius: 10,
                border: `1px solid ${isPicked ? "var(--forest)" : "var(--line)"}`,
                background: isPicked ? "rgba(0,128,55,.06)" : "var(--card)",
                color: "var(--ink)",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 14,
                display: "flex",
                gap: 12,
                alignItems: "center",
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 99,
                  border: `1.5px solid ${isPicked ? "var(--forest)" : "var(--line-3)"}`,
                  background: isPicked ? "var(--forest)" : "transparent",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {isPicked && (
                  <span
                    style={{ width: 8, height: 8, background: "#fff", borderRadius: 99 }}
                  />
                )}
              </span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "space-between" }}>
        <button
          type="button"
          className="btn btn-ghost btn-lg"
          onClick={prev}
          disabled={step === 0}
          style={{ opacity: step === 0 ? 0.5 : 1 }}
        >
          ← Previous
        </button>
        <button
          type="button"
          className="btn btn-pri btn-lg"
          onClick={next}
          disabled={selected === undefined}
        >
          {step === total - 1 ? "Review & submit" : "Next"} →
        </button>
      </div>
    </div>
  );
}
