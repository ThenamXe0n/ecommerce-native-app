export type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

export type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isHydrated: boolean;

  setAuth: (data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  }) => void;

  setHydrate: (value: boolean) => void;

  updateAccessToken: (accessToken: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
};
