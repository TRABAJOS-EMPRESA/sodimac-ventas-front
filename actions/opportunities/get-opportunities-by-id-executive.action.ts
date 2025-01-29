"use server";

import { ErrorResp } from "@/interfaces/error-resp/get-roles-error.interface";
import { GetOpportunitiesByIDExecutive } from "@/interfaces/opportunities/get-opportunities-by-executiveId.interface";

import { auth } from "@/utils/auth";
import { refreshTokenServer } from "../refresh-token/refresh-token.action";
import { updateSessionTokens } from "../update-session/update-session.action";

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
  // console.log("endpoint", endpoint);
  // console.log("apikey", apikey);

  try {
    let response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user.accessTokenBack}`,
      },
      next: { tags: ["opportunities"] },
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
