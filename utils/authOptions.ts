import { NextAuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
// import CredentialsProvider from "next-auth/providers/credentials";
import { getRoleUser } from "@/actions/user/get-role-user.action";

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      name: "keycloak",
      clientId: process.env.KEYCLOAK_CLIENT_ID as string,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "",
      issuer: process.env.KEYCLOAK_ISSUER,
    }),

    // HABILITAR E INTEGRAR PARA FUTURO LOGIN TRADICIONAL
    // CredentialsProvider({
    //   name: "credentials",
    //   credentials: {
    //     email: { label: "Email", type: "text" },
    //     password: { label: "Password", type: "password" },
    //   },
    //   // async authorize(credentials) {
    //   //   try {
    //   //     const response = await fetch(
    //   //       `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
    //   //       {
    //   //         method: "POST",
    //   //         headers: { "Content-Type": "application/json" },
    //   //         body: JSON.stringify({
    //   //           email: credentials?.email,
    //   //           password: credentials?.password,
    //   //         }),
    //   //       }
    //   //     );

    //   //     if (response.ok) {
    //   //       const { user } = await response.json();

    //   //       console.log("user desde autorize", user);

    //   //       return {
    //   //         id: user.id,
    //   //         name: user.name,
    //   //         email: user.email,
    //   //         role: user.role,
    //   //         tokenCredentials: user.token,
    //   //       }; // Devuelve el usuario si es válido
    //   //     } else {
    //   //       const error = await response.json();
    //   //       throw new Error(error.message || "Error de autenticación");
    //   //     }
    //   //   } catch (err) {
    //   //     console.error("Error en authorize:", err);
    //   //     throw new Error("No se pudo conectar al servidor.");
    //   //   }
    //   // },
    // }),
  ],
  callbacks: {
    // CALLBACKN PARA MANIPULAR EL TOKEN DE NEXTAUTH
    async jwt({ token, user, account }) {
      if (user && account?.provider === "keycloak") {
        try {
          const response = await getRoleUser(user.email, account.access_token!, account.refresh_token!);
          // const response = await getRoleUser(user.email, account.access_token!);

          if ("error" in response) {
            console.log(
              "Error al obtener datos adicionalessssss:",
              response.error
            );
          } else {
            console.log("RESPONSE GET INFO USER", response);

            token.role = response.role.name;
            token.id = response.id;
            token.name = response.names;
            token.email = response.email;
            // token.accessTokenCamp = account.access_token;
            token.refreshAccessTokenCamp = account.refresh_token;
            token.accessTokenBack = response.tokenBack.accessTokenBack;
            token.refreshTokenBack = response.tokenBack.refreshTokenBack;
            token.provider = account?.provider;
          }
        } catch (error) {
          console.error("Error obteniendo datos adicionales:", error);
        }

        // console.log("user desde jwt", user);
      } else if (user && account?.provider === "credentials") {
        // console.log("user desde jwt", user);

        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;

        token.provider = account?.provider;
      }

      // if (account && token) {

      //   console.log("account", account);
      //   console.log("profile", profile);

      // console.log("token desde JWT", token);

      return token;
    },

    // AQUI MANEJAMOS LA SESION
    async session({ session, token }) {
      // console.log("token desde sesion", token);

      if (token && token.provider === "keycloak") {
        session.user = {
          id: token.sub!,
          name: token.name!,
          email: token.email!,
          role: token.role!,
          // accessTokenCamp: token.accessTokenCamp,
          refreshAccessTokenCamp: token.refreshAccessTokenCamp,
          accessTokenBack: token.accessTokenBack,
          refreshTokenBack: token.refreshTokenBack,
        };
      } else if (token && token.provider === "credentials") {
        session.user = {
          id: token.sub!,
          name: token.name!,
          email: token.email!,
          role: token.role!,
          // tokenCredentials: token.tokenCredentials,
        };
      }

      // console.log("session deesde SESSION CALLBACK", session);

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 30,
  },
  pages: {
    signIn: "/auth/login",
  },
  debug: true,
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
