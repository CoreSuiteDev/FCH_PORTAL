import { useTranslations } from "next-intl"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"

export default function Page() {
  const t = useTranslations("home")

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F6F4F2] px-4 font-sans text-[#1C1A19]">
      <div className="mx-auto max-w-md text-center space-y-6">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{t("title")}</h1>
        <p className="text-muted-foreground text-sm">{t("description")}</p>
        
        <div className="flex justify-center gap-4">
          <button className="rounded-md bg-[#1C1A19] text-white px-5 py-2 text-sm font-semibold hover:bg-slate-800 transition-colors cursor-pointer">
            {t("login")}
          </button>
          <button className="rounded-md border border-slate-300 bg-white px-5 py-2 text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer">
            {t("register")}
          </button>
        </div>

        <div className="border-t border-slate-200 pt-6 flex justify-center">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  )
}
