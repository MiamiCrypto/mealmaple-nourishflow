
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecipeCard } from "@/components/recipe-card";

export function PopularRecipesSection() {
  return (
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
  );
}

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
    title: "Berry Protein Smoothie",
    image: "https://images.unsplash.com/photo-1553530666-ba11a90a0868?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    prepTime: 10,
    servings: 1,
    mealType: "breakfast" as const,
  },
];
