
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BenefitsSectionProps {
  onStartOnboarding: () => void;
}

export function BenefitsSection({ onStartOnboarding }: BenefitsSectionProps) {
  return (
    <section className="py-16 px-4 md:px-6">
      <div className="container max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 relative h-[400px]">
            <div className="absolute top-0 left-[10%] w-[80%] h-[70%] rounded-lg overflow-hidden shadow-xl hover-scale card-shadow">
              <img 
                src="https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                alt="Meal planning" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-[10%] w-[60%] h-[50%] rounded-lg overflow-hidden shadow-xl hover-scale card-shadow">
              <img 
                src="https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                alt="Grocery shopping" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="order-1 md:order-2 space-y-6 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold">Save Time and Eat Better</h2>
            <p className="text-lg text-muted-foreground">
              MealMaple helps you take control of your nutrition with minimal effort. No more last-minute grocery runs or wondering what to cook.
            </p>
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <Button size="lg" onClick={onStartOnboarding}>
              Start Your Journey
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

const benefits = [
  "Reduce food waste by planning exactly what you need",
  "Save money by shopping with purpose",
  "Eat healthier with balanced, nutritionist-approved meals",
  "Save up to 5 hours per week on meal planning and grocery shopping",
  "Reduce stress with a clear plan for every meal",
];
