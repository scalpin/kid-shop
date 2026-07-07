//app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import { Manrope, Comfortaa } from 'next/font/google'
import "./globals.css";
import SiteChrome from './components/SiteChrome'
import {
  SITE_ADDRESS,
  SITE_DESCRIPTION,
  SITE_EMAIL,
  SITE_LATITUDE,
  SITE_LONGITUDE,
  SITE_NAME,
  SITE_PHONE,
  SITE_URL,
  absoluteUrl,
  createJsonLdMarkup,
} from '@/lib/seo'

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['400','500','700'],
  variable: '--font-sans'
})

const comfortaa = Comfortaa({
  subsets: ['latin', 'cyrillic'],
  weight: ['500','700'],
  variable: '--font-heading'
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} — детская ясельная одежда оптом`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'детская одежда оптом',
    'ясельная одежда оптом',
    'детский трикотаж оптом',
    'одежда для новорожденных оптом',
    'производитель детской одежды',
    'детская одежда Пенза',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  verification: {
    yandex: '7624b7ab2713d0ae',
    google: 'aA0wak_nxPdHNSaK8GI5iS6VZN8WWj9wF3EgOluzH1k',
  },
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        type: 'image/x-icon',
      },
    ],
    shortcut: ['/favicon.ico'],
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: '/',
    siteName: SITE_NAME,
    title: `${SITE_NAME} — детская ясельная одежда оптом`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/hero_img2.png',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — детская одежда оптом`,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  other: {
    'geo.region': 'RU-PNZ',
    'geo.placename': 'Пенза',
    'geo.position': `${SITE_LATITUDE};${SITE_LONGITUDE}`,
    ICBM: `${SITE_LATITUDE}, ${SITE_LONGITUDE}`,
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'LocalBusiness'],
  name: SITE_NAME,
  url: SITE_URL,
  logo: absoluteUrl('/logo_kroha(cuted).png'),
  telephone: SITE_PHONE,
  email: SITE_EMAIL,
  areaServed: ['Россия', 'СНГ'],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Пенза',
    streetAddress: SITE_ADDRESS.replace('Пенза, ', ''),
    addressCountry: 'RU',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: SITE_LATITUDE,
    longitude: SITE_LONGITUDE,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">

      <body className={`${manrope.variable} ${comfortaa.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={createJsonLdMarkup(organizationJsonLd)}
        />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
