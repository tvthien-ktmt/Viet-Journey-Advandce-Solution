import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useT } from '@/store/langStore';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { Card, CardContent } from '@/components/ui';
import { ChevronLeft, Mail, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const t = useT();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
      toast.success('Đã gửi link khôi phục mật khẩu!');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="https://www.vietnamairlines.com/~/media/Images/VNANew/Home/Logo/logo_vna_menu.png" alt="Vietnam Airlines" className="h-10 mx-auto mb-6" />
        </div>

        <Card className="shadow-lg border-0 rounded-xl">
          <CardContent className="p-8 rounded-xl">
            
            {!isSent ? (
              <>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Quên mật khẩu?</h1>
                <p className="text-slate-600 mb-6 text-sm">Đừng lo lắng, hãy nhập email hoặc số thẻ Lotusmiles của bạn để chúng tôi gửi link khôi phục.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email / Số thẻ Lotusmiles</Label>
                    <Input 
                      id="email" 
                      placeholder="Nhập email hoặc số thẻ"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full bg-vna-blue hover:bg-vna-blue/90 text-white text-base rounded-lg transition-all duration-300" disabled={isLoading}>
                    {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Gửi yêu cầu'}
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-blue-100 text-vna-blue rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Kiểm tra email của bạn</h2>
                <p className="text-slate-600 mb-8 text-sm">Chúng tôi đã gửi hướng dẫn khôi phục mật khẩu tới địa chỉ <strong>{email}</strong>.</p>
                <Button variant="outline" className="w-full h-12 rounded-lg" onClick={() => setIsSent(false)}>
                  Gửi lại email
                </Button>
              </div>
            )}

          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Link to="/login" className="text-sm font-semibold text-slate-500 hover:text-vna-blue flex items-center justify-center gap-1 transition-all duration-300">
            <ChevronLeft className="w-4 h-4" /> Quay lại Đăng nhập
          </Link>
        </div>

      </div>
    </div>
  );
}

