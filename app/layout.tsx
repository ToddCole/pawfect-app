import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Pawfect Match - Find Your Perfect Dog Breed",
  description: "Discover the ideal dog breed that matches your lifestyle with Pawfect Match.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased min-h-screen flex flex-col"
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
