import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/ui/navbar";
import ThirdWebWrapper from "@/components/ThirdWebWrapper";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Fundhive",
  description: "CrowdFunding Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThirdWebWrapper>
      <html lang="en">
        <body className={`${inter.className} dark`}>
          <div className="relative flex min-h-svh flex-col bg-background">
            <div data-wrapper="" className="border-grid flex flex-1 flex-col">
              <NavBar />
              <main className="flex flex-1 flex-col">{children}</main>
            </div>
          </div>
        </body>
      </html>
    </ThirdWebWrapper>
  );
}
