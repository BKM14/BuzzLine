import "./globals.css";
import "@repo/ui/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getSession } from "next-auth/react";
import Providers from "./providers";
import '@mantine/core/styles.css';

const inter = Inter({ subsets: ["latin"] });

import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';

export const metadata: Metadata = {
  title: "Create Turborepo",
  description: "Generated by create turbo",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {

  const session = await getSession();

  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
      <ColorSchemeScript />
      </head>
      <body className={inter.className}>
        <Providers session={session}>
          <MantineProvider>{children}</MantineProvider>
        </Providers>
      </body>
    </html>
  );
}
