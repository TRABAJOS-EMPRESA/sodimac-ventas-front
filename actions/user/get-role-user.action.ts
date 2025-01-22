import { ErrorResp } from "@/interfaces/error-resp/get-roles-error.interface";
import {
  DecodedAccessToken,
  GetInfoUserResp,
} from "@/interfaces/user/get-role/get-info-user-resp.interface";
import { decode } from "jsonwebtoken"; 

export async function getRoleUser(
  email: string,
  accessToken: string,
  refreshToken: string
): Promise<GetInfoUserResp | ErrorResp> {
  const endpoint = `${process.env.BACKEND_URL}/auth/swap-token`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({
        email: email,
        accessToken: accessToken,
        refreshToken: refreshToken,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("RESPONSEEEE ->>>>", response);

    if (response.ok) {
      const data: { accessToken: string; refreshToken: string } =
        await response.json();

      console.log("Tokens received:", data);

      const decodedAccessToken = decode(data.accessToken);
      console.log("Decoded Access Token Claims:", decodedAccessToken);

      return {
        id: (decodedAccessToken as DecodedAccessToken).id,
        email: (decodedAccessToken as DecodedAccessToken).email,
        names: (decodedAccessToken as DecodedAccessToken).names,
        campUuid: (decodedAccessToken as DecodedAccessToken).campUuid,
        role: (decodedAccessToken as DecodedAccessToken).role,
        tokenBack: {
          accessTokenBack: data.accessToken,
          refreshTokenBack: data.refreshToken,
        },
        expiredTokenBack: (decodedAccessToken as DecodedAccessToken).exp,
      } as unknown as GetInfoUserResp;
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
