import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StoreProvider from "@/shared/providers/store-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkyReels AI Platform",
  description: "Next-gen AI Video Generation Platform",
  icons: {
    icon: "/app-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground min-h-screen antialiased selection:bg-primary/20`}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
