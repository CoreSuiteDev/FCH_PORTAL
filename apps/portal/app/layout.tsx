import { Geist, Geist_Mono } from "next/font/google"

import QueryProvider from "@/providers/query-provider"
import { Toaster } from "@workspace/ui/components/sonner"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import "@workspace/ui/globals.css"
import { cn } from "@workspace/ui/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

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
        geist.variable
      )}
    >
      <body>
        <QueryProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster position="top-right" duration={2000} />
        </QueryProvider>
      </body>
    </html>
  )
}
