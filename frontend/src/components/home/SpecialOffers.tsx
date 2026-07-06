
import { ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { offers } from '@/data/vna-data';
import { useT } from '@/store/langStore';
import { toast } from 'sonner';

export function SpecialOffers() {
  const t = useT();

  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-[#023a78] sm:text-3xl">{t.sections.offers}</h2>
          <p className="mx-auto mt-1 max-w-xl text-sm text-slate-500">{t.sections.offersSub}</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {offers.map((o) => (
            <article key={o.id} className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={o.image} alt={o.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                <Badge className="absolute left-2 top-2 bg-vna-red text-white hover:bg-vna-red/90 border-0 transition-all duration-300">{o.badge}</Badge>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-2 text-sm font-bold text-[#023a78]">{o.title}</h3>
                <p className="mt-1.5 line-clamp-2 flex-1 text-xs text-slate-500">{o.excerpt}</p>
                <div className="mt-3 flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock className="size-3" />
                  {o.validity}
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="flex items-center gap-2 mt-3 w-full bg-[#023a78] text-white hover:bg-[#022f60] rounded-lg transition-all duration-300"
                  onClick={() => toast.success(t.common.bookNow, { description: o.title })}
                >
                  {t.common.bookNow}
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
