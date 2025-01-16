// import Logout from "@/components/login/Logout";
import { LeftSideBarMenu } from "@/interfaces/navigation/left-sidebar-menu.interface";
import Link from "next/link";
import Image from "next/image";

interface Props {
  leftSideMenu: LeftSideBarMenu[];
}
function LeftSideBar(props: Props) {
  const { leftSideMenu } = props;

  return (
    <section
      className="sticky
        left-0 top-0 h-screen border-none flex flex-col gap-16 overflow-y-auto 
        pl-2 px-2 max-sm:hidden lg:w-[90px] py-2 shadow-sodimac z-auto"
    >
      <Image
        src="/img/mi_radar_only_icon.svg"
        alt="logo"
        width={100}
        height={100}
      />
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
