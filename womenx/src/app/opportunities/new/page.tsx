"use client";
import { useState } from "react";
import { z } from "zod";

const S = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  summary: z.string().trim().min(10, "Summary must be at least 10 characters"),
  rewardZAR: z.preprocess(
    v => typeof v === "string" ? v.replace(/[,\s]/g, "") : v,
    z.coerce.number().positive("Reward must be a positive number")
  ),
  // user enters BDAG (e.g. 1.5), we send string to server and convert to wei there
  chainAmountBDAG: z.string().trim().min(1, "On-chain amount is required")
                     .refine(v => /^[0-9]*\.?[0-9]+$/.test(v), "Enter a number like 1 or 0.5"),
});

type FormData = z.infer<typeof S>;

export default function NewOpportunity() {
  const [form, setForm] = useState<FormData>({
    title: "",
    summary: "",
    rewardZAR: "" as unknown as number, // we keep input as string in UI, zod coerces
    chainAmountBDAG: "",
  } as unknown as FormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  function set<K extends keyof FormData>(k: K, v: string) {
    setForm(f => ({ ...f, [k]: v } as any));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    const parsed = S.safeParse(form);
    if (!parsed.success) {
      const flat = parsed.error.flatten();
      const fieldErrs: Record<string, string> = {};
      for (const [k, v] of Object.entries(flat.fieldErrors)) {
        if (v && v.length) fieldErrs[k] = v[0]!;
      }
      setErrors(fieldErrs);
      return;
    }

    try {
      setBusy(true);
      const res = await fetch("/api/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to create opportunity");
      }
      alert("Created!");
      setForm({ title: "", summary: "", rewardZAR: "" as any, chainAmountBDAG: "" } as any);
    } catch (err: any) {
      alert(err.message ?? "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="form">
      <h1 style={{ fontSize: 22, fontWeight: 600 }}>Post an Opportunity</h1>

      <input className="input" placeholder="Title"
        value={form.title as any} onChange={e=>set("title", e.target.value)} />
      {errors.title && <div className="text-sm" style={{ color: "#b00020" }}>{errors.title}</div>}

      <textarea className="textarea" placeholder="Summary (min 10 chars)"
        value={form.summary as any} onChange={e=>set("summary", e.target.value)} />
      {errors.summary && <div className="text-sm" style={{ color: "#b00020" }}>{errors.summary}</div>}

      <input className="input" placeholder="Reward ZAR (e.g. 1500)"
        inputMode="decimal"
        value={String(form.rewardZAR ?? "")}
        onChange={e=>set("rewardZAR", e.target.value)} />
      {errors.rewardZAR && <div className="text-sm" style={{ color: "#b00020" }}>{errors.rewardZAR}</div>}

      <input className="input" placeholder="On-chain amount (BDAG, e.g. 1.25)"
        inputMode="decimal"
        value={form.chainAmountBDAG}
        onChange={e=>set("chainAmountBDAG", e.target.value)} />
      {errors.chainAmountBDAG && <div className="text-sm" style={{ color: "#b00020" }}>{errors.chainAmountBDAG}</div>}

      <div><button className="btn" type="submit" disabled={busy}>{busy ? "Creating…" : "Create"}</button></div>
    </form>
  );
}
