"use client"

import React from "react"
import { useDeleteSponsorPlan } from "@/hooks/useSponsorPlan"
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
  planId: string | null
  onSuccess: () => void
}

export const DeleteConfirmDialog = ({
  isOpen,
  setIsOpen,
  planId,
  onSuccess,
}: DeleteConfirmDialogProps) => {
  const deleteMutation = useDeleteSponsorPlan()

  const handleDelete = async () => {
    if (!planId) return
    try {
      await deleteMutation.mutateAsync(planId)
      toast.success("Sponsor plan deleted successfully!")
      setIsOpen(false)
      onSuccess()
    } catch (err: any) {
      toast.error(err.message || "Failed to delete plan")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete Plan?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this sponsor plan? This action cannot be undone.
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
            {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
