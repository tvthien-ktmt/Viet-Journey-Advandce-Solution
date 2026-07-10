import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/api/admin';
import { Input } from '@/components/ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui';

export default function AdminFeedbacksPage() {
  const [search, setSearch] = useState('');
  
  const { data: feedbacks, isLoading } = useQuery({ 
    queryKey: ['adminFeedbacks'], 
    queryFn: () => adminApi.feedbacks.list() 
  });

  const filtered = feedbacks?.filter((f: { comment: string, user: { email: string } }) => 
    f.comment?.toLowerCase().includes(search.toLowerCase()) || 
    f.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-vna-text">Quản lý Phản hồi</h1>
      </div>
      
      <Input 
        placeholder="Tìm nội dung, email..." 
        value={search} 
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm bg-white"
      />

      <div className="bg-white rounded-xl shadow-sm border border-vna-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Người dùng</TableHead>
              <TableHead>Đánh giá</TableHead>
              <TableHead>Nội dung</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={3} className="text-center py-4">Đang tải...</TableCell></TableRow>
            ) : filtered?.length === 0 ? (
              <TableRow><TableCell colSpan={3} className="text-center py-4 text-vna-muted">Chưa có phản hồi nào</TableCell></TableRow>
            ) : (
              filtered?.map((f: { id: number, user: { email: string }, rating: number, comment: string }) => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium">{f.user?.email}</TableCell>
                  <TableCell>{'⭐'.repeat(f.rating)}</TableCell>
                  <TableCell className="max-w-xs truncate">{f.comment}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
