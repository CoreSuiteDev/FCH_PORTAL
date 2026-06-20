/* eslint-disable react/no-unknown-property */
import { Footer } from "@/components/layout/footer"
import Navbar from "@/components/layout/navbar"
import QueryProvider from "@/providers/query-provider"
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
              <div className="overflow-hidden">
                <Navbar />
                <div className="mt-20">{children}</div>
                <Footer />
              </div>
            </NextIntlClientProvider>
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
