
import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { OnboardingSteps } from "@/components/onboarding-steps";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { PopularRecipesSection } from "@/components/landing/popular-recipes-section";
import { BenefitsSection } from "@/components/landing/benefits-section";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

const Index = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const handleStartOnboarding = () => {
    setShowOnboarding(true);
  };
  
  const handleCompleteOnboarding = () => {
    setShowOnboarding(false);
    // In a real app, we would navigate to dashboard after onboarding
    window.location.href = "/dashboard";
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {showOnboarding ? (
          <div className="container max-w-6xl py-12 px-4 md:px-6">
            <OnboardingSteps onComplete={handleCompleteOnboarding} />
          </div>
        ) : (
          <>
            <HeroSection onStartOnboarding={handleStartOnboarding} />
            <FeaturesSection />
            <PopularRecipesSection />
            <BenefitsSection onStartOnboarding={handleStartOnboarding} />
            <CTASection onStartOnboarding={handleStartOnboarding} />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
