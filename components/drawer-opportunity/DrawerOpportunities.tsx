"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import FormDrawerAddOpportunity from "../forms/FormDrawerAddOpportunity";
import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

interface Props {
  w: string;
  session: Session;
}
function DrawerOpportunities(props: Props) {
  const { w, session } = props;

  // console.log( 'userId', userId);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        className={cn(
          "flex shadow-md space-x-2 w-full rounded-full bg-primary-blue hover:bg-blue-500 text-primary-white",
          w
        )}
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menú lateral"
      >
        <Image src={"/img/icons/add.png"} alt="add" width={10} height={10} />
        Crear nueva oportunidad
      </Button>

      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-screen w-full md:w-[900px] bg-background z-50 shadow-lg transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Nueva Oportunidad</h2>
          </div>
          <div className="flex-grow p-4 overflow-y-auto">
            <SessionProvider session={session}>
              <FormDrawerAddOpportunity setIsOpen={setIsOpen} />
            </SessionProvider>
          </div>
          <div className="p-4 border-t">
            <Button onClick={() => setIsOpen(false)} className="w-full">
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DrawerOpportunities;
