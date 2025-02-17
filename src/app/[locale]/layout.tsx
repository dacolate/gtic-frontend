import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
// import { notFound } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GTIC School Management Dashboard",
  description: "GTIC School Management",
};
// export function generateStaticParams() {
//   return [{ locale: "en" }, { locale: "fr" }, { locale: "de" }];
// }

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const p = await params;
  const locale = p.locale;
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
