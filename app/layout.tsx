import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });
import "react-toastify/dist/ReactToastify.css";
export const metadata: Metadata = {
  title: "Live Payout",
  description: "An Streaming platform who pays you for being here ane doing streams.",
};
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
  
        <html lang="en">
          <head>
          <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon.png"/>
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
          <link rel="manifest" href="/site.webmanifest"/>
          <meta name="msapplication-TileColor" content="#da532c"/>
          <meta name="theme-color" content="#ffffff"/>
          </head>
          <body className={inter.className}>
            <ThemeProvider
              attribute="class"
              forcedTheme="dark"
              storageKey="gamehub-theme"
            >
              <Toaster theme="light" position="bottom-center" />
              {children}
            </ThemeProvider>
          </body>
        </html>
    </ClerkProvider>
  );
}
