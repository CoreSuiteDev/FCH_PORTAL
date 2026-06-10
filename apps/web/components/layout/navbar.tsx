"use client"

import Image from "next/image"
import { IconX } from "@tabler/icons-react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Phone, LogIn } from "lucide-react"
import { useEffect, useState } from "react"

import { useNavStore } from "@/store/use-nav-store"
import { Button } from "@workspace/ui/components/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@workspace/ui/components/sheet"
import { NavLink, navLinks } from "@/constents/nav-manus"

export default function Navbar() {
  const pathname = usePathname()
  const { isOpen, setOpen } = useNavStore()
  const [isSticky, setIsSticky] = useState(false)
  const [activeLang, setActiveLang] = useState<"en" | "es">("en")

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50)
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
        className={`rounded-full px-2 py-1 ${activeLang === "en" ? "bg-red-600 text-white" : ""}`}
      >
        EN
      </button>
      <button
        onClick={() => setActiveLang("es")}
        className={`rounded-full px-2 py-1 ${activeLang === "es" ? "bg-red-600 text-white" : ""}`}
      >
        ES
      </button>
    </div>
  )

  return (
    <header
      className={`${
        isSticky ? "fixed top-0 right-0 left-0 z-[1000] shadow-md" : "relative"
      } w-full bg-white transition-all duration-300`}
    >
      <div className="hidden border-b bg-gray-50 md:block">
        <div className="container mx-auto flex items-center justify-between px-4 py-1 text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <LanguageToggle />
          </div>
          <div className="flex items-center gap-6">
            <span className="flex cursor-pointer items-center gap-1 hover:text-red-600">
              <Phone className="h-3 w-3" /> Contact
            </span>
            <span className="flex cursor-pointer items-center gap-1 hover:text-red-600">
              <LogIn className="h-3 w-3" /> Log In
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="relative block h-[50px] w-[120px]">
          <Image
            src="/assets/fch-logo-new-xp-scaled.png"
            alt="FCH Logo"
            fill
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop Menu with Underline Effect */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link: NavLink) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.id}
                href={link.href}
                className={`relative py-1 text-sm font-medium transition-colors hover:text-red-700 ${
                  isActive ? "text-red-700" : "text-gray-700"
                } after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-red-700 after:transition-all hover:after:w-full ${
                  isActive ? "after:w-full" : ""
                }`}
              >
                {link.name}
              </Link>
            )
          })}
          <Button size="lg" className="bg-green-700">
            Donate
          </Button>
          <Link href="/login">
            <Button size="lg" className="bg-red-700">
              Sign Up
            </Button>
          </Link>
        </nav>

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
                <span className="font-bold">Menu</span>
              </div>
              <nav className="flex-1 overflow-y-auto py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block border-b px-6 py-3 text-sm font-medium"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
              <div className="space-y-3 border-t p-5">
                <Button className="w-full bg-green-700">Donate</Button>
                <Button className="w-full bg-red-700">Sign Up</Button>
                <div className="flex justify-between pt-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Phone className="h-4 w-4" /> Contact
                  </span>
                  <span className="flex items-center gap-1">
                    <LogIn className="h-4 w-4" /> Log In
                  </span>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
