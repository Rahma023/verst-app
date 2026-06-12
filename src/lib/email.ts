import "server-only";

import { Resend } from "resend";

const resendKey = process.env.RESEND_API_KEY;
const FROM = process.env.EMAIL_FROM ?? "Verst Carbon Academy <onboarding@resend.dev>";
const REPLY_TO = process.env.EMAIL_REPLY_TO ?? "rfaiz@verst.earth";

let _resend: Resend | null = null;
function client(): Resend {
  if (!_resend) {
    if (!resendKey) throw new Error("RESEND_API_KEY is missing");
    _resend = new Resend(resendKey);
  }
  return _resend;
}

const SITE = "https://verst-app.vercel.app";

const BRAND = {
  forest: "#008037",
  forest2: "#003F1B",
  moss: "#589630",
  ink: "#0E1612",
  ink2: "#2A332D",
  ink3: "#5A6259",
  paper: "#FFFFFF",
  paper2: "#F7F7F4",
  line: "#E5E3DA",
};

type Attachment = {
  filename: string;
  content: Buffer | string;
};

type SendOpts = {
  to: string | string[];
  subject: string;
  /** Inner content HTML — gets wrapped in the branded layout. */
  body: string;
  /** Optional plain-text version (good for spam scoring). */
  text?: string;
  attachments?: Attachment[];
};

export async function sendEmail(opts: SendOpts) {
  if (!resendKey) {
    // Soft-fail in environments without the key (dev without env) so app stays usable.
    console.warn(`[email] RESEND_API_KEY missing — skipping email to ${opts.to}: ${opts.subject}`);
    return { skipped: true as const };
  }
  const html = wrap(opts.body);
  return client().emails.send({
    from: FROM,
    to: opts.to,
    replyTo: REPLY_TO,
    subject: opts.subject,
    html,
    text: opts.text,
    attachments: opts.attachments?.map((a) => ({
      filename: a.filename,
      content: typeof a.content === "string" ? a.content : a.content.toString("base64"),
    })),
  });
}

// ────────────────────────────────────────────────────────────
// Branded base layout — inline styles only (email clients strip <style>)
// ────────────────────────────────────────────────────────────
function wrap(inner: string): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Verst Carbon Academy</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.paper2};font-family:'Raleway','Helvetica Neue',Arial,sans-serif;color:${BRAND.ink};line-height:1.55;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${BRAND.paper2};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0"
               style="max-width:600px;width:100%;background:${BRAND.paper};border:1px solid ${BRAND.line};border-radius:14px;overflow:hidden;">
          <!-- header bar -->
          <tr>
            <td style="background:${BRAND.forest2};padding:24px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <div style="font-size:11px;letter-spacing:.18em;color:${BRAND.moss};font-weight:700;text-transform:uppercase;">
                      · Verst Carbon Academy
                    </div>
                    <div style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:-.015em;margin-top:6px;">
                      Climate-Tech Learning
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- body -->
          <tr>
            <td style="padding:32px;">
              ${inner}
            </td>
          </tr>

          <!-- footer -->
          <tr>
            <td style="border-top:1px solid ${BRAND.line};padding:24px 32px;background:${BRAND.paper2};">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="font-size:12px;color:${BRAND.ink3};line-height:1.6;">
                    Verst Carbon Academy is built for African project developers, corporate sustainability teams, and the next generation of climate professionals.
                    <br><br>
                    <a href="${SITE}" style="color:${BRAND.forest};text-decoration:none;font-weight:600;">verst-app.vercel.app</a>
                    &nbsp;·&nbsp;
                    <a href="${SITE}/program" style="color:${BRAND.forest};text-decoration:none;font-weight:600;">The program</a>
                    &nbsp;·&nbsp;
                    <a href="${SITE}/forum" style="color:${BRAND.forest};text-decoration:none;font-weight:600;">Forum</a>
                  </td>
                </tr>
                <tr>
                  <td style="font-size:11px;color:${BRAND.ink3};opacity:.7;padding-top:18px;">
                    You're receiving this because of activity on your Verst Academy account.
                    Reply to this email to reach a human.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <div style="font-size:11px;color:${BRAND.ink3};opacity:.6;padding-top:18px;font-family:'Raleway','Helvetica Neue',Arial,sans-serif;">
          © Verst Carbon · Nairobi, Kenya
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ────────────────────────────────────────────────────────────
// Reusable inner-content building blocks
// ────────────────────────────────────────────────────────────
export function emailHeading(text: string): string {
  return `<h1 style="font-size:26px;font-weight:800;letter-spacing:-.015em;color:${BRAND.ink};margin:0 0 14px 0;line-height:1.15;">${escapeHtml(text)}</h1>`;
}

export function emailParagraph(text: string): string {
  return `<p style="font-size:15px;color:${BRAND.ink2};line-height:1.6;margin:0 0 14px 0;">${text}</p>`;
}

export function emailButton(href: string, label: string): string {
  return `
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:22px 0;">
    <tr>
      <td>
        <a href="${href}"
           style="display:inline-block;background:${BRAND.forest};color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;
                  padding:14px 24px;border-radius:999px;letter-spacing:.01em;">
          ${escapeHtml(label)} →
        </a>
      </td>
    </tr>
  </table>`;
}

export function emailMetaStrip(rows: Array<[string, string]>): string {
  const items = rows
    .map(
      ([k, v]) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px dashed ${BRAND.line};font-size:13px;color:${BRAND.ink3};">${escapeHtml(k)}</td>
          <td style="padding:10px 0;border-bottom:1px dashed ${BRAND.line};font-size:13px;color:${BRAND.ink};font-weight:700;text-align:right;">${escapeHtml(v)}</td>
        </tr>`,
    )
    .join("");
  return `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
         style="border:1px solid ${BRAND.line};border-radius:8px;margin:18px 0;padding:6px 18px;background:${BRAND.paper2};">
    ${items}
  </table>`;
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
