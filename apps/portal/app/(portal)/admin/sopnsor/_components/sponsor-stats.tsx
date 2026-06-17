import { sponsorPackages, totalSummary } from "@/constants/sponsor-data"
import { Card, CardContent } from "@workspace/ui/components/card"

const SponsorStats = () => {
  return (
    <div className="space-y-6 pb-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Sponsors Payments</h1>
        <p className="mt-2 text-slate-500">
          Monitor dues capture, review status, and filter transaction records.
        </p>
      </div>

      {/* Full Width Summary Card */}
      <Card className="rounded-xl border-slate-200 bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="mb-1 text-3xl text-[13px] font-bold text-gray-800 uppercase">
                {totalSummary.title}
              </p>
              <h3 className="text-4xl font-extrabold text-indigo-700">
                {totalSummary.mainValue}
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-8 border-t border-slate-100 pt-4 md:gap-12 md:border-t-0 md:border-l md:pt-0 md:pl-12">
              {[
                { label: "LIFETIME", val: totalSummary.lifetime },
                { label: "YEARLY", val: totalSummary.yearly },
                { label: "MONTHLY", val: totalSummary.monthly },
              ].map((item, idx) => (
                <div key={idx}>
                  <p className="mb-1 text-[10px] font-bold text-gray-800">
                    {item.label}
                  </p>
                  <p className="text-lg font-bold text-slate-800">{item.val}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5-Column Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        {sponsorPackages.map((pkg, i) => (
          <Card
            key={i}
            className="group rounded-xl border-slate-200 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
          >
            <CardContent className="p-6">
              <p className="mb-4 text-[13px] font-bold text-gray-800 uppercase">
                {pkg.title} PACKAGE
              </p>
              <h3 className={`mb-6 text-3xl font-extrabold ${pkg.color}`}>
                {pkg.total}
              </h3>

              <div className="space-y-4 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-bold text-gray-800 uppercase">
                    Lifetime
                  </p>
                  <p className={`text-xs font-bold ${pkg.light}`}>
                    {pkg.total}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-bold text-gray-800 uppercase">
                    Yearly
                  </p>
                  <p className={`text-xs font-bold ${pkg.light}`}>
                    {pkg.yearly}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-bold text-gray-800 uppercase">
                    Monthly
                  </p>
                  <p className={`text-xs font-bold ${pkg.light}`}>
                    {pkg.monthly}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default SponsorStats
