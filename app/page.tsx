import { Hero } from "@/components/marketing/Hero";
import { NewClientOffer } from "@/components/marketing/NewClientOffer";
import { Programs } from "@/components/marketing/Programs";
import { B2BBanner } from "@/components/marketing/B2BBanner";
import { HowItWorks } from "@/components/marketing/HowItWorks";

export default function HomePage() {
  return (
    <>
      <Hero />
      <NewClientOffer />
      <Programs />
      <B2BBanner />
      <HowItWorks />
    </>
  );
}
