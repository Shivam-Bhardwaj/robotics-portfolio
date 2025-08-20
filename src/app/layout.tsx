import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Orbitron } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RoombaSimulation from "@/components/RoombaSimulation";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
  display: 'swap'
});

const orbitron = Orbitron({ 
  subsets: ["latin"], 
  variable: "--font-orbitron",
  display: 'swap'
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: 'swap'
});

export const metadata: Metadata = {
  title: {
    default: "Shivam Bhardwaj - Robotics Engineer & Project Manager",
    template: "%s | Shivam Bhardwaj"
  },
  description: "Expert robotics engineer and project manager specializing in autonomous systems, self-driving technology, and medical devices. Turning prototypes into production-ready systems.",
  keywords: [
    "robotics engineer",
    "project manager", 
    "autonomous systems",
    "self-driving",
    "medical devices",
    "hardware development",
    "prototyping",
    "production systems"
  ],
  authors: [{ name: "Shivam Bhardwaj" }],
  creator: "Shivam Bhardwaj",
  metadataBase: new URL("https://shivambhardwaj.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shivambhardwaj.com",
    title: "Shivam Bhardwaj - Robotics Engineer & Project Manager",
    description: "Expert robotics engineer and project manager specializing in autonomous systems, self-driving technology, and medical devices.",
    siteName: "Shivam Bhardwaj Portfolio"
  },
  twitter: {
    card: "summary_large_image",
    title: "Shivam Bhardwaj - Robotics Engineer & Project Manager",
    description: "Expert robotics engineer and project manager specializing in autonomous systems, self-driving technology, and medical devices."
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${orbitron.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {/* Background simulation */}
        <RoombaSimulation />
        
        {/* Main layout */}
        <div className="flex flex-col min-h-screen bg-background text-foreground">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
        
        {/* Performance and accessibility improvements */}
        <div id="skip-to-content" className="sr-only">
          <a href="#main-content" className="focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:px-4 focus-visible:py-2 focus-visible:bg-brand-primary focus-visible:text-white focus-visible:rounded-md">
            Skip to main content
          </a>
        </div>
      </body>
    </html>
  );
}
