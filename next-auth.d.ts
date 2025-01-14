// import { DefaultSession } from "next-auth";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       name?: string;
//       email: string;
//       image?: string;
//     } & DefaultSession["user"];
//   }
// }

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name?: string;
    picture?: string;
    email: string;
    sub?: string;
  }
}

import NextAuth from "next-auth";

declare module "next-auth" {
  // Extend the User type to include custom fields
  interface User {
    id: string;
    token?: string; // Add custom property for manual token
    name?: string | null;
    email: string
    image?: string | null;
  }

  // Extend the Session type
  interface Session {
    user: {
      id: string;
      name?: string;
      email: string;
      image?: string;
    };
  }

  // // Extend the JWT type
  // interface JWT {
  //   id: string;
  //   name?: string;
  //   email: string;
  //   picture?: string;
  //   sub?: string;
  //   manualToken?: string; // Add custom property for manual token
  // }
}

