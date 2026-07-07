
import { ArrowRight, CalendarDays, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui';
import { news } from '@/data/vna-data';
import { useT } from '@/store/langStore';
import { toast } from 'sonner';

export function NewsSection() {
  const t = useT();

  return (
    <section id="news" className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 text-[#1f6fb2]">
              <Newspaper className="size-5" />
              <span className="text-xs font-bold uppercase tracking-wide">Vietnam Airlines · Newsroom</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-[#023a78] sm:text-3xl">{t.sections.news}</h2>
            <p className="mt-1 text-sm text-slate-500">{t.sections.newsSub}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {news.map((n) => (
            <article key={n.id} className="group flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-[#1f6fb2]/40 hover:shadow-md sm:flex-row">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-[#eaf3fb] text-[#023a78]">
                <Newspaper className="size-5" />
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-1.5 text-[11px] text-slate-400">
                  <CalendarDays className="size-3" />
                  {n.date}
                </div>
                <h3 className="line-clamp-2 text-base font-bold text-[#023a78] group-hover:text-[#1f6fb2] transition-all duration-300">{n.title}</h3>
                <p className="mt-1.5 line-clamp-3 text-sm text-slate-600">{n.excerpt}</p>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="flex items-center gap-2 mt-2 h-auto p-0 text-[#1f6fb2] hover:text-[#023a78] rounded-lg transition-all duration-300"
                  onClick={() => toast.success(t.common.readMore, { description: n.title })}
                >
                  {t.common.readMore}
                  <ArrowRight className="size-3.5" />
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

