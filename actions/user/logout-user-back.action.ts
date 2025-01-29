"use server";

import { ErrorResp } from "@/interfaces/error-resp/get-roles-error.interface";
import { auth } from "@/utils/auth";
import { refreshTokenServer } from "../refresh-token/refresh-token.action";
import { updateSessionTokens } from "../update-session/update-session.action";

export async function logoutUserBack(
  email: string,
  token: string
): Promise<{ message: string } | ErrorResp> {
  const endpoint = `${process.env.BACKEND_URL}/auth/logout`;
  const session = await auth();

  // console.log("URLL BAAAAACKKKK LOGOUT", endpoint);
console.log('token desde logout', token);

  try {
    let response = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({ email: email }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("RESPONSEEEE LOGOUT ->>>>", response);

    if (response.status === 401 && session) {
      const newTokens = await refreshTokenServer(
        session.user.refreshTokenBack!
      );

      console.log("newTokens ->>>>>>", newTokens);

      await updateSessionTokens(newTokens.accessToken, newTokens.refreshToken);

      response = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({ email: email }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newTokens.accessToken}`,
        },
      });
    }

    if (response.ok) {
      const data = await response.json();
      console.log("data desde logout", data);

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
