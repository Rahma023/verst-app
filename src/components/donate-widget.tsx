"use client";

import { useEffect, useState, useTransition } from "react";
import { recordDonationIntent } from "@/app/donate/actions";
import { Icon } from "@/components/icon";

const PRESETS = [5, 10, 25, 50, 100];

type PayMethod = "mpesa" | "card" | "paypal";

const PAY_METHODS: { id: PayMethod; title: string; sub: string }[] = [
  { id: "mpesa", title: "M-Pesa", sub: "Mobile money · KE, TZ, UG" },
  { id: "card", title: "Card · via Stripe", sub: "Visa, Mastercard, Amex" },
  { id: "paypal", title: "PayPal", sub: "International" },
];

export function DonateWidget({
  defaultEmail = "",
  defaultName = "",
}: {
  defaultEmail?: string;
  defaultName?: string;
}) {
  const [amount, setAmount] = useState<number>(5);
  const [custom, setCustom] = useState<string>("");
  const [monthly, setMonthly] = useState<boolean>(true);
  const [pay, setPay] = useState<PayMethod>("mpesa");
  const [email, setEmail] = useState(defaultEmail);
  const [name, setName] = useState(defaultName);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setEmail(defaultEmail);
    setName(defaultName);
  }, [defaultEmail, defaultName]);

  const finalAmount = Number(custom || amount) || 0;
  const canSubmit = finalAmount > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  function submit() {
    setError(null);
    startTransition(async () => {
      const res = await recordDonationIntent({
        amount: finalAmount,
        isMonthly: monthly,
        paymentMethod: pay,
        email,
        name: name || undefined,
        message: message || undefined,
      });
      if (res.ok) setDone(true);
      else setError(res.error);
    });
  }

  if (done) {
    return (
      <div
        style={{
          padding: "32px 28px",
          textAlign: "center",
          background: "var(--card)",
          border: "1px solid var(--line)",
          borderRadius: 12,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "var(--forest)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 18,
          }}
        >
          <Icon name="check" size={28} stroke={2.5} style={{ color: "#fff" }} />
        </div>
        <h2 style={{ fontWeight: 800, fontSize: 26, letterSpacing: "-.01em", marginBottom: 8 }}>
          Thank you.
        </h2>
        <p style={{ fontSize: 14, color: "var(--ink-2)", marginBottom: 6, lineHeight: 1.55 }}>
          <strong>
            ${finalAmount.toLocaleString()}
            {monthly ? " / month" : ""}
          </strong>{" "}
          will fund a scholarship for a learner in Africa.
        </p>
        <p style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 18 }}>
          Payment via {PAY_METHODS.find((p) => p.id === pay)?.title} is being set up — we'll
          email <strong>{email}</strong> as soon as it's live.
        </p>
        <button
          className="btn btn-pri btn-lg"
          onClick={() => setDone(false)}
          style={{ width: "100%", justifyContent: "center" }}
        >
          Make another gift
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 24,
        background: "var(--card)",
        border: "1px solid var(--line)",
        borderRadius: 12,
      }}
    >
      <div className="eyebrow" style={{ marginBottom: 6 }}>
        · Donate · in seconds
      </div>
      <h3
        style={{
          fontWeight: 800,
          fontSize: 22,
          letterSpacing: "-.01em",
          lineHeight: 1.15,
          marginBottom: 18,
        }}
      >
        Support a learner.
      </h3>

      {/* amount input */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 6,
          padding: "16px 18px",
          background: "var(--paper-2)",
          border: "1px solid var(--line)",
          borderRadius: 10,
        }}
      >
        <span style={{ fontWeight: 800, fontSize: 32, color: "var(--ink-3)", lineHeight: 1 }}>$</span>
        <input
          type="text"
          inputMode="decimal"
          value={custom || amount}
          onChange={(e) => setCustom(e.target.value.replace(/[^0-9.]/g, ""))}
          placeholder="5"
          aria-label="Donation amount"
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontFamily: "inherit",
            fontSize: 32,
            fontWeight: 800,
            color: "var(--ink)",
            letterSpacing: "-.01em",
            width: "100%",
            lineHeight: 1,
          }}
        />
        {monthly && (
          <span style={{ color: "var(--ink-3)", fontSize: 13 }}>/ month</span>
        )}
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
        {PRESETS.map((p) => {
          const isOn = amount === p && !custom;
          return (
            <button
              key={p}
              type="button"
              onClick={() => {
                setAmount(p);
                setCustom("");
              }}
              style={{
                flex: 1,
                padding: "9px 0",
                background: isOn ? "var(--forest)" : "transparent",
                color: isOn ? "#fff" : "var(--ink-2)",
                border: "1px solid " + (isOn ? "var(--forest)" : "var(--line)"),
                borderRadius: 6,
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              ${p}
            </button>
          );
        })}
      </div>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: 14,
          gap: 10,
          fontSize: 13,
          color: "var(--ink-2)",
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          checked={monthly}
          onChange={(e) => setMonthly(e.target.checked)}
        />
        Make this a monthly gift · funds 2x more learners over a year
      </label>

      {/* payment method */}
      <div
        className="mono"
        style={{
          fontSize: 10,
          letterSpacing: ".14em",
          fontWeight: 700,
          color: "var(--ink-3)",
          marginTop: 22,
          marginBottom: 10,
        }}
      >
        PAYMENT METHOD
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {PAY_METHODS.map((m) => {
          const isOn = pay === m.id;
          return (
            <label
              key={m.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 14px",
                border: "1px solid " + (isOn ? "var(--forest)" : "var(--line)"),
                background: isOn ? "rgba(0,128,55,0.05)" : "#fff",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                name="pay"
                checked={isOn}
                onChange={() => setPay(m.id)}
                style={{ accentColor: "var(--forest)" }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>
                  {m.title}
                </div>
                <div
                  className="mono"
                  style={{
                    fontSize: 10.5,
                    color: "var(--ink-3)",
                    marginTop: 2,
                    fontWeight: 600,
                  }}
                >
                  {m.sub}
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {/* donor details */}
      <div
        className="mono"
        style={{
          fontSize: 10,
          letterSpacing: ".14em",
          fontWeight: 700,
          color: "var(--ink-3)",
          marginTop: 22,
          marginBottom: 10,
        }}
      >
        YOUR DETAILS
      </div>
      <input
        type="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input"
        style={{ width: "100%", fontSize: 14, marginBottom: 8 }}
      />
      <input
        type="text"
        placeholder="Your name (optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input"
        style={{ width: "100%", fontSize: 14, marginBottom: 8 }}
      />
      <textarea
        placeholder="A note for the scholarship recipient (optional)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="input"
        style={{ width: "100%", minHeight: 60, fontSize: 14, resize: "vertical" }}
      />

      {error && (
        <p style={{ marginTop: 10, color: "var(--clay)", fontSize: 13 }}>{error}</p>
      )}

      <button
        type="button"
        disabled={!canSubmit || pending}
        onClick={submit}
        className="btn btn-pri btn-lg"
        style={{ width: "100%", justifyContent: "center", marginTop: 16 }}
      >
        {pending ? (
          "Saving…"
        ) : (
          <>
            Donate ${finalAmount.toLocaleString()}
            {monthly ? " / month" : ""} <Icon name="arrow-r" size={15} />
          </>
        )}
      </button>
      <div
        className="mono"
        style={{
          fontSize: 9.5,
          color: "var(--ink-3)",
          letterSpacing: ".1em",
          textAlign: "center",
          marginTop: 12,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <Icon name="lock" size={10} /> SECURED · RECEIPT EMAILED
      </div>
      <p
        style={{
          marginTop: 14,
          fontSize: 11,
          color: "var(--ink-3)",
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        Payment processors are being connected. Your intent is recorded now and we'll email you
        the moment payment is live.
      </p>
    </div>
  );
}
