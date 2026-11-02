import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ZapDocu",
    "operatingSystem": "All",
    "applicationCategory": "BusinessApplication",
    "browser": "Requires JavaScript. Requires HTML5.",
    "url": "https://zapdocu.com",
    "description": "ZapDocu is a fast, offline-first private PDF and image utility suite. Merge, split, compress, rotate, watermark PDFs, and convert formats locally in your browser.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "PDF Merging",
      "PDF Splitting",
      "PDF Compression",
      "Image to PDF Conversion",
      "Client-side local processing for privacy"
    ]
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
        {/* Securely serialized JSON-LD to prevent any script-breaking characters */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />

        {/* Global Header placeholder */}

        {/* Main page views */}
        <main className="flex-grow">{children}</main>

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  );
}