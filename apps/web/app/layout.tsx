/* eslint-disable react/no-unknown-property */
import LayoutWrapper from "@/components/layout/layout-wrapper"
import QueryProvider from "@/providers/query-provider"
import { Toaster } from "@workspace/ui/components/sonner"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import "@workspace/ui/globals.css"
import { cn } from "@workspace/ui/lib/utils"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import { Geist, Geist_Mono } from "next/font/google"

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
        <QueryProvider>
          <TooltipProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <LayoutWrapper>{children}</LayoutWrapper>
            </NextIntlClientProvider>
          </TooltipProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  )
}
