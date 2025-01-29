"use server";

import { ErrorResp } from "@/interfaces/error-resp/get-roles-error.interface";
import { GetRegionsResp } from "@/interfaces/regions/regions.interface";
import { auth } from "@/utils/auth";
import { refreshTokenServer } from "../refresh-token/refresh-token.action";
import { updateSessionTokens } from "../update-session/update-session.action";

export async function getRegions(): Promise<GetRegionsResp[] | ErrorResp | []> {
  const endpoint = `${process.env.BACKEND_URL}/regions`;
  const session = await auth()
  console.log("endpoint", endpoint);

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
      const data: GetRegionsResp[] = await response.json();
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
