"use client"
"use no compiler"

import React from "react"
import { ResourceListViewer } from "../_components/resource-list-viewer"

export default function ParishDioceseResourcesPage() {
  return (
    <ResourceListViewer
      categoryName="Parish & Diocese Resources"
      title="Parish &amp; Diocese Resources"
      description="Get administrative policies, sacramental records templates, and diocesan guidelines."
    />
  )
}
