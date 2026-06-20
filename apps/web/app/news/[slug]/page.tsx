import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import Container from "@/components/shared/container"
import { newsData } from "@/constants/news-data"

interface NewsItem {
  id: number
  img: string
  categoryKey: string
  titleKey: string
  descKey: string
  link: string
}

export default async function NewsDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Data find করা
  const news = newsData.find((item) => item.id.toString() === slug)

  if (!news) {
    notFound()
  }

  // Navigation Logic
  const currentIndex = newsData.findIndex((item) => item.id.toString() === slug)
  const prevNews = currentIndex > 0 ? newsData[currentIndex - 1] : null
  const nextNews =
    currentIndex < newsData.length - 1 ? newsData[currentIndex + 1] : null

  return (
    <main className="min-h-screen bg-white py-12">
      <Container className="max-w-4xl px-6">
        {/* Header Section */}
        <h1 className="mb-4 text-4xl font-extrabold text-[#8b0000]">
          {news.titleKey}
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          Category: {news.categoryKey}
        </p>

        {/* Featured Image */}
        <div className="relative mb-8 h-96 w-full overflow-hidden rounded-lg shadow-lg">
          <Image
            src={news.img}
            alt={news.titleKey}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Article Content */}
        <article className="prose prose-lg mb-16 max-w-none text-gray-700">
          <p className="text-xl font-medium text-gray-900">{news.descKey}</p>
          <div className="mt-4">
            <a
              href={news.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0073aa] hover:underline"
            >
              Read original article
            </a>
          </div>
        </article>

        {/* Previous/Next Navigation */}
        <div className="my-12 flex justify-between border-y py-8">
          {prevNews ? (
            <Link href={`/news/${prevNews.id}`} className="group flex flex-col">
              <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                ← Previous
              </span>
              <span className="mt-1 font-semibold text-[#8b0000] group-hover:underline">
                {prevNews.titleKey}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {nextNews ? (
            <Link
              href={`/news/${nextNews.id}`}
              className="group flex flex-col text-right"
            >
              <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                Next →
              </span>
              <span className="mt-1 font-semibold text-[#8b0000] group-hover:underline">
                {nextNews.titleKey}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>

        {/* Comment Section */}
        <section className="rounded-xl border border-gray-200 bg-gray-50 p-8 shadow-sm">
          <h3 className="mb-6 text-2xl font-bold text-gray-900">
            Leave a Comment
          </h3>
          <form className="space-y-4">
            <textarea
              className="h-40 w-full rounded-md border border-gray-300 p-4 outline-none focus:border-[#8b0000] focus:ring-1 focus:ring-[#8b0000]"
              placeholder="Type here..."
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <input
                type="text"
                placeholder="Name*"
                className="rounded border border-gray-300 p-2"
              />
              <input
                type="email"
                placeholder="Email*"
                className="rounded border border-gray-300 p-2"
              />
              <input
                type="text"
                placeholder="Website"
                className="rounded border border-gray-300 p-2"
              />
            </div>
            <button
              type="submit"
              className="mt-2 rounded bg-[#0073aa] px-8 py-2 font-bold text-white transition hover:bg-[#005f91]"
            >
              Post Comment
            </button>
          </form>
        </section>
      </Container>
    </main>
  )
}
