"use server";

import { ErrorResp } from "@/interfaces/error-resp/get-roles-error.interface";

import { auth } from "@/utils/auth";
import { refreshTokenServer } from "../refresh-token/refresh-token.action";
import { updateSessionTokens } from "../update-session/update-session.action";
import { Task } from "@/interfaces/task/task.interface";

export async function getTaskByIdExecutive(): Promise<Task[] | ErrorResp | []> {
  const session = await auth();
  //   console.log("session", session?.user.id);
  if (!session?.user.id) {
    const error: ErrorResp = {
      message: "No session found",
      error: "AuthError",
      statusCode: 401,
    };
    return error;
  }
  const endpoint = `${process.env.BACKEND_URL}/tasks/executive/${session?.user.id}`;
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
      const data: Task[] = await response.json();

      console.log("data task desde servicio ->", data);

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
