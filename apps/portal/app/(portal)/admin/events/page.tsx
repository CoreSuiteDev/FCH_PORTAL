"use client"

import React, { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { toast } from "@workspace/ui/components/sonner"

import {
  useCreateEvent,
  useDeleteEvent,
  useEventCategories,
  useEventsList,
  useUpdateEvent,
} from "@/hooks/useEvents"
import {
  ZCICreateEventSchema,
  ZTCCreateEvent,
  ZTCCreateEventInput,
  ZTEvent,
} from "@workspace/types"

import { EventStatsCards } from "./_components/event-stats-cards"
import { EventFilters } from "./_components/event-filters"
import { EventTable } from "./_components/event-table"
import { EventFormDialog } from "./_components/event-form-dialog"
import { EventDeleteDialog } from "./_components/event-delete-dialog"

export default function EventsAdminPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("ALL")
  const [selectedType, setSelectedType] = useState("ALL")

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const listParams = useMemo(
    () => ({ page: currentPage, limit: 10 }),
    [currentPage]
  )

  const { data: eventsData, isLoading, isError, refetch } = useEventsList(listParams)
  const { data: categoriesData } = useEventCategories()

  const createEventMutation = useCreateEvent()
  const updateEventMutation = useUpdateEvent()
  const deleteEventMutation = useDeleteEvent()

  const categoriesList = categoriesData || []

  // --- Form Hook ---
  const form = useForm<ZTCCreateEventInput>({
    resolver: zodResolver(ZCICreateEventSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      coverImage: "",
      meetingLink: "",
      maxCapacity: undefined,
      visibility: "PUBLIC",
      eventType: "EVENT",
      speakers: [],
      categoryIds: [],
    },
  })

  const handleOpenCreate = () => {
    setEditingId(null)
    form.reset({
      title: "",
      description: "",
      location: "",
      coverImage: "",
      meetingLink: "",
      maxCapacity: undefined,
      visibility: "PUBLIC",
      eventType: "EVENT",
      speakers: [],
      categoryIds: [],
    })
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (event: ZTEvent) => {
    setEditingId(event.id)
    form.reset({
      title: event.title,
      description: event.description ?? "",
      startDate: new Date(event.startDate),
      endDate: event.endDate ? new Date(event.endDate) : undefined,
      location: event.location,
      coverImage: event.coverImage ?? "",
      meetingLink: event.meetingLink ?? "",
      maxCapacity: event.maxCapacity ?? undefined,
      visibility: event.visibility,
      eventType: event.eventType,
      speakers: event.webinar?.speakers ?? [],
      categoryIds: event.categories.map((c) => c.id),
    })
    setIsDialogOpen(true)
  }

  const onSubmit = (values: ZTCCreateEventInput) => {
    const payload: ZTCCreateEvent = {
      title: values.title,
      description: values.description || undefined,
      startDate: new Date(values.startDate as unknown as string),
      endDate: values.endDate ? new Date(values.endDate as unknown as string) : undefined,
      location: values.location,
      coverImage: values.coverImage || undefined,
      meetingLink: values.meetingLink || undefined,
      maxCapacity: values.maxCapacity ? Number(values.maxCapacity) : undefined,
      visibility: values.visibility || "PUBLIC",
      eventType: values.eventType || "EVENT",
      speakers: values.speakers || [],
      categoryIds: values.categoryIds || [],
    }

    if (editingId) {
      updateEventMutation.mutate(
        { id: editingId, data: payload },
        {
          onSuccess: () => {
            toast.success("Event updated successfully")
            setIsDialogOpen(false)
            setEditingId(null)
          },
          onError: (err: unknown) => {
            toast.error(
              `Update failed: ${err instanceof Error ? err.message : "Unknown error"}`
            )
          },
        }
      )
    } else {
      createEventMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Event created successfully")
          setIsDialogOpen(false)
        },
        onError: (err: unknown) => {
          toast.error(
            `Creation failed: ${err instanceof Error ? err.message : "Unknown error"}`
          )
        },
      })
    }
  }

  const handleDeleteConfirm = () => {
    if (!deleteConfirmId) return
    deleteEventMutation.mutate(deleteConfirmId, {
      onSuccess: () => {
        toast.success("Event deleted successfully")
        setDeleteConfirmId(null)
      },
      onError: (err: unknown) => {
        toast.error(
          `Delete failed: ${err instanceof Error ? err.message : "Unknown error"}`
        )
        setDeleteConfirmId(null)
      },
    })
  }

  // Client-side search and filters
  const displayedEvents = useMemo(() => {
    const raw = eventsData?.data || []
    return raw.filter((ev) => {
      // Show only EVENT types on the Events page
      if (ev.eventType !== "EVENT") return false

      const matchesSearch =
        !searchQuery ||
        ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.location.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = selectedStatus === "ALL" || ev.status === selectedStatus
      return matchesSearch && matchesStatus
    })
  }, [eventsData, searchQuery, selectedStatus])

  const totalPages = eventsData?.meta.totalPages || 1

  // Compute Stats
  const stats = useMemo(() => {
    const all = (eventsData?.data || []).filter((e) => e.eventType === "EVENT")
    return {
      total: all.length,
      upcoming: all.filter((e) => e.status === "UPCOMING").length,
      ongoing: all.filter((e) => e.status === "ONGOING").length,
      completed: all.filter((e) => e.status === "COMPLETED").length,
    }
  }, [eventsData])

  return (
    <div className="min-h-screen flex-1 space-y-6 bg-slate-50/50 p-8 pt-6 dark:bg-slate-900/40">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Events Manager
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Create, manage, and monitor events.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="h-10 hover:cursor-pointer">
          <Plus className="mr-2 size-4" /> Create Event
        </Button>
      </div>

      {/* Stats Cards */}
      <EventStatsCards stats={stats} />

      {/* Filters */}
      <EventFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        hideTypeFilter={true}
      />

      {/* Table & Pagination */}
      <EventTable
        events={displayedEvents}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onEdit={handleOpenEdit}
        onDelete={setDeleteConfirmId}
        hideTypeColumn={true}
      />

      {/* Form Dialog */}
      <EventFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingId={editingId}
        form={form}
        categoriesList={categoriesList}
        onSubmit={onSubmit}
        isPending={createEventMutation.isPending || updateEventMutation.isPending}
        fixedType="EVENT"
      />

      {/* Delete Confirmation */}
      <EventDeleteDialog
        isOpen={!!deleteConfirmId}
        onOpenChange={(open) => {
          if (!open) setDeleteConfirmId(null)
        }}
        onConfirm={handleDeleteConfirm}
        isPending={deleteEventMutation.isPending}
      />
    </div>
  )
}
