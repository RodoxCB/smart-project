import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BusMarket - Venda de Ônibus Online",
    template: "%s | BusMarket"
  },
  description: "A maior plataforma online especializada na compra e venda de ônibus novos e usados. Encontre o veículo ideal para seu negócio com segurança e facilidade.",
  keywords: ["ônibus", "autocarros", "compra", "venda", "transporte", "veículos", "Brasil", "usados", "novos"],
  authors: [{ name: "BusMarket" }],
  creator: "BusMarket",
  publisher: "BusMarket",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://smart-project-orpin.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://smart-project-orpin.vercel.app',
    title: 'BusMarket - Venda de Ônibus Online',
    description: 'A maior plataforma online especializada na compra e venda de ônibus novos e usados. Encontre o veículo ideal para seu negócio.',
    siteName: 'BusMarket',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BusMarket - Plataforma de venda de ônibus',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BusMarket - Venda de Ônibus Online',
    description: 'A maior plataforma online especializada na compra e venda de ônibus novos e usados.',
    images: ['/og-image.jpg'],
    creator: '@busmarket',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'automotive',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "BusMarket",
              "url": "https://smart-project-orpin.vercel.app",
              "logo": "https://smart-project-orpin.vercel.app/logo.png",
              "description": "A maior plataforma online especializada na compra e venda de ônibus novos e usados",
              "sameAs": [
                "https://www.facebook.com/busmarket",
                "https://www.instagram.com/busmarket",
                "https://twitter.com/busmarket"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+55-11-99999-9999",
                "contactType": "customer service",
                "availableLanguage": "Portuguese"
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "BR"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
