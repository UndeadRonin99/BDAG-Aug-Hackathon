import { prisma } from "@/lib/prisma";
import GrantActions from "./grant-ations";

export default async function OppPage({ params }: { params: { id: string } }) {
  const opp = await prisma.opportunity.findUnique({ where: { id: params.id }});
  if (!opp) return <div>Not found</div>;
  return (
    <div className="stack">
      <h1 style={{ fontSize: 22, fontWeight: 600 }}>{opp.title}</h1>
      <p className="text-sm">{opp.summary}</p>
      <div className="text-sm">Reward: {opp.rewardZAR} ZAR · On-chain: {opp.chainAmount}</div>
      <GrantActions oppId={opp.id} metadataUri={`ipfs://todo-${opp.id}`} />
    </div>
  );
}
