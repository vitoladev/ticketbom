import { ThemeProvider } from 'next-themes';
import { auth } from '../app/auth/auth';
import { OrderProvider } from './order-provider';
import { UserProvider } from './user-provider';
import { ReactQueryProvider } from './react-query-provider';

export const Providers = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
    >
      <UserProvider user={session?.user}>
        <ReactQueryProvider>
          <OrderProvider>{children}</OrderProvider>
        </ReactQueryProvider>
      </UserProvider>
    </ThemeProvider>
  );
};
