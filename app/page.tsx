import Link from "next/link";
import Logout from "./components/Logout";

export default function Home() {
  return (
    <div className="flex justify-center items-center flex-col  h-screen ">
      <div className="flex justify-center gap-4 items-center w-full">
        <Link
          className="text-center py-3 px-2 rounded-xl bg-blue-500"
          href="/root-home"
        >
          EJECUTIVOS
        </Link>
        <Link
          className="text-center py-3 px-2 rounded-xl bg-red-500"
          href="/dashboard-management"
        >
          GERENCIA
        </Link>
      </div>

      <Logout />
    </div>
  );
}
