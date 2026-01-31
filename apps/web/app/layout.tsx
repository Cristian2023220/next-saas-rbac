import type { Metadata } from "next";
import './globals.css'
import { Providers } from '@/components/providers'

export const metadata: Metadata = {
  title: "Create Next App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}