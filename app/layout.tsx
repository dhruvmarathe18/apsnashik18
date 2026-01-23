import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { DataProvider } from '@/contexts/DataContext'
import { TransportProvider } from '@/contexts/TransportContext'
import { SchoolProvider } from '@/contexts/SchoolContext'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Apple Public School Nashik - Best CBSE School in Nashik',
  description: 'Apple Public School (APS) Nashik - The best CBSE school in Nashik providing quality education and holistic development for students. Apply for admission now.',
  keywords: 'APS Nashik, Apple Public School, CBSE School Nashik, Best School Nashik, Education Nashik, School Admission Nashik',
  authors: [{ name: 'APS Nashik' }],
  openGraph: {
    title: 'Apple Public School Nashik - Best CBSE School in Nashik',
    description: 'Apple Public School (APS) Nashik - The best CBSE school in Nashik providing quality education and holistic development for students.',
    url: 'https://apsnashik.com',
    siteName: 'Apple Public School Nashik',
    images: [
      {
        url: '/images/aps.jpg',
        width: 1200,
        height: 630,
        alt: 'Apple Public School Nashik',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Apple Public School Nashik - Best CBSE School in Nashik',
    description: 'Apple Public School (APS) Nashik - The best CBSE school in Nashik providing quality education and holistic development for students.',
    images: ['/images/aps.jpg'],
  },
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/aps.jpg" type="image/x-icon" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <DataProvider>
            <TransportProvider>
              <SchoolProvider>
                {children}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: 'var(--toast-bg, #363636)',
                      color: 'var(--toast-color, #fff)',
                    },
                    className: 'dark:bg-gray-800 dark:text-gray-100',
                  }}
                />
              </SchoolProvider>
            </TransportProvider>
          </DataProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
