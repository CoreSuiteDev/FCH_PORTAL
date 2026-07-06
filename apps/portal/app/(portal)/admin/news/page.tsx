"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, Plus, ShieldAlert, Users } from "lucide-react"
import Link from "next/link"
import React, { useMemo, useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { toast } from "@workspace/ui/components/sonner"

import { useAuthors } from "@/hooks/useAuthor"
import {
  useCreateNews,
  useDeleteNews,
  useNewsList,
  useUpdateNews,
} from "@/hooks/useNews"
import { ZCICreateNewsSchema, ZTCNewsOutput, ZTCCreateNews, ZTCCreateNewsInput } from "@workspace/types"

import { NewsFilters } from "./_components/news-filters"
import { NewsTable } from "./_components/news-table"
import { NewsFormDialog } from "./_components/news-form-dialog"

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
  const form = useForm<ZTCCreateNewsInput>({
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

  const { setValue, reset, watch } = form
  // eslint-disable-next-line react-hooks/incompatible-library
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
      <NewsFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {/* Main Table Card */}
      <NewsTable
        displayedNews={displayedNews}
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      {/* CREATE / EDIT DIALOG */}
      <NewsFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingId={editingId}
        form={form}
        authorsList={authorsList}
        onSubmit={onSubmit}
        isPending={createNewsMutation.isPending || updateNewsMutation.isPending}
      />
    </div>
  )
}
