import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Plus, ChevronRight, Clock, CheckCircle2, Circle, AlertCircle } from "lucide-react";

// âââ Types ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

type ActivationStatus = "draft" | "active" | "paused" | "completed" | "cancelled";

interface ClientWithEngagement {
  id: string;
  full_name: string | null;
  email: string;
  created_at: string;
  activation: {
    id: string;
    title: string;
    status: ActivationStatus;
    target_responses: number | null;
    response_count: number;
  } | null;
}

// âââ Helpers ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

const STATUS_CONFIG: Record<ActivationStatus, { label: string; color: string; icon: React.ReactNode }> = {
  draft:     { label: "Draft",     color: "bg-gray-100 text-gray-600",   icon: <Circle className="h-3 w-3" /> },
  active:    { label: "Active",    color: "bg-green-100 text-green-700", icon: <CheckCircle2 className="h-3 w-3" /> },
  paused:    { label: "Paused",    color: "bg-amber-100 text-amber-700", icon: <Clock className="h-3 w-3" /> },
  completed: { label: "Completed", color: "bg-blue-100 text-blue-700",   icon: <CheckCircle2 className="h-3 w-3" /> },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-600",     icon: <AlertCircle className="h-3 w-3" /> },
};

function StatusBadge({ status }: { status: ActivationStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${cfg.color}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function ProgressBar({ current, target }: { current: number; target: number | null }) {
  if (!target || target === 0) return null;
  const pct = Math.min(100, Math.round((current / target) * 100));
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {current} / {target}
      </span>
    </div>
  );
}

// âââ Page âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

export default async function OrgClientsPage() {
  const supabase = await createClient();

  // Verify org admin session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, organization_id")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "org_admin") redirect("/");

  const orgId = profile.organization_id;

  // Fetch all clients in this org with their latest activation
  const { data: clients, error } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      email,
      created_at,
      activations!activations_client_id_fkey (
        id,
        title,
        status,
        target_responses
      )
    `)
    .eq("role", "client")
    .eq("organization_id", orgId)
    .order("full_name", { ascending: true });

  if (error) console.error("Error fetching clients:", error);

  // Flatten: for each client, grab the most recent activation + its response count
  const clientsWithEngagements: ClientWithEngagement[] = await Promise.all(
    (clients || []).map(async (c: any) => {
      const activations = Array.isArray(c.activations) ? c.activations : [];
      // Take the most recently created activation (or active one)
      const activation = activations.find((a: any) => a.status === "active")
        ?? activations[activations.length - 1]
        ?? null;

      let responseCount = 0;
      if (activation) {
        const { count } = await supabase
          .from("question_responses")
          .select("id", { count: "exact", head: true })
          .eq("activation_id", activation.id);
        responseCount = count ?? 0;
      }

      return {
        id: c.id,
        full_name: c.full_name,
        email: c.email,
        created_at: c.created_at,
        activation: activation
          ? { ...activation, response_count: responseCount }
          : null,
      };
    })
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Clients</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage client accounts and set up their engagements
          </p>
        </div>
        <Link
          href="/org/clients/new"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add client
        </Link>
      </div>

      {/* Client list */}
      {clientsWithEngagements.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-background flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">No clients yet</p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Add your first client to set up their engagement
          </p>
          <Link
            href="/org/clients/new"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add client
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          {clientsWithEngagements.map((client, idx) => (
            <Link
              key={client.id}
              href={`/org/clients/${client.id}`}
              className={`flex items-center gap-4 px-5 py-4 hover:bg-accent transition-colors group ${
                idx !== clientsWithEngagements.length - 1 ? "border-b border-border" : ""
              }`}
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary flex-shrink-0">
                {(client.full_name ?? client.email).slice(0, 2).toUpperCase()}
              </div>

              {/* Client info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {client.full_name ?? client.email}
                </p>
                <p className="text-xs text-muted-foreground truncate">{client.email}</p>

                {/* Engagement info */}
                {client.activation ? (
                  <div className="mt-1.5">
                    <p className="text-xs text-foreground font-medium truncate">
                      {client.activation.title}
                    </p>
                    <ProgressBar
                      current={client.activation.response_count}
                      target={client.activation.target_responses}
                    />
                  </div>
                ) : (
                  <p className="text-xs text-amber-600 mt-1">No engagement set up yet</p>
                )}
              </div>

              {/* Status + arrow */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {client.activation ? (
                  <StatusBadge status={client.activation.status} />
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700">
                    <AlertCircle className="h-3 w-3" />
                    Setup needed
                  </span>
                )}
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
