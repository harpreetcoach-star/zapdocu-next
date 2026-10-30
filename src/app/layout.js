import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer"; // Assuming you have your Footer component here

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ZapDocu - 100% Client-Side Secure Document Tools",
  description: "Fast, secure, browser-based PDF and image document conversion tools.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
        {/* Global Header with your logo */}
      

        {/* Main page views */}
        <main className="flex-grow">{children}</main>

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  );
}
