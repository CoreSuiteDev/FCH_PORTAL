import { useTranslations } from "next-intl"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"

export default function Page() {
  const t = useTranslations("home")

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F6F4F2] px-4 font-sans text-[#1C1A19]">
      <div className="mx-auto max-w-md space-y-6 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
          {t("title")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("description")}</p>

        <div className="flex justify-center gap-4">
          <button className="cursor-pointer rounded-md bg-[#1C1A19] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800">
            {t("login")}
          </button>
          <button className="cursor-pointer rounded-md border border-slate-300 bg-white px-5 py-2 text-sm font-semibold transition-colors hover:bg-slate-50">
            {t("register")}
          </button>
        </div>

        <div className="flex justify-center border-t border-slate-200 pt-6">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  )
}
