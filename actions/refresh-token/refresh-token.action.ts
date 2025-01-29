"use server";

export async function refreshTokenServer(refreshToken: string) {
  console.log("refreshTokenServer", refreshToken);

  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      }
    );

  
    const responseData = await response.json();

    console.log("refreshTokenServer RESPONSEEEE ->>>>>>", responseData);

    if (!response.ok) {
      throw new Error("Error renovando el token");
    }

    
    return responseData;
  } catch (error) {
    console.error("Error en refreshTokenServer:", error);
    throw error;
  }
}
