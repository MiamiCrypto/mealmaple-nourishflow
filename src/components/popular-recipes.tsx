
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { RecipeCard } from "@/components/recipe-card";
import { useToast } from "@/hooks/use-toast";

export function PopularRecipes() {
  const { toast } = useToast();
  
  const handleAddToMealPlan = (recipeId: string) => {
    toast({
      title: "Recipe added to meal plan",
      description: "You can now see it in your weekly plan",
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Popular Recipes</h2>
        <a 
          href="/recipes" 
          className="text-sm font-medium text-primary link-underline inline-block"
        >
          View all recipes
        </a>
      </div>
      
      <ScrollArea className="pb-4">
        <div className="flex space-x-4">
          {popularRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              {...recipe}
              className="min-w-[300px]"
              onAddToMealPlan={handleAddToMealPlan}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

const popularRecipes = [
  {
    id: "1",
    title: "Mediterranean Breakfast Bowl",
    image: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    prepTime: 15,
    servings: 2,
    mealType: "breakfast" as const,
  },
  {
    id: "2",
    title: "Avocado & Egg Toast",
    image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    prepTime: 10,
    servings: 1,
    mealType: "breakfast" as const,
  },
  {
    id: "3",
    title: "Quinoa Buddha Bowl",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    prepTime: 20,
    servings: 2,
    mealType: "lunch" as const,
  },
  {
    id: "4",
    title: "Salmon with Roasted Vegetables",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    prepTime: 30,
    servings: 4,
    mealType: "dinner" as const,
  },
  {
    id: "5",
    title: "Greek Yogurt Parfait",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    prepTime: 5,
    servings: 1,
    mealType: "snack" as const,
  },
];
