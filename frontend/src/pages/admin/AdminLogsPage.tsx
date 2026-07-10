import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/api/admin';
import { Input } from '@/components/ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui';
import { Badge } from '@/components/ui';
import { formatDate } from '@/lib/formatters';

export default function AdminLogsPage() {
  const [search, setSearch] = useState('');
  
  const { data: logs, isLoading } = useQuery({ 
    queryKey: ['adminLogs'], 
    queryFn: () => adminApi.logs.list() 
  });

  const filtered = logs?.filter((l: { action: string, details: string }) => 
    l.action?.toLowerCase().includes(search.toLowerCase()) || 
    l.details?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-vna-text">Nhật ký hoạt động (Audit Logs)</h1>
      </div>
      
      <div className="flex gap-4">
        <Input 
          placeholder="Tìm hành động, chi tiết..." 
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
                <TableHead>ID</TableHead>
                <TableHead>Hành động</TableHead>
                <TableHead>User ID (Người thực hiện)</TableHead>
                <TableHead>Chi tiết</TableHead>
                <TableHead>Thời gian</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-vna-muted">Đang tải dữ liệu...</TableCell>
                </TableRow>
              ) : filtered?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-vna-muted">Không tìm thấy log nào</TableCell>
                </TableRow>
              ) : (
                filtered?.map((l: { id: number, action: string, userId: number, details: string, createdAt: string }) => (
                  <TableRow key={l.id}>
                    <TableCell>{l.id}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {l.action}
                      </Badge>
                    </TableCell>
                    <TableCell>{l.userId || 'Hệ thống'}</TableCell>
                    <TableCell className="max-w-[300px] truncate" title={l.details}>
                      {l.details || '-'}
                    </TableCell>
                    <TableCell>{formatDate(new Date(l.createdAt).toISOString())}</TableCell>
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
