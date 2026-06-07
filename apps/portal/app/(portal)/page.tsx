import React from "react"
import { SectionCards } from "@/components/section-cards"
import { IconInfoCircle } from "@tabler/icons-react"

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Developer Notes / TODO */}
      <div className="mx-4 lg:mx-6 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
        <div className="flex items-start gap-3">
          <IconInfoCircle className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <h4 className="font-semibold text-primary">Developer TODO Checklist:</h4>
            <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
              <li>Dynamic Statistics: Fetch real-time numbers from database/Stripe API instead of rendering hardcoded values.</li>
              <li>Chart Integration: Wire up the statistics to charts inside the cards to display weekly/monthly progress trends.</li>
            </ul>
          </div>
        </div>
      </div>

      <SectionCards />
    </div>
  )
}
