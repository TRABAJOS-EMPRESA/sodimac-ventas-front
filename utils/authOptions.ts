
import  NextAuth, { NextAuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      name: "keycloak",
      clientId: process.env.KEYCLOAK_CLIENT_ID as string,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET as string,
      // AQUI SE DEBE CAMBIAR LA URL DE KEYCLOAK
      issuer: process.env.KEYCLOAK_ISSUER as string,
    }),
  ],
  callbacks: {
    // CALLBACKN PARA MANIPULAR EL TOKEN DE NEXTAUTH
    async jwt({ token, account, profile }) {
      // SI EL USUARIO PRIMERA VEZ QUE SE AUTENTICA
      if (account && profile) {
        token.email = profile.email;

        // AQUI OBTENEMOS EL ROL HACIA NUESTRO BACKEND EN NEST
        // EN ESTE CASO ESSTA BASADO EN EL CORREO
        const response = await fetch(`${process.env.BACKEND_URL}/api/user/role`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${account.access_token}`,
          },
          body: JSON.stringify({ email: profile.email }),
        });
        
        try {
          if (response.ok) {
            const { role } = await response.json();
            token.role = role; // Agrega el rol al token
          } else {
            console.error("Error al obtener el rol:", response.statusText);
            token.role = "unknown"; // Fallback a un rol predeterminado
          }
        } catch (error) {
          console.error("Excepción al obtener el rol:", error);
          token.role = "unknown"; // Fallback seguro
        }
     
      }
      return token;
    },
    // AQUI MANEJAMOS LA SESION
    async session({ session, token }) {
      session.user = {
        id: token.sub!,
        name: token.name || "",
        email: token.email!,
        role: token.role!,
        token: token.token,
      };
      session.user.token = token.token;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hora
  },
};

export default NextAuth(authOptions);
