"use server";

import { cookies } from "next/headers";
import { VerifyToken } from "../interfaces/verify-token.interface";

export async function verifyToken():Promise<VerifyToken> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("TOKEN");
    console.log("token", token);

    const response = await fetch(`${process.env.BASE_URL}/api/auth/verify`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
    });

    console.log("response", response);

    if (!response.ok) {
      throw new Error("Invalid credentials");
    }

    const res = await response.json();

    console.log("res", res);

    return res;
  } catch (error) {
    console.error("Authorize Error:", error);
    throw new Error("Invalid credentials");
  }
}
