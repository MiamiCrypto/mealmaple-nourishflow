
import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { PageTitle } from "@/components/ui/page-title";
import { RecipeCard } from "@/components/recipe-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  SlidersHorizontal, 
  Clock, 
  BadgeCheck, 
  Tag,
  ChevronDown,
  Database,
  Globe
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { SpoonacularRecipeSearch } from "@/components/spoonacular-recipe-search";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Extended recipe data for the recipe page
interface RecipeData {
  id: string;
  title: string;
  image: string;
  prepTime: number;
  servings: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

const recipeData: RecipeData[] = [
  {
    id: "1",
    title: "Mediterranean Breakfast Bowl",
    image: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    prepTime: 15,
    servings: 2,
    mealType: "breakfast",
    tags: ["healthy", "vegetarian", "mediterranean"],
    difficulty: "easy",
  },
  {
    id: "2",
    title: "Avocado & Egg Toast",
    image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    prepTime: 10,
    servings: 1,
    mealType: "breakfast",
    tags: ["quick", "vegetarian", "high-protein"],
    difficulty: "easy",
  },
  {
    id: "3",
    title: "Quinoa Buddha Bowl",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    prepTime: 20,
    servings: 2,
    mealType: "lunch",
    tags: ["vegan", "gluten-free", "meal-prep"],
    difficulty: "medium",
  },
  {
    id: "4",
    title: "Salmon with Roasted Vegetables",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    prepTime: 30,
    servings: 4,
    mealType: "dinner",
    tags: ["pescatarian", "high-protein", "low-carb"],
    difficulty: "medium",
  },
  {
    id: "5",
    title: "Greek Yogurt Parfait",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    prepTime: 5,
    servings: 1,
    mealType: "snack",
    tags: ["quick", "vegetarian", "high-protein"],
    difficulty: "easy",
  },
  {
    id: "6",
    title: "Overnight Oats with Berries",
    image: "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    prepTime: 5,
    servings: 1,
    mealType: "breakfast",
    tags: ["vegan", "meal-prep", "no-cook"],
    difficulty: "easy",
  },
  {
    id: "7",
    title: "Chicken Caesar Salad",
    image: "https://images.unsplash.com/photo-1512852939750-1305098529bf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    prepTime: 20,
    servings: 2,
    mealType: "lunch",
    tags: ["high-protein", "classic", "keto"],
    difficulty: "easy",
  },
  {
    id: "8",
    title: "Vegetable Stir Fry",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    prepTime: 25,
    servings: 3,
    mealType: "dinner",
    tags: ["vegan", "quick", "asian-inspired"],
    difficulty: "medium",
  },
  {
    id: "9",
    title: "Blueberry Protein Smoothie",
    image: "https://images.unsplash.com/photo-1600718374662-0483d2b9da44?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    prepTime: 5,
    servings: 1,
    mealType: "snack",
    tags: ["vegetarian", "high-protein", "no-cook"],
    difficulty: "easy",
  },
  {
    id: "10",
    title: "Honey Garlic Salmon",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    prepTime: 25,
    servings: 2,
    mealType: "dinner",
    tags: ["pescatarian", "gluten-free", "low-carb"],
    difficulty: "medium",
  },
  {
    id: "11",
    title: "Turkey and Avocado Wrap",
    image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    prepTime: 10,
    servings: 1,
    mealType: "lunch",
    tags: ["quick", "high-protein", "meal-prep"],
    difficulty: "easy",
  },
  {
    id: "12",
    title: "Mushroom Risotto",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    prepTime: 40,
    servings: 4,
    mealType: "dinner",
    tags: ["vegetarian", "italian", "comfort-food"],
    difficulty: "hard",
  },
];

const Recipes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<number | null>(null);
  const { toast } = useToast();

  const handleAddToMealPlan = (recipeId: string) => {
    toast({
      title: "Recipe added to meal plan",
      description: "You can now see it in your weekly plan",
    });
  };

  const handleClearFilters = () => {
    setSelectedMealType(null);
    setSelectedDifficulty(null);
    setSelectedTimeFilter(null);
  };

  let filteredRecipes = recipeData;

