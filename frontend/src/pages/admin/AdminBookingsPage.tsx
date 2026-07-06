
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/api/admin';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatVND } from '@/lib/formatters';

export default function AdminBookingsPage() {
  const [search, setSearch] = useState('');
  
  const { data: bookings, isLoading } = useQuery({ 
    queryKey: ['adminBookings'], 
    queryFn: () => adminApi.bookings.list() 
  });

  const filteredBookings = bookings?.filter((b: any) => 
    b.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
    b.contactEmail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-vna-text">Quản lý đặt chỗ</h1>
      </div>
      
      <div className="flex gap-4">
        <Input 
          placeholder="Tìm mã đặt chỗ, email..." 
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
                <TableHead>Mã đặt chỗ</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Hành trình</TableHead>
                <TableHead>Ngày bay</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-10">Đang tải...</TableCell></TableRow>
              ) : filteredBookings?.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-10 text-vna-muted">Không tìm thấy dữ liệu</TableCell></TableRow>
              ) : (
                filteredBookings?.map((b: any) => (
                  <TableRow key={b.id} className="cursor-pointer hover:bg-slate-50 transition-all duration-300">
                    <TableCell className="font-bold text-vna-gold font-mono tracking-wider">{b.bookingCode}</TableCell>
                    <TableCell>{b.contactEmail}</TableCell>
                    <TableCell>{b.route}</TableCell>
                    <TableCell>{b.date}</TableCell>
                    <TableCell className="font-semibold">{formatVND(b.amount)}</TableCell>
                    <TableCell>
                      <Badge className={
                        b.status === 'CONFIRMED' ? 'bg-green-500' :
                        b.status === 'HOLD' ? 'bg-vna-gold' :
                        b.status === 'PENDING_PAYMENT' ? 'bg-vna-sky' :
                        b.status === 'EXPIRED' ? 'bg-vna-red' : 'bg-gray-400'
                      }>{b.status}</Badge>
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
