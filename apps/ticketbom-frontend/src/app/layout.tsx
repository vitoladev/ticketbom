import './global.css';
import { Inter } from 'next/font/google';
import { Libre_Franklin } from 'next/font/google';
import { Cormorant_Garamond } from 'next/font/google';
import Nav from '../components/ui/nav';
import Footer from '../components/ui/footer';
import { auth } from './auth/auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'TicketBom',
};

const libre_franklin = Libre_Franklin({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-libre_franklin',
});
const cormorant_garamond = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cormorant_garamond',
  weight: '300',
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  console.log({ session });

  return (
    <html lang="en">
      <body
        className={libre_franklin.variable + ' ' + cormorant_garamond.variable}
      >
        <Nav
          user={{
            name: session?.user?.name || '',
            image: session?.user?.image || '',
          }}
        />
        {children}
        <Footer />
      </body>
    </html>
  );
}
