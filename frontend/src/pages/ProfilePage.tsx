import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/store/authStore';
import { profileApi } from '@/api/profile';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Plane, CreditCard, Shield, LogOut, Award, ChevronRight } from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = useAuth((s) => s.user);
  const setAuth = useAuth((s) => s.setAuth);
  const logout = useAuth((s) => s.logout);
  const [activeTab, setActiveTab] = useState<'info' | 'bookings' | 'payment' | 'security'>('info');

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await profileApi.updateProfile({ fullName, phone });
      setAuth(res, useAuth.getState().token || '');
      toast.success('Cập nhật thông tin thành công');
    } catch (error) {
      toast.error('Cập nhật thất bại');
    } finally {
      setIsUpdating(false);
    }
  };

  const { data: bookings } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => profileApi.bookings.list(),
    enabled: !!user,
  });

  // Protect route
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getTierColor = (tier?: string) => {
    switch(tier?.toUpperCase()) {
      case 'PLATINUM': return 'bg-slate-800 text-white border-slate-700';
      case 'GOLD': return 'bg-vna-gold text-white border-yellow-600';
      case 'TITANIUM': return 'bg-slate-400 text-white border-slate-500';
      case 'SILVER': return 'bg-slate-200 text-slate-800 border-slate-300';
      default: return 'bg-vna-blue text-white border-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-24">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-80 space-y-6">
            
            {/* Lotusmiles Card */}
            <Card className={`overflow-hidden border-2 shadow-md ${getTierColor(user.lotusmilesTier)}`}>
              <CardContent className="p-6 rounded-xl">
                <div className="flex justify-between items-start mb-6">
                  <img src="https://www.vietnamairlines.com/~/media/Images/VNANew/Home/Logo/logo_vna_menu.png" alt="VNA" className="h-6 filter brightness-0 invert opacity-90" />
                  <span className="text-xs font-bold tracking-widest uppercase">{user.lotusmilesTier || 'MEMBER'}</span>
                </div>
                <div className="mb-6">
                  <p className="text-xs uppercase opacity-80 mb-1">Hội viên</p>
                  <p className="font-bold text-xl">{user.fullName}</p>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs uppercase opacity-80 mb-1">Số thẻ</p>
                    <p className="font-mono text-lg font-semibold tracking-widest">VN{user.id.padStart(8, '0')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase opacity-80 mb-1">Dặm thưởng</p>
                    <p className="font-bold text-xl flex items-center gap-1 justify-end"><Award className="w-4 h-4" /> {user.lotusmilesMiles?.toLocaleString() || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nav Menu */}
            <Card>
              <CardContent className="p-2 space-y-1 rounded-xl">
                <Button 
                  variant={activeTab === 'info' ? 'secondary' : 'ghost'} 
                  className={`flex items-center gap-2 w-full justify-start h-12 ${activeTab === 'info' ? 'bg-blue-50 text-vna-blue' : ''}`}
                  onClick={() => setActiveTab('info')}
                >
                  <User className="w-5 h-5 mr-3" /> Thông tin cá nhân
                </Button>
                <Button 
                  variant={activeTab === 'bookings' ? 'secondary' : 'ghost'} 
                  className={`flex items-center gap-2 w-full justify-start h-12 ${activeTab === 'bookings' ? 'bg-blue-50 text-vna-blue' : ''}`}
                  onClick={() => setActiveTab('bookings')}
                >
                  <Plane className="w-5 h-5 mr-3" /> Đặt chỗ của tôi
                </Button>
                <Button 
                  variant={activeTab === 'payment' ? 'secondary' : 'ghost'} 
                  className={`flex items-center gap-2 w-full justify-start h-12 ${activeTab === 'payment' ? 'bg-blue-50 text-vna-blue' : ''}`}
                  onClick={() => setActiveTab('payment')}
                >
                  <CreditCard className="w-5 h-5 mr-3" /> Phương thức thanh toán
                </Button>
                <Button 
                  variant={activeTab === 'security' ? 'secondary' : 'ghost'} 
                  className={`flex items-center gap-2 w-full justify-start h-12 ${activeTab === 'security' ? 'bg-blue-50 text-vna-blue' : ''}`}
                  onClick={() => setActiveTab('security')}
                >
                  <Shield className="w-5 h-5 mr-3" /> Bảo mật tài khoản
                </Button>
                
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <Button variant="ghost" className="flex items-center gap-2 w-full justify-start h-12 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300" onClick={handleLogout}>
                    <LogOut className="w-5 h-5 mr-3" /> Đăng xuất
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            
            {activeTab === 'info' && (
              <Card className="animate-in fade-in slide-in-from-bottom-4 rounded-xl">
                <CardHeader className="border-b bg-slate-50/50 rounded-xl">
                  <CardTitle>Thông tin cá nhân</CardTitle>
                </CardHeader>
                <CardContent className="p-6 rounded-xl">
                    <form className="space-y-6" onSubmit={handleUpdateProfile}>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Họ và tên</Label>
                        <Input value={fullName} onChange={e => setFullName(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input defaultValue={user.email} disabled />
                        <p className="text-xs text-slate-500">Email không thể thay đổi vì được dùng làm định danh đăng nhập.</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Số điện thoại</Label>
                        <Input value={phone} onChange={e => setPhone(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Quốc tịch</Label>
                        <Input defaultValue="Việt Nam" disabled />
                      </div>
                      <div className="space-y-2">
                        <Label>Ngày sinh</Label>
                        <Input type="date" defaultValue="1990-01-01" disabled />
                      </div>
                      <div className="space-y-2">
                        <Label>Số Hộ chiếu / CCCD</Label>
                        <Input defaultValue="001090123456" disabled />
                      </div>
                    </div>
                    <Button type="submit" disabled={isUpdating} className="bg-vna-blue rounded-lg">
                      {isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeTab === 'bookings' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-xl font-bold mb-4">Chuyến bay sắp tới</h2>
                
                {bookings?.map((b) => (
                  <Card key={b.id} className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-vna-blue rounded-xl mb-4" onClick={() => navigate(`/manage`)}>
                    <CardContent className="p-6 flex items-center justify-between rounded-xl">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-blue-100 text-vna-blue text-xs font-bold px-2 py-1 rounded">{b.bookingCode}</span>
                          <span className="text-sm font-semibold text-slate-600">{b.date}</span>
                        </div>
                        <p className="font-bold text-lg">{b.route}</p>
                        <p className="text-sm text-slate-500">Trạng thái: {b.status}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </CardContent>
                  </Card>
                ))}

                {(!bookings || bookings.length === 0) && (
                  <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                    <Plane className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">Bạn chưa có chuyến bay nào.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'payment' && (
              <Card className="animate-in fade-in slide-in-from-bottom-4 rounded-xl">
                <CardHeader className="border-b bg-slate-50/50 flex flex-row items-center justify-between rounded-xl">
                  <CardTitle>Phương thức thanh toán</CardTitle>
                  <Button variant="outline" size="sm">Thêm thẻ mới</Button>
                </CardHeader>
                <CardContent className="p-6 rounded-xl">
                  <div className="text-center py-12 text-slate-500">
                    <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p>Bạn chưa liên kết thẻ thanh toán nào.</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card className="animate-in fade-in slide-in-from-bottom-4 rounded-xl">
                <CardHeader className="border-b bg-slate-50/50 rounded-xl">
                  <CardTitle>Bảo mật tài khoản</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-8 rounded-xl">
                  <div className="space-y-4">
                    <h3 className="font-bold">Đổi mật khẩu</h3>
                    <div className="space-y-4 max-w-sm">
                      <div className="space-y-2">
                        <Label>Mật khẩu hiện tại</Label>
                        <Input type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label>Mật khẩu mới</Label>
                        <Input type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label>Xác nhận mật khẩu mới</Label>
                        <Input type="password" />
                      </div>
                      <Button className="bg-vna-blue w-full rounded-lg">Cập nhật mật khẩu</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
