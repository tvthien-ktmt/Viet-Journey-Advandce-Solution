import * as React from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui';
import { slides } from '@/data/vna-data';
import { cn } from '@/lib/utils';

const AUTOPLAY_MS = 5000;

export function OffersCarousel() {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on('select', onSelect);
    api.on('reInit', onSelect);
    return () => { api.off('select', onSelect); };
  }, [api]);

  React.useEffect(() => {
    if (!api || paused || count <= 1) return;
    const id = setInterval(() => {
      const next = (api.selectedScrollSnap() + 1) % count;
      api.scrollTo(next);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [api, paused, count]);

  return (
    <section
      id="offers"
      className="bg-white py-12 sm:py-16"
      aria-label="Offers carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative">
          <Carousel setApi={setApi} opts={{ loop: true, align: 'start' }} className="w-full">
            <CarouselContent>
              {slides.map((s) => (
                <CarouselItem key={s.id}>
                  <div className="relative h-[320px] overflow-hidden rounded-2xl sm:h-[420px] lg:h-[480px]">
                    <img src={s.image} alt={s.title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#023a78]/90 via-[#023a78]/55 to-transparent" />
                    <div className="relative flex h-full flex-col justify-end p-6 sm:p-10 lg:max-w-2xl">
                      <h2 className="mb-2 text-2xl font-extrabold text-white drop-shadow-md sm:text-4xl">{s.title}</h2>
                      <p className="mb-5 text-sm text-white/85 sm:text-base">{s.text}</p>
                      <div>
                        <button type="button" className={cn("flex items-center gap-2", buttonVariants(), "bg-[#f5a623] text-[#023a78] hover:bg-vna-gold")} onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}>
                          {s.cta}
                          <ArrowRight className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: count }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => api?.scrollTo(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={cn(
                    'h-2 rounded-full transition-all',
                    i === current ? 'w-6 bg-[#f5a623]' : 'w-2 bg-[#1f6fb2]/30 hover:bg-[#1f6fb2]/60',
                  )}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="icon" className="flex items-center gap-2 size-9 border-[#023a78]/30 text-[#023a78] rounded-lg" onClick={() => api?.scrollPrev()} aria-label="Previous">
                <ChevronLeft className="size-4" />
              </Button>
              <Button type="button" variant="outline" size="icon" className="flex items-center gap-2 size-9 border-[#023a78]/30 text-[#023a78] rounded-lg" onClick={() => api?.scrollNext()} aria-label="Next">
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

