
import { useQuery } from '@tanstack/react-query';
import { profileApi } from '@/api/profile';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LotusLogo } from '@/components/common/LotusLogo';
import { Star } from 'lucide-react';

const TIERS = [
  { name: 'Ocean', req: 0, color: 'text-vna-blue border-vna-blue' },
  { name: 'Titanium', req: 15000, color: 'text-slate-500 border-gray-500' },
  { name: 'Gold', req: 30000, color: 'text-vna-gold border-vna-gold' },
  { name: 'Platinum', req: 50000, color: 'text-slate-800 border-slate-800' }
];

export default function LotusmilesPage() {
  const { data: lf, isLoading } = useQuery<any>({ 
    queryKey: ['myLotusmiles'], 
    queryFn: () => profileApi.lotusmiles.me() 
  });

  if (isLoading) return <div className="text-center py-20">Đang tải...</div>;
  if (!lf) return null;

  const progress = Math.min(100, Math.max(0, (lf.miles / lf.nextTierMiles) * 100));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-vna-text">Thẻ Lotusmiles</h1>
      
      <Card className="p-6 bg-vna-blue text-white shadow-lg overflow-hidden relative rounded-xl">
        <div className="absolute -right-10 -bottom-10 opacity-10">
          <LotusLogo className="w-64 h-64" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-vna-gold text-sm font-semibold uppercase tracking-wider">Hạng thẻ hiện tại</p>
            <h2 className="text-4xl font-bold mt-1">{lf.tier}</h2>
            <p className="text-white/80 mt-2 text-lg">{lf.miles.toLocaleString()} dặm xét hạng</p>
          </div>
          <LotusLogo className="w-16 h-16 text-vna-gold drop-shadow-md" />
        </div>
        
        <div className="relative z-10 mt-8">
          <div className="flex justify-between text-xs text-white/90 mb-2 font-medium">
            <span>Đã đạt {lf.miles.toLocaleString()} dặm</span>
            <span>Cần {lf.nextTierMiles.toLocaleString()} dặm để lên {lf.nextTier}</span>
          </div>
          <div className="h-3 bg-black/20 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-vna-gold rounded-full relative" style={{ width: `${progress}%` }}>
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {TIERS.map(t => (
          <Card key={t.name} className={`p-4 text-center border-2 ${t.name === lf.tier ? `ring-2 ring-offset-2 ring-vna-gold ${t.color}` : 'border-vna-border text-vna-muted opacity-60'}`}>
            <Star className={`w-8 h-8 mx-auto mb-2 ${t.name === lf.tier ? '' : 'grayscale'}`} />
            <h4 className="font-bold">{t.name}</h4>
            <p className="text-xs mt-1">{t.req.toLocaleString()} dặm</p>
            {t.name === lf.tier && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-vna-gold text-white text-[10px] px-2 py-0.5 rounded-full font-bold">Hiện tại</span>}
          </Card>
        ))}
      </div>

      <Card className="mt-8 border-vna-border overflow-hidden rounded-xl">
        <div className="p-4 bg-slate-50 border-b border-vna-border">
          <h3 className="font-bold text-vna-text">Lịch sử tích lũy dặm</h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ngày giao dịch</TableHead>
                <TableHead>Nội dung</TableHead>
                <TableHead className="text-right">Biến động</TableHead>
                <TableHead className="text-right">Số dư dặm</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lf.history.map((h: any) => (
                <TableRow key={h.id}>
                  <TableCell>{h.date}</TableCell>
                  <TableCell>{h.action}</TableCell>
                  <TableCell className={`text-right font-bold ${h.miles > 0 ? 'text-green-600' : 'text-vna-red'}`}>
                    {h.miles > 0 ? '+' : ''}{h.miles.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-medium">{h.balance.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
