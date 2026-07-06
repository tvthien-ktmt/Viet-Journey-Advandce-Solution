import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/api/admin';
import type { AdminNews } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExternalLink, Edit, Trash2 } from 'lucide-react';

export default function AdminNewsPage() {
  const [search, setSearch] = useState('');
  
  const { data: news, isLoading } = useQuery({ 
    queryKey: ['adminNews'], 
    queryFn: () => adminApi.news.list() 
  });

  const filteredNews = news?.filter((n: AdminNews) => 
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-vna-text">Quản lý tin tức</h1>
        <Button className="bg-vna-blue hover:bg-vna-blue-700 rounded-lg transition-all duration-300">Thêm bài viết</Button>
      </div>
      
      <div className="flex gap-4">
        <Input 
          placeholder="Tìm tiêu đề..." 
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
                <TableHead>Ngày đăng</TableHead>
                <TableHead className="w-1/2">Tiêu đề</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-10">Đang tải...</TableCell></TableRow>
              ) : filteredNews?.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-10 text-vna-muted">Chưa có bài viết nào</TableCell></TableRow>
              ) : (
                filteredNews?.map((n: AdminNews) => (
                  <TableRow key={n.id}>
                    <TableCell className="whitespace-nowrap">{n.date}</TableCell>
                    <TableCell className="font-medium line-clamp-2">{n.title}</TableCell>
                    <TableCell className="text-vna-muted text-sm">{n.slug}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button className="flex items-center gap-2 rounded-lg" variant="ghost" size="icon" title="Xem trước" onClick={() => window.open(`/blog/${n.slug}`, '_blank')}>
                          <ExternalLink size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="flex items-center gap-2 text-vna-blue rounded-lg">
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-vna-red rounded-lg">
                          <Trash2 size={16} />
                        </Button>
                      </div>
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
