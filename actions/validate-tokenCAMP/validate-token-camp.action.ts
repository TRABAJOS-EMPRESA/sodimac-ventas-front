export async function validateTokenWithUserInfo(
  token: string
): Promise<boolean> {
  const userInfoEndpoint = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/userinfo`;

  // console.log("userInfoEndpoint", userInfoEndpoint);
  // console.log("token desde validateTokenWithUserInfo", token);

  try {
    const response = await fetch(userInfoEndpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      // Si el token es válido, Keycloak responde con los datos del usuario
      console.log("Token válido");
      return true;
    } else {
      console.error("Token inválido, error:", response.status);
      return false;
    }
  } catch (error) {
    console.error("Error al validar el token:", error);
    return false;
  }
}
