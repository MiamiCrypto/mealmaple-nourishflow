
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
    <section className="w-full py-12 md:py-20 lg:py-24 px-4 md:px-6 bg-white">
      <div className="container mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col max-w-3xl space-y-6">
          <div className="inline-block self-start bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            Smart Meal Planning
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Simplify Your <span className="text-primary">Meal Planning</span> Journey
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Create personalized meal plans, generate automatic grocery lists, and discover healthy recipes tailored to your preferences.
          </p>
        
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button 
              size="lg" 
              onClick={onStartOnboarding} 
              className="w-full sm:w-auto font-medium !rounded-full !h-12 !px-8 !py-3 !text-base"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={handleBrowseRecipes} 
              className="w-full sm:w-auto font-medium !rounded-full !h-12 !px-8 !py-3 !text-base"
            >
              Browse Recipes
            </Button>
          </div>
        </div>
        
        <div className="pt-6 md:pt-8">
          <img 
            src="/lovable-uploads/754f4996-6374-4b3a-929c-69dcfbfc6e8e.png" 
            alt="Healthy meal bowl" 
            className="w-full h-auto rounded-lg object-cover shadow-lg"
            onError={(e) => {
              console.error("Image failed to load");
              // Fallback if image fails to load
              const target = e.target as HTMLImageElement;
              target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";
            }}
          />
        </div>
      </div>
    </section>
  );
}
