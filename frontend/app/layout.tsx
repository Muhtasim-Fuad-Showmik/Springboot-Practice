import { Geist, Geist_Mono, Outfit } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import QueryProvider from "./QueryProvider"
import Header from "@/components/header"

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        outfit.variable
      )}
    >
      <body>
        <QueryProvider>
          <ThemeProvider>
            <Header />
            <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
