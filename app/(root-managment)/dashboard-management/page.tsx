import { verifyToken } from "@/app/actions/verify-token.action";
import React from "react";

async function DashboardManagementPage() {
  const resp = await verifyToken();

  console.log("resp desde gerencia", resp.token);
  
  return <div>
    
  </div>;
}

export default DashboardManagementPage;
