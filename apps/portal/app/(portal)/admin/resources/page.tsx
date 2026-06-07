import React from "react"
import { IconUpload, IconInfoCircle } from "@tabler/icons-react"

export default function AdminResourcesPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Upload & Manage Resources
          </h2>
          <p className="text-muted-foreground">
            Add new PDF files, worksheets, tools, templates, or zip files to FCH
            resource libraries.
          </p>
        </div>
      </div>

      {/* Developer Notes / TODO */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
        <div className="flex items-start gap-3">
          <IconInfoCircle className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <h4 className="font-semibold text-primary">
              Developer TODO Checklist:
            </h4>
            <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
              <li>
                Upload logic: Setup AWS S3 pre-signed URLs or backend upload
                routes to securely store PDFs, DOCX, and slides.
              </li>
              <li>
                Resource tagging: Connect form fields to save document meta
                (Name, size, categories, and target access tiers like General,
                Pastoral, or Board).
              </li>
              <li>
                Webhook / Sync alerts: Notify users on Slack or send
                announcement triggers when crucial resources are uploaded.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Upload Form Mock */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upload Area */}
        <div className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-12 text-center transition-colors hover:bg-secondary/20 lg:col-span-2">
          <IconUpload className="mb-4 size-12 text-muted-foreground" />
          <h4 className="mb-1 text-base font-bold tracking-tight">
            Drag and drop file here
          </h4>
          <p className="mb-4 text-xs text-muted-foreground">
            or click to browse from files (Max size: 20MB)
          </p>
          <button className="rounded-md border bg-secondary px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-secondary/80">
            Select File
          </button>
        </div>

        {/* Configurations Form */}
        <div className="space-y-4 rounded-lg border bg-card p-6">
          <h3 className="border-b pb-2 text-base font-bold tracking-tight">
            Resource Settings
          </h3>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">
              Document Name
            </label>
            <input
              type="text"
              placeholder="e.g. Q3 Parish Planning Booklet"
              className="w-full rounded border bg-secondary/50 p-2 text-sm focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">
              Access Level / Category
            </label>
            <select className="w-full rounded border bg-secondary/50 p-2 text-sm focus:outline-none">
              <option>General - Basic Resources</option>
              <option>Pastoral - Learning Library</option>
              <option>Pastoral - Catechetical Tools</option>
              <option>Pastoral - Leadership Materials</option>
              <option>Pastoral - Ministry Toolkits</option>
              <option>Pastoral - Parish/Diocese Resources</option>
              <option>Pastoral - Special Resources</option>
              <option>Board - Governance Documents</option>
            </select>
          </div>
          <button className="w-full rounded-md bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            Save & Publish Resource
          </button>
        </div>
      </div>
    </div>
  )
}
