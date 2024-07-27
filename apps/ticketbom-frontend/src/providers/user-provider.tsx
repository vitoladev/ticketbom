'use client';

import { User } from 'next-auth';
import { createContext, useContext } from 'react';

interface UserContextProps {
  user: User | undefined;
}

const UserContext = createContext<UserContextProps>({
  user: undefined,
});

export const UserProvider = ({
  user,
  children,
}: {
  user: User | undefined;
  children: React.ReactNode;
}) => {
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
