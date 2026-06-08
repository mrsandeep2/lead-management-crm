import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";
import type { LeadStats } from "@/lib/leads/types";

const COLORS: Record<string, string> = {
  New: "oklch(0.65 0.18 250)",
  Contacted: "oklch(0.7 0.18 305)",
  Qualified: "oklch(0.72 0.16 70)",
  Converted: "oklch(0.62 0.16 155)",
  Lost: "oklch(0.62 0.18 27)",
};

export function DashboardCharts({ stats }: { stats?: LeadStats }) {
  const pie = stats
    ? Object.entries(stats.byStatus).map(([name, value]) => ({ name, value }))
    : [];
  const area = stats?.weeklyTrend ?? [];

  return (
    <div className="grid lg:grid-cols-5 gap-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-5 lg:col-span-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold tracking-tight">New leads — last 14 days</h3>
            <p className="text-xs text-muted-foreground">Daily inflow trend</p>
          </div>
        </div>
        <div className="h-64 mt-4">
          <ResponsiveContainer>
            <AreaChart data={area} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.5 0.22 280)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="oklch(0.6 0.22 305)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="date" tickFormatter={(v) => v.slice(5)} fontSize={11} stroke="currentColor" opacity={0.5} />
              <YAxis allowDecimals={false} fontSize={11} stroke="currentColor" opacity={0.5} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--popover)" }} />
              <Area type="monotone" dataKey="count" stroke="oklch(0.5 0.22 280)" strokeWidth={2} fill="url(#gradA)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="glass rounded-2xl p-5 lg:col-span-2">
        <h3 className="font-semibold tracking-tight">Status distribution</h3>
        <p className="text-xs text-muted-foreground">Breakdown of pipeline</p>
        <div className="h-64 mt-4">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={pie} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={3}>
                {pie.map((d) => <Cell key={d.name} fill={COLORS[d.name]} stroke="transparent" />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--popover)" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
          {pie.map((p) => (
            <div key={p.name} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: COLORS[p.name] }} />
              <span className="text-muted-foreground">{p.name}</span>
              <span className="ml-auto font-medium">{p.value}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
