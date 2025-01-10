import Link from "next/link";
import React from "react";
import DrawerOpportunities from "../drawer-opportunity/DrawerOpportunities";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";

interface Props {
  w: string;
  titleHeader: string;
  route: string;
  routeTitle: string;
}

function HeaderPages(props: Props) {
  const { w, titleHeader, route, routeTitle } = props;
  return (
    <div className="flex justify-between items-center w-full mb-10">
      <h1 className="text-2xl font-bold">{titleHeader}</h1>
      <div className="flex">
        <Button variant={"ghost"} className="hover:bg-transparent">
          <Link
            href={route}
            className="border-2 border-blue-500 text-blue-500 rounded-full py-[6px] px-2 flex items-center"
          >
            <ChevronLeft className="ease-in-out w-10 h-10" />
            Volver a {routeTitle}
          </Link>
        </Button>
        <DrawerOpportunities w={w} />
      </div>
    </div>
  );
}

export default HeaderPages;
