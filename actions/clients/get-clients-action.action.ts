"use server";

import { GetClientResp } from "@/interfaces/client/client.interface";
import { ErrorResp } from "@/interfaces/error-resp/get-roles-error.interface";
import { auth } from "@/utils/auth";
import { refreshTokenServer } from "../refresh-token/refresh-token.action";
import { updateSessionTokens } from "../update-session/update-session.action";

export async function getClients(): Promise<GetClientResp[] | ErrorResp | []> {
  const endpoint = `${process.env.BACKEND_URL}/clients`;
  const apikey = process.env.API_KEY as string;
  const session = await auth();
  console.log("endpoint", endpoint);
  console.log("apikey", apikey);
  if (!apikey) {
    const error: ErrorResp = {
      message: "API key no está configurada",
      error: "ConfigError",
      statusCode: 400,
    };
    return error;
  }
  try {
    let response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user.accessTokenBack}`,
      },
    });

    if (response.status === 401 && session) {
      const newTokens = await refreshTokenServer(
        session.user.refreshTokenBack!
      );

      await updateSessionTokens(newTokens.accessToken, newTokens.refreshToken);

      response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.user.accessTokenBack}`,
        },
      });
    }
    if (response.ok) {
      const data: GetClientResp[] = await response.json();
      return data;
    } else {
      const errorData: ErrorResp = await response.json();

      console.log("errorData", errorData);
      return errorData;
    }
  } catch (error) {
    console.log("error desde stores action", error);

    return {
      error: "NetworkError",
      message: (error as Error).message,
      statusCode: 500,
    };
  }
}
