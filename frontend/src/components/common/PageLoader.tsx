import { LotusLogo } from './LotusLogo';
import { useLang } from '@/store/langStore';

export function PageLoader() {
  const _t = useLang((s) => s.t);
  return (
    <div className="min-h-screen flex items-center justify-center bg-vna-tint">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin"><LotusLogo size={48} /></div>
        <p className="text-vna-blue font-medium">{_t('loading')}</p>
      </div>
    </div>
  );
}
