import Hero from "@/sections/home/Hero";
import ScrollStory from "@/sections/home/ScrollStory";
import FeaturedWork from "@/sections/home/FeaturedWork";
import CaseStudyPreview from "@/sections/home/CaseStudyPreview";
import Skills from "@/sections/home/Skills";
import ExperienceTimeline from "@/sections/home/ExperienceTimeline";
import HomeSlider from "@/sections/home/HomeSlider";
import ContactCTA from "@/sections/home/ContactCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ScrollStory />
      <FeaturedWork />
      <CaseStudyPreview />
      <Skills />
      <ExperienceTimeline />
      <HomeSlider />
      <ContactCTA />
    </>
  );
}
