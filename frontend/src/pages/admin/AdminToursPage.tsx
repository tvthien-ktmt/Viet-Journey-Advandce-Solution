import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/api/admin';
import { Button } from '@/components/ui';
import { Input, Label } from '@/components/ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui';
import { toast } from 'sonner';

export default function AdminToursPage() {
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<any>(null);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '', slug: '', location: '', price: '', oldPrice: '', duration: '', overview: '', isFeatured: false
  });

  const { data: toursData, isLoading } = useQuery({ 
    queryKey: ['adminTours'], 
    queryFn: () => adminApi.tours.list() 
  });

  const tours = toursData?.content || (Array.isArray(toursData) ? toursData : []);

  const createMutation = useMutation({
    mutationFn: (data: any) => adminApi.tours.create(data),
    onSuccess: () => {
      toast.success('Thêm tour thành công');
      queryClient.invalidateQueries({ queryKey: ['adminTours'] });
      setIsDialogOpen(false);
    },
    onError: () => toast.error('Lỗi khi thêm tour')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminApi.tours.update(id, data),
    onSuccess: () => {
      toast.success('Cập nhật tour thành công');
      queryClient.invalidateQueries({ queryKey: ['adminTours'] });
      setIsDialogOpen(false);
    },
    onError: () => toast.error('Lỗi khi cập nhật tour')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.tours.delete(id),
    onSuccess: () => {
      toast.success('Xóa tour thành công');
      queryClient.invalidateQueries({ queryKey: ['adminTours'] });
    },
    onError: () => toast.error('Lỗi khi xóa tour')
  });

  const filtered = tours?.filter((t: { name: string }) => 
    t.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenDialog = (tour?: any) => {
    if (tour) {
      setEditingTour(tour);
      setFormData({
        name: tour.name || '',
        slug: tour.slug || '',
        location: tour.location || '',
        price: tour.price?.toString() || '',
        oldPrice: tour.oldPrice?.toString() || '',
        duration: tour.duration || '',
        overview: tour.overview || '',
        isFeatured: tour.isFeatured || false
      });
    } else {
      setEditingTour(null);
      setFormData({ name: '', slug: '', location: '', price: '', oldPrice: '', duration: '', overview: '', isFeatured: false });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price),
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : undefined
    };
    if (editingTour) {
      updateMutation.mutate({ id: editingTour.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-vna-text">Quản lý Tour</h1>
        <Button onClick={() => handleOpenDialog()}>Thêm Tour</Button>
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
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-4">Đang tải...</TableCell></TableRow>
            ) : filtered?.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-4 text-vna-muted">Chưa có tour nào</TableCell></TableRow>
            ) : (
              filtered?.map((t: any) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell>{t.location}</TableCell>
                  <TableCell>{t.price}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleOpenDialog(t)}>Sửa</Button>
                      <Button variant="destructive" size="sm" onClick={() => { if(window.confirm('Bạn có chắc chắn muốn xoá tour này? Hành động này không thể hoàn tác.')) deleteMutation.mutate(t.id) }}>Xóa</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTour ? 'Sửa Tour' : 'Thêm Tour'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tên Tour</Label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label>Địa điểm</Label>
                <Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label>Thời gian</Label>
                <Input value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label>Giá</Label>
                <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label>Giá cũ</Label>
                <Input type="number" value={formData.oldPrice} onChange={e => setFormData({...formData, oldPrice: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tổng quan</Label>
              <Input value={formData.overview} onChange={e => setFormData({...formData, overview: e.target.value})} required />
            </div>
            <DialogFooter>
              <Button type="submit">{editingTour ? 'Cập nhật' : 'Thêm mới'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
