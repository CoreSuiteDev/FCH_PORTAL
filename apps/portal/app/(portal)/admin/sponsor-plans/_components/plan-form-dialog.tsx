"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { GripVertical, Loader2, Plus, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

import {
  useCreateSponsorPlan,
  useUpdateSponsorPlan,
} from "@/hooks/useSponsorPlan"
import { ZTCSponsorPlanResponse } from "@workspace/types"

import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { toast } from "@workspace/ui/components/sonner"
import { Textarea } from "@workspace/ui/components/textarea"

const planFormSchema = z.object({
  planName: z.string().min(1, "Plan Name is required"),
  amount: z.number().positive("Amount must be positive"),
  currency: z.enum(["USD", "EUR"]),
  tier: z.enum(["BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND"]),
  description: z.string().optional(),
  benefits: z.array(z.string()),
})

type PlanFormValues = z.infer<typeof planFormSchema>

interface PlanFormDialogProps {
  isOpen: boolean
  setIsOpen: (val: boolean) => void
  editingPlan: ZTCSponsorPlanResponse | null
  onSuccess: () => void
}

export const PlanFormDialog = ({
  isOpen,
  setIsOpen,
  editingPlan,
  onSuccess,
}: PlanFormDialogProps) => {
  const createMutation = useCreateSponsorPlan()
  const updateMutation = useUpdateSponsorPlan()
  const isPending = createMutation.isPending || updateMutation.isPending

  const [benefitInputValue, setBenefitInputValue] = useState("")
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      planName: "",
      amount: 0,
      currency: "USD",
      tier: "BRONZE",
      description: "",
      benefits: [],
    },
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const currentBenefits = watch("benefits") || []

  useEffect(() => {
    if (isOpen) {
      if (editingPlan) {
        const benefitsArray = Array.isArray(editingPlan.benefits)
          ? (editingPlan.benefits as string[])
          : []
        reset({
          planName: editingPlan.planName,
          amount: editingPlan.amount,
          currency: editingPlan.currency as "USD" | "EUR",
          tier: editingPlan.tier as
            | "BRONZE"
            | "SILVER"
            | "GOLD"
            | "PLATINUM"
            | "DIAMOND",
          description: editingPlan.description || "",
          benefits: benefitsArray,
        })
      } else {
        reset({
          planName: "",
          amount: 0,
          currency: "USD",
          tier: "BRONZE",
          description: "",
          benefits: [],
        })
      }
      setBenefitInputValue("")
    }
  }, [isOpen, editingPlan, reset])

  const handleAddBenefit = (e?: React.MouseEvent) => {
    e?.preventDefault()
    if (!benefitInputValue.trim()) return

    if (!currentBenefits.includes(benefitInputValue.trim())) {
      setValue("benefits", [...currentBenefits, benefitInputValue.trim()], {
        shouldValidate: true,
      })
    }
    setBenefitInputValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddBenefit()
    }
  }

  const handleRemoveBenefit = (indexToRemove: number) => {
    const updatedBenefits = currentBenefits.filter(
      (_, idx) => idx !== indexToRemove
    )
    setValue("benefits", updatedBenefits, { shouldValidate: true })
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (index: number) => {
    if (draggedIndex === null) return
    const newBenefits = [...currentBenefits]
    const [draggedItem] = newBenefits.splice(draggedIndex, 1)
    if (draggedItem !== undefined) {
      newBenefits.splice(index, 0, draggedItem)
      setValue("benefits", newBenefits, { shouldValidate: true })
    }
    setDraggedIndex(null)
  }

  const onSubmit = async (data: PlanFormValues) => {
    const payload = {
      planName: data.planName,
      amount: data.amount,
      currency: data.currency,
      tier: data.tier,
      description: data.description || undefined,
      benefits: data.benefits,
    }

    try {
      if (editingPlan) {
        await updateMutation.mutateAsync({ id: editingPlan.id, ...payload })
        toast.success("Sponsor plan updated successfully!")
      } else {
        await createMutation.mutateAsync(payload)
        toast.success("Sponsor plan created successfully!")
      }
      setIsOpen(false)
      onSuccess()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save plan")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="flex max-h-[90vh] min-w-md flex-col p-0 sm:max-w-[600px] lg:min-w-xl">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex h-full flex-col overflow-hidden"
        >
          <div className="px-6 pt-6 pb-2">
            <DialogHeader>
              <DialogTitle>
                {editingPlan ? "Edit Sponsor Plan" : "Create Sponsor Plan"}
              </DialogTitle>
              <DialogDescription>
                Fill out the form below to configure a sponsorship tier.
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* এই অংশটুকু স্ক্রল হবে */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              <Field data-invalid={!!errors.planName}>
                <FieldLabel>Plan Name</FieldLabel>
                <Input
                  {...register("planName")}
                  placeholder="e.g. Bronze Sponsor"
                />
                {errors.planName && <FieldError errors={[errors.planName]} />}
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field data-invalid={!!errors.amount}>
                  <FieldLabel>Amount</FieldLabel>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("amount", { valueAsNumber: true })}
                    placeholder="250"
                  />
                  {errors.amount && <FieldError errors={[errors.amount]} />}
                </Field>

                {/* Shadcn UI Select for Currency */}
                <Field data-invalid={!!errors.currency}>
                  <FieldLabel>Currency</FieldLabel>
                  <Controller
                    control={control}
                    name="currency"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.currency && <FieldError errors={[errors.currency]} />}
                </Field>
              </div>

              {/* Shadcn UI Select for Tier */}
              <Field data-invalid={!!errors.tier}>
                <FieldLabel>Tier Level</FieldLabel>
                <Controller
                  control={control}
                  name="tier"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BRONZE">BRONZE</SelectItem>
                        <SelectItem value="SILVER">SILVER</SelectItem>
                        <SelectItem value="GOLD">GOLD</SelectItem>
                        <SelectItem value="PLATINUM">PLATINUM</SelectItem>
                        <SelectItem value="DIAMOND">DIAMOND</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.tier && <FieldError errors={[errors.tier]} />}
              </Field>

              <Field data-invalid={!!errors.description}>
                <FieldLabel>Description</FieldLabel>
                <Textarea
                  {...register("description")}
                  placeholder="Short description for sponsors..."
                />
                {errors.description && (
                  <FieldError errors={[errors.description]} />
                )}
              </Field>

              {/* Draggable Badge Input Area */}
              <div className="space-y-3">
                <FieldLabel>Benefits</FieldLabel>
                <div className="flex items-center gap-2">
                  <Input
                    value={benefitInputValue}
                    onChange={(e) => setBenefitInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. Logo on Site"
                  />
                  <Button
                    type="button"
                    variant="default"
                    size="icon"
                    onClick={handleAddBenefit}
                    disabled={!benefitInputValue.trim()}
                    className="shrink-0 hover:cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {currentBenefits.length > 0 && (
                  <div className="flex flex-col gap-2 rounded-md border border-slate-200 bg-slate-50 p-3">
                    {currentBenefits.map((benefit, index) => (
                      <div
                        key={benefit + index}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e)}
                        onDrop={() => handleDrop(index)}
                        className={`flex items-center justify-between rounded-md border bg-white px-3 py-2 text-sm shadow-sm transition-all hover:border-slate-300 ${
                          draggedIndex === index
                            ? "border-dashed opacity-50"
                            : "border-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-slate-400 hover:cursor-grab active:cursor-grabbing" />
                          <span>{benefit}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full hover:cursor-pointer hover:bg-red-50 hover:text-red-600"
                          onClick={() => handleRemoveBenefit(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                {errors.benefits && (
                  <p className="text-sm text-red-500">
                    {errors.benefits.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4">
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="hover:cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="hover:cursor-pointer"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Plan
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
