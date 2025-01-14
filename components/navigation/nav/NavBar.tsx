import { auth } from "@/utils/auth";
import { getBellSVG } from "@/utils/icons-svg-data";


async function NavBar() {
  const session = await auth()
  return (
    <nav
      className="flex justify-between items-center w-full lg:w-[calc(100%-90px)] px-10 fixed
    py-2 dark:shadow-none  "
    >
      <h1 className="text-primary-blue text-2xl">Hola <span className="font-bold text-primary-blue">{session?.user.name}</span>  Que sea un excelente día !!</h1>

      <div>
        <div className=" left-5 top-2 relative rounded-full w-6 h-6 bg-primary-blue text-primary-white flex items-center justify-center">
          3
        </div>
        <div className="pb-1">{getBellSVG()}</div>
      </div>
    </nav>
  );
}

export default NavBar;
