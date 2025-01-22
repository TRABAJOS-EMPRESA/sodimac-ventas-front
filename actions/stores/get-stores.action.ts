"use server";

import { ErrorResp } from "@/interfaces/error-resp/get-roles-error.interface";
import { GetStoresResp } from "@/interfaces/stores/store.interface";
import { auth } from "@/utils/auth";

export async function getStores(): Promise<GetStoresResp[] | ErrorResp | []> {
  const endpoint = `${process.env.BACKEND_URL}/stores`;
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
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.user.accessTokenBack}`,
      },
    });
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
