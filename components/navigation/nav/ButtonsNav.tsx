"use client";

import { logoutUserBack } from "@/actions/user/logout-user-back.action";
import { getBellSVG } from "@/utils/icons-svg-data";
// import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { SessionProvider, signOut } from "next-auth/react";
import { Session } from "next-auth";
import React from "react";
import { useRouter } from "next/navigation";

interface Props {
  session: Session;
}
function ButtonsNav(props: Props) {
  const { session } = props;
  const router = useRouter();

  const handleLogout = async () => {
    if (session?.user) {

      const logout = await logoutUserBack(
        session.user.email,
        session.user.accessTokenBack!
      );
      console.log("logout --->", logout);

      if (
        logout.message === "Logout successful" ||
        logout.message === "Token is blacklisted"
      ) {
        await signOut({ redirect: false });
        router.push("/login");
      }
    } else {
      console.error("User session is undefined");
    }
  };
  return (
    <SessionProvider session={session}>
      <div>
        <div className="left-16 md:left-16 top-2 relative rounded-full w-6 h-6 bg-primary-blue text-primary-white flex items-center justify-center">
          3
        </div>

        <div className="flex space-x-5">
          <div onClick={() => handleLogout()} className="pb-1">
            <LogOut size={29} className="text-primary-blue cursor-pointer" />
          </div>
          <div className="pb-1">{getBellSVG({ w: "30", h: "30" })}</div>
        </div>
      </div>
    </SessionProvider>
  );
}

export default ButtonsNav;
