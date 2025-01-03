import { verifyToken } from "@/app/actions/verify-token.action";
import Logout from "@/app/components/Logout";

async function RootHomePage() {
  const resp = await verifyToken();

  console.log(resp);
  
 
  return (
    <div>
      <div>{resp.token ? 'verificación': 'no verificación'}</div>;
      <Logout />
    </div>
  );
}

export default RootHomePage;
