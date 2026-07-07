import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/api/admin';
import type { AdminUser } from '@/types/admin';
import { Input } from '@/components/ui';
import { Card } from '@/components/ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Avatar } from '@/components/ui';
import { Switch } from '@/components/ui';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();
  
  const { data: users, isLoading } = useQuery({ 
    queryKey: ['adminUsers'], 
    queryFn: () => adminApi.users.list() 
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, roles }: { id: string, roles: string[] }) => adminApi.users.updateRole(id, roles),
    onSuccess: () => {
      toast.success('Đã cập nhật quyền thành công');
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
    onError: () => toast.error('Cập nhật quyền thất bại')
  });

  const handleToggleAdmin = (id: string, currentRoles: string[], checked: boolean) => {
    const newRoles = checked 
      ? [...new Set([...currentRoles, 'ADMIN'])]
      : currentRoles.filter(r => r !== 'ADMIN');
    updateRoleMutation.mutate({ id, roles: newRoles });
  };

  const filteredUsers = users?.filter((u: AdminUser) => 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-vna-text">Quản lý người dùng</h1>
      </div>
      
      <div className="flex gap-4">
        <Input 
          placeholder="Tìm email, họ tên..." 
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
                <TableHead>Avatar</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Hạng thẻ</TableHead>
                <TableHead>Quyền</TableHead>
                <TableHead>Quyền Admin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-10">Đang tải...</TableCell></TableRow>
              ) : filteredUsers?.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-10 text-vna-muted">Không tìm thấy dữ liệu</TableCell></TableRow>
              ) : (
                filteredUsers?.map((u: AdminUser) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <Avatar className="w-8 h-8 bg-vna-blue text-white flex items-center justify-center text-xs font-bold">
                        {u.fullName[0]}
                      </Avatar>
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell className="font-medium">{u.fullName}</TableCell>
                    <TableCell>
                      <Badge className="bg-vna-gold text-white">{u.lotusmilesTier}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {u.roles.map((r: string) => (
                          <Badge key={r} variant="outline" className={r === 'ADMIN' ? 'border-vna-red text-vna-red' : 'border-vna-blue text-vna-blue'}>
                            {r}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch 
                        checked={u.roles.includes('ADMIN')}
                        onCheckedChange={(checked) => handleToggleAdmin(u.id, u.roles, checked)}
                      />
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

