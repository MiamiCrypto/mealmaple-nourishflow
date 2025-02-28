
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  onStartOnboarding: () => void;
}

export function CTASection({ onStartOnboarding }: CTASectionProps) {
  return (
    <section className="py-20 px-4 md:px-6 bg-primary text-primary-foreground">
      <div className="container max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold">Ready to Simplify Your Meal Planning?</h2>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          Join thousands of users who have transformed their eating habits with our intuitive meal planning platform.
        </p>
        <Button 
          size="lg" 
          variant="secondary" 
          className="text-primary"
          onClick={onStartOnboarding}
        >
          Get Started for Free
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
