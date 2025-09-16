import pkg from "../package.json" assert { type: "json" };

export const appVersion: string = (pkg as any).version as string;
export const releaseChannel: string =
  process.env.NEXT_PUBLIC_RELEASE_CHANNEL ||
  (process.env.NODE_ENV === "production" ? "prod" : "dev");
export const gitShaShort: string | undefined =
  process.env.NEXT_PUBLIC_GIT_SHA?.slice(0, 7);


