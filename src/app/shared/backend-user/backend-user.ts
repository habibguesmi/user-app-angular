import { User } from "src/app/models/user.model";

export type BackendUser = User & {
    name?: string;
    username?: string;
    status?: string;
  };