import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api/auth';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { Card, CardContent } from '@/components/ui';
import { ChevronLeft, Mail, KeyRound, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

type Step = 'EMAIL' | 'OTP' | 'NEW_PASSWORD' | 'SUCCESS';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  
  const [step, setStep] = useState<Step>('EMAIL');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const sendEmailMutation = useMutation({
    mutationFn: () => authApi.forgotPassword(email),
    onSuccess: () => {
      toast.success('Mã OTP đã được gửi đến email của bạn!');
      setStep('OTP');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Không thể gửi OTP');
    }
  });

  const verifyOtpMutation = useMutation({
    mutationFn: () => authApi.verifyOTP(email, otp),
    onSuccess: () => {
      toast.success('Xác thực OTP thành công!');
      setStep('NEW_PASSWORD');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'OTP không hợp lệ');
    }
  });

  const resetPasswordMutation = useMutation({
    mutationFn: () => authApi.resetPassword(email, otp, newPassword),
    onSuccess: () => {
      toast.success('Đổi mật khẩu thành công!');
      setStep('SUCCESS');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Không thể đổi mật khẩu');
    }
  });

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    sendEmailMutation.mutate();
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    verifyOtpMutation.mutate();
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      toast.error('Mật khẩu không khớp!');
      return;
    }
    resetPasswordMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="https://www.vietnamairlines.com/~/media/Images/VNANew/Home/Logo/logo_vna_menu.png" alt="Vietnam Airlines" className="h-10 mx-auto mb-6" />
        </div>

        <Card className="shadow-lg border-0 rounded-xl">
          <CardContent className="p-8 rounded-xl">
            
            {step === 'EMAIL' && (
              <>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Quên mật khẩu?</h1>
                <p className="text-slate-600 mb-6 text-sm">Nhập email của bạn để chúng tôi gửi mã xác thực (OTP).</p>
                <form onSubmit={handleSendEmail} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      placeholder="example@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full bg-vna-blue hover:bg-vna-blue/90 text-white" disabled={sendEmailMutation.isPending}>
                    {sendEmailMutation.isPending ? 'Đang gửi...' : 'Gửi mã xác nhận'}
                  </Button>
                </form>
              </>
            )}

            {step === 'OTP' && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 text-vna-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Kiểm tra email của bạn</h2>
                  <p className="text-slate-600 text-sm">Chúng tôi đã gửi mã OTP tới địa chỉ <strong>{email}</strong>.</p>
                </div>
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="space-y-2 text-center">
                    <Label htmlFor="otp">Mã xác thực (OTP)</Label>
                    <Input 
                      id="otp" 
                      placeholder="Nhập 6 số OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="h-14 text-center text-2xl font-bold tracking-[0.5em]"
                      maxLength={6}
                      required
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full bg-vna-blue text-white" disabled={verifyOtpMutation.isPending}>
                    {verifyOtpMutation.isPending ? 'Đang xử lý...' : 'Xác nhận OTP'}
                  </Button>
                </form>
              </>
            )}

            {step === 'NEW_PASSWORD' && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 text-vna-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <KeyRound className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Tạo mật khẩu mới</h2>
                </div>
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Mật khẩu mới</Label>
                    <Input 
                      type="password"
                      placeholder="Nhập mật khẩu mới"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Xác nhận mật khẩu mới</Label>
                    <Input 
                      type="password"
                      placeholder="Xác nhận mật khẩu"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full bg-vna-blue text-white mt-4" disabled={resetPasswordMutation.isPending}>
                    {resetPasswordMutation.isPending ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                  </Button>
                </form>
              </>
            )}

            {step === 'SUCCESS' && (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Thành công!</h2>
                <p className="text-slate-600 mb-8 text-sm">Mật khẩu của bạn đã được cập nhật thành công.</p>
                <Button className="w-full h-12 rounded-lg bg-vna-blue text-white" onClick={() => navigate('/login')}>
                  Đăng nhập ngay
                </Button>
              </div>
            )}

          </CardContent>
        </Card>

        {step !== 'SUCCESS' && (
          <div className="text-center mt-8">
            <Link to="/login" className="text-sm font-semibold text-slate-500 hover:text-vna-blue flex items-center justify-center gap-1 transition-all duration-300">
              <ChevronLeft className="w-4 h-4" /> Quay lại Đăng nhập
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
