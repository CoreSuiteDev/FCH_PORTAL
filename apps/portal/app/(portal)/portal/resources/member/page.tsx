"use client"
"use no compiler"

import React from "react"
import { ResourceListViewer } from "../_components/resource-list-viewer"

export default function SpecialMemberResourcesPage() {
  return (
    <ResourceListViewer
      categoryName="Special Member Resources"
      title="Special Member Resources"
      description="Exclusive resources curated for FCH members — guides, tools, and materials for your faith journey."
    />
  )
}
