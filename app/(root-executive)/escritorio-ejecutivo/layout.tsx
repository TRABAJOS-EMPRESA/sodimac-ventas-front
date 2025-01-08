// import Footer from "@/components/footer/Footer";
import LeftSideBar from "@/components/navigation/left-sidebar/LeftSideBar";
import NavBar from "@/components/navigation/nav/NavBar";
import { leftSideBarMenuExecutive } from "@/constants/menus";

export default function RootExecutiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative">
      <div className="flex">
        <LeftSideBar leftSideMenu={leftSideBarMenuExecutive} />
        <div className="flex flex-1 flex-col w-full">
          <NavBar />
          <section className="flex min-h-screen flex-col max-w-[1080px] m-auto">
            {children}
          </section>

          {/* <div>
            <Footer />
          </div> */}
        </div>
      </div>
    </main>
  );
}
