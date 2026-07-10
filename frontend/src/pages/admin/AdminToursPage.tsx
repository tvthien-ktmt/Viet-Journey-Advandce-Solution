import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/api/admin';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui';

export default function AdminToursPage() {
  const [search, setSearch] = useState('');
  
  const { data: tours, isLoading } = useQuery({ 
    queryKey: ['adminTours'], 
    queryFn: () => adminApi.tours.list() 
  });

  const filtered = tours?.filter((t: any) => 
    t.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-vna-text">Quản lý Tour</h1>
        <Button disabled>Thêm Tour</Button>
      </div>
      
      <Input 
        placeholder="Tìm tour..." 
        value={search} 
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm bg-white"
      />

      <div className="bg-white rounded-xl shadow-sm border border-vna-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Tên Tour</TableHead>
              <TableHead>Địa điểm</TableHead>
              <TableHead>Giá</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={3} className="text-center py-4">Đang tải...</TableCell></TableRow>
            ) : filtered?.length === 0 ? (
              <TableRow><TableCell colSpan={3} className="text-center py-4 text-vna-muted">Chưa có tour nào</TableCell></TableRow>
            ) : (
              filtered?.map((t: any) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell>{t.location}</TableCell>
                  <TableCell>{t.price}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
