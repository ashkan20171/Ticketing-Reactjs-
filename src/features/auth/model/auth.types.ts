
export type Role = "user" | "agent" | "admin";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
  displayName?: string;
};

export type AuthTokens = {
  refreshToken: string;
  refreshExpiresAt: number;
};
