import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Settings,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  BarChart3,
  MessageSquare,
  CalendarDays,
  Plus,
  Users,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ActivationStatus = "draft" | "active" | "paused" | "completed" | "cancelled";

interface Activation {
  id: string;
  title: string;
  description: string | null;
  status: ActivationStatus;
  target_responses: number | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  response_count: number;
  question_count: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ActivationStatus, { label: string; color: string; icon: React.ReactNode }> = {
  draft:     { label: "Draft",     color: "bg-gray-100 text-gray-600",   icon: <Circle className="h-3.5 w-3.5" /> },
  active:    { label: "Active",    color: "bg-green-100 text-green-700", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  paused:    { label: "Paused",    color: "bg-amber-100 text-amber-700", icon: <Clock className="h-3.5 w-3.5" /> },
  completed: { label: "Completed", color: "bg-blue-100 text-blue-700",   icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-600",     icon: <AlertCircle className="h-3.5 w-3.5" /> },
};

function StatusBadge({ status }: { status: ActivationStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.color}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ClientDetailPage({
  params,
}: {
  params: { clientId: string };
}) {
  const supabase = await createClient();

  // Auth guard
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: orgAdminProfile } = await supabase
    .from("profiles")
    .select("role, organization_id")
    .eq("id", user.id)
    .single();

  if (!orgAdminProfile || orgAdminProfile.role !== "org_admin") redirect("/");

  const orgId = orgAdminProfile.organization_id;

  // Fetch the client profile (must belong to same org)
  const { data: client } = await supabase
    .from("profiles")
    .select("id, full_name, email, created_at, organization_id")
    .eq("id", params.clientId)
    .eq("role", "client")
    .eq("organization_id", orgId)
    .single();

  if (!client) notFound();

  // Fetch all activations for this client
  const { data: rawActivations } = await supabase
    .from("activations")
    .select(`
      id,
      title,
      description,
      status,
      target_responses,
      start_date,
      end_date,
      created_at
    `)
    .eq("client_id", params.clientId)
    .eq("org_id", orgId)
    .order("created_at", { ascending: false });

  // Enrich each activation with response + question counts
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

  const activeEngagement = activations.find((a) => a.status === "active");
  const totalResponses = activations.reduce((sum, a) => sum + a.response_count, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back */}
      <Link
        href="/org/clients"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All clients
      </Link>

      {/* Client header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-base font-semibold text-primary">
            {(client.full_name ?? client.email).slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              {client.full_name ?? client.email}
            </h1>
            <p className="text-sm text-muted-foreground">{client.email}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Client since {formatDate(client.created_at)}
            </p>
          </div>
        </div>
        <Link
          href={`/org/clients/${client.id}/setup`}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New engagement
        </Link>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={<BarChart3 className="h-4 w-4" />}
          label="Total responses"
          value={totalResponses}
        />
        <StatCard
          icon={<MessageSquare className="h-4 w-4" />}
          label="Engagements"
          value={activations.length}
        />
        <StatCard
          icon={<Users className="h-4 w-4" />}
          label="Active engagement"
          value={activeEngagement ? "Yes" : "None"}
        />
      </div>

      {/* Engagements */}
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Engagements</h2>
      </div>

      {activations.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-background flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            No engagements set up for this client yet
          </p>
          <Link
            href={`/org/clients/${client.id}/setup`}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Set up first engagement
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {activations.map((activation) => {
            const pct =
              activation.target_responses && activation.target_responses > 0
                ? Math.min(100, Math.round((activation.response_count / activation.target_responses) * 100))
                : null;

            return (
              <div
                key={activation.id}
                className="rounded-lg border border-border bg-card p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={activation.status} />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground mt-2">
                      {activation.title}
                    </h3>
                    {activation.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {activation.description}
                      </p>
                    )}
                  </div>
                  <Link
                    href={`/org/clients/${client.id}/setup?activation=${activation.id}`}
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border rounded-md px-2.5 py-1.5 transition-colors flex-shrink-0"
                  >
                    <Settings className="h-3 w-3" />
                    Edit
                  </Link>
                </div>

                {/* Progress bar */}
                {pct !== null && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Responses</span>
                      <span>{activation.response_count} of {activation.target_responses}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Meta row */}
                <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {activation.question_count} questions
                  </span>
                  {activation.start_date && (
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {formatDate(activation.start_date)}
                      {activation.end_date ? ` → ${formatDate(activation.end_date)}` : ""}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
