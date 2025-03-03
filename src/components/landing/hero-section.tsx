
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onStartOnboarding: () => void;
}

export function HeroSection({ onStartOnboarding }: HeroSectionProps) {
  const navigate = useNavigate();
  
  const handleBrowseRecipes = () => {
    navigate("/recipes");
  };
  
  return (
    <section className="w-full py-6 md:py-12 px-4 md:px-6 bg-white">
      <div className="container mx-auto space-y-4">
        <div className="space-y-2">
          <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            Smart Meal Planning
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Simplify Your <span className="text-primary">Meal Planning</span> Journey
          </h1>
          <p className="text-base text-muted-foreground max-w-prose">
            Create personalized meal plans, generate automatic grocery lists, and discover healthy recipes tailored to your preferences.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button 
            size="lg" 
            onClick={onStartOnboarding} 
            className="w-full sm:w-auto flex items-center justify-center text-white bg-primary hover:bg-primary/90 rounded-full"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={handleBrowseRecipes} 
            className="w-full sm:w-auto rounded-full"
          >
            Browse Recipes
          </Button>
        </div>
        
        <div className="pt-4">
          <img 
            src="/placeholder.svg" 
            alt="Healthy meal planning illustration" 
            className="w-full h-auto rounded-lg object-cover shadow-md"
          />
        </div>
      </div>
    </section>
  );
}
