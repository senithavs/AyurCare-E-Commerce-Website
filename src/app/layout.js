import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/globals.css";
import { CartProvider } from "@/lib/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AyurCare - Authentic Ayurvedic Wellness Products",
  description: "Shop authentic Ayurvedic and herbal wellness products - supplements, oils, teas and skincare sourced for purity and backed by tradition.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
