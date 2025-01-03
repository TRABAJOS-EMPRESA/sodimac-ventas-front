"use client"; // Marca el componente como cliente

import { signOut } from "next-auth/react";
import React from "react";

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Strict;`;
  document.cookie = "authjs.session-token=; Max-Age=0; path=/";
  document.cookie = "next-auth.session-token=; Max-Age=0; path=/";
  document.cookie = "authjs.csrf-token=; Max-Age=0; path=/";
  document.cookie = "next-auth.csrf-token=; Max-Age=0; path=/";
  document.cookie = "authjs.callback-url=; Max-Age=0; path=/";
  document.cookie = "next-auth.callback-url=; Max-Age=0; path=/";
};

function Logout() {
  async function handleLogout() {
    deleteCookie("TOKEN");
    deleteCookie("USER_ID");
    deleteCookie("ROLE");

    await signOut({ redirect: true, callbackUrl: "/login" });
  }

  return (
    <div>
      <button
        onClick={() => handleLogout()}
        className="bg-blue-500 py-3 px-2 rounded-xl my-10"
      >
        Logout
      </button>
    </div>
  );
}

export default Logout;
