import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { bookingApi } from '@/api/booking';
import { useCountdown } from '@/hooks/useCountdown';
import { useLang, useT } from '../store/langStore';
import { formatVND } from '@/lib/formatters';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import type { HoldRequest } from '@/api/booking';
import type { Passenger } from '@/types/flight';

const passengerSchema = z.object({
  type: z.enum(['adult', 'child', 'infant']),
  fullName: z.string().min(1, 'Vui lòng nhập họ tên'),
  idNumber: z.string().min(1, 'Vui lòng nhập CCCD/Passport'),
  birthDate: z.string().min(1, 'Vui lòng chọn ngày sinh'),
  gender: z.enum(['M', 'F']),
});

const holdFormSchema = z.object({
  passengers: z.array(passengerSchema),
  contactEmail: z.string().email('Email không hợp lệ'),
  contactPhone: z.string().min(10, 'SĐT không hợp lệ'),
});

type HoldFormValues = z.infer<typeof holdFormSchema>;

export default function SeatHoldPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLang();
  const t = useT();
  
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);
  const activeId = createdBookingId || (bookingId !== 'temp-id' ? bookingId : null);

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', activeId],
    queryFn: () => bookingApi.get(activeId!),
    refetchInterval: 5000,
    enabled: !!activeId,
  });

  const holdMutation = useMutation({
    mutationFn: (req: HoldRequest) => bookingApi.createHold(req),
    onSuccess: (data) => {
      setCreatedBookingId(data.id);
      window.history.replaceState({}, '', `/booking/${data.id}/hold`);
    }
  });

  useEffect(() => {
    if (bookingId === 'temp-id' && location.state) {
      const state = location.state as HoldRequest;
      if (!holdMutation.isPending && !activeId) {
        // Fallback contact values if not logged in
        holdMutation.mutate({
          ...state,
          contactEmail: 'guest@example.com',
          contactPhone: '0901234567',
        });
      }
    } else if (!activeId && bookingId !== 'temp-id') {
      navigate('/');
    }
  }, [bookingId, location.state, activeId, holdMutation, navigate]);

  const expiresAt = booking?.expiresAt || new Date(Date.now() + 10 * 60 * 1000).toISOString();
  const remaining = useCountdown(expiresAt);

  useEffect(() => {
    if (booking && remaining === 0) {
      toast.error(t('hold.expired'));
      navigate('/');
    }
  }, [remaining, booking, navigate, t]);

  const { register, handleSubmit, formState: { errors }, control } = useForm<HoldFormValues>({
    resolver: zodResolver(holdFormSchema),
    defaultValues: {
      passengers: location.state ? Array.from({ length: (location.state as any).request.adults }).map(() => ({
        type: 'adult', fullName: '', idNumber: '', birthDate: '', gender: 'M'
      })) : [],
      contactEmail: 'guest@example.com',
      contactPhone: '0901234567',
    }
  });
  
  const { fields } = useFieldArray({ control, name: 'passengers' });

  const updateMutation = useMutation({
    mutationFn: (passengers: Passenger[]) => bookingApi.updatePassengers(activeId!, passengers),
    onSuccess: () => {
      navigate(`/payment/${activeId}`);
    },
    onError: () => toast.error('Có lỗi xảy ra')
  });

  const onSubmit = (data: HoldFormValues) => {
    updateMutation.mutate(data.passengers as Passenger[]);
  };

  if (isLoading || holdMutation.isPending) return <div className="text-center py-20">Đang giữ chỗ...</div>;
  if (!booking) return null;

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');

  return (
    <div className="bg-vna-tint min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-vna-blue text-white rounded-xl p-4 mb-6 sticky top-20 z-10 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="text-vna-gold animate-pulse" />
              <div>
                <p className="text-sm text-white/70">{t('hold.remaining')}</p>
                <p className="text-2xl font-bold font-mono">{mm}:{ss}</p>
              </div>
            </div>
            <Badge className="bg-vna-gold text-white">{t('hold.bookingCode')}: {booking.bookingCode}</Badge>
          </div>
          <p className="text-xs text-white/60 mt-2">{t('hold.warning')}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card className="p-6 rounded-xl">
            <h3 className="font-bold text-lg mb-4 text-vna-blue">Thông tin hành khách</h3>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg border border-vna-border">
                  <div className="md:col-span-4 font-semibold">{t(`hold.passenger.${field.type}` as any)} {index + 1}</div>
                  <div>
                    <label className="text-xs font-medium">{t('hold.fullName')}</label>
                    <input {...register(`passengers.${index}.fullName`)} className="w-full border rounded p-2 text-sm uppercase rounded-lg" />
                    {errors.passengers?.[index]?.fullName && <p className="text-red-500 text-xs">{errors.passengers[index]?.fullName?.message}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-medium">{t('hold.idNumber')}</label>
                    <input {...register(`passengers.${index}.idNumber`)} className="w-full border rounded p-2 text-sm rounded-lg" />
                    {errors.passengers?.[index]?.idNumber && <p className="text-red-500 text-xs">{errors.passengers[index]?.idNumber?.message}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-medium">{t('hold.birthDate')}</label>
                    <input type="date" {...register(`passengers.${index}.birthDate`)} className="w-full border rounded p-2 text-sm rounded-lg" />
                    {errors.passengers?.[index]?.birthDate && <p className="text-red-500 text-xs">{errors.passengers[index]?.birthDate?.message}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-medium">{t('hold.gender')}</label>
                    <select {...register(`passengers.${index}.gender`)} className="w-full border rounded p-2 text-sm rounded-lg">
                      <option value="M">{t('hold.gender.male')}</option>
                      <option value="F">{t('hold.gender.female')}</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 rounded-xl">
            <h3 className="font-bold text-lg mb-4 text-vna-blue">Thông tin liên hệ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium">{t('hold.contactEmail')}</label>
                <input {...register('contactEmail')} className="w-full border rounded p-2 text-sm rounded-lg" />
                {errors.contactEmail && <p className="text-red-500 text-xs">{errors.contactEmail.message}</p>}
              </div>
              <div>
                <label className="text-xs font-medium">{t('hold.contactPhone')}</label>
                <input {...register('contactPhone')} className="w-full border rounded p-2 text-sm rounded-lg" />
                {errors.contactPhone && <p className="text-red-500 text-xs">{errors.contactPhone.message}</p>}
              </div>
            </div>
          </Card>

          <Button type="submit" disabled={updateMutation.isPending} className="bg-vna-blue hover:bg-vna-blue-700 w-full py-6 text-lg rounded-lg transition-all duration-300">
            {updateMutation.isPending ? 'Đang xử lý...' : `${t('hold.continue')} →`}
          </Button>
        </form>
      </div>
    </div>
  );
}
