"use client"

import React from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Sparkles, Calendar } from "lucide-react"
type EventFormData = {
  name: string
  date: string
  minClearance: string
  description: string
}

export default function AddEventForm() {
  const { register, handleSubmit, setValue, reset } = useForm<EventFormData>()

  const onSubmit: SubmitHandler<EventFormData> = (data) => {
    console.log(data)
    reset()
  }

  return (
    <section className="mt-5 px-6">
      {/* Container with a subtle ring and high-end shadow */}
      <Card className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
        {/* Decorative subtle header line */}
        <div className="absolute top-0 left-0 h-1.5 w-full bg-linear-to-r from-primary/60 to-primary" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight text-slate-900">
                New Event Entry
              </h3>
              <p className="text-[11px] font-medium tracking-wider text-slate-400 uppercase">
                Register a new portal event
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase">
                Event Name
              </Label>
              <Input
                {...register("name")}
                className="h-12 rounded-xl border-slate-200 bg-slate-50/50 transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="e.g. Annual Leadership Gala"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase">
                  Date
                </Label>
                <div className="relative">
                  <Calendar className="absolute top-3.5 left-3 h-4 w-4 text-slate-400" />
                  <Input
                    type="date"
                    {...register("date")}
                    className="h-12 rounded-xl border-slate-200 bg-slate-50/50 pl-9"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase">
                  Clearance
                </Label>
                <Select onValueChange={(v) => setValue("minClearance", v)}>
                  <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50/50">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Pastoral">Pastoral</SelectItem>
                    <SelectItem value="Board">Board</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase">
                Description
              </Label>
              <Textarea
                {...register("description")}
                className="min-h-[120px] rounded-2xl border-slate-200 bg-slate-50/50 p-4 transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Describe the event details, objectives, or requirements..."
              />
            </div>
          </div>

          <Button
            type="submit"
            className="h-12 w-full rounded-2xl bg-primary text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-black hover:shadow-xl active:scale-[0.98]"
          >
            Publish Event
          </Button>
        </form>
      </Card>
    </section>
  )
}
