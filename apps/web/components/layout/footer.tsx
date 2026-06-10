import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-[#c42028] px-6 py-12 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center">
        {/* Logo Section */}
        <div className="mb-8">
          <Image
            src="/assets/fch-logo-new-xp-scaled.png"
            alt="FCH Logo"
            width={150}
            height={60}
            className="h-16 w-auto rounded bg-white object-contain p-2" //
          />
        </div>

        {/* Navigation Links */}
        <nav className="mb-6 flex flex-wrap justify-center gap-8 text-lg font-medium">
          <a href="#" className="hover:underline">
            About
          </a>
          <a href="#" className="hover:underline">
            Events
          </a>
          <a href="#" className="hover:underline">
            Membership
          </a>
          <a href="#" className="hover:underline">
            Contact
          </a>
        </nav>

        {/* Social Links */}
        <div className="mb-8 flex gap-6 text-sm">
          <a href="#" className="flex items-center gap-2 hover:text-gray-200">
            <span>Facebook</span>
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-gray-200">
            <span>LinkedIn</span>
          </a>
        </div>

        {/* Divider */}
        <div className="my-4 w-full border-t border-red-700"></div>

        {/* Copyright */}
        <p className="text-sm opacity-90">
          Copyright &copy; 2026 FCH. All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}
