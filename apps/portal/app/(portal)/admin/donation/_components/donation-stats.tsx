import { Card, CardContent } from "@workspace/ui/components/card"

const DonationStats = () => {
  // Data for the 3 individual tiers
  const tierStats = [
    {
      title: "GENERAL TIER",
      mainValue: "$185k",
      mainColor: "text-blue-600",
      subItems: [
        { label: "LIFETIME", value: "$185k" },
        { label: "YEARLY", value: "$45k" },
        { label: "MONTHLY", value: "$4.2k" },
      ],
    },
    {
      title: "PASTORAL TIER",
      mainValue: "$48k",
      mainColor: "text-emerald-600",
      subItems: [
        { label: "LIFETIME", value: "$48k" },
        { label: "YEARLY", value: "$12k" },
        { label: "MONTHLY", value: "$1.1k" },
      ],
    },
    {
      title: "BOARD MEMBERS",
      mainValue: "$24k",
      mainColor: "text-purple-600",
      subItems: [
        { label: "LIFETIME", value: "$24k" },
        { label: "YEARLY", value: "$8k" },
        { label: "MONTHLY", value: "$2.0k" },
      ],
    },
  ]

  // Data for the summary card
  const totalSummary = {
    title: "TOTAL REVENUE",
    mainValue: "$257k",
    mainColor: "text-slate-900",
    subItems: [
      { label: "LIFETIME", value: "$257k" },
      { label: "YEARLY", value: "$65k" },
      { label: "MONTHLY", value: "$7.3k" },
    ],
  }

  return (
    <div className="mb-8 space-y-6">
      {/* Summary Card */}
      <Card className="rounded-xl border-slate-200 bg-slate-50/50 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="mb-1 text-[10px] font-bold tracking-widest text-slate-400">
                {totalSummary.title}
              </p>
              <h3
                className={`text-4xl font-extrabold ${totalSummary.mainColor}`}
              >
                {totalSummary.mainValue}
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-8 border-t border-slate-200 pt-4 md:gap-12 md:border-t-0 md:border-l md:pt-0 md:pl-12">
              {totalSummary.subItems.map((item, idx) => (
                <div key={idx}>
                  <p className="mb-1 text-[10px] font-bold text-slate-400">
                    {item.label}
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tier Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {tierStats.map((stat, i) => (
          <Card key={i} className="rounded-xl border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="mb-6">
                <p className="mb-2 text-[10px] font-bold tracking-widest text-slate-400">
                  {stat.title}
                </p>
                <h3 className={`text-3xl font-extrabold ${stat.mainColor}`}>
                  {stat.mainValue}
                </h3>
              </div>
              <div className="mb-6 h-px w-full bg-slate-100" />
              <div className="grid grid-cols-3 gap-4">
                {stat.subItems.map((item, idx) => (
                  <div key={idx}>
                    <p className="mb-1 text-[10px] font-bold text-slate-400">
                      {item.label}
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default DonationStats
