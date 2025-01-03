import { auth } from "@/utils/auth";
import { redirect } from "next/navigation";

export default async function RootManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user.role !== "GERENCIA") {
    redirect("/login");
  }
  return (
    <main>
      <h1>
        <ul>
          <li>user: {session?.user?.email}</li>
          <li>role: {session?.user.role}</li>
          <li>token: {session?.user.token}</li>
        </ul>
      </h1>
      {children}
    </main>
  );
}
