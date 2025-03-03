
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
    <section className="w-full py-12 md:py-20 lg:py-24 px-4 md:px-6 bg-white" style={{backgroundColor: 'white'}}>
      <div className="container mx-auto max-w-6xl space-y-8" style={{maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto'}}>
        <div className="flex flex-col max-w-3xl space-y-6">
          <div 
            className="inline-block self-start bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
            style={{color: 'hsl(142, 76%, 36%)', backgroundColor: 'rgba(25, 184, 85, 0.1)', borderRadius: '9999px'}}
          >
            Smart Meal Planning
          </div>
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
              fontWeight: '700',
              lineHeight: '1.1'
            }}
          >
            Simplify Your <span className="text-primary" style={{color: 'hsl(142, 76%, 36%)'}}>Meal Planning</span> Journey
          </h1>
          <p 
            className="text-lg text-muted-foreground max-w-2xl"
            style={{
              fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
              lineHeight: '1.6',
              color: '#666'
            }}
          >
            Create personalized meal plans, generate automatic grocery lists, and discover healthy recipes tailored to your preferences.
          </p>
        
          <div className="flex flex-col sm:flex-row gap-4 pt-2" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <Button 
              size="lg" 
              onClick={onStartOnboarding} 
              className="w-full sm:w-auto font-medium !rounded-full !h-12 !px-8 !py-3 !text-base"
              style={{
                backgroundColor: 'hsl(142, 76%, 36%)',
                color: 'white',
                borderRadius: '9999px',
                padding: '0.75rem 2rem',
                fontWeight: '500',
                fontSize: '1rem',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" style={{marginLeft: '0.5rem', height: '1.25rem', width: '1.25rem'}} />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={handleBrowseRecipes} 
              className="w-full sm:w-auto font-medium !rounded-full !h-12 !px-8 !py-3 !text-base"
              style={{
                backgroundColor: 'transparent',
                color: '#333',
                borderRadius: '9999px',
                padding: '0.75rem 2rem',
                fontWeight: '500',
                fontSize: '1rem',
                border: '1px solid #ddd',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
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
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '0.5rem',
              objectFit: 'cover',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}
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
