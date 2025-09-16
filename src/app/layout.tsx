import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { LoadingProvider } from "@/components/loading/LoadingContext";
import LoadingOverlay from "@/components/loading/LoadingOverlay";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Planner Apps",
  description: "Planner Apps bertujuan untuk mempermudah kalian membuat Planner harian atau mingguan ataupun bulanan!",
  icons: {
    icon: "/diary.svg",
    shortcut: "/diary.svg"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LoadingProvider>
          <LoadingOverlay />
          {children}
          <Toaster richColors position="top-center"/>
        </LoadingProvider>
      </body>
    </html>
  );
}
