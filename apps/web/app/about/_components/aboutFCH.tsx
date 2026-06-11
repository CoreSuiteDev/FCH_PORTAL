import Container from "@/components/shared/container"
import Image from "next/image"

export default function AboutFCH() {
  return (
    <section className="w-full bg-white py-12 md:py-16">
      <Container className="grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-2">
        {/* LEFT CONTENT */}
        <div className="flex flex-col justify-center">
          <div>
            <h2 className="text-3xl font-bold text-red-700 uppercase md:text-4xl">
              About FCH
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-gray-700 md:text-base">
              The Federation for Catechesis with Hispanics is a national
              organization that promotes evangelization and catechesis for those
              who serve in catechetical ministry at every level.
            </p>

            <p className="mt-4 text-sm leading-relaxed text-gray-700 md:text-base">
              FCH mentors and supports leaders who serve Hispanic/Latino
              communities by developing leaders, promoting new leadership, and
              identifying resources that strengthen catechists and catechetical
              ministry.
            </p>

            <h3 className="mt-8 text-lg font-semibold uppercase md:text-xl">
              Overview of the Federation for Catechesis with Hispanics (FCH)
              History
            </h3>

            <p className="mt-4 text-sm leading-relaxed text-gray-700 md:text-base">
              The Federation for Catechesis with Hispanics (FCH) started as a
              Forum for Catechesis with Hispanics within NCCL, and later became
              the Federation for Catechesis with Hispanics (FCH). In 2022, FCH
              became an independent not-for-profit national organization.
            </p>
          </div>
        </div>

        {/* RIGHT IMAGES */}
        <div className="flex items-center gap-4">
          {/* Big image */}
          <div className="h-[550px] w-full overflow-hidden rounded-2xl">
            <Image
              src="/assets/about-fch.jpeg"
              alt="church"
              width={500}
              height={500}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-3">
            {/* small image 1 */}
            <div className="h-[360px] w-full overflow-hidden rounded-2xl">
              <Image
                src="/assets/event-2.jpg"
                alt="prayer"
                width={400}
                height={300}
                className="h-full w-full object-cover"
              />
            </div>

            {/* small image 2 */}
            <div className="h-[180px] w-full overflow-hidden rounded-2xl">
              <Image
                src="/assets/slide3.jpg"
                alt="cross"
                width={400}
                height={200}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
