import React, { useEffect, useState } from 'react'
import { AdminNav } from '../components/Navigation'
import { Card } from '../components/Card'
import { supabase } from '../lib/supabase'
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts'
import { 
  TrendingUp, Users, Clock, MousePointer, Search, 
  Globe, Smartphone, Download, Calendar 
} from 'lucide-react'
import { Button } from '../components/Button'

// Type casting for React 18.3 compatibility
const LineChartComponent = LineChart as any
const LineComponent = Line as any
const BarChartComponent = BarChart as any
const BarComponent = Bar as any
const PieChartComponent = PieChart as any
const PieComponent = Pie as any
const CellComponent = Cell as any
const XAxisComponent = XAxis as any
const YAxisComponent = YAxis as any
const CartesianGridComponent = CartesianGrid as any
const TooltipComponent = Tooltip as any
const LegendComponent = Legend as any
const ResponsiveContainerComponent = ResponsiveContainer as any

const COLORS = ['#8B2635', '#A0522D', '#6B1E2A', '#D4A5A5', '#5A1A25']

interface AnalyticsData {
  overview: {
    totalViews: number
    totalUniqueVisitors: number
    avgTimeOnPage: number
    dateRange: { start: string; end: string }
  }
  dailyStats: any[]
  trafficSources: Record<string, number>
  deviceBreakdown: Record<string, number>
  keywords: any[]
  trend: Array<{ date: string; views: number; visitors: number }>
}

export function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [dateRange, setDateRange] = useState(30)

  useEffect(() => {
    loadAnalytics()
  }, [dateRange])

  async function loadAnalytics() {
    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('analytics-get-data', {
        body: { days: dateRange },
      })

      if (error) throw error

      setAnalytics(data.data)
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  function exportData() {
    if (!analytics) return
    
    const csvContent = [
      ['Date', 'Views', 'Unique Visitors'].join(','),
      ...analytics.trend.map(t => [t.date, t.views, t.visitors].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const trafficSourceData = analytics ? Object.entries(analytics.trafficSources).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  })) : []

  const deviceData = analytics ? Object.entries(analytics.deviceBreakdown).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  })) : []

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light">
        <AdminNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-text-secondary">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-background-light">
        <AdminNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center py-12">
            <p className="text-text-secondary">No analytics data available</p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary">Analytics Dashboard</h1>
          <div className="flex space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(Number(e.target.value))}
              className="px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            <Button onClick={exportData} variant="outline">
              <Download size={18} className="mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm mb-1">Total Page Views</p>
                <p className="text-3xl font-bold text-text-primary">
                  {analytics.overview.totalViews.toLocaleString()}
                </p>
              </div>
              <div className="text-primary">
                <TrendingUp size={40} />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm mb-1">Unique Visitors</p>
                <p className="text-3xl font-bold text-text-primary">
                  {analytics.overview.totalUniqueVisitors.toLocaleString()}
                </p>
              </div>
              <div className="text-primary">
                <Users size={40} />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm mb-1">Avg. Time on Page</p>
                <p className="text-3xl font-bold text-text-primary">
                  {formatTime(analytics.overview.avgTimeOnPage)}
                </p>
              </div>
              <div className="text-primary">
                <Clock size={40} />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm mb-1">Click-Through Rate</p>
                <p className="text-3xl font-bold text-text-primary">6.5%</p>
              </div>
              <div className="text-primary">
                <MousePointer size={40} />
              </div>
            </div>
          </Card>
        </div>

        {/* Trend Chart */}
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text-primary">Traffic Trend</h2>
            <Calendar size={20} className="text-text-secondary" />
          </div>
          <ResponsiveContainerComponent width="100%" height={300}>
            <LineChartComponent data={analytics.trend}>
              <CartesianGridComponent strokeDasharray="3 3" />
              <XAxisComponent dataKey="date" />
              <YAxisComponent />
              <TooltipComponent />
              <LegendComponent />
              <LineComponent 
                type="monotone" 
                dataKey="views" 
                stroke="#8B2635" 
                strokeWidth={2}
                name="Page Views"
              />
              <LineComponent 
                type="monotone" 
                dataKey="visitors" 
                stroke="#A0522D" 
                strokeWidth={2}
                name="Unique Visitors"
              />
            </LineChartComponent>
          </ResponsiveContainerComponent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Traffic Sources */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text-primary">Traffic Sources</h2>
              <Globe size={20} className="text-text-secondary" />
            </div>
            <ResponsiveContainerComponent width="100%" height={300}>
              <PieChartComponent>
                <PieComponent
                  data={trafficSourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {trafficSourceData.map((entry, index) => (
                    <CellComponent key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </PieComponent>
                <TooltipComponent />
              </PieChartComponent>
            </ResponsiveContainerComponent>
            <div className="mt-4 space-y-2">
              {trafficSourceData.map((source, index) => (
                <div key={source.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-text-secondary">{source.name}</span>
                  </div>
                  <span className="font-semibold text-text-primary">{source.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Device Breakdown */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text-primary">Device Breakdown</h2>
              <Smartphone size={20} className="text-text-secondary" />
            </div>
            <ResponsiveContainerComponent width="100%" height={300}>
              <BarChartComponent data={deviceData}>
                <CartesianGridComponent strokeDasharray="3 3" />
                <XAxisComponent dataKey="name" />
                <YAxisComponent />
                <TooltipComponent />
                <BarComponent dataKey="value" fill="#8B2635" />
              </BarChartComponent>
            </ResponsiveContainerComponent>
          </Card>
        </div>

        {/* SEO Keywords */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text-primary">SEO Keyword Performance</h2>
            <Search size={20} className="text-text-secondary" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-text-secondary font-semibold">Keyword</th>
                  <th className="text-right py-3 px-4 text-text-secondary font-semibold">Impressions</th>
                  <th className="text-right py-3 px-4 text-text-secondary font-semibold">Clicks</th>
                  <th className="text-right py-3 px-4 text-text-secondary font-semibold">CTR</th>
                  <th className="text-right py-3 px-4 text-text-secondary font-semibold">Avg. Position</th>
                </tr>
              </thead>
              <tbody>
                {analytics.keywords.map((keyword) => (
                  <tr key={keyword.id} className="border-b border-border hover:bg-background-light">
                    <td className="py-3 px-4 text-text-primary font-medium">{keyword.keyword}</td>
                    <td className="py-3 px-4 text-right text-text-primary">
                      {keyword.impressions.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-text-primary">
                      {keyword.clicks.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-text-primary">
                      {keyword.ctr.toFixed(2)}%
                    </td>
                    <td className="py-3 px-4 text-right text-text-primary">
                      {keyword.avg_position.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
