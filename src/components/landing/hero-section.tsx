
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
    <section className="w-full py-12 md:py-20 px-4 md:px-6 bg-gradient-to-b from-background to-secondary/20">
      <div className="container max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className="space-y-4 md:space-y-6 animate-fade-in">
          <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            Smart Meal Planning
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Simplify Your <span className="text-primary">Meal Planning</span> Journey
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Create personalized meal plans, generate automatic grocery lists, and discover healthy recipes tailored to your preferences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button size="lg" onClick={onStartOnboarding} className="w-full sm:w-auto flex items-center justify-center">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={handleBrowseRecipes} className="w-full sm:w-auto">
              Browse Recipes
            </Button>
          </div>
        </div>
        <div className="relative h-[300px] md:h-[400px] animate-scale-in hidden md:block">
          <div className="absolute top-[10%] right-[5%] shadow-xl rounded-lg overflow-hidden w-[65%] hover-scale card-shadow">
            <img 
              src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
              alt="Healthy meal" 
              className="w-full h-64 object-cover"
            />
          </div>
          <div className="absolute bottom-[15%] left-[10%] shadow-xl rounded-lg overflow-hidden w-[60%] hover-scale card-shadow">
            <img 
              src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
              alt="Healthy meal" 
              className="w-full h-56 object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
