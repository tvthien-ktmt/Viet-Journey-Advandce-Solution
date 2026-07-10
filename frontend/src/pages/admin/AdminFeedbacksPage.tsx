import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/api/admin';
import { Input, Button } from '@/components/ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui';
import { toast } from 'sonner';

export default function AdminFeedbacksPage() {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();
  
  const { data: feedbacks, isLoading } = useQuery({ 
    queryKey: ['adminFeedbacks'], 
    queryFn: () => adminApi.feedbacks.list() 
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => adminApi.feedbacks.updateStatus(id, status),
    onSuccess: () => {
      toast.success('Cập nhật trạng thái thành công');
      queryClient.invalidateQueries({ queryKey: ['adminFeedbacks'] });
    },
    onError: () => toast.error('Cập nhật thất bại')
  });

  const filtered = feedbacks?.filter((f: { comment: string, user: { email: string } }) => 
    f.comment?.toLowerCase().includes(search.toLowerCase()) || 
    f.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-vna-text">Quản lý Đánh giá</h1>
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
              <TableHead>Tour</TableHead>
              <TableHead>Đánh giá</TableHead>
              <TableHead>Nội dung</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-4">Đang tải...</TableCell></TableRow>
            ) : filtered?.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-4 text-vna-muted">Chưa có phản hồi nào</TableCell></TableRow>
            ) : (
              filtered?.map((f: { id: number, user: { email: string }, tour?: { name: string }, rating: number, comment: string, status: string }) => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium">{f.user?.email}</TableCell>
                  <TableCell>{f.tour?.name || '-'}</TableCell>
                  <TableCell>{'⭐'.repeat(f.rating)}</TableCell>
                  <TableCell className="max-w-xs truncate">{f.comment}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      f.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
                      f.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {f.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {f.status === 'PENDING_REVIEW' && (
                      <>
                        <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50" onClick={() => updateStatusMutation.mutate({ id: String(f.id), status: 'PUBLISHED' })}>Duyệt</Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50" onClick={() => updateStatusMutation.mutate({ id: String(f.id), status: 'REJECTED' })}>Từ chối</Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
