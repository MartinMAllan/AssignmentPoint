import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Assignment Point - Academic Writing & Assignment Management",
  description: "Connect with skilled writers, post assignments, manage bids, and handle payments seamlessly. Your complete academic writing solution platform.",
  applicationName: "Assignment Point",
  keywords: ["assignments", "academic writing", "writers", "freelance", "education"],
  authors: [{ name: "Assignment Point" }],
  creator: "Assignment Point",
  openGraph: {
    title: "Assignment Point",
    description: "Connect with skilled writers, post assignments, and manage your academic work.",
    type: "website",
    siteName: "Assignment Point",
  },
  icons: {
    icon: "/assignment-point-favicon.jpg",
    apple: "/assignment-point-logo.jpg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script async src="https://js.stripe.com/v3/" />
      </head>
      <body className={`${geist.className} ${geistMono.className} font-sans antialiased`}>
        <AuthProvider>{children}</AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
