// src/app/opportunities/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import GrantActions from "./grant-ations";
import Link from "next/link";
import { formatUnits } from "viem";
import { notFound } from "next/navigation";

// Minimal local types (match your Prisma schema fields actually used here)
type ApplicationRow = {
  id: string;
  userId: string;
  status: string;
  pitch: string | null;
};

type OppWithApps = {
  id: string;
  orgId: string;
  title: string;
  summary: string;
  rewardZAR: number;
  chainAmount: string | null;
  status: string;
  onchainId: string | null;
  createdAt: Date;
  applications: ApplicationRow[];
};

export default async function OppPage({ params }: { params: { id: string } }) {
  const opp = (await prisma.opportunity.findUnique({
    where: { id: params.id },
    include: { applications: true },
  })) as OppWithApps | null;

  if (!opp) return notFound();

  const BDAG_DECIMALS = 18;
  const bdagHuman = opp.chainAmount
    ? formatUnits(BigInt(opp.chainAmount), BDAG_DECIMALS)
    : "0";

  const explorer =
    process.env.NEXT_PUBLIC_BLOCKDAG_EXPLORER || "https://primordial.bdagscan.com";
  const grantsAddr = process.env.NEXT_PUBLIC_GRANTS_ADDRESS;

  return (
    <div className="stack">
      <div>
        <Link href="/opportunities" className="link">
          ← Back to opportunities
        </Link>
      </div>

      {/* Header card */}
      <section className="card stack">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          <div className="stack">
            <h1 style={{ fontSize: 26, fontWeight: 600, margin: 0 }}>{opp.title}</h1>
            <div className="meta-row">
              <span className="badge">{opp.status}</span>
              <span>Reward: <b>{opp.rewardZAR.toLocaleString()} ZAR</b></span>
              <span>On-chain: <b>{bdagHuman} BDAG</b></span>
              {opp.onchainId && (
                <span>
                  Grant ID: <b>#{opp.onchainId}</b>
                  {grantsAddr && (
                    <>
                      {" "}·{" "}
                      <a className="link" href={`${explorer}/address/${grantsAddr}`} target="_blank">
                        View contract
                      </a>
                    </>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
        <p className="lead">{opp.summary}</p>
      </section>

      {/* Main grid */}
      <div className="grid-2">
        {/* Left column */}
        <section className="stack">
          <div className="card">
            <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 0 }}>Details</h2>
            <div className="divider" />
            <dl style={{ display: "grid", gridTemplateColumns: "160px 1fr", rowGap: 10 }}>
              <dt className="text-sm">Organisation</dt>
              <dd>{opp.orgId}</dd>
              <dt className="text-sm">Created</dt>
              <dd>{opp.createdAt.toLocaleDateString()}</dd>
              <dt className="text-sm">Status</dt>
              <dd><span className="badge">{opp.status}</span></dd>
            </dl>
          </div>

          <div className="card">
            <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 0 }}>Applications</h2>
            <div className="divider" />
            {opp.applications.length ? (
              <ul className="stack">
                {opp.applications.map((a: ApplicationRow) => (
                  <li key={a.id} className="stack">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                      <div><b>Applicant</b>: {a.userId}</div>
                      <span className="badge">{a.status}</span>
                    </div>
                    {a.pitch && <p className="text-sm">{a.pitch}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm">No applications yet.</div>
            )}
          </div>
        </section>

        {/* Right column (actions) */}
        <aside className="stack">
          <GrantActions
            oppId={opp.id}
            metadataUri={`ipfs://todo-${opp.id}`}
            chainAmountWei={opp.chainAmount}
          />
          <div className="card">
            <h2 style={{ fontSize: 16, fontWeight: 600, marginTop: 0 }}>What’s next?</h2>
            <ol className="text-sm" style={{ paddingLeft: 16 }}>
              <li>Create the grant on-chain.</li>
              <li>Fund it with native BDAG.</li>
              <li>After milestones, release funds to the recipient.</li>
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}
