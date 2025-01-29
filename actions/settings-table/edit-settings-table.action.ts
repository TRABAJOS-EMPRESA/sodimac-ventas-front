"use server";

import { ColumnConfig } from "@/constants/column-config.constant";
import { ErrorResp } from "@/interfaces/error-resp/get-roles-error.interface";
import { GetSettingsTable } from "@/interfaces/table-settings/get-settings-table.interface";
import { auth } from "@/utils/auth";
import { revalidateTag } from "next/cache";
import { refreshTokenServer } from "../refresh-token/refresh-token.action";
import { updateSessionTokens } from "../update-session/update-session.action";

export async function editSettingsTable(
  settings: ColumnConfig[]
): Promise<GetSettingsTable | ErrorResp> {
  const session = await auth();
  if (!session?.user.id) {
    const error: ErrorResp = {
      message: "No session found",
      error: "AuthError",
      statusCode: 401,
    };
    return error;
  }

  console.log("settings desde endpoint", settings);

  const objectSettingsTableEdit = settings.map((setting) => {
    return {
      key: setting.key,
      label: setting.label,
      visible: setting.visible,
    };
  });

  const endpoint = `${process.env.BACKEND_URL}/settings/executive/table/opportunity/edit`;

  try {
    let response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.accessTokenBack}`,
      },
      body: JSON.stringify({
        userId: session.user.id,
        settings: objectSettingsTableEdit,
      }),
    });

    if (response.status === 401 && session) {
      const newTokens = await refreshTokenServer(
        session.user.refreshTokenBack!
      );

      await updateSessionTokens(newTokens.accessToken, newTokens.refreshToken);

      response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.accessTokenBack}`,
        },
      });
    }

    if (response.ok) {
      const data: GetSettingsTable = await response.json();
      revalidateTag("get-config-table");
      return data;
    } else {
      const errorData: ErrorResp = await response.json();
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
