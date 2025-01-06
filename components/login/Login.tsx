"use client";

import Image from "next/image";
import AuthForm from "./AuthForm";
import { SignInSchema } from "@/lib/validations";
// import { useEffect } from "react";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";

function Login() {
  // useEffect(() => {
  //   const values = {
  //     email: "test5@test5.com",
  //     password: "S@ntino123",
  //   };

  //   async function handleSubmit() {
  //     console.log("values", values);

  //     try {
  //       const res = await signIn("credentials", {
  //         ...values,
  //         redirect: false,
  //       });

  //       console.log("res SIGINT", res);

  //       if (res?.error) {
  //         console.error("Error:", res.error);
  //       } else {
  //         console.log("Inicio de sesión exitoso:", res);
  //       }
  //     } catch (error) {
  //       console.error("Error al iniciar sesión:", error);
  //     }
  //   }

  //   handleSubmit();
  // }, []);

  return (
    <div>
      <div>
        <Image
          src="/img/login-group.png"
          alt="login-group"
          width={350}
          height={350}
        />
      </div>

      <AuthForm
        formType="SIGN-IN"
        schema={SignInSchema}
        defaultValues={{ email: "", password: "" }}
        onSubmit={(data) => Promise.resolve({ success: true, data })}
      />
    </div>
  );
}

export default Login;
