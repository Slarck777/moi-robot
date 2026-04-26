import { Hero } from "@/components/marketing/Hero";
import { CarReveal } from "@/components/marketing/CarReveal";
import { ProgramsWidget } from "@/components/marketing/ProgramsWidget";
import { HowItWorks } from "@/components/marketing/HowItWorks";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CarReveal />
      <ProgramsWidget />
      <HowItWorks />
    </>
  );
}
