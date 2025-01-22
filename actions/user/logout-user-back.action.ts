'use server'

import { ErrorResp } from "@/interfaces/error-resp/get-roles-error.interface";

export async function logoutUserBack(email: string, token: string): Promise<{message: string} | ErrorResp> {
  const endpoint = `${process.env.BACKEND_URL}/auth/logout`;

// console.log("URLL BAAAAACKKKK LOGOUT", endpoint);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({ email: email }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("RESPONSEEEE ->>>>", response);

    if (response.status == 200) {
      const data = await response.json();

      return data;
    } else {
      const errorData: ErrorResp = await response.json();

      console.log("errorData", errorData);

      return errorData;
    }
  } catch (error) {
    return {
      error: "NetworkError",
      message: (error as Error).message,
      statusCode: 500,
    };
  }
}
