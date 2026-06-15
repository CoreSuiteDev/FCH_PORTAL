"use client"

import React from "react"
import { useForm } from "react-hook-form"
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
import { Video } from "lucide-react"

export default function AddWebinarForm() {
  const { register, handleSubmit, setValue, reset } = useForm()

  const onSubmit = (data: any) => {
    console.log("Premium Webinar Submission:", data)
    reset()
  }

  return (
    <section className="px-6">
      {/* Outer wrapper for depth */}
      <Card className="relative overflow-hidden rounded-lg border border-slate-100 bg-white/80 p-8 shadow-2xl shadow-slate-200/40 backdrop-blur-xl">
        {/* Accent bar at the top */}
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-red-600 via-primary to-red-900" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
              <Video className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight text-slate-900">
                New Session Entry
              </h3>
              <p className="text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                Studio Management Portal
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Webinar Title
                </Label>
                <Input
                  {...register("title")}
                  className="h-14 rounded-2xl border-slate-200 bg-white px-5 shadow-sm transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                  placeholder="e.g. Future of Ministry"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Speaker
                </Label>
                <Input
                  {...register("speaker")}
                  className="h-14 rounded-2xl border-slate-200 bg-white px-5 shadow-sm transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                  placeholder="e.g. John Doe"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Date
                </Label>
                <Input
                  type="date"
                  {...register("date")}
                  className="h-14 rounded-2xl border-slate-200 bg-white px-5 shadow-sm focus:ring-4 focus:ring-primary/10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Category
                </Label>
                <Select onValueChange={(v) => setValue("category", v)}>
                  <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-white px-5 shadow-sm">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="Catechesis">Catechesis</SelectItem>
                    <SelectItem value="Hispanic Ministry">
                      Hispanic Ministry
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Status
                </Label>
                <Select onValueChange={(v) => setValue("status", v)}>
                  <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-white px-5 shadow-sm">
                    <SelectValue placeholder="Status..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="Upcoming">Upcoming</SelectItem>
                    <SelectItem value="Live">Live</SelectItem>
                    <SelectItem value="Recorded">Recorded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Cover Image URL
              </Label>
              <Input
                {...register("image")}
                className="h-14 rounded-2xl border-slate-200 bg-white px-5 shadow-sm transition-all focus:ring-4 focus:ring-primary/10"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Description
              </Label>
              <Textarea
                {...register("description")}
                className="min-h-[140px] rounded-3xl border-slate-200 bg-white p-5 shadow-sm transition-all focus:ring-4 focus:ring-primary/10"
                placeholder="Provide a summary of the session..."
              />
            </div>
          </div>

          <Button
            type="submit"
            className="h-12 w-full rounded-2xl bg-primary text-[14px] font-bold tracking-wider text-white shadow-2xl shadow-slate-900/30 transition-all hover:scale-[1.01] hover:bg-slate-800 active:scale-[0.99]"
          >
            PUBLISH WEBINAR
          </Button>
        </form>
      </Card>
    </section>
  )
}
