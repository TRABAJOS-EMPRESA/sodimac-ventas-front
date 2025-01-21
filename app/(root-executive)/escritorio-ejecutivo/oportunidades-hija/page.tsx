import { getOpportunitiesByIdExecutive } from "@/actions/opportunities/get-opportunities-by-id-executive.action";
import HeaderPages from "@/components/header-pages/HeaderPages";
import TableOpportunties from "@/components/table-opportunities/TableOpportunities";
import ROUTES_EXECUTIVE from "@/constants/routes";
import React from "react";

async function OportunitiesChildPage() {

  const response = await getOpportunitiesByIdExecutive({
    page: 1,
    limit: 10000,
  });

  console.log("response", response);
  return (
    <div className="flex flex-col w-full">
      <HeaderPages
      buttonDrawer={true}
        buttonLink={true}
        w={"w-[200px]"}
        titleHeader="Mis Oportunidades"
        route={ROUTES_EXECUTIVE.DESK_EXECUTIVE}
        routeTitle="Dashboard"
      />
      <TableOpportunties  response={response}/>
    </div>
  );
}

export default OportunitiesChildPage;
