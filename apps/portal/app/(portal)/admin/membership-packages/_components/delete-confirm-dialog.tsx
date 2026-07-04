"use client"

import React from "react"
import { useDeletePackage } from "@/hooks/usePackage"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Loader2 } from "lucide-react"
import { toast } from "@workspace/ui/components/sonner"

interface DeleteConfirmDialogProps {
  isOpen: boolean
  setIsOpen: (val: boolean) => void
  packageId: string | null
  onSuccess: () => void
}

export const DeleteConfirmDialog = ({
  isOpen,
  setIsOpen,
  packageId,
  onSuccess,
}: DeleteConfirmDialogProps) => {
  const deleteMutation = useDeletePackage()

  const handleDelete = async () => {
    if (!packageId) return
    try {
      await deleteMutation.mutateAsync(packageId)
      toast.success("Membership package deleted successfully!")
      setIsOpen(false)
      onSuccess()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete package")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete Package?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this membership package? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="hover:cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="hover:cursor-pointer"
          >
            {deleteMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
