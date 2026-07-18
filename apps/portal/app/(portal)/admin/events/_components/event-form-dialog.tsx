import { useMemo, useState } from "react"
import { Loader2, Upload, X } from "lucide-react"
import type { UseFormReturn, FieldError } from "react-hook-form"
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
import type { ZTCCreateEventInput, ZTEventCategory } from "@workspace/types"
import { getErrorMessage, formatDateTimeLocal } from "./event-constants"
import Image from "next/image"
import { api } from "@/lib/axios"
import { IconDownload, IconTrash, IconFileText } from "@tabler/icons-react"
import { toast } from "@workspace/ui/components/sonner"

interface EventFormDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  editingId: string | null
  form: UseFormReturn<ZTCCreateEventInput>
  categoriesList: ZTEventCategory[]
  onSubmit: (values: ZTCCreateEventInput) => void
  isPending: boolean
  fixedType?: "EVENT" | "WEBINAR"
}

export function EventFormDialog({
  isOpen,
  onOpenChange,
  editingId,
  form,
  categoriesList,
  onSubmit,
  isPending,
}: EventFormDialogProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = form

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const watchedCategoryIds = watch("categoryIds") || []
  const isWebinar = useMemo(() => {
    return watchedCategoryIds.some((id) => {
      const cat = categoriesList.find((c) => c.id === id)
      return cat ? cat.name.toLowerCase().includes("webinar") : false
    })
  }, [watchedCategoryIds, categoriesList])

  const watchedCoverImage = watch("coverImage")
  const watchedMaterials = (watch("materials") as any) || []
  const [materialTitle, setMaterialTitle] = useState("")
  const [isUploadingMaterial, setIsUploadingMaterial] = useState(false)

  const handleMaterialUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!materialTitle.trim()) {
      toast.error("Please enter a title for the resource first")
      return
    }

    setIsUploadingMaterial(true)
    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(",")[1]
        
        const response = await api.post("/upload", {
          base64,
          filename: file.name,
          mimetype: file.type,
          folder: "events",
        })

        if (response.data?.success) {
          const newMaterial = {
            title: materialTitle.trim(),
            fileUrl: response.data.data.url,
            fileType: file.name.split(".").pop() || "bin",
          }

          setValue("materials" as any, [...watchedMaterials, newMaterial], {
            shouldValidate: true,
            shouldDirty: true,
          })
          setMaterialTitle("")
          toast.success("Resource uploaded successfully!")
        } else {
          toast.error("Failed to upload resource")
        }
      }
      reader.readAsDataURL(file)
    } catch (err) {
      toast.error("Failed to upload resource")
    } finally {
      setIsUploadingMaterial(false)
    }
  }

  const handleRemoveMaterial = (indexToRemove: number) => {
    setValue(
      "materials" as any,
      watchedMaterials.filter((_: any, idx: number) => idx !== indexToRemove),
      {
        shouldValidate: true,
        shouldDirty: true,
      }
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setValue("coverImage", reader.result as string, {
          shouldValidate: true,
          shouldDirty: true,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setValue("coverImage", "", {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] min-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {editingId ? "Edit Event" : "Create New Event"}
          </DialogTitle>
          <DialogDescription>
            {editingId
              ? "Update event details, visibility, and capacity."
              : "Fill in the details to create a new event or webinar."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            {/* Title */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Event Title *
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

            {/* Description */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Description
              </label>
              <Textarea
                {...register("description")}
                placeholder="Brief description of the event..."
                className="min-h-20 border-slate-200 text-xs"
              />
            </div>



            {/* Visibility */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Visibility *
              </label>
              <Select
                value={watch("visibility")}
                onValueChange={(val: string) =>
                  setValue("visibility", val as ZTCCreateEventInput["visibility"], {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger className="h-10 border-slate-200">
                  <SelectValue placeholder="Select Visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBLIC">Public</SelectItem>
                  <SelectItem value="FREE_WEBINAR">Free Webinar</SelectItem>
                  <SelectItem value="MEMBER_ONLY">Members Only</SelectItem>
                  <SelectItem value="PASTORAL_ONLY">Pastoral Only</SelectItem>
                  <SelectItem value="BOARD_ONLY">Board Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Start Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Start Date & Time *
              </label>
              <Input
                type="datetime-local"
                className="h-10 border-slate-200"
                defaultValue={
                  editingId
                    ? formatDateTimeLocal(watch("startDate") as unknown as string)
                    : ""
                }
                onChange={(e) =>
                  setValue("startDate", e.target.value as unknown as Date, {
                    shouldValidate: true,
                  })
                }
              />
              {errors.startDate && (
                <p className="text-xs font-medium text-rose-500">
                  {getErrorMessage(errors.startDate as FieldError)}
                </p>
              )}
            </div>

            {/* End Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">
                End Date & Time
              </label>
              <Input
                type="datetime-local"
                className="h-10 border-slate-200"
                defaultValue={
                  editingId && watch("endDate")
                    ? formatDateTimeLocal(watch("endDate") as unknown as string)
                    : ""
                }
                onChange={(e) =>
                  setValue(
                    "endDate",
                    e.target.value ? (e.target.value as unknown as Date) : undefined,
                    { shouldValidate: true }
                  )
                }
              />
            </div>

            {/* Location */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Location *
              </label>
              <Input
                {...register("location")}
                placeholder="e.g. Conference Hall A, New York"
                className="h-10 border-slate-200"
              />
              {errors.location && (
                <p className="text-xs font-medium text-rose-500">
                  {getErrorMessage(errors.location)}
                </p>
              )}
            </div>

            {/* Meeting Link (Webinar only) */}
            {isWebinar && (
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Meeting Link{" "}
                  <span className="text-rose-400">*</span>
                </label>
                <Input
                  {...register("meetingLink")}
                  placeholder="e.g. https://zoom.us/j/123456789"
                  className="h-10 border-slate-200 text-xs"
                />
                {errors.meetingLink && (
                  <p className="text-xs font-medium text-rose-500">
                    {getErrorMessage(errors.meetingLink)}
                  </p>
                )}
              </div>
            )}

            {/* Cover Image */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Cover Image
              </label>
              {watchedCoverImage ? (
                <div className="relative mt-1 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50/10 p-2 overflow-hidden h-40 group">
                  <Image
                    src={watchedCoverImage}
                    alt="Cover preview"
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
                      Click to upload cover image
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
            </div>


            {/* Max Capacity */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Max Capacity
              </label>
              <Input
                type="number"
                min={1}
                {...register("maxCapacity", { valueAsNumber: true })}
                placeholder="e.g. 200 (leave blank for unlimited)"
                className="h-10 border-slate-200"
              />
              {errors.maxCapacity && (
                <p className="text-xs font-medium text-rose-500">
                  {getErrorMessage(errors.maxCapacity as FieldError)}
                </p>
              )}
            </div>

            {/* Category Select */}
            {categoriesList.length > 0 && (
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Category *
                </label>
                <Select
                  value={(watch("categoryIds") || [])[0] || ""}
                  onValueChange={(val: string) => {
                    setValue("categoryIds", val ? [val] : [], {
                      shouldValidate: true,
                    })
                  }}
                >
                  <SelectTrigger className="h-10 border-slate-200 text-xs">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesList.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Speakers (Webinar only) */}
            {isWebinar && (
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Speakers{" "}
                  <span className="font-normal normal-case text-slate-400">
                    (comma-separated)
                  </span>
                </label>
                <Input
                  placeholder="e.g. Dr. John Smith, Prof. Jane Doe"
                  className="h-10 border-slate-200"
                  defaultValue={(watch("speakers") || []).join(", ")}
                  onChange={(e) =>
                    setValue(
                      "speakers",
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    )
                  }
                />
              </div>
            )}

            {/* Event Materials / Resources */}
            <div className="space-y-3 md:col-span-2 border-t pt-4 mt-2">
              <label className="text-xs font-bold text-slate-500 uppercase block">
                Event Resources &amp; Materials
              </label>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="e.g. Presentation Handout, Lecture Note PDF"
                  value={materialTitle}
                  onChange={(e) => setMaterialTitle(e.target.value)}
                  className="flex-1 h-10 border-slate-200"
                />
                <label className={`flex h-10 items-center justify-center gap-2 rounded-md border border-dashed border-slate-300 px-4 text-sm font-semibold cursor-pointer hover:bg-slate-50 transition-colors ${isUploadingMaterial ? "opacity-50 pointer-events-none" : ""}`}>
                  {isUploadingMaterial ? (
                    <>
                      <Loader2 className="size-4 animate-spin text-primary" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="size-4 text-slate-500" />
                      Upload File
                    </>
                  )}
                  <input
                    type="file"
                    onChange={handleMaterialUpload}
                    disabled={isUploadingMaterial}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Uploaded Materials List */}
              {watchedMaterials.length > 0 && (
                <div className="mt-3 rounded-lg border bg-slate-50/50 p-3 space-y-2 dark:bg-slate-900/50">
                  {watchedMaterials.map((mat: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded bg-white border border-slate-100 dark:bg-slate-950 dark:border-slate-800">
                      <div className="flex items-center gap-2 truncate">
                        <IconFileText className="size-4 text-primary shrink-0" />
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{mat.title}</span>
                        <span className="text-[10px] text-muted-foreground uppercase">({mat.fileType})</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <a
                          href={mat.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-slate-400 hover:text-primary transition-colors"
                        >
                          <IconDownload className="size-4" />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleRemoveMaterial(idx)}
                          className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                        >
                          <IconTrash className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
              {editingId ? "Update Event" : "Create Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
