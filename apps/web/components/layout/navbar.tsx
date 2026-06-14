"use client"

import { LogIn, Menu, Phone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"

import { NavLink, navLinks } from "@/constants/nav-manus"
import { useNavStore } from "@/store/use-nav-store"
import { Button } from "@workspace/ui/components/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@workspace/ui/components/sheet"
import { LanguageSwitcher } from "../LanguageSwitcher"
import Container from "../shared/container"

export default function Navbar() {
  const pathname = usePathname()
  const { isOpen, setOpen } = useNavStore()
  const [isSticky, setIsSticky] = useState(false)
  const [activeLang, setActiveLang] = useState<"en" | "es">("en")

  const t = useTranslations("nav")

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsSticky(window.scrollY > 50)
          ticking = false
        })
        ticking = true
      }
    }

    const handleResize = () => {
      if (window.innerWidth >= 768) setOpen(false)
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [setOpen])

  const LanguageToggle = () => (
    <div className="flex gap-1 rounded-full border p-0.5 text-[10px]">
      <button
        onClick={() => setActiveLang("en")}
        className={`rounded-full px-2 py-1 transition-colors ${activeLang === "en" ? "bg-red-600 text-white" : ""}`}
      >
        EN
      </button>
      <button
        onClick={() => setActiveLang("es")}
        className={`rounded-full px-2 py-1 transition-colors ${activeLang === "es" ? "bg-red-600 text-white" : ""}`}
      >
        ES
      </button>
    </div>
  )

  return (
    <header
      className={`sticky top-0 z-[1000] w-full bg-white transition-shadow duration-500 ease-in-out ${
        isSticky ? "shadow-md" : "shadow-none"
      }`}
    >
      {/* Top Bar */}
      <div className="hidden border-b bg-gray-50 md:block">
        <Container className="mx-auto flex items-center justify-between px-4 py-1 text-xs text-gray-500">
          <LanguageSwitcher />
          <div className="flex items-center gap-6">
            <span className="flex cursor-pointer items-center gap-1 hover:text-red-600">
              <Phone className="h-3 w-3" /> {t("topBar.contact")}
            </span>
            <Link href="/login">
              <span className="flex cursor-pointer items-center gap-1 hover:text-red-600">
                <LogIn className="h-3 w-3" /> {t("topBar.login")}
              </span>
            </Link>
          </div>
        </Container>
      </div>

      {/* Main Nav */}
      <Container className="mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="relative block h-[50px] w-[120px]">
          <Image
            src="/assets/fch-logo-new-xp-scaled.png"
            alt="FCH Logo"
            fill
            className="object-contain"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link: NavLink) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.id}
                href={link.href}
                className={`relative py-1 text-sm font-medium transition-colors hover:text-red-700 ${isActive ? "text-red-700" : "text-gray-700"} after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-red-700 after:transition-all hover:after:w-full ${isActive ? "after:w-full" : ""}`}
              >
                {t(`links.${link.key}`)}
              </Link>
            )
          })}
          <Link href="/donation">
            <Button className="w-full bg-green-700">
              {t("buttons.donate")}
            </Button>
          </Link>
          <Link href="/registation">
            <Button size="lg" className="bg-red-700">
              {t("buttons.signUp")}
            </Button>
          </Link>
        </nav>

        {/* Mobile Trigger */}
        <div className="flex items-center gap-3 md:hidden">
          <LanguageToggle />
          <Sheet open={isOpen} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="z-[1001] flex w-[300px] flex-col p-0"
            >
              <div className="flex items-center justify-between border-b bg-gray-50 px-5 py-4">
                <Link href="/" className="relative block h-[20px] w-[80px]">
                  <Image
                    src="/assets/fch-logo-new-xp-scaled.png"
                    alt="FCH Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </Link>
              </div>
              <nav className="flex-1 overflow-y-auto py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block border-b px-6 py-3 text-sm font-medium"
                  >
                    {t(`links.${link.key}`)}
                  </Link>
                ))}
              </nav>
              <div className="space-y-3 border-t p-5">
                <Link href="/donation">
                  <Button className="w-full bg-green-700">
                    {t("buttons.donate")}
                  </Button>
                </Link>
                <Link href="/registation">
                  <Button className="w-full bg-red-700">
                    {t("buttons.signUp")}
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  )
}
