import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/avatar";
import { Footer } from "@/components/footer";
import { ForumAcceptButton } from "@/components/forum-accept-button";
import { ForumReplyForm } from "@/components/forum-reply-form";
import { Icon } from "@/components/icon";
import { TopNav } from "@/components/top-nav";
import {
  type ForumReply,
  type ForumThreadDetail,
  categoryLabel,
  getReplies,
  getThread,
  listThreads,
} from "@/lib/data/forum";
import { createClient } from "@/lib/supabase/server";
import { timeAgo } from "@/lib/time";

type Params = { id: string };

export async function generateMetadata(props: { params: Promise<Params> }) {
  const { id } = await props.params;
  const t = await getThread(id);
  if (!t) return { title: "Thread — Verst Carbon Academy" };
  return {
    title: `${t.title} — Verst Forum`,
    description: t.body.slice(0, 160),
  };
}

export default async function ThreadDetailPage(props: { params: Promise<Params> }) {
  const { id } = await props.params;
  const [thread, replies, similar] = await Promise.all([
    getThread(id),
    getReplies(id),
    listThreads({ limit: 6 }),
  ]);
  if (!thread) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const signedIn = !!user;
  const isThreadAuthor = user?.id === thread.author.user_id;

  // Fire-and-forget view increment (don't await — keep page response snappy)
  void supabase.rpc("increment_thread_view_count", { p_thread_id: thread.id });

  const accepted = replies.find((r) => r.is_accepted);
  const others = replies.filter((r) => !r.is_accepted);
  const otherThreads = similar.filter((t) => t.id !== thread.id).slice(0, 4);

  return (
    <>
      <TopNav active="forum" />

      {/* breadcrumb */}
      <div className="container" style={{ padding: "18px 32px 0" }}>
        <div
          className="mono"
          style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: ".1em", fontWeight: 600 }}
        >
          <Link href="/forum" style={{ color: "var(--ink-3)", textDecoration: "none" }}>
            FORUM
          </Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <Link
            href={`/forum?cat=${thread.category}`}
            style={{ color: "var(--ink-3)", textDecoration: "none", textTransform: "uppercase" }}
          >
            {categoryLabel(thread.category)}
          </Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <span style={{ color: "var(--ink)", fontWeight: 700 }}>
            THREAD № {thread.id.slice(0, 8).toUpperCase()}
          </span>
        </div>
      </div>

      <div
        className="container"
        style={{
          padding: "24px 32px 80px",
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: 48,
        }}
      >
        {/* main thread */}
        <div>
          <QuestionCard thread={thread} />

          {accepted && (
            <>
              <div
                style={{
                  marginTop: 32,
                  marginBottom: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "var(--forest)",
                    color: "var(--moss)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name="check" size={16} stroke={2.5} />
                </div>
                <span style={{ fontWeight: 700, fontSize: 22, color: "var(--forest)" }}>
                  Accepted answer{" "}
                  <em style={{ color: "var(--ink-3)", fontSize: 16 }}>
                    · by {accepted.author.full_name ?? "member"}
                  </em>
                </span>
              </div>
              <ReplyCard
                reply={accepted}
                threadId={thread.id}
                isThreadAuthor={isThreadAuthor}
                isAccepted
              />
            </>
          )}

          {others.length > 0 && (
            <div
              style={{
                marginTop: 36,
                marginBottom: 18,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 22 }}>
                {others.length} {others.length === 1 ? "reply" : "replies"}
              </span>
            </div>
          )}

          {others.map((r) => (
            <ReplyCard
              key={r.id}
              reply={r}
              threadId={thread.id}
              isThreadAuthor={isThreadAuthor}
              isAccepted={false}
            />
          ))}

          <ForumReplyForm threadId={thread.id} signedIn={signedIn} />
        </div>

        {/* right rail */}
        <aside style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div
            style={{
              padding: 18,
              border: "1px solid var(--line)",
              borderRadius: 8,
              background: "var(--card)",
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: 10,
                letterSpacing: ".14em",
                fontWeight: 700,
                color: "var(--ink-3)",
                paddingBottom: 10,
                borderBottom: "1px solid var(--ink)",
                marginBottom: 12,
              }}
            >
              THREAD STATUS
            </div>
            <div
              style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, fontSize: 12.5 }}
            >
              <span style={{ color: "var(--ink-3)" }}>Status</span>
              <span
                style={{
                  color: thread.status === "answered" ? "var(--forest)" : "var(--ink-2)",
                  fontWeight: 600,
                }}
              >
                {thread.status === "answered"
                  ? "✓ Answered"
                  : thread.status === "closed"
                  ? "Closed"
                  : "Open"}
              </span>
              <span style={{ color: "var(--ink-3)" }}>Replies</span>
              <span className="mono">{thread.reply_count}</span>
              <span style={{ color: "var(--ink-3)" }}>Views</span>
              <span className="mono">{thread.view_count.toLocaleString()}</span>
              <span style={{ color: "var(--ink-3)" }}>Posted</span>
              <span className="mono">{timeAgo(thread.created_at)}</span>
            </div>
          </div>

          {otherThreads.length > 0 && (
            <div>
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  letterSpacing: ".14em",
                  fontWeight: 700,
                  color: "var(--ink-3)",
                  paddingBottom: 12,
                  borderBottom: "1px solid var(--ink)",
                  marginBottom: 14,
                }}
              >
                SIMILAR THREADS
              </div>
              {otherThreads.map((x) => (
                <Link
                  key={x.id}
                  href={`/forum/${x.id}`}
                  style={{
                    display: "block",
                    padding: "10px 0",
                    borderBottom: "1px dashed var(--line)",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <div style={{ fontSize: 13, lineHeight: 1.3, marginBottom: 4, fontWeight: 500 }}>
                    {x.title}
                  </div>
                  <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>
                    {x.reply_count} replies · {timeAgo(x.updated_at)}
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div
            style={{
              padding: 20,
              borderRadius: 8,
              background: "var(--forest-2)",
              color: "#fff",
            }}
          >
            <Icon name="sparkle" size={14} style={{ color: "var(--moss)" }} />
            <h4
              style={{
                fontWeight: 700,
                fontSize: 20,
                marginTop: 8,
                marginBottom: 8,
                color: "#fff",
              }}
            >
              Need a quicker answer?
            </h4>
            <p style={{ fontSize: 12, color: "#C9CCC4", lineHeight: 1.5, marginBottom: 14 }}>
              The Verst tutor has read every methodology document. Open any lesson to ask it.
            </p>
            <Link
              href="/program"
              className="btn btn-accent btn-sm"
              style={{ textDecoration: "none" }}
            >
              Open the program
            </Link>
          </div>
        </aside>
      </div>

      <Footer />
    </>
  );
}

// ────────────────── components ──────────────────

function ExpertBadge({ role }: { role: ForumThreadDetail["author"]["role"] }) {
  if (role !== "tutor" && role !== "admin") return null;
  return (
    <span
      className="mono"
      style={{
        fontSize: 9,
        letterSpacing: ".1em",
        padding: "2px 7px",
        background: "var(--forest)",
        color: "#fff",
        borderRadius: 3,
        fontWeight: 700,
      }}
    >
      {role === "admin" ? "ADMIN" : "VERIFIED EXPERT"}
    </span>
  );
}

function QuestionCard({ thread }: { thread: ForumThreadDetail }) {
  return (
    <article
      style={{
        padding: "32px 0",
        borderBottom: "2px solid var(--ink)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginBottom: 12,
          flexWrap: "wrap",
        }}
      >
        <span
          className="mono"
          style={{
            fontSize: 10,
            color: "var(--ink-3)",
            letterSpacing: ".1em",
            textTransform: "uppercase",
          }}
        >
          {categoryLabel(thread.category)}
        </span>
        {thread.status === "answered" && (
          <span
            className="mono"
            style={{
              fontSize: 9,
              letterSpacing: ".1em",
              padding: "2px 7px",
              background: "var(--forest)",
              color: "#fff",
              borderRadius: 3,
              fontWeight: 700,
            }}
          >
            ✓ ANSWERED
          </span>
        )}
        <span
          className="mono"
          style={{ fontSize: 11, color: "var(--ink-3)", marginLeft: "auto" }}
        >
          POSTED {timeAgo(thread.created_at)}
        </span>
      </div>

      <h1
        className="display"
        style={{
          fontSize: "clamp(28px, 4vw, 44px)",
          lineHeight: 1.1,
          letterSpacing: "-.02em",
          marginBottom: 24,
        }}
      >
        {thread.title}
      </h1>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 24 }}>
        <Avatar name={thread.author.full_name ?? "Member"} size={36} />
        <div>
          <div
            style={{ fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}
          >
            {thread.author.full_name ?? "Member"} <ExpertBadge role={thread.author.role} />
          </div>
          <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>
            {thread.author.role.toUpperCase()}
          </div>
        </div>
      </div>

      <div
        style={{
          fontSize: 15,
          color: "var(--ink-2)",
          lineHeight: 1.65,
          whiteSpace: "pre-wrap",
        }}
      >
        {thread.body}
      </div>
    </article>
  );
}

function ReplyCard({
  reply,
  threadId,
  isThreadAuthor,
  isAccepted,
}: {
  reply: ForumReply;
  threadId: string;
  isThreadAuthor: boolean;
  isAccepted: boolean;
}) {
  const baseStyle = isAccepted
    ? {
        padding: 24,
        background: "var(--card-2)",
        border: "1px solid var(--forest)",
        borderLeft: "4px solid var(--forest)",
        borderRadius: 8,
      }
    : {
        padding: "20px 0",
        borderBottom: "1px solid var(--line)",
      };

  return (
    <article style={baseStyle}>
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          marginBottom: 14,
          flexWrap: "wrap",
        }}
      >
        <Avatar name={reply.author.full_name ?? "Member"} size={32} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{ fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}
          >
            {reply.author.full_name ?? "Member"} <ExpertBadge role={reply.author.role} />
          </div>
          <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>
            {reply.author.role.toUpperCase()} · {timeAgo(reply.created_at)}
          </div>
        </div>
        {isThreadAuthor && (
          <ForumAcceptButton
            threadId={threadId}
            replyId={reply.id}
            alreadyAccepted={isAccepted}
          />
        )}
      </div>
      <div
        style={{
          fontSize: 14.5,
          color: "var(--ink-2)",
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
        }}
      >
        {reply.body}
      </div>
    </article>
  );
}
