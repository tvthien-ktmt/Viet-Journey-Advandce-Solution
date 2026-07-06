import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/api/admin';
import type { AdminFlight } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatVND } from '@/lib/formatters';

export default function AdminFlightsPage() {
  const [search, setSearch] = useState('');
  
  const { data: flights, isLoading } = useQuery({ 
    queryKey: ['adminFlights'], 
    queryFn: () => adminApi.flights.list() 
  });

  const filteredFlights = flights?.filter((f: AdminFlight) => 
    f.flightNo.toLowerCase().includes(search.toLowerCase()) ||
    f.from.toLowerCase().includes(search.toLowerCase()) ||
    f.to.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-vna-text">Quản lý chuyến bay</h1>
        <Button className="bg-vna-blue hover:bg-vna-blue-700 rounded-lg transition-all duration-300">Thêm chuyến</Button>
      </div>
      
      <div className="flex gap-4">
        <Input 
          placeholder="Tìm kiếm chuyến bay, sân bay..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm bg-white"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-vna-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Chuyến bay</TableHead>
                <TableHead>Tuyến</TableHead>
                <TableHead>Ngày bay</TableHead>
                <TableHead>Giờ khởi hành</TableHead>
                <TableHead>Máy bay</TableHead>
                <TableHead>Giá cơ bản</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-10">Đang tải...</TableCell></TableRow>
              ) : filteredFlights?.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-10 text-vna-muted">Không tìm thấy chuyến bay</TableCell></TableRow>
              ) : (
                filteredFlights?.map((flight: AdminFlight) => (
                  <TableRow key={flight.id}>
                    <TableCell className="font-semibold text-vna-blue">{flight.flightNo}</TableCell>
                    <TableCell>{flight.from} → {flight.to}</TableCell>
                    <TableCell>{flight.departDate}</TableCell>
                    <TableCell>{flight.departTime}</TableCell>
                    <TableCell className="text-vna-muted">{flight.aircraft}</TableCell>
                    <TableCell>{formatVND(flight.basePrice)}</TableCell>
                    <TableCell>
                      <Badge className={
                        flight.status === 'ACTIVE' ? 'bg-green-500' :
                        flight.status === 'DELAYED' ? 'bg-vna-gold' :
                        flight.status === 'CANCELLED' ? 'bg-vna-red' : 'bg-gray-500'
                      }>{flight.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
