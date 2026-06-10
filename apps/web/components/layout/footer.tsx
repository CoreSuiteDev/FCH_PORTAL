import Image from "next/image"
import Link from "next/link" // next/link ইমপোর্ট করলাম

export function Footer() {
  return (
    <footer className="bg-[#c42028] px-6 py-12 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center">
        {/* Logo Section */}
        <div className="mb-8">
          <Link href="/">
            <Image
              src="/assets/fch-logo-new-xp-scaled.png"
              alt="FCH Logo"
              width={150}
              height={60}
              className="h-16 w-auto rounded bg-white object-contain p-2"
            />
          </Link>
        </div>

        {/* Navigation Links using next/link */}
        <nav className="mb-6 flex flex-wrap justify-center gap-8 text-lg font-medium">
          <Link href="/about" className="underline-offset-4 hover:underline">
            About
          </Link>
          <Link href="/events" className="underline-offset-4 hover:underline">
            Events
          </Link>
          <Link
            href="/membership"
            className="underline-offset-4 hover:underline"
          >
            Membership
          </Link>
          <Link href="/contact" className="underline-offset-4 hover:underline">
            Contact
          </Link>
        </nav>

        {/* Social Links */}
        <div className="mb-8 flex gap-6 text-sm">
          <a
            href="https://facebook.com/your-page"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-gray-200"
          >
            Facebook
          </a>
          <a
            href="https://linkedin.com/company/your-company"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-gray-200"
          >
            LinkedIn
          </a>
        </div>

        {/* Divider */}
        <div className="my-4 w-full border-t border-red-700"></div>

        {/* Copyright */}
        <p className="text-sm opacity-90">
          &copy; {new Date().getFullYear()} FCH. All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}
