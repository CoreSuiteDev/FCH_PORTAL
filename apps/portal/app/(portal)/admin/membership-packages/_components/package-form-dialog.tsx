"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { GripVertical, Loader2, Plus, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"

import {
  useCreatePackage,
  useUpdatePackage,
} from "@/hooks/usePackage"
import { ZCPackageFormSchema, ZTCMembershipPackage, ZTPackageFormValues } from "@workspace/types"

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
import { Switch } from "@workspace/ui/components/switch"

interface PackageFormDialogProps {
  isOpen: boolean
  setIsOpen: (val: boolean) => void
  editingPackage: ZTCMembershipPackage | null
  onSuccess: () => void
}

export const PackageFormDialog = ({
  isOpen,
  setIsOpen,
  editingPackage,
  onSuccess,
}: PackageFormDialogProps) => {
  const createMutation = useCreatePackage()
  const updateMutation = useUpdatePackage()
  const isPending = createMutation.isPending || updateMutation.isPending

  const [featureInputValue, setFeatureInputValue] = useState("")
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ZTPackageFormValues>({
    resolver: zodResolver(ZCPackageFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      type: "GENERAL",
      billingCycle: "MONTHLY",
      price: 0,
      currency: "USD",
      subTitle: "",
      description: "",
      featureTitle: "What's included",
      features: [],
      sortOrder: 0,
      isActive: true,
      isPopular: false,
    },
  })

  // Watch features to render and reorder
  // eslint-disable-next-line react-hooks/incompatible-library
  const currentFeatures = watch("features") || []

  // Auto-generate slug from name
  const nameValue = watch("name")
  useEffect(() => {
    if (nameValue && !editingPackage) {
      const generatedSlug = nameValue
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
      setValue("slug", generatedSlug, { shouldValidate: true })
    }
  }, [nameValue, editingPackage, setValue])

  useEffect(() => {
    if (isOpen) {
      if (editingPackage) {
        const featuresArray = Array.isArray(editingPackage.features)
          ? (editingPackage.features as string[])
          : []
        reset({
          name: editingPackage.name,
          slug: editingPackage.slug,
          type: editingPackage.type as "GENERAL" | "PASTORAL",
          billingCycle: editingPackage.billingCycle as "MONTHLY" | "YEARLY",
          price: Number(editingPackage.price),
          currency: editingPackage.currency as "USD" | "EUR",
          description: editingPackage.description || "",
          subTitle: editingPackage.subTitle || "",
          featureTitle: editingPackage.featureTitle || "What's included",
          features: featuresArray,
          sortOrder: editingPackage.sortOrder ?? 0,
          isActive: editingPackage.isActive ?? true,
          isPopular: editingPackage.isPopular ?? false,
        })
      } else {
        reset({
          name: "",
          slug: "",
          type: "GENERAL",
          billingCycle: "MONTHLY",
          price: 0,
          currency: "USD",
          description: "",
          subTitle: "",
          featureTitle: "What's included",
          features: [],
          sortOrder: 0,
          isActive: true,
          isPopular: false,
        })
      }
      setFeatureInputValue("")
    }
  }, [isOpen, editingPackage, reset])

  const handleAddFeature = () => {
    const trimmed = featureInputValue.trim()
    if (!trimmed) return
    if (currentFeatures.includes(trimmed)) {
      toast.error("This feature is already added")
      return
    }
    setValue("features", [...currentFeatures, trimmed], { shouldValidate: true })
    setFeatureInputValue("")
  }

  const handleRemoveFeature = (index: number) => {
    const updated = currentFeatures.filter((_, i) => i !== index)
    setValue("features", updated, { shouldValidate: true })
  }

  // --- Drag & Drop logic for Features reordering ---
  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const updated = [...currentFeatures]
    const [draggedItem] = updated.splice(draggedIndex, 1)
    updated.splice(index, 0, draggedItem!)

    setDraggedIndex(index)
    setValue("features", updated, { shouldValidate: true })
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const onSubmit = async (data: ZTPackageFormValues) => {
    try {
      if (editingPackage) {
        await updateMutation.mutateAsync({
          id: editingPackage.id,
          data: {
            name: data.name,
            slug: data.slug,
            type: data.type,
            billingCycle: data.billingCycle,
            price: data.price,
            currency: data.currency,
            subTitle: data.subTitle || undefined,
            description: data.description || undefined,
            featureTitle: data.featureTitle || undefined,
            features: data.features.length > 0 ? data.features : undefined,
            sortOrder: data.sortOrder,
            isActive: data.isActive,
            isPopular: data.isPopular,
          },
        })
        toast.success("Membership package updated successfully!")
      } else {
        await createMutation.mutateAsync({
          name: data.name,
          slug: data.slug,
          type: data.type,
          billingCycle: data.billingCycle,
          price: data.price,
          currency: data.currency,
          subTitle: data.subTitle || undefined,
          description: data.description || undefined,
          featureTitle: data.featureTitle || undefined,
          features: data.features.length > 0 ? data.features : undefined,
          sortOrder: data.sortOrder,
          isActive: data.isActive,
          isPopular: data.isPopular,
        })
        toast.success("Membership package created successfully!")
      }
      setIsOpen(false)
      onSuccess()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "An error occurred while saving the package")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* 1. Added flex flex-col to parent dialog container */}
      <DialogContent className="min-w-2xl max-h-[90vh] flex flex-col gap-0 p-6">
        <DialogHeader className="pb-4">
          <DialogTitle>
            {editingPackage ? "Edit Membership Package" : "Create Membership Package"}
          </DialogTitle>
          <DialogDescription>
            Configure membership pricing, limits, and billing rules.
          </DialogDescription>
        </DialogHeader>

        {/* 2. Made the form stretch and handle hidden overflow */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
          
          {/* 3. Created a dedicated scroll container for all inputs */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-6 min-h-0 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={!!errors.name}>
                <FieldLabel className="text-xs font-bold text-slate-500 uppercase">Package Name</FieldLabel>
                <Input
                  {...register("name")}
                  placeholder="e.g. Premium Pastoral"
                  className="h-10 border-slate-200"
                  disabled={isPending}
                />
                {errors.name && <FieldError errors={[errors.name]} />}
              </Field>

              <Field data-invalid={!!errors.slug}>
                <FieldLabel className="text-xs font-bold text-slate-500 uppercase">Slug</FieldLabel>
                <Input
                  {...register("slug")}
                  placeholder="e.g. premium-pastoral"
                  className="h-10 border-slate-200"
                  disabled={isPending}
                />
                {errors.slug && <FieldError errors={[errors.slug]} />}
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={!!errors.type}>
                <FieldLabel className="text-xs font-bold text-slate-500 uppercase">Membership Type</FieldLabel>
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="h-10 border-slate-200 capitalize">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GENERAL" className="capitalize">General</SelectItem>
                        <SelectItem value="PASTORAL" className="capitalize">Pastoral</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.type && <FieldError errors={[errors.type]} />}
              </Field>

              <Field data-invalid={!!errors.billingCycle}>
                <FieldLabel className="text-xs font-bold text-slate-500 uppercase">Billing Cycle</FieldLabel>
                <Controller
                  control={control}
                  name="billingCycle"
                  render={({ field }) => (
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="h-10 border-slate-200 capitalize">
                        <SelectValue placeholder="Select cycle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MONTHLY" className="capitalize">Monthly</SelectItem>
                        <SelectItem value="YEARLY" className="capitalize">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.billingCycle && <FieldError errors={[errors.billingCycle]} />}
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field data-invalid={!!errors.price} className="sm:col-span-2">
                <FieldLabel className="text-xs font-bold text-slate-500 uppercase">Price</FieldLabel>
                <Input
                  type="number"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                  placeholder="0.00"
                  className="h-10 border-slate-200"
                  disabled={isPending}
                />
                {errors.price && <FieldError errors={[errors.price]} />}
              </Field>

              <Field data-invalid={!!errors.currency}>
                <FieldLabel className="text-xs font-bold text-slate-500 uppercase">Currency</FieldLabel>
                <Controller
                  control={control}
                  name="currency"
                  render={({ field }) => (
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="h-10 border-slate-200">
                        <SelectValue placeholder="USD" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.currency && <FieldError errors={[errors.currency]} />}
              </Field>
            </div>

            <Field data-invalid={!!errors.subTitle}>
              <FieldLabel className="text-xs font-bold text-slate-500 uppercase">Sub Title / Tagline (Optional)</FieldLabel>
              <Input
                {...register("subTitle")}
                placeholder="e.g. Best choice for churches"
                className="h-10 border-slate-200"
                disabled={isPending}
              />
              {errors.subTitle && <FieldError errors={[errors.subTitle]} />}
            </Field>

            <Field data-invalid={!!errors.description}>
              <FieldLabel className="text-xs font-bold text-slate-500 uppercase">Description (Optional)</FieldLabel>
              <Textarea
                {...register("description")}
                placeholder="Describe what makes this package special..."
                className="min-h-20 border-slate-200"
                disabled={isPending}
              />
              {errors.description && <FieldError errors={[errors.description]} />}
            </Field>

            {/* Features management */}
            <div className="space-y-3 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Features & Benefits List</h3>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field data-invalid={!!errors.featureTitle} className="sm:col-span-1">
                  <FieldLabel className="text-[10px] font-bold text-slate-500 uppercase">Features Header</FieldLabel>
                  <Input
                    {...register("featureTitle")}
                    placeholder="e.g. What's included"
                    className="h-10 border-slate-200"
                    disabled={isPending}
                  />
                </Field>

                <div className="sm:col-span-2 flex flex-col justify-end">
                  <FieldLabel className="text-[10px] font-bold text-slate-500 uppercase mb-1">Add Individual Feature</FieldLabel>
                  <div className="flex gap-2">
                    <Input
                      value={featureInputValue}
                      onChange={(e) => setFeatureInputValue(e.target.value)}
                      placeholder="e.g. Free access to basic webinars"
                      className="h-10 border-slate-200 flex-1"
                      disabled={isPending}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddFeature()
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddFeature}
                      className="h-10 hover:cursor-pointer border-slate-200"
                      disabled={isPending}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {currentFeatures.length > 0 ? (
                <div className="mt-3 space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  <p className="text-[10px] text-slate-400 font-medium italic">Drag to reorder features</p>
                  {currentFeatures.map((feat, index) => (
                    <div
                      key={index}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className="flex items-center gap-2 rounded-md border border-slate-100 bg-slate-50/50 p-2 cursor-grab active:cursor-grabbing hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50"
                    >
                      <GripVertical className="size-4 shrink-0 text-slate-400" />
                      <span className="text-xs text-slate-700 dark:text-slate-300 flex-1 truncate">{feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="text-slate-400 hover:text-red-500 shrink-0 p-0.5"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center py-4 border border-dashed rounded-md border-slate-200 mt-2">
                  No features added yet. Add some above.
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field data-invalid={!!errors.sortOrder} className="sm:col-span-1">
                <FieldLabel className="text-xs font-bold text-slate-500 uppercase">Sort Order</FieldLabel>
                <Input
                  type="number"
                  {...register("sortOrder", { valueAsNumber: true })}
                  placeholder="0"
                  className="h-10 border-slate-200"
                  disabled={isPending}
                />
                {errors.sortOrder && <FieldError errors={[errors.sortOrder]} />}
              </Field>

              <div className="sm:col-span-2 flex items-center gap-6 pt-6">
                <Field orientation="horizontal" className="items-center space-y-0 space-x-2 py-0.5">
                  <Controller
                    control={control}
                    name="isActive"
                    render={({ field }) => (
                      <Switch
                        id="pkg-isActive"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <FieldLabel htmlFor="pkg-isActive" className="cursor-pointer text-sm font-medium">
                    Active
                  </FieldLabel>
                </Field>

                <Field orientation="horizontal" className="items-center space-y-0 space-x-2 py-0.5">
                  <Controller
                    control={control}
                    name="isPopular"
                    render={({ field }) => (
                      <Switch
                        id="pkg-isPopular"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <FieldLabel htmlFor="pkg-isPopular" className="cursor-pointer text-sm font-medium">
                    Popular Package
                  </FieldLabel>
                </Field>
              </div>
            </div>
          </div>

          {/* 4. Kept footer strictly placed below the scroll window */}
          <DialogFooter className="pt-4 border-t border-slate-100 dark:border-slate-800 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="h-10 hover:cursor-pointer"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-10 bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 hover:cursor-pointer"
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingPackage ? "Update Package" : "Create Package"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}