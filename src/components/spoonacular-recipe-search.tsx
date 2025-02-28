
import { useState } from "react";
import { useSpoonacular } from "@/hooks/use-spoonacular";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { RecipeCard } from "@/components/recipe-card";
import { useToast } from "@/hooks/use-toast";

export function SpoonacularRecipeSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [diet, setDiet] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [mealType, setMealType] = useState("");
  const [maxReadyTime, setMaxReadyTime] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const { searchRecipes, isLoading } = useSpoonacular();
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search query required",
        description: "Please enter a search term",
        variant: "destructive",
      });
      return;
    }

    const params: any = {
      query: searchQuery,
      number: 8, // Number of results to return
    };

    if (diet) params.diet = diet;
    if (cuisine) params.cuisine = cuisine;
    if (mealType) params.type = mealType;
    if (maxReadyTime) params.maxReadyTime = parseInt(maxReadyTime);

    const results = await searchRecipes(params);
    
    if (results && results.results) {
      setSearchResults(results.results);
      
      if (results.results.length === 0) {
        toast({
          title: "No recipes found",
          description: "Try different search terms or filters",
        });
      } else {
        toast({
          title: "Recipes found",
          description: `Found ${results.results.length} recipes matching your criteria`,
        });
      }
    }
  };

  const handleAddToMealPlan = (recipeId: string) => {
    toast({
      title: "Recipe added to meal plan",
      description: "You can now see it in your weekly plan",
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Search Recipes</h2>
        <p className="text-muted-foreground">
          Search for recipes from Spoonacular's extensive database
        </p>
        
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <Input
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Select value={diet} onValueChange={setDiet}>
              <SelectTrigger>
                <SelectValue placeholder="Diet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Any Diet</SelectItem>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="gluten-free">Gluten Free</SelectItem>
                <SelectItem value="ketogenic">Ketogenic</SelectItem>
                <SelectItem value="paleo">Paleo</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={cuisine} onValueChange={setCuisine}>
              <SelectTrigger>
                <SelectValue placeholder="Cuisine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Any Cuisine</SelectItem>
                <SelectItem value="italian">Italian</SelectItem>
                <SelectItem value="mexican">Mexican</SelectItem>
                <SelectItem value="asian">Asian</SelectItem>
                <SelectItem value="mediterranean">Mediterranean</SelectItem>
                <SelectItem value="american">American</SelectItem>
                <SelectItem value="indian">Indian</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={mealType} onValueChange={setMealType}>
              <SelectTrigger>
                <SelectValue placeholder="Meal Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Any Type</SelectItem>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="main course">Lunch/Dinner</SelectItem>
                <SelectItem value="appetizer">Appetizer</SelectItem>
                <SelectItem value="salad">Salad</SelectItem>
                <SelectItem value="soup">Soup</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
                <SelectItem value="dessert">Dessert</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={maxReadyTime} onValueChange={setMaxReadyTime}>
              <SelectTrigger>
                <SelectValue placeholder="Max Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Any Time</SelectItem>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button
            onClick={handleSearch}
            disabled={isLoading}
            className="md:w-auto w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              "Search"
            )}
          </Button>
        </div>
      </div>
      
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Search Results</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchResults.map((recipe, index) => {
              // Map Spoonacular recipe to our RecipeCard format
              // Here we need to map the mealType - convert Spoonacular dishTypes to our meal types
              let mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' = 'dinner';
              if (recipe.dishTypes && recipe.dishTypes.length > 0) {
                if (recipe.dishTypes.includes('breakfast')) mealType = 'breakfast';
                else if (recipe.dishTypes.includes('lunch')) mealType = 'lunch';
                else if (recipe.dishTypes.includes('snack') || recipe.dishTypes.includes('appetizer')) mealType = 'snack';
              }
              
              return (
                <RecipeCard
                  key={recipe.id}
                  id={recipe.id.toString()}
                  title={recipe.title}
                  image={recipe.image}
                  prepTime={recipe.readyInMinutes}
                  servings={recipe.servings}
                  mealType={mealType}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onAddToMealPlan={handleAddToMealPlan}
                />
              );
            })}
          </div>
        </div>
      )}
      
      {/* Attribution for Spoonacular API as required */}
      <div className="text-center text-xs text-muted-foreground mt-8 pt-4 border-t">
        Recipe data provided by <a href="https://spoonacular.com/food-api" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Spoonacular Food API</a>
      </div>
    </div>
  );
}
