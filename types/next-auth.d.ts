import { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: Role;
      organisationId?: string | null;
      organisation?: {
        id: string;
        name: string;
      } | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    role: Role;
    organisationId?: string | null;
    organisation?: {
      id: string;
      name: string;
    } | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
    organisationId?: string | null;
    organisation?: {
      id: string;
      name: string;
    } | null;
  }
}
