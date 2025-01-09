'use client'

import React from "react";
import { useRouter } from "next/navigation";
import ROUTES_EXECUTIVE from "@/constants/routes";
import { Button } from "../ui/button";

function ButtonTableOpportunities() {

    const router = useRouter();
  return (
    <Button
      className="flex shadow-md justify-center items-center space-x-2 w-full text-center py-1 px-2 rounded-full bg-primary-white text-primary-blue border border-primary-blue hover:bg-primary-blue hover:text-primary-white"
      onClick={() => router.push(ROUTES_EXECUTIVE.OPORTUNITIES_CHILD)}
    >
      Ver tabla de oportunidades
    </Button>
  );
}

export default ButtonTableOpportunities;
