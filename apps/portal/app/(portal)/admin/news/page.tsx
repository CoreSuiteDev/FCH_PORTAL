"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  ArrowRight,
  Edit,
  Eye,
  FileText,
  Filter,
  Globe,
  Loader2,
  Plus,
  Search,
  ShieldAlert,
  Trash2,
  Users,
} from "lucide-react"
import Link from "next/link"
import React, { useMemo, useState } from "react"
import { useForm, FieldError } from "react-hook-form"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { toast } from "@workspace/ui/components/sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Textarea } from "@workspace/ui/components/textarea"

import { useAuthors } from "@/hooks/useAuthor"
import {
  useCreateNews,
  useDeleteNews,
  useNewsList,
  useUpdateNews,
} from "@/hooks/useNews"
import { ZCICreateNewsSchema, ZTCNewsOutput, ZTCCreateNews, ZTCCreateNewsInput } from "@workspace/types"
import Image from "next/image"

const STATUS_COLORS: Record<string, string> = {
  DRAFT:
    "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300",
  REVIEW:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400",
  SCHEDULED:
    "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400",
  PUBLISHED:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400",
  ARCHIVED:
    "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400",
}

const TYPE_COLORS: Record<string, string> = {
  NEWS: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400",
  BLOG: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400",
  ANNOUNCEMENT:
    "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/40 dark:text-pink-400",
}

const getErrorMessage = (error: FieldError | undefined | null): string | null => {
  if (!error) return null
  return error.message || null
}

