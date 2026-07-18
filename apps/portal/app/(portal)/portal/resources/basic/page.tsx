"use client"
"use no compiler"

import React from "react"
import { ResourceListViewer } from "../_components/resource-list-viewer"

export default function BasicResourcesPage() {
  return (
    <ResourceListViewer
      categoryName="Basic Resources"
      title="Basic Resources"
      description="Access general reference guides, FCH toolkits, and introductory materials."
    />
  )
}
