
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
    <section className="w-full py-12 md:py-16 px-4 md:px-6 bg-white">
      <div className="container mx-auto space-y-6">
        <div className="space-y-4">
          <div className="inline-block bg-green-100 text-green-600 px-6 py-2 rounded-full text-base font-medium">
            Smart Meal Planning
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Simplify Your <span className="text-green-600">Meal<br className="hidden sm:block"/> Planning</span> Journey
          </h1>
          <p className="text-gray-600 text-xl max-w-prose">
            Create personalized meal plans, generate automatic grocery lists, and discover healthy recipes tailored to your preferences.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button 
            size="lg" 
            onClick={onStartOnboarding} 
            className="w-full sm:w-auto flex items-center justify-center text-white bg-green-600 hover:bg-green-700 rounded-full py-6 px-8 text-lg"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={handleBrowseRecipes} 
            className="w-full sm:w-auto rounded-full py-6 px-8 text-lg border-gray-300"
          >
            Browse Recipes
          </Button>
        </div>
        
        <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-64 md:h-80">
            <img 
              src="https://images.unsplash.com/photo-1543352634-99a5d50ae78e?w=800&auto=format&fit=crop&q=80" 
              alt="Meal preparation with fresh ingredients" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-[48%]">
              <img 
                src="https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=500&auto=format&fit=crop&q=80" 
                alt="Organized meal prep containers" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-[48%]">
              <img 
                src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop&q=80" 
                alt="Fresh vegetables for cooking" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
