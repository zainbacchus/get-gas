import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Script from 'next/script'
import { Providers } from './providers';

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
  style: ['normal'],
})

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://getgas.xyz'),
  title: "GetGas",
  description: "Get ETH on the Superchain",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/images/fc-logo.png', sizes: '32x32', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
    apple: '/images/fc-logo.png',
  },
  openGraph: {
    title: "GetGas - Get ETH on the Superchain",
    description: "Get ETH on the Superchain",
    url: "https://getgas.xyz",
    siteName: "GetGas",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "GetGas - Get ETH on the Superchain",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GetGas - Get ETH on the Superchain",
    description: "Get ETH on the Superchain",
    images: ["/images/og-image.png"],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" href="/images/fc-logo.png" sizes="32x32" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/fc-logo.png" />
        <meta name="msapplication-TileImage" content="/images/fc-logo.png" />
        <meta name="msapplication-TileColor" content="#000000" />
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className={`${inter.className} bg-black bg-dotted-grid`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
