import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";

const BASE_URL = process.env.BASE_URL;
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const cookieStore = await cookies();
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Missing username or password");
          }

          const response = await fetch(`${BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            throw new Error("Invalid credentials");
          }

          const { user } = await response.json();
          if (!user) {
            throw new Error("No user returned from server");
          }

          cookieStore.set("USER_ID", user.id.toString());
          cookieStore.set("TOKEN", user.token);
          cookieStore.set("ROLE", user.role);

          const payloadJwt = JSON.parse(
            Buffer.from(user.token.split(".")[1], "base64").toString()
          );

          // console.log("payload jwt", payloadJwt.exp);

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            token: user.token,
            role: user.role,
            accessTokenExpires: payloadJwt.exp,
          };
        } catch (error) {
          console.error("Authorize Error:", error);
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        console.log("User desde JWT: --->", user);
        console.log("Token --->", token);

        return {
          ...token,
          ...user,
        };
      }

      return token;
    },
    session: async ({ session, token }) => {
      // console.log("session en session", session);
      // console.log("token en session", token);

      if (token.error) {
        session.error = token.error;
      }

      if (token.token) {
        session.user.token = token.token;
      }

      if (token.role) {
        session.user.role = token.role!;
      }

      // console.log("Session: desde sesioon", session);

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hora
  },
};
