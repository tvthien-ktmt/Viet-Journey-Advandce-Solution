import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui';

// Mock data for visualizations
const revenueData = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 5000 },
  { month: 'Apr', revenue: 4500 },
  { month: 'May', revenue: 6000 },
  { month: 'Jun', revenue: 8000 },
];

const topToursData = [
  { name: 'Đà Nẵng 3N2D', bookings: 120 },
  { name: 'Phú Quốc 4N3D', bookings: 98 },
  { name: 'Sapa 2N1D', bookings: 86 },
  { name: 'Nha Trang 4N3D', bookings: 75 },
  { name: 'Hạ Long 2N1D', bookings: 60 },
];

const serviceDistributionData = [
  { name: 'Tour', value: 400 },
  { name: 'Khách sạn', value: 300 },
  { name: 'Vé máy bay', value: 300 },
];

const userRegistrationsData = [
  { week: 'W1', users: 50 },
  { week: 'W2', users: 80 },
  { week: 'W3', users: 150 },
  { week: 'W4', users: 210 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => { const t = setTimeout(() => setIsLoading(false), 1000); return () => clearTimeout(t); }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 rounded-xl">
            <p className="text-sm text-slate-500 font-medium">Tổng Đặt Chỗ</p>
            <h3 className="text-3xl font-bold mt-2">1,245</h3>
            <p className="text-green-500 text-sm mt-2">↑ 12% so với tháng trước</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 rounded-xl">
            <p className="text-sm text-slate-500 font-medium">Doanh Thu (Tháng này)</p>
            <h3 className="text-3xl font-bold mt-2">485M VND</h3>
            <p className="text-green-500 text-sm mt-2">↑ 8.5% so với tháng trước</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 rounded-xl">
            <p className="text-sm text-slate-500 font-medium">Tour Phổ Biến Nhất</p>
            <h3 className="text-xl font-bold mt-2 line-clamp-1">Đà Nẵng - Hội An</h3>
            <p className="text-vna-blue text-sm mt-2">120 bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 rounded-xl">
            <p className="text-sm text-slate-500 font-medium">Tỉ lệ Xác nhận</p>
            <h3 className="text-3xl font-bold mt-2">86%</h3>
            <p className="text-green-500 text-sm mt-2">↑ 2% so với tháng trước</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Line Chart: Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu 6 tháng gần nhất</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              {isLoading ? (
                <div className="animate-pulse bg-gray-200 rounded-xl h-64 w-full" aria-label="Đang tải biểu đồ..." />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="currentColor" className="text-vna-blue" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart: Top Tours */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Tour Đặt Nhiều Nhất</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              {isLoading ? (
                <div className="animate-pulse bg-gray-200 rounded-xl h-64 w-full" aria-label="Đang tải biểu đồ..." />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topToursData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={120} />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="currentColor" className="text-emerald-500" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart: Service Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Phân Bổ Dịch Vụ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full flex justify-center">
              {isLoading ? (
                <div className="animate-pulse bg-gray-200 rounded-xl h-64 w-full" aria-label="Đang tải biểu đồ..." />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="currentColor" className="text-indigo-400"
                    paddingAngle={5}
                    dataKey="value"
                    label
                  >
                    {serviceDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Area Chart: User Registrations */}
        <Card>
          <CardHeader>
            <CardTitle>Người Dùng Đăng Ký Mới (Theo Tuần)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              {isLoading ? (
                <div className="animate-pulse bg-gray-200 rounded-xl h-64 w-full" aria-label="Đang tải biểu đồ..." />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userRegistrationsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="week" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area type="monotone" dataKey="users" stroke="currentColor" className="text-violet-500" fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
