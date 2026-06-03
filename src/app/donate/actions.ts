"use server";

import { createClient } from "@/lib/supabase/server";

export type DonateInput = {
  amount: number;
  isMonthly: boolean;
  paymentMethod: "mpesa" | "card" | "paypal";
  email: string;
  name?: string;
  message?: string;
};

export type DonateResult =
  | { ok: true; donationId: string }
  | { ok: false; error: string };

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function recordDonationIntent(input: DonateInput): Promise<DonateResult> {
  const amount = Number(input.amount);
  if (!Number.isFinite(amount) || amount <= 0 || amount > 100_000) {
    return { ok: false, error: "Pick an amount between $1 and $100,000." };
  }
  const email = String(input.email ?? "").trim().toLowerCase();
  if (!EMAIL_RX.test(email)) {
    return { ok: false, error: "Enter a valid email so we can send your receipt." };
  }
  if (!["mpesa", "card", "paypal"].includes(input.paymentMethod)) {
    return { ok: false, error: "Pick a payment method." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("donations")
    .insert({
      donor_user_id: user?.id ?? null,
      donor_email: email,
      donor_name: input.name?.trim() || null,
      amount_usd: amount,
      is_monthly: !!input.isMonthly,
      payment_method: input.paymentMethod,
      message: input.message?.trim() || null,
      // status defaults to 'pending_setup' until Stripe/Paystack are wired
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };
  return { ok: true, donationId: data.id };
}
