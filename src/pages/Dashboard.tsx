
import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { PageTitle } from "@/components/ui/page-title";
import { QuickStats } from "@/components/quick-stats";
import { MealPlanner } from "@/components/meal-planner";
import { PopularRecipes } from "@/components/popular-recipes";
import { GroceryList } from "@/components/grocery-list";
import { useSpoonacular } from "@/hooks/use-spoonacular";
import { RecipeCard } from "@/components/recipe-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight, Clock, Loader2, Search } from "lucide-react";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [maxTime, setMaxTime] = useState(30);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
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

    const params = {
      query: searchQuery,
      maxReadyTime: maxTime,
      number: 4, // Limit to 4 results for dashboard
    };

    const results = await searchRecipes(params);
    
    if (results && results.results) {
      setSearchResults(results.results);
      setShowResults(true);
      
      if (results.results.length === 0) {
        toast({
          title: "No recipes found",
          description: "Try different search terms or filters",
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8 px-4 md:px-6">
        <div className="space-y-8 animate-fade-in">
          <PageTitle 
            title="Welcome to MealMaple" 
            description="Your personalized meal planning assistant"
          />
          
          <QuickStats />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <MealPlanner />
              
              {/* Recipe Search */}
              <div className="bg-card rounded-lg border shadow-sm p-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col space-y-1.5">
                    <h3 className="font-semibold text-lg leading-none tracking-tight">
                      Quick Recipe Search
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Find recipes based on ingredients you have or meal ideas
                    </p>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search recipes or ingredients..."
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSearch();
                            }
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="w-full md:w-52">
                      <Label>Max time: {maxTime} minutes</Label>
                      <Slider
                        value={[maxTime]}
                        onValueChange={(value) => setMaxTime(value[0])}
                        max={60}
                        step={5}
                        className="mt-2"
                      />
                    </div>
                    
                    <Button 
                      onClick={handleSearch}
                      disabled={isLoading}
                      className="whitespace-nowrap"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        "Search Recipes"
                      )}
                    </Button>
                  </div>
                  
                  {showResults && searchResults.length > 0 && (
                    <div className="mt-2 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {searchResults.slice(0, 2).map((recipe, index) => {
                          // Map Spoonacular recipe to our RecipeCard format
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
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Showing {Math.min(2, searchResults.length)} of {searchResults.length} results
                        </span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1"
                          onClick={() => window.location.href = '/recipes'}
                        >
                          View all recipes
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <PopularRecipes />
            </div>
            <div>
              <GroceryList />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
