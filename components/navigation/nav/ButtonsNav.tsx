"use client";

import { LogOut } from "lucide-react";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import React, { useState } from "react";
import { getBellSVG } from "@/utils/icons-svg-data";
import { LogoutDialog } from "@/components/login/LogoutDialog";

interface Props {
  session: Session;
}

function ButtonsNav(props: Props) {
  const { session } = props;
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsLogoutDialogOpen(true); // Abre el diálogo de confirmación
  };

  return (
    <SessionProvider session={session}>
      <div>
        <div className="left-16 md:left-16 top-2 relative rounded-full w-6 h-6 bg-primary-blue text-primary-white flex items-center justify-center">
          3
        </div>

        <div className="flex space-x-5">
          <button onClick={handleLogoutClick} className="pb-1">
            <LogOut size={29} className="text-primary-blue cursor-pointer" />
          </button>
          <button className="pb-1">{getBellSVG({ w: "30", h: "30" })}</button>
        </div>

        {/* Diálogo de confirmación */}
        <LogoutDialog
          isOpen={isLogoutDialogOpen}
          onClose={() => setIsLogoutDialogOpen(false)}
          session={session}
        />
      </div>
    </SessionProvider>
  );
}

export default ButtonsNav;
