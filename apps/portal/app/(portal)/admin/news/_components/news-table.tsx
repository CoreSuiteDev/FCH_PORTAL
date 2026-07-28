import { Edit, Eye, FileText, Loader2, ShieldAlert, Trash2 } from "lucide-react"
import Image from "next/image"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import type { ZTCNewsOutput } from "@workspace/types"
import { STATUS_COLORS, TYPE_COLORS } from "./news-constants"

interface NewsTableProps {
  displayedNews: ZTCNewsOutput[]
  isLoading: boolean
  isError: boolean
  refetch: () => void
  currentPage: number
  totalPages: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  onEdit: (article: ZTCNewsOutput) => void
  onDelete: (id: string) => void
}

export function NewsTable({
  displayedNews,
  isLoading,
  isError,
  refetch,
  currentPage,
  totalPages,
  setCurrentPage,
  onEdit,
  onDelete,
}: NewsTableProps) {
  return (
    <Card className="overflow-hidden border border-slate-200 bg-white shadow-none dark:border-slate-800 dark:bg-slate-950">
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <Loader2 className="h-10 w-10 animate-spin text-slate-500" />
            <p className="text-sm font-medium text-slate-500">
              Retrieving news articles database...
            </p>
          </div>
        ) : isError ? (
          <div className="m-6 flex flex-col items-center justify-center gap-2 rounded-xl border border-rose-100 bg-rose-50/20 py-20">
            <ShieldAlert className="h-10 w-10 text-rose-500" />
            <h4 className="text-base font-bold text-slate-800">
              Connection Failed
            </h4>
            <p className="text-xs text-slate-500">
              Failed to fetch articles. Please retry.
            </p>
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="mt-2 h-8"
            >
              Retry Connection
            </Button>
          </div>
        ) : displayedNews.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2 p-6 text-sm text-slate-400">
            <FileText className="h-8 w-8 text-slate-300" />
            No news articles found matching current filters.
          </div>
        ) : (
          <div className="block overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/70 dark:bg-slate-800/40">
                <TableRow>
                  <TableHead className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                    Title
                  </TableHead>
                  <TableHead className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                    Author
                  </TableHead>
                  <TableHead className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                    Type
                  </TableHead>
                  <TableHead className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                    Views
                  </TableHead>
                  <TableHead className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                    Status
                  </TableHead>
                  <TableHead className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">
                    Created
                  </TableHead>
                  <TableHead className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">
                    Operations
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedNews.map((article) => (
                  <TableRow
                    key={article.id}
                    className="border-b border-slate-100 hover:bg-slate-50/40 dark:border-slate-900"
                  >
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {article.featuredImage ? (
                          <Image
                            src={article.featuredImage}
                            alt={article.title}
                            height={40}
                            width={40}
                            className="shrink-0 rounded border bg-slate-50 object-cover"
                          />
                        ) : (
                          <div className="flex size-10 shrink-0 items-center justify-center rounded border bg-slate-50 text-slate-400 dark:bg-slate-900">
                            <FileText className="size-4" />
                          </div>
                        )}
                        <div>
                          <div className="line-clamp-1 font-semibold text-slate-900 dark:text-slate-100">
                            {article.title}
                          </div>
                          <div className="font-mono text-[10px] text-slate-400">
                            /{article.slug}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {article.author?.name || "Unknown Author"}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${TYPE_COLORS[article.newsType]}`}
                      >
                        {article.newsType.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <span className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <Eye className="size-3 text-slate-400" />{" "}
                        {article.viewCount}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant="outline"
                        className={`rounded-full text-[10px] font-bold capitalize ${STATUS_COLORS[article.status]}`}
                      >
                        {article.status.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-xs whitespace-nowrap text-slate-500">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 hover:cursor-pointer"
                          onClick={() => onEdit(article)}
                        >
                          <Edit className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:cursor-pointer hover:bg-red-50 hover:text-red-600"
                          onClick={() => onDelete(article.id)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Pagination Section */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200/50 p-4">
          <span className="text-xs text-slate-500">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 text-xs hover:cursor-pointer"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
              className="h-8 text-xs hover:cursor-pointer"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
