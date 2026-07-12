import { ArrowRight, MapPin } from 'lucide-react';
import { buttonVariants } from '@/components/ui';
import { cn } from '@/lib/utils';
import { destinations } from '@/data/vna-data';
import { useLang, useT } from '@/store/langStore';
import { formatVND } from '@/lib/formatters';

export function Destinations() {
  const _t = useT();
  const _lang = useLang((s) => s.lang);

  return (
    <section id="destinations" className="vna-tint-bg-2 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-[#023a78] sm:text-3xl">{_t.sections.destinations}</h2>
            <p className="mt-1 text-sm text-slate-500">{_t.sections.destinationsSub}</p>
          </div>
          <a href="#booking" className={cn("flex items-center gap-2", buttonVariants({ variant: "outline" }), "border-[#023a78]/30 text-[#023a78] hover:bg-[#eaf3fb] hover:text-[#023a78]")}>
            {_t.common.seeDetail}
            <ArrowRight className="size-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {destinations.map((d) => (
            <a
              key={d.code}
              href="#booking"
              className="group relative block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-[#f5a623] hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={d.image}
                  alt={_lang === 'vn' ? d.city : d.cityEn}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#023a78]/70 via-transparent to-transparent" />
                <div className="absolute right-2 top-2 rounded-full bg-[#f5a623] px-2.5 py-1 text-[11px] font-bold text-[#023a78] shadow">
                  {_t.sections.fromPrice} {formatVND(d.fromPriceVND)}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <div className="flex items-center gap-1.5 text-[11px] text-white/85">
                    <MapPin className="size-3" />
                    {d.country}
                  </div>
                  <div className="text-lg font-bold leading-tight drop-shadow">{_lang === 'vn' ? d.city : d.cityEn}</div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

