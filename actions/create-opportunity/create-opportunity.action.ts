"use server";

import { ErrorResp } from "@/interfaces/error-resp/get-roles-error.interface";
import { CreateOpportunityRequest } from "@/interfaces/opportunities/create-oportunity.interface";
import { auth } from "@/utils/auth";
import { revalidateTag } from "next/cache";
import { refreshTokenServer } from "../refresh-token/refresh-token.action";
import { updateSessionTokens } from "../update-session/update-session.action";

export async function createOpportunity(
  opportunityData: CreateOpportunityRequest
): Promise<CreateOpportunityRequest | ErrorResp> {
  console.log("opportunityData ----->>>>>>>", opportunityData);

  const endpoint = `${process.env.BACKEND_URL}/opportunities/create`;
  const apikey = process.env.API_KEY as string;
  const session = await auth();

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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.accessTokenBack}`,
      },
      body: JSON.stringify([opportunityData]),
    });

    if (response.status === 401 && session) {
      const newTokens = await refreshTokenServer(
        session.user.refreshTokenBack!
      );

      await updateSessionTokens(newTokens.accessToken, newTokens.refreshToken);

      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.accessTokenBack}`,
        },
      });
    }

    if (response.ok) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = await response.json();
      console.log("CREACION -> ", data);
      revalidateTag("opportunities");
      return data;
    } else {
      const errorData: ErrorResp = await response.json();
      console.error("Error al crear la oportunidad:", errorData);
      return errorData;
    }
  } catch (error) {
    console.error("Error de red al crear la oportunidad:", error);
    return {
      error: "NetworkError",
      message: (error as Error).message,
      statusCode: 500,
    };
  }
}
