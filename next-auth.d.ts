import { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
};
// // importantisimooooooo para el error que habia pas que el user de next auth es string
// declare module 'next-auth' {
//   interface User {
//     id: number; // <- here it is
//   }
// }

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
    error: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    token: string;
    user: User;
    error?: string;
    role?: string;
  }
}
