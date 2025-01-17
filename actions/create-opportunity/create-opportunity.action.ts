'use server'

import { ErrorResp } from "@/interfaces/error-resp/get-roles-error.interface";
import { CreateOpportunityRequest } from "@/interfaces/opportunities/create-oportunity.interface";

export async function createOpportunity(
  opportunityData: CreateOpportunityRequest
): Promise<CreateOpportunityRequest | ErrorResp> {

  console.log("opportunityData", opportunityData);
  
  const endpoint = `${process.env.BACKEND_URL}/opportunities/create`;
  const apikey = process.env.API_KEY as string;

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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apikey,
      },
      body: JSON.stringify([opportunityData]),
    });

    if (response.ok) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = await response.json();
      console.log("CREACION -> ", data);

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
