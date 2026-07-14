import React from "react"
import { Users, FileText, CheckCircle, FileWarning } from "lucide-react"
import { Card, CardContent } from "@workspace/ui/components/card"
import { ZTCAuthorOutput } from "@workspace/types"

interface AuthorStatsProps {
  authors: ZTCAuthorOutput[]
  totalAuthors: number
}

export function AuthorStats({ authors, totalAuthors }: AuthorStatsProps) {
  // Compute aggregations from the current page's authors
  const totalArticles = authors.reduce((acc, curr) => acc + (curr._count?.news || 0), 0)
  const publishedArticles = authors.reduce((acc, curr) => acc + (curr.publishedCount || 0), 0)
  const unpublishedArticles = authors.reduce((acc, curr) => acc + (curr.unpublishedCount || 0), 0)

  const stats = [
    {
      title: "Total Authors",
      value: totalAuthors,
      icon: Users,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400",
    },
    {
      title: "Total Articles",
      value: totalArticles,
      icon: FileText,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400",
    },
    {
      title: "Published Articles",
      value: publishedArticles,
      icon: CheckCircle,
      color: "text-green-600 bg-green-50 dark:bg-green-950/40 dark:text-green-400",
    },
    {
      title: "Drafts & Pending",
      value: unpublishedArticles,
      icon: FileWarning,
      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-none">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {stat.title}
                </p>
                <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                  {stat.value}
                </h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.color} shrink-0`}>
                <Icon className="size-6" />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
