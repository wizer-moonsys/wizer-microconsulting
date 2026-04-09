"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NewClientPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName]   = useState("");
  const [email, setEmail]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get org admin's org
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: adminProfile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();

      if (!adminProfile?.organization_id) throw new Error("Organisation not found");

      // Invite the client user via Supabase auth (sends magic link / invite email)
      const { data: invited, error: inviteErr } = await supabase.auth.admin.inviteUserByEmail(email, {
        data: { full_name: fullName, role: "client" },
      });

      // Fallback: if admin invite isn't available client-side, create profile directly
      // (In production you'd call a server action or API route for this)
      if (inviteErr) {
        // Create a placeholder profile that the client will claim when they sign up
        const { error: profileErr } = await supabase.from("profiles").insert({
          email,
          full_name: fullName,
          role: "client",
          organization_id: adminProfile.organization_id,
        });
        if (profileErr) throw profileErr;
      } else if (invited?.user) {
        // Upsert profile with org linkage
        await supabase.from("profiles").upsert({
          id: invited.user.id,
          email,
          full_name: fullName,
          role: "client",
          organization_id: adminProfile.organization_id,
        });
      }

      router.push("/org/clients");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <Link
        href="/org/clients"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All clients
      </Link>

      <h1 className="text-xl font-semibold text-foreground mb-1">Add a client</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Create a client account. They will receive an invitation to access their dashboard.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Full name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jane Smith"
            required
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@company.com"
            required
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Adding client…" : "Add client"}
          </button>
          <Link
            href="/org/clients"
            className="inline-flex items-center rounded-md border border-border px-5 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
