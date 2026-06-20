interface NewsItem {
  id: number
  img: string
  categoryKey: string
  titleKey: string
  descKey: string
  link: string
}

export const newsData: NewsItem[] = [
  {
    id: 1,
    img: "/assets/feature-news.jpeg",
    titleKey: "featuredNews.title",
    descKey: "featuredNews.description",
    categoryKey: "categories.world",
    link: "https://www.vaticannews.va/en/pope/news/2026-06/pope-leo-xiv-hebrew-university-jerusalem-israel.html",
  },
  {
    id: 2,
    img: "https://picsum.photos/seed/readings/800/600",
    categoryKey: "categories.vatican",
    titleKey: "newsItems.0.title",
    descKey: "newsItems.0.description",
    link: "https://www.vaticannews.va/en.html",
  },
  {
    id: 3,
    img: "https://picsum.photos/seed/saint/800/600",
    categoryKey: "categories.vatican",
    titleKey: "newsItems.1.title",
    descKey: "newsItems.1.description",
    link: "https://www.vaticannews.va/en.html",
  },
  {
    id: 4,
    img: "https://picsum.photos/seed/evangel/800/600",
    categoryKey: "categories.usccb",
    titleKey: "newsItems.2.title",
    descKey: "newsItems.2.description",
    link: "https://www.usccb.org/committees/evangelization-catechesis",
  },
  {
    id: 5,
    img: "https://picsum.photos/seed/usccb/800/600",
    categoryKey: "categories.usccb",
    titleKey: "newsItems.3.title",
    descKey: "newsItems.3.description",
    link: "https://www.usccb.org/",
  },
]
