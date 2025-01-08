import { NextAuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      name: "keycloak",
      clientId: process.env.KEYCLOAK_CLIENT_ID as string,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET as string,
      // Y LA URL DE NEXTAUTH QUE DEBEMOS ENVIAR ES
      // http://localhost:3000/api/auth/callback/keycloak
      // AQUI SE DEBE CAMBIAR LA URL DE KEYCLOAK ES LA URL DEL SERVIDOR DE KEY

      issuer: process.env.KEYCLOAK_ISSUER as string,
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
              }),
            }
          );

          if (response.ok) {
            const { user } = await response.json();

            console.log("user desde autorize", user);

            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              tokenCredentials: user.token,
            }; // Devuelve el usuario si es válido
          } else {
            const error = await response.json();
            throw new Error(error.message || "Error de autenticación");
          }
        } catch (err) {
          console.error("Error en authorize:", err);
          throw new Error("No se pudo conectar al servidor.");
        }
      },
    }),
  ],
  callbacks: {
    // CALLBACKN PARA MANIPULAR EL TOKEN DE NEXTAUTH
    async jwt({ token, user, account }) {
      if (user && account?.provider === "keycloak") {
        // LOGICA DE OBTENCION DE ROL EN KEYCLOAK
        // TRAER LA RESPUESTA DE BACKEND RESPECTO AL ROL O PERFIL

        const uuid = account.id;

        // Petición POST para obtener datos adicionales
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/loginCAMP`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ campUuid: uuid }),
            }
          );

          if (response.ok) {
            const additionalData = await response.json();

            //datos adicionales al token
            token.role = additionalData.role;
            token.campUuid = uuid as string
          } else {
            console.error("Error al obtener datos adicionales:", response.statusText);
          }
        } catch (error) {
          console.error("Error obteniendo datos adicionales:", error);
        }

        console.log("user desde jwt", user);

        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.tokenKeycloak = user.tokenKeycloak;
        token.provider = account?.provider;
      } else if (user && account?.provider === "credentials") {
        console.log("user desde jwt", user);

        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.tokenCredentials = user.tokenCredentials;
        token.provider = account?.provider;
      }

      // if (account && token) {

      //   console.log("account", account);
      //   console.log("profile", profile);

      console.log("token desde JWT", token);

      //   // try {
      //   //   const response = await fetch(`${process.env.BACKEND_URL}/api/user/role`, {
      //   //     method: "POST",
      //   //     headers: {
      //   //       "Content-Type": "application/json",
      //   //       ...(account.access_token && {
      //   //         Authorization: `Bearer ${account.access_token}`,
      //   //       }),
      //   //     },
      //   //     body: JSON.stringify({ email: profile!.email }),
      //   //   });

      //   //   if (response.ok) {
      //   //     const { role } = await response.json();
      //   //     token.role = role;
      //   //   } else {
      //   //     console.error("Error al obtener el rol:", response.statusText);
      //   //     token.role = "unknown";
      //   //   }
      //   // } catch (error) {
      //   //   console.error("Excepción al obtener el rol:", error);
      //   //   token.role = "unknown";
      //   // }
      // }
      return token;
    },

    // AQUI MANEJAMOS LA SESION
    async session({ session, token }) {
      console.log("token desde sesion", token);

      if (token && token.provider === "keycloak") {
        session.user = {
          id: token.sub!,
          name: token.name!,
          email: token.email!,
          role: token.role!,
          tokenKeycloak: token.tokenKeycloak,
          provider: token.provider,
        };
      } else if (token && token.provider === "credentials") {
        session.user = {
          id: token.sub!,
          name: token.name!,
          email: token.email!,
          role: token.role!,
          tokenCredentials: token.tokenCredentials,
          provider: token.provider,
        };
      }

      console.log("session deesde sesion", session);

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
};

// TODO: FLUJO NEXTAUTH PARA CREDENCIALES

// 1. EL USUARIO INGRESA SUS CREDENCIALES
// 2. SE ENVIAN LAS CREDENCIALES AL BACKEND
// 3. EL BACKEND VALIDA LAS CREDENCIALES
// 4. EL BACKEND DEVUELVE UN TOKEN DE ACCESO
// 5. EL FRONTEND GUARDA EL TOKEN DE ACCESO
// 6. EL FRONTEND REDIRIGE AL USUARIO A LA PAGINA DE INICIO

// EN EL FLUJO DE KeycloakProvider

// 1. EL USUARIO INGRESA SUS CREDENCIALES
// 2. SE REDIRIGE AL USUARIO A KEYCLOAK
// 3. EL USUARIO INICIA SESION EN KEYCLOAK
// 4. KEYCLOAK REDIRIGE AL USUARIO DE NUEVO AL FRONTEND
// 5. EL FRONTEND GUARDA EL TOKEN DE ACCESO EN LA SESION GRACIAS A QYE LA URL DE RETORNO SERA
//    LA URL DE NEXT AUTH OSEA
//    http://localhost:3000/api/auth/callback/keycloak
// 6. EL FRONTEND REDIRIGE AL USUARIO A LA PAGINA DE INICIO

// PARA AGREGAR ATRIBUTOS A LAS INTERFACES DE SESION O DE USUARIO

// VAMOS AL ARCHIVO NEXT-AUTH.D.TS

// ALLI AGREGAMOS LOS ATRIBUTOS QUE QUEREMOS AGREGAR A LA SESION O AL USUARIO O AL JWT

// EJEMPLO:

// declare module "next-auth" {

//   interface Session {

//     user: ExtendedUser;

//     error: string;

//   }

//   interface User {

//     id: string;

//     name: string;

//     email: string;

//     role: string;

//     tokenCredentials?: string;

//     tokenKeycloak?: string;

//   }
