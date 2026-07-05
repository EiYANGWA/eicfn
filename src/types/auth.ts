export type AuthUser = {
  id?: string;
  userId?: string;
  username: string;
  email: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};