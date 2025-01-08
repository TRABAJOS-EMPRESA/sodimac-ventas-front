// import Logout from "@/components/login/Logout";
import { LeftSideBarMenu } from "@/interfaces/left-sidebar-menu.interface";
import Link from "next/link";

interface Props {
  leftSideMenu: LeftSideBarMenu[];
}
function LeftSideBar(props: Props) {
  const { leftSideMenu } = props;

  return (
    <section
      className="sticky
        left-0 top-0 h-screen  flex flex-col gap-16 overflow-y-auto 
        p-6 dark:shadow-none max-sm:hidden lg:w-[90px] py-16 shadow-sodimac z-auto"
    >
      {leftSideMenu.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="flex items-center justify-center w-full text-center rounded-lg
              hover:bg-primary-light cursor-pointer"
          >
            {item.icon()}
          </Link>

      ))}
          {/* <div>
            <Logout />
          </div> */}
    </section>
  );
}

export default LeftSideBar;
