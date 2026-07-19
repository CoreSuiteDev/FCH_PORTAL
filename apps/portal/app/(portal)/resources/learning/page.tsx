"use client"
"use no compiler"

import React from "react"
import { ResourceListViewer } from "../_components/resource-list-viewer"

export default function LearningLibraryPage() {
  return (
    <ResourceListViewer
      categoryName="Learning Library"
      title="Learning Library"
      description="Complete training guides, lecture notes, theological frameworks, and study modules."
    />
  )
}
