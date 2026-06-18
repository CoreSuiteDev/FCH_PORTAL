"use client"

import { useState } from "react"
import { Plus, Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command"
import { cn } from "@workspace/ui/lib/utils"
import { createEvent } from "@/services/event-service"

export default function AddNewEvent() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    location: "",
    meetingLink: "",
    coverImage: "",
    maxCapacity: 100,
    description: "",
    speakers: "",
    categoryIds: "",
  })

  const [visibility, setVisibility] = useState("PUBLIC")
  const [eventType, setEventType] = useState("EVENT")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Utility to split and clean arrays
    const parseToArray = (str: string) =>
      str
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "")

    const finalData = {
      title: formData.title,
      startDate: formData.startDate,
      endDate: formData.endDate,
      location: formData.location,
      description: formData.description,
      coverImage: formData.coverImage,
      maxCapacity: Number(formData.maxCapacity),
      meetingLink: formData.meetingLink,
      visibility,
      eventType,
      speakers: formData.speakers,
      categoryIds: parseToArray(formData.categoryIds),
    }

    console.log("Full Event Data:", finalData)

    try {
      const response = await createEvent(finalData)
      console.log("Event Created Successfully:", response)
      setIsAddModalOpen(false)
    } catch (error) {
      console.error("Failed to create event:", error)
      alert("ইভেন্ট তৈরি করতে সমস্যা হয়েছে!")
    }
    setIsAddModalOpen(false)
  }

  return (
    <div className="space-y-6 p-8">
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add New Event
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] max-w-3xl! overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Title</Label>
              <Input name="title" onChange={handleInputChange} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Start Date</Label>
                <Input
                  type="datetime-local"
                  name="startDate"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>End Date</Label>
                <Input
                  type="datetime-local"
                  name="endDate"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Location</Label>
              <Input name="location" onChange={handleInputChange} />
            </div>

            <div className="grid gap-2">
              <Label>Meeting Link</Label>
              <Input name="meetingLink" onChange={handleInputChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Visibility</Label>
                <SelectPopover
                  options={[
                    "PUBLIC",
                    "FREE_WEBINAR",
                    "MEMBER_ONLY",
                    "PASTORAL_ONLY",
                    "BOARD_ONLY",
                  ]}
                  value={visibility}
                  onChange={setVisibility}
                />
              </div>
              <div className="grid gap-2">
                <Label>Event Type</Label>
                <SelectPopover
                  options={["EVENT", "WEBINAR"]}
                  value={eventType}
                  onChange={setEventType}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Max Capacity</Label>
              <Input
                type="number"
                name="maxCapacity"
                value={formData.maxCapacity}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <Label>Cover Image URL</Label>
              <Input name="coverImage" onChange={handleInputChange} />
            </div>

            <div className="grid gap-2">
              <Label>Speakers (comma separated)</Label>
              <Input
                name="speakers"
                placeholder="Speaker 1, Speaker 2"
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <Label>Category IDs (comma separated)</Label>
              <Input
                name="categoryIds"
                placeholder="cat1, cat2"
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <Label>Description</Label>
              <Input name="description" onChange={handleInputChange} />
            </div>

            <Button type="submit">Create Event</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SelectPopover({
  options,
  value,
  onChange,
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {value} <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt}
                  onSelect={() => {
                    onChange(opt)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === opt ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {opt}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
