import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/api/admin';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui';
import { formatVND } from '@/lib/formatters';

export default function AdminPromotionsPage() {
  const [search, setSearch] = useState('');
  
  const { data: promos, isLoading } = useQuery({ 
    queryKey: ['adminPromotions'], 
    queryFn: () => adminApi.promotions.list() 
  });

  const filtered = promos?.filter((p: { code: string, description: string }) => 
    p.code?.toLowerCase().includes(search.toLowerCase()) || 
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-vna-text">Quản lý Khuyến mãi</h1>
        <Button onClick={() => alert('Tính năng đang được phát triển')}>Thêm Khuyến mãi</Button>
      </div>
      
      <Input 
        placeholder="Tìm mã khuyến mãi..." 
        value={search} 
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm bg-white"
      />

      <div className="bg-white rounded-xl shadow-sm border border-vna-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Mã</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Giá trị</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-4">Đang tải...</TableCell></TableRow>
            ) : filtered?.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-4 text-vna-muted">Chưa có khuyến mãi nào</TableCell></TableRow>
            ) : (
              filtered?.map((p: { id: number, code: string, description: string, discountType: string, discountValue: number, isActive: boolean }) => (
                <TableRow key={p.id}>
                  <TableCell className="font-bold">{p.code}</TableCell>
                  <TableCell>{p.description}</TableCell>
                  <TableCell>{p.discountType === 'PERCENTAGE' ? `${p.discountValue}%` : formatVND(p.discountValue)}</TableCell>
                  <TableCell>{p.isActive ? 'Active' : 'Inactive'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
