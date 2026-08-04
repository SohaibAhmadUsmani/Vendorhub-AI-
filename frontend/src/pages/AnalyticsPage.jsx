import React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Wallet,
  Users,
  PiggyBank,
  TrendingUp,
  DollarSign,
  Percent,
  Clock,
  Package,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

const monthlySpending = [
  { month: "Jan", amount: 82000 },
  { month: "Feb", amount: 91000 },
  { month: "Mar", amount: 103000 },
  { month: "Apr", amount: 98000 },
  { month: "May", amount: 112000 },
  { month: "Jun", amount: 127000 },
];

const topSuppliers = [
  { name: "Global Electronics Inc.", spend: 38800, orders: 18 },
  { name: "Precision Gear Co.", spend: 26300, orders: 12 },
  { name: "Atlas Industrial", spend: 19200, orders: 9 },
];

const savingsData = [{ name: "Savings", value: 14.6, fill: "#8b5cf6" }];

const purchaseTrendBars = [
  { label: "Week 1", value: 55 },
  { label: "Week 2", value: 72 },
  { label: "Week 3", value: 64 },
  { label: "Week 4", value: 83 },
];

const buyerHighlights = [
  { title: "Monthly spending", value: "$127.0K", subtitle: "Highest quarter spend", icon: Wallet },
  { title: "Top suppliers", value: "3 vendors", subtitle: "Leading supplier spend", icon: Users },
  { title: "Cost savings", value: "14.6%", subtitle: "Saved vs prior period", icon: PiggyBank },
  { title: "Purchase trends", value: "+21%", subtitle: "Steady buyer growth", icon: TrendingUp },
];

const vendorHighlights = [
  { title: "Revenue", value: "$275.4K", subtitle: "Total seller revenue", icon: DollarSign },
  { title: "RFQ conversion rate", value: "67%", subtitle: "Win rate on RFQs", icon: Percent },
  { title: "Response time", value: "1h 42m", subtitle: "Average reply time", icon: Clock },
  { title: "Best-selling products", value: "3 SKUs", subtitle: "Top performing products", icon: Package },
];

const revenueTrend = [
  { month: "Jan", revenue: 168000 },
  { month: "Feb", revenue: 191000 },
  { month: "Mar", revenue: 205000 },
  { month: "Apr", revenue: 224000 },
  { month: "May", revenue: 251000 },
  { month: "Jun", revenue: 275400 },
];

const rfqFunnel = [
  { stage: "Sent", value: 42 },
  { stage: "Quoted", value: 31 },
  { stage: "Won", value: 28 },
];

const conversionData = [{ name: "Conversion", value: 67, fill: "#06b6d4" }];

const bestSellingProducts = [
  { name: "Steel Brackets", sales: 6200 },
  { name: "Servo Motors", sales: 5100 },
  { name: "Ball Bearings", sales: 3800 },
];

function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-xl bg-[var(--bg-card)] px-3 py-2 text-xs shadow-lg ring-1 ring-[var(--border-card)]">
      {label && <p className="mb-1 font-semibold text-[var(--text-primary)]">{label}</p>}
      {payload.map((entry) => (
        <p key={entry.dataKey || entry.name} className="text-[var(--text-secondary)]">
          {formatter ? formatter(entry.value) : entry.value}
        </p>
      ))}
    </div>
  );
}

