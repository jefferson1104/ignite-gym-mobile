import { createContext, ReactNode, useState } from "react";

import { UserDTO } from "@dtos/UserDTO";

export type AuthContextDataProps = {
  user: UserDTO;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  // Hooks
  const [user, setUser] = useState({
    id: "123456",
    name: "John Doe",
    email: "johndoe@email.com",
    avatar: "john-doe.png",
  });

  // Renders
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}
