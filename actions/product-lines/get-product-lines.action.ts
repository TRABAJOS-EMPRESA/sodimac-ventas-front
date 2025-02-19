import { ErrorResp } from "@/interfaces/error-resp/get-roles-error.interface";
import { ProductLine } from "@/interfaces/product-lines/product-lines.interface";
import { auth } from "@/utils/auth";
import { refreshTokenServer } from "../refresh-token/refresh-token.action";
import { updateSessionTokens } from "../update-session/update-session.action";

export async function getProductLines(): Promise<
  ProductLine[] | ErrorResp | []
> {
  const endpoint = `${process.env.BACKEND_URL}/product-lines`;
  const session = await auth();
  // console.log("endpoint", endpoint);
  // console.log("apikey", apikey);

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
      const data: ProductLine[] = await response.json();
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
