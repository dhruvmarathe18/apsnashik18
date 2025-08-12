import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { DataProvider } from '@/contexts/DataContext'

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
    <html lang="en">
      <head>
        <link rel="icon" href="/images/aps.jpg" type="image/x-icon" />
      </head>
      <body className={inter.className}>
        <DataProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </DataProvider>
      </body>
    </html>
  )
}
