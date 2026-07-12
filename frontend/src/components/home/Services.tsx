
import { ArrowRight } from 'lucide-react';
import { services } from '@/data/vna-data';
import { useT } from '@/store/langStore';
import { toast } from 'sonner';

export function Services() {
  const _t = useT();

  return (
    <section id="services" className="vna-tint-bg py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-[#023a78] sm:text-3xl">{_t.sections.services}</h2>
          <p className="mx-auto mt-1 max-w-xl text-sm text-slate-500">{_t.sections.servicesSub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.label}
                type="button"
                onClick={() => toast.success(s.label, { description: s.desc })}
                className="flex items-center gap-2 group flex-col items-start rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-[#f5a623] hover:shadow-md sm:p-5"
              >
                <div className="inline-flex size-11 items-center justify-center rounded-full bg-[#eaf3fb] text-[#023a78] transition-colors group-hover:bg-[#f5a623] group-hover:text-[#023a78]">
                  <Icon className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#023a78]">{s.label}</div>
                  <div className="mt-0.5 line-clamp-2 text-[11px] text-slate-500">{s.desc}</div>
                </div>
                <div className="mt-auto inline-flex items-center gap-1 text-[11px] font-semibold text-[#1f6fb2] opacity-0 transition-opacity group-hover:opacity-100">
                  {_t.common.seeDetail}
                  <ArrowRight className="size-3" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
