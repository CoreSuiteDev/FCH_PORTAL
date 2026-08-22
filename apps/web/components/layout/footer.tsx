import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const t = useTranslations("footer")

  return (
    <footer className="bg-[#c42028] px-6 py-12 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center">
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

        <nav className="mb-6 flex flex-wrap justify-center gap-8 text-lg font-medium">
          <Link href="/about" className="underline-offset-4 hover:underline">
            {t("nav.about")}
          </Link>
          <Link
            href="/membership"
            className="underline-offset-4 hover:underline"
          >
            {t("nav.membership")}
          </Link>
          <Link
            href="/sponsor"
            className="underline-offset-4 hover:underline"
          >
            {t("nav.sponsor")}
          </Link>
          <Link
            href="/news"
            className="underline-offset-4 hover:underline"
          >
            {t("nav.news")}
          </Link>
          <Link href="/events" className="underline-offset-4 hover:underline">
            {t("nav.events")}
          </Link>
          <Link href="/webinars" className="underline-offset-4 hover:underline">
            {t("nav.webinar")}
          </Link>
        </nav>

        <div className="mb-8 flex gap-6 text-sm">
          <a
            href="https://facebook.com/your-page"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-gray-200"
          >
            {t("social.facebook")}
          </a>
        </div>

        <div className="my-4 w-full border-t border-red-700"></div>

        <p className="text-sm opacity-90">
          &copy; {new Date().getFullYear()} FCH. {t("copyright")}
        </p>
      </div>
    </footer>
  )
}