function HighlightCard({ item, badgeBg, badgeText, borderColor }) {
  const Icon = item.icon;
  return (
    <div className={`card-surface rounded-l-none border-l-4 ${borderColor} bg-[var(--bg-card)] p-6 shadow-sm transition-transform hover:-translate-y-0.5`}>
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${badgeBg}`}>
          <Icon className={`h-5 w-5 ${badgeText}`} strokeWidth={2} />
        </div>
        <p className="text-3xl font-bold text-[var(--text-primary)]">{item.value}</p>
      </div>
      <p className="mt-4 text-sm font-semibold text-[var(--text-primary)]">{item.title}</p>
      <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">{item.subtitle}</p>
    </div>
  );
}

export default function AnalyticsPage() {
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="space-y-10 px-6 sm:px-8 md:px-10 lg:px-12 xl:px-14 2xl:px-20 py-10 mx-auto max-w-[1500px]">
      <section className="card-surface relative overflow-hidden p-8 sm:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-transparent blur-2xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-gradient-to-tr from-cyan-500/15 to-transparent blur-2xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--bg-main)] px-3 py-1 ring-1 ring-[var(--border-card)]">
              <Sparkles className="h-3.5 w-3.5 text-violet-500" strokeWidth={2} />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Live dashboard
              </span>
            </div>
            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-[var(--text-primary)] sm:text-5xl">
              <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
                VendorHub
              </span>{" "}
              analytics
            </h1>
            <p className="max-w-xl text-base leading-7 text-[var(--text-secondary)]">
              Buyer and vendor metrics in one responsive dashboard. Jump straight to the section you want.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="btn-purple-primary inline-flex items-center gap-2"
              onClick={() => scrollTo("buyer-section")}
            >
              Buyer analytics
              <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
            </button>
            <button
              type="button"
              className="btn-outline-secondary inline-flex items-center gap-2"
              onClick={() => scrollTo("vendor-section")}
            >
              Vendor analytics
              <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </section>

      {/* BUYER SECTION */}
      <section id="buyer-section" className="space-y-8 max-w-[1440px] mx-auto">
        <div className="card-surface p-8 space-y-10">
          <div className="rounded-l-none rounded-r-[1.5rem] border-l-4 border-violet-500 bg-[var(--bg-main)] py-8 pl-8 pr-10 shadow-sm sm:py-10 sm:pl-10 sm:pr-14">
            <div className="max-w-3xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-700">Buyer section</p>
              <h2 className="font-heading text-2xl font-bold text-[var(--text-primary)]">Procurement overview</h2>
              <p className="text-sm leading-7 text-[var(--text-secondary)]">
                Insights on spend, supplier performance, cost savings, and demand trends for your buying team.
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {buyerHighlights.map((item) => (
              <HighlightCard
                key={item.title}
                item={item}
                borderColor="border-violet-500"
                badgeBg="bg-violet-100"
                badgeText="text-violet-600"
              />
            ))}
          </div>

          <div className="grid min-w-0 gap-8 xl:grid-cols-[1.5fr_1fr]">
            <div className="card-surface min-w-0 bg-[var(--bg-card)] p-6">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-[var(--text-muted)]">Procurement spend</p>
                <p className="text-3xl font-bold text-[var(--text-primary)]">$127.0K</p>
                <p className="text-sm text-[var(--text-secondary)]">Spending trend across the current year.</p>
              </div>
              <div className="mt-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlySpending} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="var(--border-card)" strokeDasharray="4 6" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                      tickFormatter={(v) => `$${v / 1000}k`}
                      width={44}
                    />
                    <Tooltip
                      cursor={{ stroke: "var(--border-card)", strokeWidth: 1 }}
                      content={<ChartTooltip formatter={(v) => `$${v.toLocaleString()}`} />}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      fill="url(#spendFill)"
                      dot={{ r: 3, fill: "#8b5cf6", strokeWidth: 0 }}
                      activeDot={{ r: 5 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-8">
              <div className="card-surface min-w-0 bg-[var(--bg-card)] p-6">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[var(--text-muted)]">Supplier ranking</p>
                  <p className="text-3xl font-bold text-[var(--text-primary)]">3 active</p>
                  <p className="text-sm text-[var(--text-secondary)]">Most spend is concentrated within three suppliers.</p>
                </div>
                <div className="mt-6 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topSuppliers} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                      <XAxis type="number" hide />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={110}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
                        tickFormatter={(v) => (v.length > 14 ? `${v.slice(0, 14)}…` : v)}
                      />
                      <Tooltip
                        cursor={{ fill: "var(--border-card)", opacity: 0.4 }}
                        content={<ChartTooltip formatter={(v) => `$${v.toLocaleString()}`} />}
                      />
                      <Bar dataKey="spend" radius={[0, 8, 8, 0]} barSize={18}>
                        {topSuppliers.map((entry, index) => (
                          <Cell key={entry.name} fill={["#8b5cf6", "#d946ef", "#06b6d4"][index % 3]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card-surface min-w-0 bg-[var(--bg-card)] p-6">
                <div className="flex items-center gap-6">
                  <div className="relative h-28 w-28 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        data={savingsData}
                        innerRadius="72%"
                        outerRadius="100%"
                        startAngle={90}
                        endAngle={-270}
                        barSize={10}
                      >
                        <RadialBar dataKey="value" cornerRadius={10} background={{ fill: "var(--border-card)" }} max={20} />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-[var(--text-primary)]">14.6%</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[var(--text-muted)]">Negotiated savings</p>
                    <p className="text-sm leading-6 text-[var(--text-secondary)]">
                      Saved $9.8K this quarter by negotiating supplier contracts.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card-surface min-w-0 bg-[var(--bg-card)] p-6">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[var(--text-muted)]">Demand cadence</p>
                  <p className="text-3xl font-bold text-[var(--text-primary)]">+21%</p>
                  <p className="text-sm text-[var(--text-secondary)]">Weekly buyer demand is trending upward.</p>
                </div>
                <div className="mt-4 h-28">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={purchaseTrendBars} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
                      <YAxis hide />
                      <Tooltip cursor={{ fill: "var(--border-card)", opacity: 0.4 }} content={<ChartTooltip />} />
                      <Bar dataKey="value" fill="#06b6d4" radius={[8, 8, 0, 0]} barSize={28} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VENDOR SECTION */}
      <section id="vendor-section" className="space-y-8 max-w-[1440px] mx-auto">
        <div className="card-surface p-8 space-y-10">
          <div className="rounded-l-none rounded-r-[1.5rem] border-l-4 border-cyan-500 bg-[var(--bg-main)] py-8 pl-8 pr-10 shadow-sm sm:py-10 sm:pl-10 sm:pr-14">
            <div className="flex flex-col gap-5">
              <div className="max-w-2xl space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">Vendor section</p>
                <h2 className="font-heading text-2xl font-bold text-[var(--text-primary)]">Seller performance</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge badge-active">Revenue</span>
                <span className="badge badge-active">RFQ conversion rate</span>
                <span className="badge badge-active">Response time</span>
                <span className="badge badge-active">Best-selling products</span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {vendorHighlights.map((item) => (
              <HighlightCard
                key={item.title}
                item={item}
                borderColor="border-cyan-500"
                badgeBg="bg-cyan-100"
                badgeText="text-cyan-600"
              />
            ))}
          </div>

          <div className="grid min-w-0 gap-8 xl:grid-cols-[1.5fr_1fr]">
            <div className="card-surface min-w-0 bg-[var(--bg-card)] p-6">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-[var(--text-muted)]">Revenue trend</p>
                <p className="text-3xl font-bold text-[var(--text-primary)]">$275.4K</p>
                <p className="text-sm text-[var(--text-secondary)]">Cumulative seller revenue by month.</p>
              </div>
              <div className="mt-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="var(--border-card)" strokeDasharray="4 6" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                      tickFormatter={(v) => `$${v / 1000}k`}
                      width={44}
                    />
                    <Tooltip
                      cursor={{ stroke: "var(--border-card)", strokeWidth: 1 }}
                      content={<ChartTooltip formatter={(v) => `$${v.toLocaleString()}`} />}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#06b6d4"
                      strokeWidth={3}
                      dot={{ r: 3, fill: "#06b6d4", strokeWidth: 0 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-8">
              <div className="card-surface min-w-0 bg-[var(--bg-card)] p-6">
                <div className="flex items-center gap-6">
                  <div className="relative h-28 w-28 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        data={conversionData}
                        innerRadius="72%"
                        outerRadius="100%"
                        startAngle={90}
                        endAngle={-270}
                        barSize={10}
                      >
                        <RadialBar dataKey="value" cornerRadius={10} background={{ fill: "var(--border-card)" }} max={100} />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-[var(--text-primary)]">67%</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[var(--text-muted)]">RFQ conversion</p>
                    <p className="text-sm leading-6 text-[var(--text-secondary)]">
                      28 of 42 sent RFQs converted into won orders.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card-surface min-w-0 bg-[var(--bg-card)] p-6">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[var(--text-muted)]">RFQ funnel</p>
                  <p className="text-sm text-[var(--text-secondary)]">Sent, quoted, and won requests this quarter.</p>
                </div>
                <div className="mt-4 h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={rfqFunnel} margin={{ top: 4, right: 0, left: 0, bottom: 4 }}>
                      <XAxis dataKey="stage" tickLine={false} axisLine={false} tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
                      <YAxis hide />
                      <Tooltip cursor={{ fill: "var(--border-card)", opacity: 0.4 }} content={<ChartTooltip />} />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={32}>
                        {rfqFunnel.map((entry, index) => (
                          <Cell key={entry.stage} fill={["#a78bfa", "#22d3ee", "#34d399"][index % 3]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card-surface min-w-0 bg-[var(--bg-card)] p-6">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[var(--text-muted)]">Best-selling products</p>
                  <p className="text-sm text-[var(--text-secondary)]">Units sold across top SKUs this quarter.</p>
                </div>
                <div className="mt-4 h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bestSellingProducts} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                      <XAxis type="number" hide />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={100}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
                      />
                      <Tooltip cursor={{ fill: "var(--border-card)", opacity: 0.4 }} content={<ChartTooltip />} />
                      <Bar dataKey="sales" fill="#0891b2" radius={[0, 8, 8, 0]} barSize={16} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
