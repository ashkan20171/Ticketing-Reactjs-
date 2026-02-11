import { Role } from "../../auth/model/auth";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  department?: "فنی" | "مالی" | "فروش"; // for agents (optional)
};
