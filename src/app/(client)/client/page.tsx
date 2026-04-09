import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  MessageSquare,
  CalendarDays,
  BarChart3,
} from "lucide-react";

// âââ Types ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

type ActivationStatus = "draft" | "active" | "paused" | "completed" | "cancelled";

interface Activation {
  id: string;
  title: string;
  description: string | null;
  status: ActivationStatus;
  target_responses: number | null;
  start_date: string | null;
  end_date: string | null;
  response_count: number;
  question_count: number;
}

// âââ Helpers ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

const STATUS_CONFIG: Record<
  ActivationStatus,
  { label: string; color: string; bg: string; icon: React.ReactNode; description: string }
> = {
  draft: {
    label: "Being prepared",
    color: "text-gray-600",
    bg: "bg-gray-100",
    icon: <Clock className="h-4 w-4" />,
    description: "Your engagement is being set up. We will notify you when it goes live.",
  },
  active: {
    label: "Live",
    color: "text-green-700",
    bg: "bg-green-100",
    icon: <CheckCircle2 className="h-4 w-4" />,
    description: "Your engagement is live and collecting responses.",
  },
  paused: {
    label: "Paused",
    color: "text-amber-700",
    bg: "bg-amber-100",
    icon: <Clock className="h-4 w-4" />,
    description: "Your engagement has been temporarily paused.",
  },
  completed: {
    label: "Completed",
    color: "text-blue-700",
    bg: "bg-blue-100",
    icon: <CheckCircle2 className="h-4 w-4" />,
    description: "Your engagement has wrapped up. Results are being reviewed.",
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-600",
    bg: "bg-red-100",
    icon: <AlertCircle className="h-4 w-4" />,
    description: "This engagement has been cancelled. Please contact your consultant.",
  },
};

function StatusPill({ status }: { status: ActivationStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${cfg.bg} ${cfg.color}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// âââ Page âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

export default async function ClientDashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, organization_id")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "client") redirect("/");

  // Fetch activations linked to this client
  const { data: rawActivations } = await supabase
    .from("activations")
    .select(`
      id,
      title,
      description,
      status,
      target_responses,
      start_date,
      end_date
    `)
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  // Enrich with counts
  const activations: Activation[] = await Promise.all(
    (rawActivations || []).map(async (a) => {
      const [{ count: responseCount }, { count: questionCount }] = await Promise.all([
        supabase
          .from("question_responses")
          .select("id", { count: "exact", head: true })
          .eq("activation_id", a.id),
        supabase
          .from("activation_questions")
          .select("id", { count: "exact", head: true })
          .eq("activation_id", a.id),
      ]);
      return {
        ...a,
        response_count: responseCount ?? 0,
        question_count: questionCount ?? 0,
      };
    })
  );

  const firstName = profile.full_name?.split(" ")[0] ?? "there";

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">
          Hello, {firstName}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here is a live view of your engagement progress.
        </p>
      </div>

      {/* No engagements state */}
      {activations.length === 0 && (
        <div className="rounded-lg border border-dashed border-border bg-background flex flex-col items-center justify-center py-16 text-center px-6">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <BarChart3 className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">Your engagement is being prepared</p>
          <p className="text-sm text-muted-foreground mt-1">
            Your consultant is setting things up. Check back soon.
          </p>
        </div>
      )}

      {/* Engagement cards */}
      <div className="space-y-6">
        {activations.map((activation) => {
          const cfg = STATUS_CONFIG[activation.status] ?? STATUS_CONFIG.draft;
          const pct =
            activation.target_responses && activation.target_responses > 0
              ? Math.min(
                  100,
                  Math.round((activation.response_count / activation.target_responses) * 100)
                )
              : null;

          return (
            <div
              key={activation.id}
              className="rounded-xl border border-border bg-card shadow-sm overflow-hidden"
            >
   key={activation.id}
              className="rounded-xl border border-border bg-card shadow-sm overflow-hidden"
            >
              {/* Card header */}
              <div className="p-5 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-semibold text-foreground">
                      {activation.title}
                    </h2>
                    {activation.description && (
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {activation.description}
                      </p>
                    )}
                  </div>
                  <StatusPill status={activation.status} />
                </div>

                {/* Status description */}
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                  {cfg.description}
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Stats */}
              <div className="px-5 py-4">
                {/* Progress bar */}
                {pct !== null && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-foreground">Responses collected</span>
                      <span className="text-muted-foreground">
                        {activation.response_count} of {activation.target_responses}
                      </span>
                    </div>
                    <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          pct >= 100 ? "bg-green-500" : "bg-primary"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 text-right">{pct}% complete</p>
                  </div>
                )}

                {/* Meta */}
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {activation.question_count} question{activation.question_count !== 1 ? "s" : ""}
                  </span>

                  {activation.start_date && (
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(activation.start_date)}
                      {activation.end_date
                        ? ` â ${formatDate(activation.end_date)}`
                        : ""}
                    </span>
                  )}

                  {!activation.target_responses && (
                    <span className="flex items-center gap-1.5">
                      <BarChart3 className="h-3.5 w-3.5" />
                      {activation.response_count} response{activation.response_count !== 1 ? "s" : ""} received
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
