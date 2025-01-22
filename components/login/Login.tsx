"use client";

import Image from "next/image";
import AuthForm from "./AuthForm";
import { SignInSchema } from "@/lib/validations";
import { signIn } from "next-auth/react";

import { useRouter } from "next/navigation";

function Login() {


  const router = useRouter();

  return (
    <div className="p-8 md:w-1/4 md:p-0">
      <div className="flex flex-col w-full justify-center items-center space-y-5">
        <Image
          src="/img/sodimac.png"
          alt="login-group"
          width={200}
          height={100}
        />
        <Image
          src="/img/mi-radar.png"
          alt="login-group"
          width={400}
          height={100}
        />
      </div>

      <AuthForm
        formType="SIGN-IN"
        schema={SignInSchema}
        defaultValues={{ email: "", password: "" }}
        onSubmit={async (data) => {
          const result = await signIn("credentials", {
            email: data.email,
            password: data.password,
          });

          if (result?.error) {
            console.log("Error de inicio de sesión:", result.error);
            return { success: false };
          } else {
            console.log("Inicio de sesión exitoso:", result);
            router.push("/");
            return { success: true };
          }
        }}
      />
    </div>
  );
}

export default Login;
