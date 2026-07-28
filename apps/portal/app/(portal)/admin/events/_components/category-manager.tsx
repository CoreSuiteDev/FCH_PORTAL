"use client"

import React, { useState } from "react"
import { Plus, Edit2, Trash2, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { toast } from "@workspace/ui/components/sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import {
  useEventCategories,
  useCreateEventCategory,
  useUpdateEventCategory,
  useDeleteEventCategory,
} from "@/hooks/useEvents"

export function CategoryManager() {
  const { data: categories, isLoading, isError, refetch } = useEventCategories()

  const createMutation = useCreateEventCategory()
  const updateMutation = useUpdateEventCategory()
  const deleteMutation = useDeleteEventCategory()

  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const handleOpenCreate = () => {
    setEditingId(null)
    setName("")
    setDescription("")
    setIsOpen(true)
  }

  const handleOpenEdit = (cat: any) => {
    setEditingId(cat.id)
    setName(cat.name)
    setDescription(cat.description || "")
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Category name is required")
      return
    }

    const payload = {
      name: name.trim(),
      description: description.trim() || undefined,
    }

    if (editingId) {
      updateMutation.mutate(
        { id: editingId, data: payload },
        {
          onSuccess: () => {
            toast.success("Category updated successfully")
            setIsOpen(false)
            setEditingId(null)
            refetch()
          },
          onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to update category")
          },
        }
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Category created successfully")
          setIsOpen(false)
          refetch()
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || "Failed to create category")
        },
      })
    }
  }

  const handleDeleteConfirm = () => {
    if (!deleteConfirmId) return
    deleteMutation.mutate(deleteConfirmId, {
      onSuccess: () => {
        toast.success("Category deleted successfully")
        setDeleteConfirmId(null)
        refetch()
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || "Failed to delete category")
        setDeleteConfirmId(null)
      },
    })
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-card p-6 border rounded-xl shadow-xs">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Event & Webinar Categories
          </h3>
          <p className="text-xs text-muted-foreground">
            Manage classification labels for all events and webinars.
          </p>
        </div>
        <Button onClick={handleOpenCreate} size="sm" className="h-9 hover:cursor-pointer">
          <Plus className="mr-1.5 size-4" /> Create Category
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : isError ? (
        <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-4 text-center">
          <p className="text-sm text-destructive font-semibold">Failed to load categories</p>
          <Button onClick={() => refetch()} variant="outline" size="sm" className="gap-1.5">
            <RefreshCw className="size-3.5" /> Retry
          </Button>
        </div>
      ) : !categories || categories.length === 0 ? (
        <div className="flex h-32 items-center justify-center rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground">
          No categories found. Click 'Create Category' to get started.
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="bg-muted/40 text-xs font-semibold text-foreground uppercase border-b">
                <tr>
                  <th className="px-6 py-3.5">Name</th>
                  <th className="px-6 py-3.5">Description</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {categories.map((cat: any) => (
                  <tr key={cat.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground">{cat.name}</td>
                    <td className="px-6 py-4 text-xs max-w-xs truncate">
                      {cat.description || <span className="text-muted-foreground/50">No description</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => handleOpenEdit(cat)}
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <Edit2 className="size-4" />
                        </Button>
                        <Button
                          onClick={() => setDeleteConfirmId(cat.id)}
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-destructive cursor-pointer"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Category" : "Create Category"}</DialogTitle>
              <DialogDescription>
                Provide a name and an optional description for this event classification.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Youth Summit, Training..."
                  required
                  disabled={isPending}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what kinds of events belong to this category..."
                  rows={3}
                  disabled={isPending}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="cursor-pointer">
                {isPending && <Loader2 className="mr-1.5 size-4 animate-spin" />}
                {editingId ? "Save Changes" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this event category? This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
              disabled={deleteMutation.isPending}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              className="cursor-pointer"
            >
              {deleteMutation.isPending && <Loader2 className="mr-1.5 size-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
