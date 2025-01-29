"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface Props {
  title: string;
  route: string;
  tabIndex: number;
}

function ButtonDashboardCustom(props: Props) {
  const [loading, setLoading] = useState(false);

  const { title, route, tabIndex } = props;
  function goRoute() {
    setLoading(true);
    router.push(route);
  }

  const router = useRouter();
  return (
    <Button
      className="flex shadow-md justify-center items-center space-x-2 w-full text-center py-1 px-2 rounded-full bg-primary-white text-primary-blue border border-primary-blue hover:bg-primary-blue hover:text-primary-white"
      onClick={() => goRoute()}
      tabIndex={tabIndex}
    >
      {loading ? <Loader2 className="animate-spin" /> : title}
    </Button>
  );
}

export default ButtonDashboardCustom;
