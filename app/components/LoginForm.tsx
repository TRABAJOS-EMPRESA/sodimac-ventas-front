"use client";

import { signIn } from "next-auth/react";

import React, { useState } from "react";

function LoginForm() {
  const [error, setError] = useState<string | null>(null);

  const values = {
    email: "test4@test4.com",
    password: "S@ntino123",
  };

  async function handleSubmit() {
    console.log("values", values);

    try {
      const res = await signIn("credentials", {
        ...values,
        redirect: true,
        callbackUrl: "/",
      });

      console.log("res SIGINT", res);

      if (res?.error) {
        setError("Error de inicio de sesión. Verifica tus credenciales.");
        console.error("Error:", res.error);
      } else {
        console.log("Inicio de sesión exitoso:", res);
        setError(null);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError("Ocurrió un error inesperado. Inténtalo más tarde.");
    }
  }

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleSubmit}>Login</button>
    </div>
  );
}

export default LoginForm;
