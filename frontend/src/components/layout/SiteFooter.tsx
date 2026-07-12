import * as React from 'react';
import { Award, Phone } from 'lucide-react';
import { useT } from '@/store/langStore';
import { LotusLogo } from '@/components/common/LotusLogo';

export function SiteFooter() {
  const _t = useT();

  return (
    <footer className="bg-[#023a78] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <LotusLogo size={48} />
              <div className="text-sm font-bold tracking-[0.15em] uppercase">Vietnam Airlines</div>
            </div>
            <p className="mb-6 text-sm text-white/80">{_t.footer.about}</p>
            <div className="flex items-center gap-4">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-[#023a78] transition-colors hover:bg-[#023a78] hover:text-white">
                <span className="sr-only">Facebook</span>FB
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-[#023a78] transition-colors hover:bg-[#023a78] hover:text-white">
                <span className="sr-only">Instagram</span>IG
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-[#023a78] transition-colors hover:bg-[#023a78] hover:text-white">
                <span className="sr-only">Youtube</span>YT
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase">{_t.footer.about}</h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li><a href="#" className="hover:text-white transition-all duration-300">{_t.footer.aboutLinks.intro}</a></li>
              <li><a href="#" className="hover:text-white transition-all duration-300">{_t.footer.aboutLinks.team}</a></li>
              <li><a href="#" className="hover:text-white transition-all duration-300">{_t.footer.aboutLinks.routes}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase">{_t.footer.services}</h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li><a href="#" className="hover:text-white transition-all duration-300">{_t.footer.serviceLinks.book}</a></li>
              <li><a href="#" className="hover:text-white transition-all duration-300">{_t.footer.serviceLinks.manage}</a></li>
              <li><a href="#" className="hover:text-white transition-all duration-300">{_t.footer.serviceLinks.checkin}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase">{_t.footer.support}</h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li><a href="#" className="hover:text-white transition-all duration-300">{_t.footer.supportLinks.faq}</a></li>
              <li><a href="#" className="hover:text-white transition-all duration-300">{_t.footer.supportLinks.guide}</a></li>
              <li><a href="#" className="hover:text-white flex items-center gap-1 transition-all duration-300"><Phone className="size-3" /> {_t.footer.supportLinks.complaint}</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#022f60]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-4 text-xs text-white/70 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <Award className="size-4 text-[#f5a623]" />
            <span>{_t.footer.certify}</span>
          </div>
          <div className="text-center sm:text-right">
            {_t.footer.copyright}
          </div>
        </div>
      </div>
    </footer>
  );
}
