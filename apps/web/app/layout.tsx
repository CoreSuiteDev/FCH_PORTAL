import { Geist, Geist_Mono } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import "@workspace/ui/globals.css"
import { cn } from "@workspace/ui/lib/utils"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import Navbar from "@/components/layout/navbar"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body cz-shortcut-listen="true">
        <TooltipProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Navbar />
            {children}
          </NextIntlClientProvider>
        </TooltipProvider>
      </body>
    </html>
  )
}
