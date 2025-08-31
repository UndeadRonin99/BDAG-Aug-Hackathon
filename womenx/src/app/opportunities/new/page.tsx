"use client";
import { useState } from "react";
import { z } from "zod";

const S = z.object({
  title: z.string().min(3),
  summary: z.string().min(10),
  rewardZAR: z.coerce.number().int().positive(),
  chainAmount: z.string().min(1),
});

export default function NewOpportunity() {
  const [form, setForm] = useState({ title:"", summary:"", rewardZAR:"", chainAmount:"" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = S.safeParse(form);
    if (!parsed.success) return alert("Please fill all fields.");
    const res = await fetch("/api/opportunities", { method: "POST", body: JSON.stringify(parsed.data) });
    if (!res.ok) return alert("Failed to create.");
    alert("Created!");
    setForm({ title:"", summary:"", rewardZAR:"", chainAmount:"" });
  }

  return (
    <form onSubmit={submit} className="form">
      <h1 style={{ fontSize: 22, fontWeight: 600 }}>Post an Opportunity</h1>
      <input className="input" placeholder="Title"
        value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/>
      <textarea className="textarea" placeholder="Summary"
        value={form.summary} onChange={e=>setForm(f=>({...f,summary:e.target.value}))}/>
      <input className="input" placeholder="Reward ZAR"
        value={form.rewardZAR} onChange={e=>setForm(f=>({...f,rewardZAR:e.target.value}))}/>
      <input className="input" placeholder="On-chain amount (BDAG units)"
        value={form.chainAmount} onChange={e=>setForm(f=>({...f,chainAmount:e.target.value}))}/>
      <div><button className="btn" type="submit">Create</button></div>
    </form>
  );
}