  // Filter by search term
  if (searchTerm) {
    filteredRecipes = filteredRecipes.filter(recipe => 
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }

  // Filter by meal type
  if (selectedMealType) {
    filteredRecipes = filteredRecipes.filter(recipe => 
      recipe.mealType === selectedMealType
    );
  }

  // Filter by difficulty
  if (selectedDifficulty) {
    filteredRecipes = filteredRecipes.filter(recipe => 
      recipe.difficulty === selectedDifficulty
    );
  }

  // Filter by prep time
  if (selectedTimeFilter) {
    filteredRecipes = filteredRecipes.filter(recipe => 
      recipe.prepTime <= selectedTimeFilter
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8 px-4 md:px-6">
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <PageTitle 
              title="Recipe Collection" 
              description="Browse our curated collection of healthy recipes"
            />
          </div>
          
          <Tabs defaultValue="local" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="local" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Local Recipes
              </TabsTrigger>
              <TabsTrigger value="spoonacular" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Search Online
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="local" className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search recipes or ingredients..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2 flex-wrap md:flex-nowrap">
                  {/* Meal Type Filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-1">
                        <Tag className="h-4 w-4" />
                        <span className="hidden sm:inline">Meal Type</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Meal Type</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => setSelectedMealType("breakfast")}>
                          <span className="meal-badge meal-badge-breakfast mr-2">B</span>
                          Breakfast
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedMealType("lunch")}>
                          <span className="meal-badge meal-badge-lunch mr-2">L</span>
                          Lunch
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedMealType("dinner")}>
                          <span className="meal-badge meal-badge-dinner mr-2">D</span>
                          Dinner
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedMealType("snack")}>
                          <span className="meal-badge meal-badge-snack mr-2">S</span>
                          Snack
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  {/* Time Filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-1">
                        <Clock className="h-4 w-4" />
                        <span className="hidden sm:inline">Time</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Preparation Time</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => setSelectedTimeFilter(15)}>
                          Under 15 minutes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedTimeFilter(30)}>
                          Under 30 minutes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedTimeFilter(45)}>
                          Under 45 minutes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedTimeFilter(60)}>
                          Under 60 minutes
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  {/* Difficulty Filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-1">
                        <BadgeCheck className="h-4 w-4" />
                        <span className="hidden sm:inline">Difficulty</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Difficulty Level</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => setSelectedDifficulty("easy")}>
                          Easy
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedDifficulty("medium")}>
                          Medium
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedDifficulty("hard")}>
                          Hard
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  {/* More Filters */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-1">
                        <SlidersHorizontal className="h-4 w-4" />
                        <span className="hidden sm:inline">More Filters</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Dietary Preferences</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>Vegetarian</DropdownMenuItem>
                        <DropdownMenuItem>Vegan</DropdownMenuItem>
                        <DropdownMenuItem>Gluten-Free</DropdownMenuItem>
                        <DropdownMenuItem>Low-Carb</DropdownMenuItem>
                        <DropdownMenuItem>High-Protein</DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  {/* Clear Filters */}
                  <Button variant="ghost" onClick={handleClearFilters}>
                    Clear Filters
                  </Button>
                </div>
              </div>
              
              {/* Filter Pills */}
              {(selectedMealType || selectedDifficulty || selectedTimeFilter) && (
                <div className="flex flex-wrap gap-2">
                  {selectedMealType && (
                    <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      <span>Meal: {selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1)}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 ml-1 hover:bg-transparent" 
                        onClick={() => setSelectedMealType(null)}
                      >
                        ×
                      </Button>
                    </div>
                  )}
                  {selectedDifficulty && (
                    <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      <span>Difficulty: {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 ml-1 hover:bg-transparent" 
                        onClick={() => setSelectedDifficulty(null)}
                      >
                        ×
                      </Button>
                    </div>
                  )}
                  {selectedTimeFilter && (
                    <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      <span>Time: Under {selectedTimeFilter} minutes</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 ml-1 hover:bg-transparent" 
                        onClick={() => setSelectedTimeFilter(null)}
                      >
                        ×
                      </Button>
                    </div>
                  )}
                </div>
              )}
              
              {/* Recipe Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredRecipes.map((recipe, index) => (
                  <RecipeCard
                    key={recipe.id}
                    {...recipe}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                    onAddToMealPlan={handleAddToMealPlan}
                  />
                ))}
                
                {filteredRecipes.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <h3 className="text-lg font-medium mb-2">No recipes found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your filters or search terms
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="spoonacular">
              <SpoonacularRecipeSearch />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Recipes;
