"use server";

import { ErrorResp } from "@/interfaces/error-resp/get-roles-error.interface";
import { ProjectType } from "@/interfaces/project-types/project-types.interface";
import { auth } from "@/utils/auth";
import { refreshTokenServer } from "../refresh-token/refresh-token.action";
import { updateSessionTokens } from "../update-session/update-session.action";

export async function getProjectTypes(): Promise<
  ProjectType[] | ErrorResp | []
> {
  const endpoint = `${process.env.BACKEND_URL}/project-types`;
  const session = await auth();
  // console.log("endpoint", endpoint);
  // console.log("apikey desde projecttttttttt", apikey);
  
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
      const data: ProjectType[] = await response.json();

      // console.log("data desde project types action", data);

      return data;
    } else {
      const errorData: ErrorResp = await response.json();
      console.log("errorData", errorData);
      return errorData;
    }
  } catch (error) {
    console.log("error desde project types action", error);

    return {
      error: "NetworkError",
      message: (error as Error).message,
      statusCode: 500,
    };
  }
}
