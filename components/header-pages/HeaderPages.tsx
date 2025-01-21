import Link from "next/link";
import React from "react";
import DrawerOpportunities from "../drawer-opportunity/DrawerOpportunities";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { auth } from "@/utils/auth";

interface Props {
  w: string;
  titleHeader: string;
  route: string;
  routeTitle: string;
  buttonLink: boolean;
  buttonDrawer: boolean;
}

async function HeaderPages(props: Props) {
  const { w, titleHeader, route, routeTitle, buttonDrawer, buttonLink } = props;

  const session = await auth();
  return (
    <div className="flex justify-between items-center w-full mb-10">
      <h1 className="text-2xl font-bold">{titleHeader}</h1>
      <div className="flex">
        {buttonLink && (
          <Button variant={"ghost"} className="hover:bg-transparent">
            <Link
              href={route}
              className="border-2 flex border-primary-blue py-[6px] px-2 text-primary-blue rounded-full font-bold bg-white shadow-md hover:shadow-lg active:shadow-sm active:translate-y-1 active:border-blue-700 transition-all duration-150 ease-in-out"
            >
              <ChevronLeft className="ease-in-out w-10 h-10" />
              Volver a {routeTitle}
            </Link>
          </Button>
        )}

        {buttonDrawer && <DrawerOpportunities w={w} session={session!} />}
      </div>
    </div>
  );
}

export default HeaderPages;
