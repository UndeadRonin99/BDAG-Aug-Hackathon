"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function Opportunities() {
  const { data } = useQuery({
    queryKey: ["opps"],
    queryFn: () => fetch("/api/opportunities").then(r => r.json())
  });

  return (
    <div className="stack">
      <h1 style={{ fontSize: 22, fontWeight: 600 }}>Open Opportunities</h1>
      <ul className="stack">
        {(data ?? []).map((o: any) => (
          <li key={o.id} className="card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 600 }}>{o.title}</div>
                <div className="text-sm">{o.summary}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="text-sm">Reward: {o.rewardZAR} ZAR</div>
                <Link className="link" href={`/opportunities/${o.id}`}>View</Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
