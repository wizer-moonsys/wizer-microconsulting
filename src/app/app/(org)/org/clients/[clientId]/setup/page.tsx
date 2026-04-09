"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, Loader2, Plus, Trash2, GripVertical } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ActivationStatus = "draft" | "active" | "paused" | "completed" | "cancelled";

interface Question {
  id: string; // local id for list tracking
  text: string;
  points: number;
}

interface EngagementForm {
  title: string;
  description: string;
  status: ActivationStatus;
  target_responses: string;
  start_date: string;
  end_date: string;
  questions: Question[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function newQuestion(): Question {
  return { id: crypto.randomUUID(), text: "", points: 10 };
}

const STATUS_OPTIONS: { value: ActivationStatus; label: string }[] = [
  { value: "draft",     label: "Draft — not visible to client yet" },
  { value: "active",    label: "Active — live and visible to client" },
  { value: "paused",    label: "Paused — visible but not collecting" },
  { value: "completed", label: "Completed" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EngagementSetupPage({
  params,
}: {
  params: { clientId: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activationId = searchParams.get("activation"); // editing existing if present
  const supabase = createClient();

  const [clientName, setClientName] = useState("");
  const [loading, setLoading]       = useState(false);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const [form, setForm] = useState<EngagementForm>({
    title: "",
    description: "",
    status: "draft",
    target_responses: "",
    start_date: "",
    end_date: "",
    questions: [newQuestion()],
  });

  // Load client name + existing activation if editing
  useEffect(() => {
    async function load() {
      setLoading(true);

      const { data: client } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", params.clientId)
        .single();

      setClientName(client?.full_name ?? client?.email ?? "Client");

      if (activationId) {
        const { data: activation } = await supabase
          .from("activations")
          .select("*")
          .eq("id", activationId)
          .single();

        const { data: questions } = await supabase
          .from("activation_questions")
          .select("id, question_text, points")
          .eq("activation_id", activationId)
          .order("order_index", { ascending: true });

        if (activation) {
          setForm({
            title: activation.title ?? "",
            description: activation.description ?? "",
            status: activation.status ?? "draft",
            target_responses: activation.target_responses?.toString() ?? "",
            start_date: activation.start_date?.slice(0, 10) ?? "",
            end_date: activation.end_date?.slice(0, 10) ?? "",
            questions:
              questions && questions.length > 0
                ? questions.map((q) => ({
                    id: q.id,
                    text: q.question_text ?? "",
                    points: q.points ?? 10,
                  }))
                : [newQuestion()],
          });
        }
      }

      setLoading(false);
    }

    load();
  }, [params.clientId, activationId]);

  // ── Question helpers ───────────────────────────────────────────────────────

  const addQuestion = () =>
    setForm((f) => ({ ...f, questions: [...f.questions, newQuestion()] }));

  const removeQuestion = (id: string) =>
    setForm((f) => ({
      ...f,
      questions: f.questions.filter((q) => q.id !== id),
    }));

  const updateQuestion = (id: string, patch: Partial<Question>) =>
    setForm((f) => ({
      ...f,
      questions: f.questions.map((q) => (q.id === id ? { ...q, ...patch } : q)),
    }));

  // ── Save ───────────────────────────────────────────────────────────────────

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: adminProfile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();

      const orgId = adminProfile?.organization_id;
      if (!orgId) throw new Error("Organisation not found");

      const payload = {
        title: form.title,
        description: form.description || null,
        status: form.status,
        target_responses: form.target_responses ? parseInt(form.target_responses) : null,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        client_id: params.clientId,
        org_id: orgId,
      };

      let resolvedActivationId = activationId;

      if (activationId) {
        // Update existing
        const { error: updateErr } = await supabase
          .from("activations")
          .update(payload)
          .eq("id", activationId);
        if (updateErr) throw updateErr;
      } else {
        // Create new
        const { data: created, error: createErr } = await supabase
          .from("activations")
          .insert(payload)
          .select("id")
          .single();
        if (createErr) throw createErr;
        resolvedActivationId = created.id;
      }

      // Upsert questions: delete existing then re-insert in order
      if (resolvedActivationId) {
        await supabase
          .from("activation_questions")
          .delete()
          .eq("activation_id", resolvedActivationId);

        const questionsToInsert = form.questions
          .filter((q) => q.text.trim())
          .map((q, idx) => ({
            activation_id: resolvedActivationId,
            question_text: q.text.trim(),
            points: q.points,
            order_index: idx,
          }));

        if (questionsToInsert.length > 0) {
          const { error: qErr } = await supabase
            .from("activation_questions")
            .insert(questionsToInsert);
          if (qErr) throw qErr;
        }
      }

      router.push(`/org/clients/${params.clientId}`);
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Something went wrong. Please try again.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link
        href={`/org/clients/${params.clientId}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {clientName}
      </Link>

      <h1 className="text-xl font-semibold text-foreground mb-1">
        {activationId ? "Edit engagement" : "Set up engagement"}
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        Configure the engagement for <span className="font-medium text-foreground">{clientName}</span>.
        They will only see the details and live status — not this setup view.
      </p>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ── Engagement details ──────────────────────────────────────────── */}
        <section className="rounded-lg border border-border bg-card p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Engagement details</h2>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Strategic Decision Review — Q2 2026"
              required
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Brief overview of what this engagement covers and what the client can expect…"
              rows={3}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ActivationStatus }))}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* ── Timeline & targets ──────────────────────────────────────────── */}
        <section className="rounded-lg border border-border bg-card p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Timeline & targets</h2>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Target responses
            </label>
            <input
              type="number"
              min={1}
              value={form.target_responses}
              onChange={(e) => setForm((f) => ({ ...f, target_responses: e.target.value }))}
              placeholder="e.g. 50"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Start date
              </label>
              <input
                type="date"
                value={form.start_date}
                onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                End date
              </label>
              <input
                type="date"
                value={form.end_date}
                onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </section>

        {/* ── Questions ───────────────────────────────────────────────────── */}
        <section className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Questions</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add question
            </button>
          </div>

          <div className="space-y-3">
            {form.questions.map((q, idx) => (
              <div key={q.id} className="flex items-start gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground mt-2.5 flex-shrink-0" />
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={q.text}
                    onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                    placeholder={`Question ${idx + 1}`}
                    className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="number"
                    value={q.points}
                    onChange={(e) => updateQuestion(q.id, { points: parseInt(e.target.value) || 0 })}
                    min={0}
                    title="Points for this question"
                    className="w-20 rounded-md border border-border bg-background px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-xs text-muted-foreground self-center">pts</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeQuestion(q.id)}
                  disabled={form.questions.length === 1}
                  className="mt-2 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-30"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Saving…" : activationId ? "Save changes" : "Create engagement"}
          </button>
          <Link
            href={`/org/clients/${params.clientId}`}
            className="inline-flex items-center rounded-md border border-border px-5 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
