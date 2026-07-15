"use client"

import { LogIn, LogOut, Menu, Phone, User as UserIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { NavLink, navLinks } from "@/constants/nav-manus"
import { useSessionInfo } from "@/hooks/useUser"
import { useNavStore } from "@/store/use-nav-store"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { Separator } from "@workspace/ui/components/separator"
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

  const { data } = useSessionInfo()

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

  const user = data?.user

  const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL || "http://localhost:3001/"
  const roles = user?.roles?.map((r) => r.toUpperCase()) || []
  const hasPortalAccess = roles.some((role) =>
    ["GENERAL", "MEMBER", "PASTORAL", "ADMIN", "SUPER_ADMIN", "BOARD"].includes(role)
  )

  return (
    <header
      className={`fixed top-0 z-1000 w-full bg-white transition-shadow duration-500 ease-in-out ${
        isSticky ? "shadow-md" : "shadow-none"
      }`}
    >
      {/* Top Bar */}
      <div className="hidden border-b bg-gray-50 md:block">
        <Container className="mx-auto flex items-center justify-between px-4 py-1 text-xs text-gray-500">
          <LanguageSwitcher />
          <div className="flex items-center gap-6">
            <Link
              href="/contact"
              className="flex cursor-pointer items-center gap-1 hover:text-red-600"
            >
              <Phone className="h-3 w-3" /> {t("topBar.contact")}
            </Link>
            {!user && (
              <Link href="/login">
                <span className="flex cursor-pointer items-center gap-1 hover:text-red-600">
                  <LogIn className="h-3 w-3" /> {t("topBar.login")}
                </span>
              </Link>
            )}
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
            sizes="120px"
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
            <Button size="lg" className="w-full bg-green-700">
              {t("buttons.donate")}
            </Button>
          </Link>

          {hasPortalAccess && (
            <Link href={portalUrl}>
              <Button size="lg" className="bg-primary hover:bg-primary/95 text-white">
                Portal
              </Button>
            </Link>
          )}

          {user ? (
            <Popover>
              <PopoverTrigger asChild className="z-100001">
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full p-0"
                >
                  <Avatar className="h-10 w-10 border border-gray-200">
                    <AvatarImage
                      src={user?.image || ""}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback className="bg-red-50 font-medium text-red-700">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="z-100000001 flex w-56 flex-col gap-0 p-2"
                align="end"
              >
                {/* User Info Section */}

                <div className="flex items-center justify-center gap-2">
                  <Avatar className="h-10 w-10 border border-gray-200">
                    <AvatarImage
                      src={user?.image || ""}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback className="bg-red-50 font-medium text-red-700">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1.5 px-2 py-1.5">
                    <p className="text-sm leading-none font-medium">
                      {user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>

                {/* Visible Separator */}
                <Separator className="my-1 h-px bg-slate-200" />

                <Link
                  href="/profile"
                  className="flex w-full cursor-pointer items-center rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-slate-100"
                >
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>

                {/* Visible Separator */}
                <Separator className="my-1 h-px bg-slate-200" />

                <button className="flex w-full cursor-pointer items-center rounded-md px-2 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-50 hover:text-red-700">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </button>
              </PopoverContent>
            </Popover>
          ) : (
            <Link href="/registation">
              <Button size="lg" className="bg-red-700 hover:bg-red-800">
                {t("buttons.signUp")}
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile Trigger */}
        <div className="flex items-center gap-3 md:hidden">
          <LanguageToggle
            activeLang={activeLang}
            setActiveLang={setActiveLang}
          />
          <Sheet open={isOpen} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="z-1001 flex w-[300px] flex-col p-0"
            >
              <div className="flex items-center justify-between border-b bg-gray-50 px-5 py-4">
                <Link href="/" className="relative block h-[20px] w-[80px]">
                  <Image
                    src="/assets/fch-logo-new-xp-scaled.png"
                    alt="FCH Logo"
                    fill
                    sizes="80px"
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

              <div className="space-y-3 border-t bg-gray-50 p-5">
                {user ? (
                  <div className="mb-4 flex items-center gap-3 rounded-lg border bg-white p-3 shadow-sm">
                    <Avatar className="h-10 w-10 border border-gray-200">
                      <AvatarImage
                        src={user?.image || ""}
                        alt={user?.name || "User"}
                      />
                      <AvatarFallback className="bg-red-50 font-medium text-red-700">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col overflow-hidden">
                      <span className="truncate text-sm font-semibold">
                        {user?.name}
                      </span>
                      <span className="truncate text-xs text-gray-500">
                        {user?.email}
                      </span>
                    </div>
                  </div>
                ) : null}

                <Link href="/donation">
                  <Button className="w-full bg-green-700 hover:bg-green-800">
                    {t("buttons.donate")}
                  </Button>
                </Link>

                {hasPortalAccess && (
                  <Link href={portalUrl}>
                    <Button className="w-full bg-primary hover:bg-primary/95 text-white">
                      Portal
                    </Button>
                  </Link>
                )}

                {user ? (
                  <Button
                    variant="outline"
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                ) : (
                  <Link href="/registation">
                    <Button className="w-full bg-red-700 hover:bg-red-800">
                      {t("buttons.signUp")}
                    </Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  )
}

interface LanguageToggleProps {
  activeLang: "en" | "es"
  setActiveLang: (lang: "en" | "es") => void
}

const LanguageToggle = ({ activeLang, setActiveLang }: LanguageToggleProps) => (
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
