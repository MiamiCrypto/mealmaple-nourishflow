
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
    image: "https://images.unsplash.com/photo-1622597768237-a57eb7ed9b69?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    prepTime: 10,
    servings: 1,
    mealType: "breakfast" as const,
  },
  {
    id: "5",
    title: "Avocado Toast with Poached Eggs",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    prepTime: 15,
    servings: 2,
    mealType: "breakfast" as const,
  },
];
