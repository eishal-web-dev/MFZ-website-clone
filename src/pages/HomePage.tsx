import { HeroSlider } from '@/components/HeroSlider';
import {
  CrunchLineup,
  InsideTheCrunch,
  BuildPreview,
  Bestsellers,
  LocationsPreview,
  SocialGallery,
  CrunchClub,
  FinalCTA,
} from '@/components/home/Sections';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <CrunchLineup />
      <InsideTheCrunch />
      <BuildPreview />
      <Bestsellers />
      <LocationsPreview />
      <SocialGallery />
      <CrunchClub />
      <FinalCTA />
      <Footer />
    </>
  );
}