export default function NewsManagePage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL")
  const [selectedType, setSelectedType] = useState<string>("ALL")
  const [searchQuery, setSearchQuery] = useState("")

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Fetch list parameters
  const listParams = useMemo(
    () => ({
      page: currentPage,
      limit: 10,
      status: selectedStatus === "ALL" ? undefined : selectedStatus,
      newsType: selectedType === "ALL" ? undefined : selectedType,
    }),
    [currentPage, selectedStatus, selectedType]
  )

  // Queries
  const {
    data: newsData,
    isLoading,
    isError,
    refetch,
  } = useNewsList(listParams)
  const { data: authorsData } = useAuthors(1, 100) // retrieve up to 100 authors

  const authorsList = authorsData?.data || []

  // Mutations
  const createNewsMutation = useCreateNews()
  const updateNewsMutation = useUpdateNews()
  const deleteNewsMutation = useDeleteNews()

  // Form Setup
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<ZTCCreateNewsInput>({
    resolver: zodResolver(ZCICreateNewsSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      supTitle: "",
      excerpt: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      canonicalUrl: "",
      featuredImage: "",
      featuredImageAlt: "",
      status: "DRAFT",
      newsType: "NEWS",
      readingTime: undefined,
      authorId: "",
      tags: [],
    },
  })

  const titleVal = watch("title")

  // Generate slug on title change
  React.useEffect(() => {
    if (titleVal && !editingId) {
      const generated = titleVal
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      setValue("slug", generated, { shouldValidate: true })
    }
  }, [titleVal, setValue, editingId])

  const handleOpenCreate = () => {
    setEditingId(null)
    reset({
      title: "",
      slug: "",
      content: "",
      supTitle: "",
      excerpt: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      canonicalUrl: "",
      featuredImage: "",
      featuredImageAlt: "",
      status: "DRAFT",
      newsType: "NEWS",
      readingTime: undefined,
      authorId: authorsList[0]?.id || "",
      tags: [],
    })
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (article: ZTCNewsOutput) => {
    setEditingId(article.id)
    reset({
      title: article.title,
      slug: article.slug,
      content: article.content,
      supTitle: article.supTitle || "",
      excerpt: article.excerpt || "",
      metaTitle: article.metaTitle || "",
      metaDescription: article.metaDescription || "",
      metaKeywords: article.metaKeywords || "",
      canonicalUrl: article.canonicalUrl || "",
      featuredImage: article.featuredImage || "",
      featuredImageAlt: article.featuredImageAlt || "",
      status: article.status,
      newsType: article.newsType,
      readingTime: article.readingTime || undefined,
      authorId: article.authorId,
      tags: article.tags || [],
    })
    setIsDialogOpen(true)
  }

  const onSubmit = (values: ZTCCreateNewsInput) => {
    // Basic sanitization of null values
    const payload: ZTCCreateNews = {
      title: values.title,
      slug: values.slug,
      content: values.content,
      supTitle: values.supTitle || null,
      excerpt: values.excerpt || null,
      metaTitle: values.metaTitle || null,
      metaDescription: values.metaDescription || null,
      metaKeywords: values.metaKeywords || null,
      canonicalUrl: values.canonicalUrl || null,
      featuredImage: values.featuredImage || null,
      featuredImageAlt: values.featuredImageAlt || null,
      status: values.status || "DRAFT",
      newsType: values.newsType || "NEWS",
      readingTime: values.readingTime ? Number(values.readingTime) : null,
      authorId: values.authorId,
      tags: values.tags || [],
    }

    if (editingId) {
      updateNewsMutation.mutate(
        { id: editingId, data: payload },
        {
          onSuccess: () => {
            toast.success("News article successfully updated")
            setIsDialogOpen(false)
            setEditingId(null)
          },
          onError: (err: unknown) => {
            toast.error(`Update failed: ${err instanceof Error ? err.message : "Unknown error"}`)
          },
        }
      )
    } else {
      createNewsMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("News article successfully created")
          setIsDialogOpen(false)
        },
        onError: (err: unknown) => {
          toast.error(`Creation failed: ${err instanceof Error ? err.message : "Unknown error"}`)
        },
      })
    }
  }

  const handleDelete = (id: string) => {
    if (
      confirm(
        "Are you sure you want to delete this article? This cannot be undone."
      )
    ) {
      deleteNewsMutation.mutate(id, {
        onSuccess: () => {
          toast.success("Article deleted successfully")
        },
        onError: (err: unknown) => {
          toast.error(`Deletion failed: ${err instanceof Error ? err.message : "Unknown error"}`)
        },
      })
    }
  }

  // Client search filter matching title or slug
  const displayedNews = useMemo(() => {
    const raw = newsData?.data || []
    if (!searchQuery) return raw
    const q = searchQuery.toLowerCase()
    return raw.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q)
    )
  }, [newsData, searchQuery])

  const totalPages = newsData?.meta.totalPages || 1

  return (
    <div className="min-h-screen flex-1 space-y-6 bg-slate-50/50 p-8 pt-6 dark:bg-slate-900/40">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            News & Articles Manager
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Create and edit content articles, blogs, and announcements.
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/admin/news/authors">
            <Button variant="outline" className="h-10 hover:cursor-pointer">
              <Users className="mr-2 size-4" /> Manage Authors
            </Button>
          </Link>
          <Button
            onClick={handleOpenCreate}
            disabled={authorsList.length === 0}
            className="h-10 hover:cursor-pointer"
          >
            <Plus className="mr-2 size-4" /> Create Article
          </Button>
        </div>
      </div>

      {/* Warning if no authors exist */}
      {authorsList.length === 0 && (
        <Card className="border-amber-100 bg-amber-50/30 dark:bg-amber-950/10">
          <CardContent className="flex items-start gap-3 p-4">
            <ShieldAlert className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-500" />
            <div className="space-y-1">
              <h5 className="text-sm font-bold text-amber-800 dark:text-amber-400">
                No Authors Discovered
              </h5>
              <p className="text-xs text-amber-700/90 dark:text-amber-400/80">
                You must register at least one author profile before creating
                articles.
              </p>
              <Link
                href="/admin/news/authors"
                className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-amber-900 hover:underline dark:text-amber-300"
              >
                Go to Authors Manager <ArrowRight className="size-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters Bar */}
      <Card className="border border-slate-200 bg-white shadow-none dark:border-slate-800 dark:bg-slate-950">
        <CardContent className="flex flex-col items-stretch gap-4 p-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search news titles or slug terms..."
              className="h-10 w-full border-slate-200 bg-white pl-9 shadow-none focus-visible:border-slate-300 focus-visible:ring-rose-800/10 dark:bg-slate-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex shrink-0 items-center gap-1.5 text-xs font-semibold tracking-wide text-slate-500 uppercase">
              <Filter className="h-3.5 w-3.5" /> Filter Type:
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="h-10 w-[140px] border-slate-200 shadow-none">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="NEWS">News</SelectItem>
                <SelectItem value="BLOG">Blog</SelectItem>
                <SelectItem value="ANNOUNCEMENT">Announcement</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-10 w-[140px] border-slate-200 shadow-none">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="REVIEW">Review</SelectItem>
                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Table Card */}
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
                            onClick={() => handleOpenEdit(article)}
                          >
                            <Edit className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:cursor-pointer hover:bg-red-50 hover:text-red-600"
                            onClick={() => handleDelete(article.id)}
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

      {/* CREATE / EDIT DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editingId ? "Edit Article Details" : "Create News Article"}
            </DialogTitle>
            <DialogDescription>
              Write content details, configure analytics, and publish setup
              configurations.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Title */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Article Title
                </label>
                <Input
                  {...register("title")}
                  placeholder="e.g. Annual Fellowship Conference 2026"
                  className="h-10 border-slate-200"
                />
                {errors.title && (
                  <p className="text-xs font-medium text-rose-500">
                    {getErrorMessage(errors.title)}
                  </p>
                )}
              </div>

              {/* Sub Title */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Subtitle / Preheading (Optional)
                </label>
                <Input
                  {...register("supTitle")}
                  placeholder="e.g. Connecting communities globally"
                  className="h-10 border-slate-200"
                />
                {errors.supTitle && (
                  <p className="text-xs font-medium text-rose-500">
                    {getErrorMessage(errors.supTitle)}
                  </p>
                )}
              </div>

              {/* Slug */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Slug Identifier
                </label>
                <Input
                  {...register("slug")}
                  placeholder="e.g. annual-fellowship-conference-2026"
                  className="h-10 border-slate-200 font-mono text-xs"
                />
                {errors.slug && (
                  <p className="text-xs font-medium text-rose-500">
                    {getErrorMessage(errors.slug)}
                  </p>
                )}
              </div>

              {/* Author Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Author Profiles
                </label>
                <Select
                  value={watch("authorId")}
                  onValueChange={(val) =>
                    setValue("authorId", val, { shouldValidate: true })
                  }
                >
                  <SelectTrigger className="h-10 border-slate-200">
                    <SelectValue placeholder="Select Author" />
                  </SelectTrigger>
                  <SelectContent>
                    {authorsList.map((author) => (
                      <SelectItem key={author.id} value={author.id}>
                        {author.name} ({author.designation || "Author"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.authorId && (
                  <p className="text-xs font-medium text-rose-500">
                    {getErrorMessage(errors.authorId)}
                  </p>
                )}
              </div>

              {/* Content Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Content Type
                </label>
                <Select
                  value={watch("newsType")}
                  onValueChange={(val: string) =>
                    setValue("newsType", val as ZTCCreateNewsInput["newsType"], { shouldValidate: true })
                  }
                >
                  <SelectTrigger className="h-10 border-slate-200">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEWS">News</SelectItem>
                    <SelectItem value="BLOG">Blog</SelectItem>
                    <SelectItem value="ANNOUNCEMENT">Announcement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Publish Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Publish Status
                </label>
                <Select
                  value={watch("status")}
                  onValueChange={(val: string) =>
                    setValue("status", val as ZTCCreateNewsInput["status"], { shouldValidate: true })
                  }
                >
                  <SelectTrigger className="h-10 border-slate-200">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="REVIEW">Review</SelectItem>
                    <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Featured Image */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Featured Image URL
                </label>
                <Input
                  {...register("featuredImage")}
                  placeholder="e.g. https://images.unsplash.com/..."
                  className="h-10 border-slate-200 text-xs"
                />
                {errors.featuredImage && (
                  <p className="text-xs font-medium text-rose-500">
                    {getErrorMessage(errors.featuredImage)}
                  </p>
                )}
              </div>

              {/* Featured Image Alt */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Featured Image Alt Text
                </label>
                <Input
                  {...register("featuredImageAlt")}
                  placeholder="e.g. Conference main stage view"
                  className="h-10 border-slate-200"
                />
                {errors.featuredImageAlt && (
                  <p className="text-xs font-medium text-rose-500">
                    {getErrorMessage(errors.featuredImageAlt)}
                  </p>
                )}
              </div>

              {/* Reading Time */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Reading Time (Minutes)
                </label>
                <Input
                  type="number"
                  {...register("readingTime")}
                  placeholder="e.g. 5"
                  className="h-10 border-slate-200"
                />
                {errors.readingTime && (
                  <p className="text-xs font-medium text-rose-500">
                    {getErrorMessage(errors.readingTime)}
                  </p>
                )}
              </div>

              {/* Excerpt */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Short Excerpt (Summary)
                </label>
                <Textarea
                  {...register("excerpt")}
                  placeholder="Enter a brief summary statement for previews..."
                  className="min-h-16 border-slate-200 text-xs"
                />
                {errors.excerpt && (
                  <p className="text-xs font-medium text-rose-500">
                    {getErrorMessage(errors.excerpt)}
                  </p>
                )}
              </div>

              {/* Content body */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Content Body
                </label>
                <Textarea
                  {...register("content")}
                  placeholder="Write the full content body details here..."
                  className="min-h-48 border-slate-200 text-xs"
                />
                {errors.content && (
                  <p className="text-xs font-medium text-rose-500">
                    {getErrorMessage(errors.content)}
                  </p>
                )}
              </div>

              {/* SEO Divider */}
              <div className="flex items-center gap-1.5 border-t border-slate-100 pt-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase md:col-span-2">
                <Globe className="size-3.5 text-primary" /> SEO configuration
                properties
              </div>

              {/* Meta Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  SEO Meta Title
                </label>
                <Input
                  {...register("metaTitle")}
                  placeholder="e.g. Fellowship Conference 2026 | FCH"
                  className="h-10 border-slate-200 text-xs"
                />
              </div>

              {/* Canonical URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Canonical URL
                </label>
                <Input
                  {...register("canonicalUrl")}
                  placeholder="e.g. https://fchportal.org/news/conf-26"
                  className="h-10 border-slate-200 text-xs"
                />
                {errors.canonicalUrl && (
                  <p className="text-xs font-medium text-rose-500">
                    {getErrorMessage(errors.canonicalUrl)}
                  </p>
                )}
              </div>

              {/* Meta Keywords */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  SEO Meta Keywords
                </label>
                <Input
                  {...register("metaKeywords")}
                  placeholder="e.g. fellowship, conference, 2026, events"
                  className="h-10 border-slate-200 text-xs"
                />
              </div>

              {/* Meta Description */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  SEO Meta Description
                </label>
                <Textarea
                  {...register("metaDescription")}
                  placeholder="Enter details optimizing indexing metadata..."
                  className="min-h-16 border-slate-200 text-xs"
                />
              </div>
            </div>

            <DialogFooter className="flex gap-2 border-t border-slate-100 pt-4">
              <Button
                type="button"
                variant="outline"
                className="hover:cursor-pointer"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  createNewsMutation.isPending || updateNewsMutation.isPending
                }
                className="hover:cursor-pointer"
              >
                {createNewsMutation.isPending ||
                updateNewsMutation.isPending ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : null}
                {editingId ? "Update Article" : "Publish Article"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
