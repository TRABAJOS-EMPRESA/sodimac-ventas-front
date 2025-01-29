import { getOpportunitiesByIdExecutive } from "@/actions/opportunities/get-opportunities-by-id-executive.action";
import { getSettingsTable } from "@/actions/settings-table/get-settings-table.action";
import HeaderPages from "@/components/header-pages/HeaderPages";
import TableOpportunties from "@/components/table-opportunities/TableOpportunities";
import ROUTES_EXECUTIVE from "@/constants/routes";
import { auth } from "@/utils/auth";
import React from "react";


async function OportunitiesChildPage() {

  const session = await auth()

  const opportunitiesResp = await getOpportunitiesByIdExecutive({
    page: 1,
    limit: 10000,
  });

  const settingsTable = await getSettingsTable();
  

  // console.log("response", opportunitiesResp);
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
      <TableOpportunties session={session!}  settingsTable={settingsTable}  opportunitiesResp={opportunitiesResp}/>
    </div>
  );
}

export default OportunitiesChildPage;
