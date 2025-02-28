
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { OnboardingSteps } from "@/components/onboarding-steps";
import { RecipeCard } from "@/components/recipe-card";
import { 
  Calendar, 
  ShoppingBag, 
  Utensils, 
  Clock, 
  ArrowRight, 
  CheckCircle 
} from "lucide-react";

const Index = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const navigate = useNavigate();
  
  const handleStartOnboarding = () => {
    setShowOnboarding(true);
  };
  
  const handleCompleteOnboarding = () => {
    setShowOnboarding(false);
    // In a real app, we would navigate to dashboard after onboarding
    window.location.href = "/dashboard";
  };

  const handleBrowseRecipes = () => {
    navigate("/recipes");
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
            {/* Hero Section */}
            <section className="py-20 px-4 md:px-6 bg-gradient-to-b from-background to-secondary/20">
              <div className="container max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 animate-fade-in">
                  <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    Smart Meal Planning
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                    Simplify Your <span className="text-primary">Meal Planning</span> Journey
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Create personalized meal plans, generate automatic grocery lists, and discover healthy recipes tailored to your preferences.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" onClick={handleStartOnboarding}>
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button size="lg" variant="outline" onClick={handleBrowseRecipes}>
                      Browse Recipes
                    </Button>
                  </div>
                </div>
                <div className="relative h-[350px] md:h-[450px] animate-scale-in">
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
            
            {/* Features Section */}
            <section className="py-16 px-4 md:px-6">
              <div className="container max-w-6xl mx-auto">
                <div className="text-center mb-12 space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Our intuitive platform makes meal planning and preparation effortless
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {features.map((feature, index) => (
                    <div 
                      key={index} 
                      className="bg-card border rounded-lg p-6 hover-scale card-shadow"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            
            {/* Popular Recipes Section */}
            <section className="py-16 px-4 md:px-6 bg-secondary/20">
              <div className="container max-w-6xl mx-auto">
                <div className="text-center mb-12 space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold">Popular Recipes</h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Discover delicious and nutritious recipes loved by our community
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {popularRecipes.map((recipe, index) => (
                    <RecipeCard
                      key={recipe.id}
                      {...recipe}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    />
                  ))}
                </div>
                
                <div className="text-center mt-10">
                  <Button size="lg" asChild>
                    <Link to="/recipes">
                      View All Recipes
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </section>
            
            {/* Benefits Section */}
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
                    <Button size="lg" onClick={handleStartOnboarding}>
                      Start Your Journey
                    </Button>
                  </div>
                </div>
              </div>
            </section>
            
            {/* CTA Section */}
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
                  onClick={handleStartOnboarding}
                >
                  Get Started for Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </section>
          </>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-secondary py-8 px-4 md:px-6 border-t">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">
                <span className="text-primary">Meal</span>Maple
              </h3>
              <p className="text-muted-foreground">
                Smart meal planning for a healthier lifestyle.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/recipes" className="text-muted-foreground hover:text-foreground transition-colors">
                    Recipes
                  </Link>
                </li>
                <li>
                  <Link to="/meal-plan" className="text-muted-foreground hover:text-foreground transition-colors">
                    Meal Plan
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <address className="not-italic text-muted-foreground">
                <p>contact@mealmaple.com</p>
                <p>1234 Healthy Street</p>
                <p>San Francisco, CA 94110</p>
              </address>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} MealMaple. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    title: "Create Meal Plans",
    description: "Plan your weekly meals with a simple drag-and-drop interface. Customize for dietary preferences and schedule.",
    icon: <Calendar className="h-6 w-6" />,
  },
  {
    title: "Generate Grocery Lists",
    description: "Automatically create shopping lists based on your meal plan. Never forget an ingredient again.",
    icon: <ShoppingBag className="h-6 w-6" />,
  },
  {
    title: "Discover Recipes",
    description: "Browse our collection of healthy recipes filtered by dietary preferences, prep time, and more.",
    icon: <Utensils className="h-6 w-6" />,
  },
];

const benefits = [
  "Reduce food waste by planning exactly what you need",
  "Save money by shopping with purpose",
  "Eat healthier with balanced, nutritionist-approved meals",
  "Save up to 5 hours per week on meal planning and grocery shopping",
  "Reduce stress with a clear plan for every meal",
];

const popularRecipes = [
  {
    id: "1",
    title: "Garlic Butter Shrimp Pasta",
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    prepTime: 20,
    servings: 3,
    mealType: "dinner" as const,
  },
  {
    id: "2",
    title: "Colorful Buddha Bowl",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    prepTime: 25,
    servings: 2,
    mealType: "lunch" as const,
  },
  {
    id: "3",
    title: "Honey Glazed Salmon",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    prepTime: 30,
    servings: 4,
    mealType: "dinner" as const,
  },
  {
    id: "4",
    title: "Berry Protein Smoothie Bowl",
    image: "https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    prepTime: 10,
    servings: 1,
    mealType: "breakfast" as const,
  },
];

export default Index;
