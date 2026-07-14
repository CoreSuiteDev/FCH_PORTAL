import React from "react"
import Link from "next/link"
import Image from "next/image"
import { User, Link2, Trash2, Edit3, CheckCircle, FileText } from "lucide-react"
import { Card, CardHeader, CardContent } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { ZTCAuthorOutput } from "@workspace/types"

interface AuthorCardProps {
  author: ZTCAuthorOutput
  onEdit: (author: ZTCAuthorOutput) => void
  onDelete: (id: string) => void
}

export function AuthorCard({ author, onEdit, onDelete }: AuthorCardProps) {
  return (
    <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-none relative flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
      <CardHeader className="flex flex-row items-start gap-4 pb-4">
        {/* Constrained Avatar */}
        <div className="relative size-12 rounded-full overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800 bg-slate-50 flex items-center justify-center">
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
        <div className="space-y-0.5 flex-1 min-w-0">
          <h4 className="font-bold text-slate-900 dark:text-slate-50 leading-tight truncate">
            {author.name}
          </h4>
          {author.designation && (
            <p className="text-xs font-semibold text-slate-400 capitalize truncate">
              {author.designation}
            </p>
          )}
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono mt-1">
            <Link2 className="size-3 shrink-0" />
            <span className="truncate">slug: {author.slug}</span>
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
        {/* Published & Unpublished Counts */}
        <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          <div className="flex items-center gap-1">
            <CheckCircle className="size-3 text-green-500" />
            <span>Pub: {author.publishedCount ?? 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="size-3 text-rose-400" />
            <span>Unpub: {author.unpublishedCount ?? 0}</span>
          </div>
        </div>

        {/* Edit & Delete Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(author)}
            className="h-8 w-8 hover:cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 shrink-0"
          >
            <Edit3 className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(author.id)}
            className="h-8 w-8 hover:cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 text-slate-400 shrink-0"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

export function AuthorCardSkeleton() {
  return (
    <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-none relative flex flex-col justify-between animate-pulse">
      <CardHeader className="flex flex-row items-start gap-4 pb-4">
        <div className="size-12 rounded-full shrink-0 bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3.5 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      </CardHeader>
      <CardContent className="pt-0 flex-1 space-y-2">
        <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
      </CardContent>
      <div className="border-t border-slate-100 dark:border-slate-800 p-4 pt-3 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20 rounded-b-xl">
        <div className="h-3.5 w-20 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="flex gap-1">
          <div className="h-8 w-8 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-8 w-8 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </Card>
  )
}
