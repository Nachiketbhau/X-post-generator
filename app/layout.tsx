import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
const inter = Inter({ subsets: ['latin'] });


export const metadata: Metadata = {
  title: "AI X Post Generator",
  description: "Generate X posts with AI in a blink",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.className} bg-black`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          forcedTheme="dark"
          disableTransitionOnChange
          storageKey="x-post-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'