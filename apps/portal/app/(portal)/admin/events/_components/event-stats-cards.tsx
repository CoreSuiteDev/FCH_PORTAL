import { CalendarDays, Users, Video, Zap } from "lucide-react"
import { Card, CardContent } from "@workspace/ui/components/card"

interface EventStats {
  total: number
  upcoming: number
  ongoing: number
  completed: number
}

interface EventStatsCardsProps {
  stats: EventStats
}

export function EventStatsCards({ stats }: EventStatsCardsProps) {
  const cards = [
    {
      label: "Total Events",
      value: stats.total,
      icon: CalendarDays,
      color: "text-slate-600 dark:text-slate-300",
      bg: "bg-white dark:bg-slate-950",
    },
    {
      label: "Upcoming",
      value: stats.upcoming,
      icon: Zap,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      label: "Ongoing",
      value: stats.ongoing,
      icon: Video,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: Users,
      color: "text-slate-500 dark:text-slate-400",
      bg: "bg-slate-50 dark:bg-slate-800/40",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((s) => (
        <Card
          key={s.label}
          className={`border border-slate-200 shadow-none dark:border-slate-800 ${s.bg}`}
        >
          <CardContent className="flex items-center gap-4 p-5">
            <div className={`rounded-xl p-2.5 ${s.bg}`}>
              <s.icon className={`size-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {s.label}
              </p>
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
