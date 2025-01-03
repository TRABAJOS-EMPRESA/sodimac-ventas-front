import { auth } from "@/utils/auth";
import { redirect } from "next/navigation";

export default async function RootHomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

console.log("session", session);

  if (!session || session.user.role !== "EJECUTIVO") {
    redirect("/login");
  }

  return (
    <main>
      <h1>
        <ul>
          <li>user: {session?.user?.email}</li>
          <li>role: {session?.user?.role}</li>
          <li>token: {session?.user?.token}</li>
        </ul>
      </h1>
      {children}
    </main>
  );
}
