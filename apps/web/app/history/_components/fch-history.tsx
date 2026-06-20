import Container from "@/components/shared/container"
import { useTranslations } from "next-intl"
import React from "react"

const FchHistory = () => {
  const t = useTranslations("history")
  return (
    <section className="bg-white">
      <Container className="flex min-h-screen flex-col items-center">
        <h2 className="font-trajan text-4xl font-bold text-black">
          {t("pageTitle")}
        </h2>{" "}
        <br />
        <p className="font-semi-bold text-2xl">{t("pageDescription")}</p>
      </Container>
    </section>
  )
}

export default FchHistory
