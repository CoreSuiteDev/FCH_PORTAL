import { Globe, Loader2, Upload, X } from "lucide-react"
import Image from "next/image"
import type { UseFormReturn } from "react-hook-form"
import { Button } from "@workspace/ui/components/button"
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
import { Textarea } from "@workspace/ui/components/textarea"
import type { ZTCCreateNewsInput } from "@workspace/types"
import { getErrorMessage } from "./news-constants"

interface NewsFormDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  editingId: string | null
  form: UseFormReturn<ZTCCreateNewsInput>
  authorsList: Array<{
    id: string
    name: string
    designation?: string | null
  }>
  onSubmit: (values: ZTCCreateNewsInput) => void
  isPending: boolean
}

export function NewsFormDialog({
  isOpen,
  onOpenChange,
  editingId,
  form,
  authorsList,
  onSubmit,
  isPending,
}: NewsFormDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form

  const watchedFeaturedImage = watch("featuredImage")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setValue("featuredImage", reader.result as string, {
          shouldValidate: true,
          shouldDirty: true,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setValue("featuredImage", "", {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  return (

    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] min-w-5xl overflow-y-auto">
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
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Featured Image
              </label>
              {watchedFeaturedImage ? (
                <div className="relative mt-1 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50/10 p-2 overflow-hidden h-40 group">
                  <Image
                    src={watchedFeaturedImage}
                    alt="Featured preview"
                    fill
                    className="h-full w-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-4 right-4 bg-rose-500 text-white rounded-full p-1.5 shadow-md hover:bg-rose-600 transition-colors opacity-90 hover:opacity-100 cursor-pointer"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <label className="relative mt-1 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer group h-40">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="rounded-full bg-slate-100 p-2 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-600 transition-colors">
                      <Upload className="size-5" />
                    </div>
                    <p className="text-xs font-medium text-slate-700">
                      Click to upload featured image
                    </p>
                    <p className="text-[10px] text-slate-400">
                      PNG, JPG, WEBP, or GIF (max. 10MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
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
              <Globe className="size-3.5 text-primary" /> SEO configuration properties
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
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="hover:cursor-pointer"
            >
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              {editingId ? "Update Article" : "Publish Article"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
