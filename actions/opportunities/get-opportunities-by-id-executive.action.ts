"use server";

import { ErrorResp } from "@/interfaces/error-resp/get-roles-error.interface";
import { GetOpportunitiesByIDExecutive } from "@/interfaces/opportunities/get-opportunities-by-executiveId.interface";

import { auth } from "@/utils/auth";

export interface PaginationGetOpportunitiesByIdExecutive {
  page: number;
  limit: number;
}

export async function getOpportunitiesByIdExecutive(
  pagination: PaginationGetOpportunitiesByIdExecutive
): Promise<GetOpportunitiesByIDExecutive[] | ErrorResp | []> {
  const session = await auth();
  console.log("session", session?.user.id);
  if (!session?.user.id) {
    const error: ErrorResp = {
      message: "No session found",
      error: "AuthError",
      statusCode: 401,
    };
    return error;
  }
  const endpoint = `${process.env.BACKEND_URL}/opportunities/executive/child/filter?executiveId=${session?.user.id}&page=${pagination.page}&limit=${pagination.limit}`;
  const apikey = process.env.API_KEY as string;
  // console.log("endpoint", endpoint);
  // console.log("apikey", apikey);
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
        "api-key": apikey,
      },
      next: {tags: ['opportunities']}
    });
    if (response.ok) {
      const data: GetOpportunitiesByIDExecutive[] = await response.json();

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
