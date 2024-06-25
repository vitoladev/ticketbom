import './global.css';
import { ThemeProvider } from 'next-themes';
import Footer from '../components/ui/footer';
import React from 'react';
import { ReactQueryProvider } from '../providers/ReactQueryProvider';
import Nav from '../components/ui/nav';
import { UserProvider } from '../providers/UserProvider';
import { auth } from './auth/auth';
import { OrderProvider } from '../providers/OrderProvider';

export const metadata = {
  title: 'TicketBom',
};

const Providers = async ({ children }: { children: React.ReactNode }) => {
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-black min-h-dvh">
        <Providers>
          <main>
            <Nav />
            {children}
            <Footer />
          </main>
        </Providers>
      </body>
    </html>
  );
}
