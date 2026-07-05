import { Loader2 } from "lucide-react"
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
  fixedType,
}: EventFormDialogProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = form

  const watchedEventType = watch("eventType")

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

            {!fixedType && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Event Type *
                </label>
                <Select
                  value={watch("eventType")}
                  onValueChange={(val: string) =>
                    setValue("eventType", val as ZTCCreateEventInput["eventType"], {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger className="h-10 border-slate-200">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EVENT">Event</SelectItem>
                    <SelectItem value="WEBINAR">Webinar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

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
            {watchedEventType === "WEBINAR" && (
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
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Cover Image URL
              </label>
              <Input
                {...register("coverImage")}
                placeholder="e.g. https://images.unsplash.com/..."
                className="h-10 border-slate-200 text-xs"
              />
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

            {/* Categories */}
            {categoriesList.length > 0 && (
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Categories
                </label>
                <div className="flex flex-wrap gap-2 rounded-lg border border-slate-200 p-3">
                  {categoriesList.map((cat) => {
                    const selected = (watch("categoryIds") || []).includes(cat.id)
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          const current = watch("categoryIds") || []
                          setValue(
                            "categoryIds",
                            selected
                              ? current.filter((id) => id !== cat.id)
                              : [...current, cat.id]
                          )
                        }}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                          selected
                            ? "bg-primary text-primary-foreground"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {cat.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Speakers (Webinar only) */}
            {watchedEventType === "WEBINAR" && (
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
