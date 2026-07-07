import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/api/admin';
import { Wallet, Ticket, Plane, Percent } from 'lucide-react';
import type { ChartDataPoint } from '@/types/admin';
import { formatVND } from '@/lib/formatters';
import { Card } from '@/components/ui/card';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

import { ADMIN_STATS } from '@/api/mocks/admin';

export default function AdminDashboardPage() {
  const { data: stats } = useQuery({ queryKey: ['adminStats'], queryFn: () => adminApi.kpi() });

  // Use real stats for totals if available, otherwise mock. For charts, fallback to mock since backend only returns scalar stats currently.
  const kpi = stats?.totalBookings !== undefined ? {
    totalRevenue: Number(stats.totalRevenue) ?? 12500000000,
    totalBookings: stats.totalBookings ?? 4520,
    totalFlights: stats.totalFlights ?? 1250,
    loadFactor: stats.loadFactor ?? 86.5,
    trends: stats.trends ?? { revenue: 12.5, bookings: 8.2, flights: 5.0, loadFactor: 2.1 }
  } : ADMIN_STATS.kpi;

  const revenue = stats?.revenueByMonth || ADMIN_STATS.revenueByMonth;
  const routeStats = stats?.bookingsByRoute || ADMIN_STATS.bookingsByRoute;
  const cabinStats = stats?.cabinDistribution || ADMIN_STATS.cabinDistribution;
  const loadFactor = stats?.loadFactorByMonth || ADMIN_STATS.loadFactorByMonth;

  const kpis = [
    { label: 'Tổng doanh thu', value: kpi ? formatVND(kpi.totalRevenue) : '...', icon: Wallet, trend: kpi?.trends.revenue, trendUp: true },
    { label: 'Số đặt chỗ', value: kpi?.totalBookings.toLocaleString() || '...', icon: Ticket, trend: kpi?.trends.bookings, trendUp: true },
    { label: 'Số chuyến bay', value: kpi?.totalFlights.toLocaleString() || '...', icon: Plane, trend: kpi?.trends.flights, trendUp: true },
    { label: 'Tỉ lệ lấp đầy', value: kpi ? `${kpi.loadFactor}%` : '...', icon: Percent, trend: kpi?.trends.loadFactor, trendUp: false },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-vna-text">Tổng quan hoạt động</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((item, i) => (
          <Card key={i} className="p-5 shadow-sm border-vna-border rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-vna-muted">{item.label}</p>
                <p className="text-2xl font-bold text-vna-text mt-1">{item.value}</p>
                {item.trend !== undefined && (
                  <p className={`text-xs mt-1 ${item.trendUp ? 'text-green-600' : 'text-vna-red'}`}>
                    {item.trendUp ? '↑' : '↓'} {item.trend}% so với tháng trước
                  </p>
                )}
              </div>
              <div className="w-12 h-12 rounded-full bg-vna-gold/20 flex items-center justify-center shrink-0">
                <item.icon className="text-vna-gold" size={24} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 shadow-sm border-vna-border rounded-xl">
          <h3 className="font-bold text-vna-text mb-6">Doanh thu theo tháng</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={v => `${v/1e6}M`} />
                <Tooltip formatter={v => formatVND(Number(v))} contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Line type="monotone" dataKey="revenue" stroke="#023a78" strokeWidth={3} dot={{ fill: '#f5a623', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 shadow-sm border-vna-border rounded-xl">
          <h3 className="font-bold text-vna-text mb-6">Đặt chỗ theo tuyến</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={routeStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="route" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Bar dataKey="count" fill="#1f6fb2" radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 shadow-sm border-vna-border rounded-xl">
          <h3 className="font-bold text-vna-text mb-6">Phân bố hạng ghế</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={cabinStats} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {cabinStats?.map((_: ChartDataPoint, i: number) => <Cell fill={['#023a78','#1f6fb2','#f5a623','#d4111a'][i]} key={i} />)}
                </Pie>
                <Legend />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 shadow-sm border-vna-border rounded-xl">
          <h3 className="font-bold text-vna-text mb-6">Tỉ lệ lấp đầy theo tháng</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={loadFactor}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f5a623" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#f5a623" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={v => `${v}%`} />
                <Tooltip formatter={v => `${v}%`} contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Area type="monotone" dataKey="factor" stroke="#f5a623" strokeWidth={2} fill="url(#goldGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
