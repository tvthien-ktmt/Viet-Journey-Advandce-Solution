import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/api/admin';
import { Input, Button } from '@/components/ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui';
import { Badge } from '@/components/ui';
import { formatVND, formatDate } from '@/lib/formatters';

export default function AdminPaymentsPage() {
  const [search, setSearch] = useState('');
  
  const { data: payments, isLoading } = useQuery({ 
    queryKey: ['adminPayments'], 
    queryFn: () => adminApi.payments.list() 
  });

  const filtered = payments?.filter((p: { transactionId: string, booking: { bookingCode: string } }) => 
    p.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
    p.booking?.bookingCode?.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportCSV = () => {
    if (!payments) return;
    const headers = ['Mã giao dịch', 'Mã PNR', 'Số tiền', 'Trạng thái', 'Ngày GD'];
    const rows = payments.map((p: { transactionId: string, booking: { bookingCode: string }, amount: number, status: string, paymentDate: string, createdAt: string }) => [
      p.transactionId || 'N/A',
      p.booking?.bookingCode || 'N/A',
      p.amount,
      p.status,
      new Date(p.paymentDate || p.createdAt).toISOString()
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "payments_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-vna-text">Quản lý thanh toán</h1>
        <Button onClick={handleExportCSV} className="bg-green-600 hover:bg-green-700">Xuất Excel (CSV)</Button>
      </div>
      
      <div className="flex gap-4">
        <Input 
          placeholder="Tìm mã giao dịch, mã PNR..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm bg-white"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-vna-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Mã giao dịch</TableHead>
                <TableHead>Mã PNR</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày GD</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-vna-muted">Đang tải dữ liệu...</TableCell>
                </TableRow>
              ) : filtered?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-vna-muted">Không tìm thấy giao dịch nào</TableCell>
                </TableRow>
              ) : (
                filtered?.map((p: { id: number, transactionId: string, booking: { bookingCode: string, user: { email: string } }, amount: number, status: 'SUCCESS'|'FAILED'|'PENDING', paymentDate: string, createdAt: string }) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono">{p.transactionId || 'N/A'}</TableCell>
                    <TableCell className="font-bold text-vna-gold">{p.booking?.bookingCode || 'N/A'}</TableCell>
                    <TableCell className="font-medium text-vna-red">{formatVND(p.amount)}</TableCell>
                    <TableCell>
                      <Badge className={
                        p.status === 'SUCCESS' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                        p.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' :
                        'bg-red-100 text-red-700 hover:bg-red-100'
                      }>
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{p.paymentDate ? formatDate(new Date(p.paymentDate).toISOString()) : 'N/A'}</TableCell>
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
