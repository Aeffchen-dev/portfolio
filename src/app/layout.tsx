import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Selected work",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ backgroundColor: "#0d0d0d" }}>
      <body style={{ backgroundColor: "#0d0d0d", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
