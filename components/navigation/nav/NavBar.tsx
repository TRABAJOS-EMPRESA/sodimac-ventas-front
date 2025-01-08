import { getBarsSVG, getBellSVG } from "@/utils/icons-svg-data";

function NavBar() {
  return (
    <nav
      className="flex bg-primary-white justify-between items-center w-full lg:w-[calc(100%-90px)] px-10 fixed
    py-2 dark:shadow-none  "
    >
      <div className="cursor-pointer">{getBarsSVG()}</div>

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
