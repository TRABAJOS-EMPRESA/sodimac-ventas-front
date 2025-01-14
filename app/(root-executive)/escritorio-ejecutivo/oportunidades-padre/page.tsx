import { getOpportunitiesAll } from "@/actions/opportunities/get-opportunities-all.action";
import React from "react";

async function OportunitiesFatherPage() {
  const opportunities = await getOpportunitiesAll();

  console.log("opportunities", opportunities);

  return <div className="h-full w-full">OportunitiesFatherPage</div>;
}

export default OportunitiesFatherPage;
