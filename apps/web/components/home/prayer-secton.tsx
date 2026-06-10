"use client"
import Container from "@/components/shared/container"

export function PrayerSection() {
  return (
    <section className="relative min-h-[400px] w-full bg-cover bg-fixed bg-center py-16 md:py-32">
      {/* Dark overlay to make the text readable over the background image */}
      <div className="absolute inset-0 bg-black/60" />

      <Container className="relative z-10 flex flex-col items-center justify-center px-4 text-center text-white">
        <h2 className="mb-8 font-trajan text-3xl tracking-wide md:text-5xl">
          PRAYER OF THE ROMAN MISSAL
        </h2>

        <div className="max-w-3xl space-y-4 font-montserrat text-base leading-relaxed italic md:space-y-6 md:text-lg md:text-xl">
          <p>O God, shepherd and ruler of all the faithful,</p>
          <p>look favorably upon your servant, Leo XIV,</p>
          <p>whom you have set at the head of your Church as her shepherd;</p>
          <p>grant, we pray, that by word and example</p>
          <p>he may be of service to those over whom he presides</p>
          <p>so that, together with the flock entrusted to his care,</p>
          <p>he may come to everlasting life.</p>
          <p className="pt-4 font-normal not-italic">
            Through our Lord Jesus Christ, your Son,
            <br />
            who lives and reigns with you in the unity of the Holy Spirit,
            <br />
            one God, for ever and ever. Amen.
          </p>
        </div>
      </Container>
    </section>
  )
}
