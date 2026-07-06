import { HeroSearch } from '@/components/home/HeroSearch';
import { OffersCarousel } from '@/components/home/OffersCarousel';
import { Destinations } from '@/components/home/Destinations';
import { SpecialOffers } from '@/components/home/SpecialOffers';
import { LotusmilesSection } from '@/components/home/LotusmilesSection';
import { TravelClasses } from '@/components/home/TravelClasses';
import { Services } from '@/components/home/Services';
import { NewsSection } from '@/components/home/NewsSection';

export default function HomePage() {
  return (
    <>
      <HeroSearch />
      <OffersCarousel />
      <Destinations />
      <SpecialOffers />
      <LotusmilesSection />
      <TravelClasses />
      <Services />
      <NewsSection />
    </>
  );
}
