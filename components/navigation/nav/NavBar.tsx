import { auth } from "@/utils/auth";
import ButtonsNav from "./ButtonsNav";

async function NavBar() {
  const session = await auth();
  return (
    <nav
      className="z-50 flex justify-between items-center w-full border-none bg-primary-white lg:w-[calc(100%-90px)] px-10 fixed shadow-bottom shadow-sodimac 
    py-2 space-x-3"
    >
      <h1 className="text-primary-blue text-[15px] md:text-2xl">
        Hola{" "}
        <span className="font-bold text-primary-blue">
          {session?.user.name}
        </span>{" "}
        Que sea un excelente día !!
      </h1>

      <ButtonsNav session={session!} />
    </nav>
  );
}

export default NavBar;
