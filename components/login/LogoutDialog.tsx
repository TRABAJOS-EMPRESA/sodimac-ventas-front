"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // Asegúrate de importar tu componente Button
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"; // Asegúrate de importar tus componentes de diálogo
import { Session } from "next-auth";
import { logoutUserBack } from "@/actions/user/logout-user-back.action";

interface LogoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session;
}

export function LogoutDialog({ isOpen, onClose, session }: LogoutDialogProps) {
  const router = useRouter();

  const handleConfirmLogout = async () => {
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
    onClose(); // Cierra el diálogo después de confirmar
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex rounded-xl flex-col justify-center items-center w-[350px] md:w-[400px]">
        <DialogHeader>
          <DialogTitle>¿Estás seguro de cerrar la sesión?</DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-center items-center gap-3">
          <Button className=" border-1 border-primary-blue  text-primary-blue rounded-full font-bold bg-white shadow-md hover:shadow-lg active:shadow-sm active:translate-y-1 active:border-blue-700 transition-all duration-150 ease-in-out" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="border  py-[19px] border-primary-red text-red-500 rounded-full font-bold bg-white shadow-md hover:shadow-lg active:shadow-sm active:translate-y-1 active:border-red-700 transition-all duration-150 ease-in-out hover:text-white"  variant="destructive" onClick={handleConfirmLogout}>
            Cerrar Sesión
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}