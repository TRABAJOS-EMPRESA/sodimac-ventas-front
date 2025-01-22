// import Footer from "@/components/footer/Footer";
// import { validateTokenWithUserInfo } from "@/actions/validate-tokenCAMP/validate-token-camp.action";
import LeftSideBar from "@/components/navigation/left-sidebar/LeftSideBar";
import NavBar from "@/components/navigation/nav/NavBar";
import { leftSideBarMenuExecutive } from "@/constants/menus";
import { auth } from "@/utils/auth";

export default async function RootExecutiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  console.log("session desde componente ejecutivio", session);

  // if (session) {
  //   const isValidate = await validateTokenWithUserInfo(session.user.tokenKeycloak!);
  //   console.log("isValidate", isValidate);
  // }

  return (
    <main className="relative">
      <div className="flex">
        <LeftSideBar leftSideMenu={leftSideBarMenuExecutive} />
        <div className="flex flex-1 flex-col w-full">
          <NavBar />
          <section className="flex min-h-screen flex-col max-w-[1600px] m-auto py-28">
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
