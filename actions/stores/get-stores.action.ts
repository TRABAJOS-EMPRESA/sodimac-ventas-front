"use server";

import { ErrorResp } from "@/interfaces/error-resp/get-roles-error.interface";
import { GetStoresResp } from "@/interfaces/stores/store.interface";
import { auth } from "@/utils/auth";
import { refreshTokenServer } from "../refresh-token/refresh-token.action";
import { updateSessionTokens } from "../update-session/update-session.action";

export async function getStores(): Promise<GetStoresResp[] | ErrorResp | []> {
  const endpoint = `${process.env.BACKEND_URL}/stores`;
  const session = await auth();
  // console.log("endpoint", endpoint);

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

      response = await fetch(`${process.env.BACKEND_URL}/api/stores`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.user.accessTokenBack}`,
        },
      });
    }
    if (response.ok) {
      const data: GetStoresResp[] = await response.json();

      // console.log('stores', data);

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
