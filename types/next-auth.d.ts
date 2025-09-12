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
      mfaRequired?: boolean;
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
    mfaRequired?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    organisationId?: string | null;
    organisation?: {
      id: string;
      name: string;
    } | null;
    mfaRequired?: boolean;
  }
}
