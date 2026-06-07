import React from "react"
import { IconDownload, IconFileText, IconInfoCircle } from "@tabler/icons-react"

export default function BasicResourcesPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Basic Resource Library</h2>
          <p className="text-muted-foreground">
            Access general reference guides, FCH toolkits, and introductory materials.
          </p>
        </div>
      </div>

      {/* Developer Notes / TODO */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
        <div className="flex items-start gap-3">
          <IconInfoCircle className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <h4 className="font-semibold text-primary">Developer TODO Checklist:</h4>
            <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
              <li>Integrate file uploads from the Admin dashboard to cloud storage (e.g., AWS S3).</li>
              <li>Fetch files filtered by member group (e.g. general members should only see 'basic' resource tags).</li>
              <li>Track file download statistics (increment download count in database on click).</li>
              <li>Implement fuzzy search and category filtration (PDFs, Templates, Guideline sheets).</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mock Resources */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "FCH Member Welcome Handbook",
            type: "PDF Document",
            size: "2.4 MB",
            description: "Introduction guidelines, membership benefits, and FCH portal navigation instructions.",
          },
          {
            title: "Parish Engagement Template",
            type: "Word Document",
            size: "1.2 MB",
            description: "Standard layout for setting up community announcements and outreach bulletins.",
          },
          {
            title: "Introduction to Catechism Guide",
            type: "PDF Document",
            size: "4.1 MB",
            description: "A summary overview of the FCH catechetical structure and teaching methodology.",
          },
          {
            title: "Community Outreach Flyer",
            type: "PNG Image Template",
            size: "8.5 MB",
            description: "Customizable flyer design for organizing community activities and volunteer signups.",
          },
        ].map((resource, index) => (
          <div key={index} className="flex flex-col justify-between rounded-lg border bg-card p-6 shadow-xs">
            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-primary/10 p-2 text-primary">
                  <IconFileText className="size-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm line-clamp-1">{resource.title}</h4>
                  <p className="text-xs text-muted-foreground">{resource.type} • {resource.size}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                {resource.description}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t">
              <button className="flex w-full items-center justify-center gap-2 rounded-md bg-secondary px-3 py-2 text-xs font-semibold hover:bg-secondary/80 transition-colors">
                <IconDownload className="size-4" /> Download File
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}