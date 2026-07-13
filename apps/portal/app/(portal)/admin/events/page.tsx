"use client"

import React, { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { toast } from "@workspace/ui/components/sonner"
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"

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
  const [selectedCategoryId, setSelectedCategoryId] = useState("all")

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const listParams = useMemo(
    () => ({ page: currentPage, limit: 50 }), // Load more for tab filter operations
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
    const isWebinar = values.categoryIds?.some((id) => {
      const cat = categoriesList.find((c) => c.id === id)
      return cat ? cat.name.toLowerCase().includes("webinar") : false
    })

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
      eventType: isWebinar ? "WEBINAR" : "EVENT",
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
            refetch()
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
          refetch()
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
        refetch()
      },
      onError: (err: unknown) => {
        toast.error(
          `Delete failed: ${err instanceof Error ? err.message : "Unknown error"}`
        )
        setDeleteConfirmId(null)
      },
    })
  }

  // Client-side search, status, and dynamic categories filters
  const displayedEvents = useMemo(() => {
    const raw = eventsData?.data || []
    return raw.filter((ev) => {
      const matchesSearch =
        !searchQuery ||
        ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.location.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = selectedStatus === "ALL" || ev.status === selectedStatus

      const matchesType = selectedType === "ALL" || ev.eventType === selectedType

      const matchesCategory =
        selectedCategoryId === "all" ||
        ev.categories.some((c: any) => c.id === selectedCategoryId)

      return matchesSearch && matchesStatus && matchesType && matchesCategory
    })
  }, [eventsData, searchQuery, selectedStatus, selectedType, selectedCategoryId])

  const totalPages = eventsData?.meta.totalPages || 1

  // Compute Stats
  const stats = useMemo(() => {
    const all = eventsData?.data || []
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
            Create, manage, and monitor events and webinars.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="h-10 hover:cursor-pointer">
          <Plus className="mr-2 size-4" /> Create Event
        </Button>
      </div>

      {/* Stats Cards */}
      <EventStatsCards stats={stats} />

      {/* Categories Tabs Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Filter by Category
        </label>
        <Tabs value={selectedCategoryId} onValueChange={setSelectedCategoryId} className="w-full">
          <TabsList className="bg-muted/60 border p-1 rounded-xl flex flex-wrap gap-1 w-fit">
            <TabsTrigger value="all" className="px-4 py-2 text-xs font-semibold rounded-lg hover:cursor-pointer">
              All Categories
            </TabsTrigger>
            {categoriesList.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id} className="px-4 py-2 text-xs font-semibold rounded-lg hover:cursor-pointer">
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Filters (Search, Type, Status) */}
      <EventFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        hideTypeFilter={false} // Show type filter because webinar page is removed
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
        hideTypeColumn={false} // Show type column because both are managed here
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
