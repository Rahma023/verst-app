import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import { VerstCertificate } from "@/lib/pdf/certificate";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type CertJoin = {
  id: string;
  user_id: string;
  module_id: string | null;
  verify_code: string;
  issued_at: string;
  modules: { code: string; title: string } | null;
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("certificates")
    .select(
      "id, user_id, module_id, verify_code, issued_at, modules ( code, title )",
    )
    .eq("id", id)
    .maybeSingle();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const cert = data as unknown as CertJoin | null;
  if (!cert) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (cert.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("user_id", user.id)
    .maybeSingle<{ full_name: string | null }>();
  const fullName = profile?.full_name ?? user.email ?? "Verst Learner";

  const moduleCode = cert.modules?.code ?? "—";
  const moduleTitle = cert.modules?.title ?? "Verst Carbon Academy";

  const pdfBuffer = await renderToBuffer(
    <VerstCertificate
      data={{
        fullName,
        moduleCode,
        moduleTitle,
        issuedAt: cert.issued_at,
        verifyCode: cert.verify_code,
      }}
    />,
  );

  const safeName = fullName.replace(/[^A-Za-z0-9-_]+/g, "-").replace(/-+/g, "-");
  const filename = `verst-certificate-${moduleCode}-${safeName}.pdf`;

  return new Response(pdfBuffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
