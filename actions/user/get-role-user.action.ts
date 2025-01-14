import { ErrorResp } from "@/interfaces/error-resp/get-roles-error.interface";
import { GetRoleResp } from "@/interfaces/user/get-role/get-role-user-resp.interface";

export async function getRoleUser(
  email: string
): Promise<GetRoleResp | ErrorResp> {
  const endpoint = `${process.env.BACKEND_URL}/user/find?email=${email}`;
  const apikey = process.env.API_KEY;

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
        "api-key": apikey,
      },
    });

    if (response.ok) {
      const data: GetRoleResp = await response.json();
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
