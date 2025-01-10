import HeaderPages from "@/components/header-pages/HeaderPages";
import TableOpportunties from "@/components/table-opportunities/TableOpportunities";
import ROUTES_EXECUTIVE from "@/constants/routes";
import React from "react";

function OportunitiesChildPage() {
  return (
    <div className="flex flex-col w-full">
      <HeaderPages
        w={"w-[200px]"}
        titleHeader="Mis Oportunidades"
        route={ROUTES_EXECUTIVE.DESK_EXECUTIVE}
        routeTitle="Dashboard"
      />
      <TableOpportunties />
    </div>
  );
}

export default OportunitiesChildPage;
