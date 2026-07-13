"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  User,
  Plus,
  Loader2,
  Trash2,
  ShieldAlert,
  ArrowLeft,
  CheckCircle,
  Link2,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { toast } from "@workspace/ui/components/sonner"

import { ZCICreateAuthorSchema, ZTCCreateAuthor } from "@workspace/types"
import { useAuthors, useCreateAuthor, useDeleteAuthor } from "@/hooks/useAuthor"
import Image from "next/image"

export default function AuthorsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  
  // Queries & Mutations
  const { data, isLoading, isError, refetch } = useAuthors(currentPage, 10)
  const createAuthorMutation = useCreateAuthor()
  const deleteAuthorMutation = useDeleteAuthor()

  // Form Setup
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<ZTCCreateAuthor>({
    resolver: zodResolver(ZCICreateAuthorSchema),
    defaultValues: {
      name: "",
      slug: "",
      bio: "",
      avatar: "",
      designation: "",
    },
  })

  const nameVal = watch("name")

  // Auto-generate slug from name
  React.useEffect(() => {
    if (nameVal) {
      const generated = nameVal
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
      setValue("slug", generated, { shouldValidate: true })
    }
  }, [nameVal, setValue])

  const onSubmit = (values: ZTCCreateAuthor) => {
    createAuthorMutation.mutate(values, {
      onSuccess: () => {
        toast.success("Author successfully provisioned")
        reset()
      },
      onError: (err: any) => {
        toast.error(`Provisioning failed: ${err.message || "Unknown error"}`)
      },
    })
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this author? All associated news will be deleted.")) {
      deleteAuthorMutation.mutate(id, {
        onSuccess: () => {
          toast.success("Author deleted successfully")
        },
        onError: (err: any) => {
          toast.error(`Delete failed: ${err.message || "Unknown error"}`)
        },
      })
    }
  }

  const authorsList = data?.data || []
  const totalPages = data?.meta.totalPages || 1

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 min-h-screen bg-slate-50/50 dark:bg-slate-900/40">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link
            href="/admin/news"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 mb-2"
          >
            <ArrowLeft className="size-3" /> Back to News Manage
          </Link>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            News Authors Manager
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Manage author identity profiles for news articles, blogs, and announcements.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Creation Form */}
        <Card className="lg:col-span-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-none h-fit">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Add New Author</CardTitle>
            <CardDescription className="text-xs">
              Provision a new author account with system authority details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Author Name</label>
                <Input
                  {...register("name")}
                  placeholder="e.g. Dr. John Carter"
                  className="h-10 border-slate-200"
                  disabled={createAuthorMutation.isPending}
                />
                {errors.name && (
                  <p className="text-xs font-medium text-rose-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Slug Identifier</label>
                <Input
                  {...register("slug")}
                  placeholder="e.g. john-carter"
                  className="h-10 border-slate-200"
                  disabled={createAuthorMutation.isPending}
                />
                {errors.slug && (
                  <p className="text-xs font-medium text-rose-500">{errors.slug.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Designation / Role</label>
                <Input
                  {...register("designation")}
                  placeholder="e.g. Senior Medical Writer"
                  className="h-10 border-slate-200"
                  disabled={createAuthorMutation.isPending}
                />
                {errors.designation && (
                  <p className="text-xs font-medium text-rose-500">{errors.designation.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Avatar Image URL (Optional)</label>
                <Input
                  {...register("avatar")}
                  placeholder="e.g. https://images.unsplash.com/..."
                  className="h-10 border-slate-200"
                  disabled={createAuthorMutation.isPending}
                />
                {errors.avatar && (
                  <p className="text-xs font-medium text-rose-500">{errors.avatar.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Author Bio (Optional)</label>
                <Textarea
                  {...register("bio")}
                  placeholder="Brief biography details..."
                  className="min-h-24 border-slate-200"
                  disabled={createAuthorMutation.isPending}
                />
                {errors.bio && (
                  <p className="text-xs font-medium text-rose-500">{errors.bio.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={createAuthorMutation.isPending}
                className="w-full h-10 hover:cursor-pointer mt-2"
              >
                {createAuthorMutation.isPending ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 size-4" />
                )}
                Create Author
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Authors List */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 border rounded-2xl bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
              <Loader2 className="size-8 text-slate-400 animate-spin" />
              <p className="text-sm text-slate-500">Retrieving authors list...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2 border rounded-2xl bg-rose-50/10 border-rose-100">
              <ShieldAlert className="size-10 text-rose-500" />
              <h4 className="font-bold text-slate-900">Failed to load authors</h4>
              <p className="text-xs text-slate-500">Please retry fetching author database records.</p>
              <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-2">
                Retry Connection
              </Button>
            </div>
          ) : authorsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-2xl bg-white border-slate-200 dark:bg-slate-950 dark:border-slate-800">
              <User className="size-10 text-slate-400 mb-2" />
              <h4 className="font-bold text-slate-900">No Authors Discovered</h4>
              <p className="text-xs text-slate-500">Add details on the left side to register your first author.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {authorsList.map((author) => (
                <Card
                  key={author.id}
                  className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-none relative flex flex-col justify-between"
                >
                  <CardHeader className="flex flex-row items-start gap-4 pb-4">
                    <div className="size-12 rounded-full overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800 bg-slate-50 flex items-center justify-center">
                      {author.avatar ? (
                        <Image
                          src={author.avatar}
                          alt={author.name}
                          fill
                          className="size-full object-cover"
                        />
                      ) : (
                        <User className="size-5 text-slate-400" />
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-slate-900 dark:text-slate-50 leading-tight">
                        {author.name}
                      </h4>
                      {author.designation && (
                        <p className="text-xs font-semibold text-slate-400 capitalize">
                          {author.designation}
                        </p>
                      )}
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono mt-1">
                        <Link2 className="size-3" />
                        <span>slug: {author.slug}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 flex-1">
                    {author.bio ? (
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                        {author.bio}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No biography defined.</p>
                    )}
                  </CardContent>
                  <div className="border-t border-slate-100 dark:border-slate-800 p-4 pt-3 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20 rounded-b-xl">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                      {/* @ts-ignore */}
                      Articles: {author._count?.news || 0}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(author.id)}
                      className="h-8 w-8 hover:cursor-pointer hover:bg-red-50 hover:text-red-600 text-slate-400 shrink-0"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-4 border-t border-slate-200/50">
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
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 text-xs hover:cursor-pointer"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
