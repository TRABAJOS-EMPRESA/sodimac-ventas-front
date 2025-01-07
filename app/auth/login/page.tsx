// import { auth } from "@/utils/auth";
// import { redirect } from "next/navigation";
import Login from "@/components/login/Login";

const Page = async () => {
  // const session = await auth();

  // console.log("session ->", session);

  // if (session?.user) {
  //   if (session.user.role === "EJECUTIVO") {
  //     redirect("/escritorio-ejecutivo");
  //   } else if (session.user.role === "SUBGERENTE") {
  //     redirect("/escritorio-subgerente");
  //   }
  // }

  return (
    <div className="flex justify-center items-center flex-col h-screen">
      <Login />
    </div>
  );
};

export default Page;
