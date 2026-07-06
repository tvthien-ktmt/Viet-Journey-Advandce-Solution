
import { useQuery } from '@tanstack/react-query';
import { profileApi } from '@/api/profile';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatVND } from '@/lib/formatters';
import { Ticket, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BookingHistoryPage() {
  const navigate = useNavigate();
  const { data: bookings, isLoading } = useQuery({ 
    queryKey: ['myBookings'], 
    queryFn: () => profileApi.bookings.list() as Promise<any[]>
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-vna-text">Lịch sử đặt chỗ</h1>
      
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-20 w-full" />
          ))}
        </div>
      ) : !bookings || bookings.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <Ticket className="w-14 h-14 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-[#0b1f3a]">Chưa có đặt chỗ nào</h3>
          <p className="text-[#64748b] mt-1 text-sm">Đặt chuyến bay đầu tiên của bạn ngay hôm nay</p>
          <button onClick={() => navigate('/')}
            className="mt-4 px-5 py-2 bg-[#f5a623] text-white rounded-full text-sm font-medium hover:bg-[#d4891a] transition-colors">
            Tìm vé ngay
          </button>
        </div>
      ) : (
        <Card className="border-vna-border shadow-sm overflow-hidden rounded-xl">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>Mã đặt chỗ</TableHead>
                  <TableHead>Hành trình</TableHead>
                  <TableHead>Ngày bay</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Chi tiết</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings?.map((b: any) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-bold text-vna-gold font-mono">{b.bookingCode}</TableCell>
                    <TableCell className="whitespace-nowrap">{b.route}</TableCell>
                    <TableCell className="whitespace-nowrap">{b.date}</TableCell>
                    <TableCell className="font-medium">{formatVND(b.amount)}</TableCell>
                    <TableCell>
                      <Badge className={
                        b.status === 'CONFIRMED' ? 'bg-green-500' :
                        b.status === 'HOLD' ? 'bg-vna-gold' :
                        b.status === 'PENDING_PAYMENT' ? 'bg-vna-sky' :
                        b.status === 'EXPIRED' ? 'bg-vna-red' : 'bg-gray-400'
                      }>{b.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {b.status === 'CONFIRMED' && (
                        <Button className="flex items-center gap-2 rounded-lg" variant="ghost" size="default" onClick={() => navigate(`/booking/${b.id}/confirm`)} title="Xem vé điện tử">
                          <ExternalLink size={16} className="text-vna-blue" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
}
