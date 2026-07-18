"use client"
"use no compiler"

import React from "react"
import { ResourceListViewer } from "../_components/resource-list-viewer"

export default function SpecialBoardResourcesPage() {
  return (
    <ResourceListViewer
      categoryName="Special Board Resources"
      title="Special Board Resources"
      description="Confidential resources exclusively available to FCH Board members — governance materials, strategic documents, and board-level tools."
    />
  )
}
