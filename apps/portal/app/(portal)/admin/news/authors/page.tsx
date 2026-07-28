"use client"

import { ArrowLeft, Plus, ShieldAlert, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@workspace/ui/components/button"
import { toast } from "@workspace/ui/components/sonner"

import { useAuthors, useDeleteAuthor } from "@/hooks/useAuthor"
import { ZTCAuthorOutput } from "@workspace/types"

// Subcomponents
import { AuthorCard, AuthorCardSkeleton } from "./_components/author-card"
import { AuthorFormDialog } from "./_components/author-form-dialog"
import { AuthorStats } from "./_components/author-stats"

export default function AuthorsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [activeAuthorForEdit, setActiveAuthorForEdit] =
    useState<ZTCAuthorOutput | null>(null)

  // Queries & Mutations
  const { data, isLoading, isError, refetch } = useAuthors(currentPage, 10)
  const deleteAuthorMutation = useDeleteAuthor()

  const handleDelete = (id: string) => {
    if (
      confirm(
        "Are you sure you want to delete this author? All associated news will be deleted."
      )
    ) {
      deleteAuthorMutation.mutate(id, {
        onSuccess: () => {
          toast.success("Author deleted successfully")
        },
        onError: (err: Error) => {
          toast.error(`Delete failed: ${err.message || "Unknown error"}`)
        },
      })
    }
  }

  const handleEdit = (author: ZTCAuthorOutput) => {
    setActiveAuthorForEdit(author)
    setIsFormOpen(true)
  }

  const handleAddClick = () => {
    setActiveAuthorForEdit(null)
    setIsFormOpen(true)
  }

  const authorsList = data?.data || []
  const totalPages = data?.meta.totalPages || 1
  const totalAuthors = data?.meta.totalCount || 0

  return (
    <div className="min-h-screen flex-1 space-y-8 bg-slate-50/50 p-8 pt-6 dark:bg-slate-900/40">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Link
            href="/admin/news"
            className="mb-2 inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
          >
            <ArrowLeft className="size-3" /> Back to News Manage
          </Link>
          <h2 className="font-trajan text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            News Authors Manager
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage author identity profiles for news articles, blogs, and
            announcements.
          </p>
        </div>
        <Button
          onClick={handleAddClick}
          className="h-10 font-semibold shadow-xs hover:cursor-pointer sm:self-end"
        >
          <Plus className="mr-2 size-4" /> Add New Author
        </Button>
      </div>

      {/* KPI Stats Grid */}
      {!isLoading && !isError && authorsList.length > 0 && (
        <AuthorStats authors={authorsList} totalAuthors={totalAuthors} />
      )}

      {/* Authors list layout */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[1, 2, 3, 6].map((i) => (
              <AuthorCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-rose-100 bg-rose-50/10 py-16">
            <ShieldAlert className="size-10 text-rose-500" />
            <h4 className="font-bold text-slate-900">Failed to load authors</h4>
            <p className="text-xs text-slate-500">
              Please retry fetching author database records.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="mt-2"
            >
              Retry Connection
            </Button>
          </div>
        ) : authorsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-20 dark:border-slate-800 dark:bg-slate-950">
            <User className="mb-2 size-10 text-slate-400" />
            <h4 className="font-bold text-slate-900">No Authors Discovered</h4>
            <p className="text-xs text-slate-500">
              Add details to register your first author.
            </p>
            <Button
              onClick={handleAddClick}
              className="mt-4 hover:cursor-pointer"
            >
              <Plus className="mr-2 size-4" /> Add First Author
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {authorsList.map((author) => (
              <AuthorCard
                key={author.id}
                author={author}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200/50 pt-4">
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
      </div>

      {/* Creation / Edition Dialog Modal */}
      <AuthorFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        author={activeAuthorForEdit}
        onSuccess={() => refetch()}
      />
    </div>
  )
}
