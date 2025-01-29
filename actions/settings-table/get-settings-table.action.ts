"use server";

import { ColumnConfig } from "@/constants/column-config.constant";
import { ErrorResp } from "@/interfaces/error-resp/get-roles-error.interface";
import { GetSettingsTable } from "@/interfaces/table-settings/get-settings-table.interface";

import { auth } from "@/utils/auth";
import { refreshTokenServer } from "../refresh-token/refresh-token.action";
import { updateSessionTokens } from "../update-session/update-session.action";

export interface PaginationGetOpportunitiesByIdExecutive {
  page: number;
  limit: number;
}

export async function getSettingsTable(): Promise<ColumnConfig[] | ErrorResp> {
  const session = await auth();
  if (!session?.user.id) {
    const error: ErrorResp = {
      message: "No session found",
      error: "AuthError",
      statusCode: 401,
    };
    return error;
  }
  const endpoint = `${process.env.BACKEND_URL}/settings/executive/table/opportunity/get/${session?.user.id}`;
  // console.log("endpoint", endpoint);
  // console.log("apikey", apikey);

  try {
    let response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user.accessTokenBack}`,
      },
      next: { tags: ["get-config-table"] },
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
      const data: GetSettingsTable = await response.json();
      console.log("settings", data.settings);

      return data.settings;
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
