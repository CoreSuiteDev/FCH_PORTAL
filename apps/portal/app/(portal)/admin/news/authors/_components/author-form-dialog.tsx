import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus, Save } from "lucide-react"
import { toast } from "@workspace/ui/components/sonner"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@workspace/ui/components/dialog"
import { ZCICreateAuthorSchema, ZTCCreateAuthor, ZTCAuthorOutput } from "@workspace/types"
import { useCreateAuthor, useUpdateAuthor } from "@/hooks/useAuthor"

interface AuthorFormDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  author: ZTCAuthorOutput | null
  onSuccess: () => void
}

export function AuthorFormDialog({
  isOpen,
  onOpenChange,
  author,
  onSuccess,
}: AuthorFormDialogProps) {
  const createAuthorMutation = useCreateAuthor()
  const updateAuthorMutation = useUpdateAuthor()

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

  // Reset form when dialog opens/closes or author changes
  React.useEffect(() => {
    if (isOpen) {
      if (author) {
        reset({
          name: author.name,
          slug: author.slug,
          bio: author.bio || "",
          avatar: author.avatar || "",
          designation: author.designation || "",
        })
      } else {
        reset({
          name: "",
          slug: "",
          bio: "",
          avatar: "",
          designation: "",
        })
      }
    }
  }, [author, isOpen, reset])

  // Auto-generate slug from name in Create mode
  React.useEffect(() => {
    if (!author && nameVal) {
      const generated = nameVal
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
      setValue("slug", generated, { shouldValidate: true })
    }
  }, [nameVal, setValue, author])

  const onSubmit = (values: ZTCCreateAuthor) => {
    if (author) {
      updateAuthorMutation.mutate(
        { id: author.id, data: values },
        {
          onSuccess: () => {
            toast.success("Author profile updated successfully")
            onOpenChange(false)
            onSuccess()
          },
          onError: (err: any) => {
            toast.error(`Update failed: ${err.message || "Unknown error"}`)
          },
        }
      )
    } else {
      createAuthorMutation.mutate(values, {
        onSuccess: () => {
          toast.success("Author provisioned successfully")
          onOpenChange(false)
          onSuccess()
        },
        onError: (err: any) => {
          toast.error(`Provisioning failed: ${err.message || "Unknown error"}`)
        },
      })
    }
  }

  const isPending = createAuthorMutation.isPending || updateAuthorMutation.isPending

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {author ? "Edit Author Profile" : "Add New Author"}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
            {author
              ? "Update this author's details and biography information."
              : "Provision a new author account with system authority details."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Author Name</label>
            <Input
              {...register("name")}
              placeholder="e.g. Dr. John Carter"
              className="h-10 border-slate-200 dark:border-slate-850 bg-slate-50/30 dark:bg-slate-900/30"
              disabled={isPending}
            />
            {errors.name && (
              <p className="text-xs font-medium text-rose-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Slug Identifier</label>
            <Input
              {...register("slug")}
              placeholder="e.g. john-carter"
              className="h-10 border-slate-200 dark:border-slate-850 bg-slate-50/30 dark:bg-slate-900/30"
              disabled={isPending}
            />
            {errors.slug && (
              <p className="text-xs font-medium text-rose-500">{errors.slug.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Designation / Role</label>
            <Input
              {...register("designation")}
              placeholder="e.g. Senior Medical Writer"
              className="h-10 border-slate-200 dark:border-slate-850 bg-slate-50/30 dark:bg-slate-900/30"
              disabled={isPending}
            />
            {errors.designation && (
              <p className="text-xs font-medium text-rose-500">{errors.designation.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Avatar Image URL (Optional)</label>
            <Input
              {...register("avatar")}
              placeholder="e.g. https://images.unsplash.com/..."
              className="h-10 border-slate-200 dark:border-slate-850 bg-slate-50/30 dark:bg-slate-900/30"
              disabled={isPending}
            />
            {errors.avatar && (
              <p className="text-xs font-medium text-rose-500">{errors.avatar.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Author Bio (Optional)</label>
            <Textarea
              {...register("bio")}
              placeholder="Brief biography details..."
              className="min-h-20 border-slate-200 dark:border-slate-850 bg-slate-50/30 dark:bg-slate-900/30"
              disabled={isPending}
            />
            {errors.bio && (
              <p className="text-xs font-medium text-rose-500">{errors.bio.message}</p>
            )}
          </div>

          <DialogFooter className="pt-4 border-t border-slate-100 dark:border-slate-800/80 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-10 border-slate-200 dark:border-slate-800 hover:cursor-pointer"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="h-10 hover:cursor-pointer"
            >
              {isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : author ? (
                <Save className="mr-2 size-4" />
              ) : (
                <Plus className="mr-2 size-4" />
              )}
              {author ? "Save Changes" : "Create Author"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
