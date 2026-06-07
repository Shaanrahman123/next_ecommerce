import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import MainLayoutWrapper from "@/components/layout/MainLayoutWrapper";
import AuthProvider from "@/providers/AuthProvider";
import AdminAuthProvider from "@/providers/AdminAuthProvider";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BLAK BLAZE - Premium E-Commerce",
  description: "Discover premium fashion. Shop clothing, footwear, and accessories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} font-sans antialiased`}>
        <AuthProvider>
          <AdminAuthProvider>
            <MainLayoutWrapper>
              {children}
            </MainLayoutWrapper>
          </AdminAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
