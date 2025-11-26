"use client"

import { useRef } from "react"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts"
import { Card } from "@/components/ui/card"

// NAYA: Patent interface mein number add kiya (country code ke liye)
interface Patent {
  domain: string
  technology: string
  subTechnology: string
  keywords: string[]
  number?: string   // ← YE NAYA ADD KIYA (Patent Number)
}

export default function AnalyticsDashboard({ results }: { results: Patent[] }) {
  const domainChartRef = useRef<HTMLDivElement>(null)
  const techChartRef = useRef<HTMLDivElement>(null)
  const subtechChartRef = useRef<HTMLDivElement>(null)

  const total = results.length || 1

  // Domain Count (cleaned)
  const domainCount = results.reduce((acc, p) => {
    let d = p.domain || "Unknown"
    d = d.replace(/\*+/g, "").trim()
    if (!d) d = "Unknown"
    acc[d] = (acc[d] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Technology Count (cleaned)
  const techCount = results.reduce((acc, p) => {
    let t = p.technology || "Unknown"
    t = t.replace(/\*+/g, "").trim()
    if (!t) t = "Unknown"
    acc[t] = (acc[t] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Sub-Technology
  const subtechList = results.flatMap(p =>
    p.subTechnology.split(/[,;]/).map(s => s.trim()).filter(Boolean)
  )
  const subtechCount = subtechList.reduce((acc, s) => {
    acc[s] = (acc[s] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Keywords
  const allKeywords = results.flatMap(p => p.keywords || [])
  const keywordCount = allKeywords.reduce((acc, kw) => {
    const k = kw.trim()
    if (k) acc[k] = (acc[k] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // NAYA: Country Code from Patent Number (US, CN, JP, KR, EP, WO, etc.)
  const countryCount = results.reduce((acc, p) => {
    const patentNumber = p.number || ""
    const match = patentNumber.match(/^([A-Z]{2})/i)  // First 2 letters (case insensitive)
    const countryCode = match ? match[1].toUpperCase() : "OTH"  // Others
    acc[countryCode] = (acc[countryCode] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const countryData = Object.entries(countryCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 15)

  // Data for charts
  const domainData = Object.entries(domainCount)
    .map(([name, value]) => ({ name, value, percentage: Math.round((value / total) * 100) }))
    .sort((a, b) => b.value - a.value)

  const techData = Object.entries(techCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)

  const subtechData = Object.entries(subtechCount)
    .map(([name, value]) => ({ name, value: value / total }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 12)

  const colors = ["#398AE6", "#f05e22", "#703412", "#6B9FD8", "#E07A42", "#8B4513"]

  if (!results.length) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9F5] to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Domain Distribution */}
          <Card className="p-8 rounded-3xl shadow-xl border-2 border-[#f05e22]/20 hover:shadow-2xl transition-all bg-gradient-to-br from-slate-900 to-slate-800">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-orange-500">Domain Distribution</h3>
                <p className="text-gray-400 text-sm">Industry-wise breakdown</p>
              </div>
            </div>

            <div ref={domainChartRef} className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={domainData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={140}
                    innerRadius={60}
                    labelLine={false}
                    label={({ percentage }) => `${percentage}%`}
                  >
                    {domainData.map((_, i) => (
                      <Cell key={i} fill={colors[i % colors.length]} />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.95)",
                      border: "2px solid #f05e22",
                      borderRadius: "12px",
                      padding: "12px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
                    }}
                    labelStyle={{ color: "#f05e22", fontWeight: "bold", fontSize: "14px" }}
                    itemStyle={{ color: "#e2e8f0", fontSize: "14px" }}
                    formatter={(value: number, name: string) => [
                      `${value} patents (${Math.round((value / total) * 100)}%)`,
                      name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Top Technologies */}
          <Card className="p-8 rounded-3xl shadow-xl border-2 border-[#398AE6]/20 hover:shadow-2xl transition-all">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-[#398AE6]">Top Technologies</h3>
                <p className="text-muted-foreground">Most frequent technology areas</p>
              </div>
            </div>
            <div ref={techChartRef} className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={techData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 13, fill: "#e2e8f0" }} />
                  <YAxis tick={{ fontSize: 13, fill: "#e2e8f0" }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.95)", border: "2px solid #398AE6", borderRadius: "12px", padding: "12px" }}
                    labelStyle={{ color: "#398AE6", fontWeight: "bold", fontSize: "15px" }}
                    formatter={(value: number) => [`${value} patents`, "Count"]}
                  />
                  <Bar dataKey="value" fill="#398AE6" radius={8} barSize={40}>
                    <LabelList dataKey="value" position="top" style={{ fill: "#fff", fontWeight: "bold", fontSize: 14 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Sub-Technology Focus */}
         <Card className="p-8 rounded-3xl shadow-xl border-2 border-orange-500/30 hover:shadow-2xl transition-all lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-orange-700">Sub-Technology Focus</h3>
                <p className="text-sm text-gray-600">Detailed technical areas</p>
              </div>
            </div>

            <div ref={subtechChartRef} className="w-full h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subtechData} layout="horizontal" margin={{ top: 20, right: 50, left: 120, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    type="number"
                    domain={[0, 1]}
                    ticks={[0, 0.25, 0.5, 0.75, 1]}
                    tick={{ fill: '#666', fontSize: 12 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={160}
                    tick={{ fill: '#444', fontSize: 13, fontWeight: 600 }}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(255, 106, 0, 0.1)' }}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '2px solid #f05e22',
                      borderRadius: '12px',
                      padding: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                    labelStyle={{ color: '#703412', fontWeight: 'bold', marginBottom: '8px' }}
                    formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Frequency']}
                  />
                  <Bar
                    dataKey="value"
                    fill="#f05e22"
                    radius={[8, 8, 8, 8]}
                    barSize={28}
                  >
                    <LabelList
                      dataKey="value"
                      position="right"
                      formatter={(val: number) => val >= 0.1 ? `${(val * 100).toFixed(0)}%` : ''}
                      style={{ fill: '#703412', fontWeight: 'bold', fontSize: 14 }}
                      offset={10}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

        <Card className="p-8 rounded-3xl shadow-xl border-2 border-purple-500/30 hover:shadow-2xl transition-all lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800">
  <div className="mb-8">
    <h3 className="text-3xl font-bold text-purple-400">Patent Filing by Country</h3>
    <p className="text-gray-400 mt-2">Geographical distribution of patent filings</p>
  </div>

  <div className="h-[420px]">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={countryData}
        margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

        {/* ✅ COUNTRY CODE HORIZONTAL */}
        <XAxis
          dataKey="name"
          angle={-30}
          textAnchor="end"
          height={80}
          tick={{ fontSize: 14, fill: "#c084fc", fontWeight: "bold" }}
        />

        <YAxis tick={{ fontSize: 13, fill: "#e5e7eb" }} />

        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            border: "2px solid #a855f7",
            borderRadius: "12px",
            padding: "12px",
          }}
          labelStyle={{
            color: "#c084fc",
            fontWeight: "bold",
            fontSize: "15px",
          }}
          formatter={(value) => [`${value} patents`, "Count"]}
        />

        <Bar
          dataKey="value"
          fill="url(#purpleGradient)"
          radius={[10, 10, 0, 0]}
          barSize={45}
        >
          <LabelList
            dataKey="value"
            position="top"
            style={{ fill: "#fff", fontWeight: "bold", fontSize: 14 }}
          />
        </Bar>

        {/* ✅ Gradient Fill */}
        <defs>
          <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>

      </BarChart>
    </ResponsiveContainer>
  </div>
</Card>



        </div>
      </div>
    </div>
  )
}