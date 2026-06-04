import type { Metadata, Viewport } from "next";
import { Raleway } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#008037",
};

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Verst Carbon Academy — Climate-Tech Learning Ecosystem",
  description:
    "A two-section climate-tech program for African project developers, corporate sustainability teams and the next generation of climate professionals. Self-paced. Verified credentials.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={raleway.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
