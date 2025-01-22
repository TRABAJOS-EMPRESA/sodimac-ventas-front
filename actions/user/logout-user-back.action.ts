import { ErrorResp } from "@/interfaces/error-resp/get-roles-error.interface";
import { auth } from "@/utils/auth";

export async function logoutUserBack(): Promise<string | ErrorResp> {
  const endpoint = `${process.env.BACKEND_URL}/auth/logout`;

  const session = await auth();

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({ email: session?.user.email }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.accessTokenBack}`,
      },
    });

    console.log("RESPONSEEEE ->>>>", response);

    if (response.status == 200) {
      const data = await response.json();

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
