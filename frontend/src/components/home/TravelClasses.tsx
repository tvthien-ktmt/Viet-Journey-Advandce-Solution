
import { Check, Plane } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui';
import { travelClasses, IMAGES } from '@/data/vna-data';
import { useLang, useT } from '@/store/langStore';

export function TravelClasses() {
  const t = useT();
  const lang = useLang((s) => s.lang);

  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-[#023a78] sm:text-3xl">{t.sections.travelClasses}</h2>
          <p className="mx-auto mt-1 max-w-xl text-sm text-slate-500">{t.sections.travelClassesSub}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
          <div className="relative overflow-hidden rounded-2xl shadow-sm lg:sticky lg:top-28">
            <img src={IMAGES.cabin} alt="Vietnam Airlines cabin interior" className="h-72 w-full object-cover sm:h-96 lg:h-[520px]" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#023a78]/85 via-[#023a78]/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="mb-1 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#f5a623]">
                <Plane className="size-3.5" />
                Vietnam Airlines
              </div>
              <h3 className="text-xl font-bold drop-shadow sm:text-2xl">
                {lang === 'vn' ? 'Trải nghiệm đẳng cấp trên từng chuyến bay' : 'A premium experience on every flight'}
              </h3>
            </div>
          </div>

          <Accordion defaultValue={['economy']} className="w-full">
            {travelClasses.map((c) => (
              <AccordionItem key={c.id} value={c.id} className="rounded-xl border border-slate-200 bg-white px-4 shadow-sm mb-3 last:mb-0">
                <AccordionTrigger className="hover:no-underline transition-all duration-300">
                  <div className="flex flex-col items-start gap-0.5 pr-2 text-left">
                    <span className="text-base font-bold text-[#023a78]">{c.name}</span>
                    <span className="text-[11px] font-normal uppercase tracking-wide text-slate-400">{c.nameEn}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mb-3 text-sm text-slate-600">{c.desc}</p>
                  <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {c.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-[#1f6fb2]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

