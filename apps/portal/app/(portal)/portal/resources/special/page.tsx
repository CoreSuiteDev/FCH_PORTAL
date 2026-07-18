"use client"
"use no compiler"

import React from "react"
import { ResourceListViewer } from "../_components/resource-list-viewer"

export default function SpecialPastoralResourcesPage() {
  return (
    <ResourceListViewer
      categoryName="Special Pastoral Resources"
      title="Special Pastoral Resources"
      description="Browse curated collections for seasonal programs, retreats, and special parish events."
    />
  )
}
