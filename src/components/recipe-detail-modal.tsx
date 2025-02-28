
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Users, 
  ChefHat, 
  Sparkles, 
  Info, 
  ScrollText,
  CalendarPlus 
} from "lucide-react";
import { RecipePersonalization } from "@/components/recipe-personalization";

interface RecipeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: any;
  onAddToMealPlan: (recipeId: string) => void;
}

export function RecipeDetailModal({
  isOpen,
  onClose,
  recipe,
  onAddToMealPlan,
}: RecipeDetailModalProps) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!recipe) return null;

  const handleAddToMealPlan = () => {
    onAddToMealPlan(recipe.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">{recipe.title}</DialogTitle>
          <DialogDescription>
            {recipe.description || "A delicious recipe for any occasion"}
          </DialogDescription>
        </DialogHeader>

        <div className="relative rounded-md overflow-hidden h-[200px] mt-2">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <div className="flex flex-wrap gap-2">
              {recipe.tags?.slice(0, 3).map((tag: string) => (
                <Badge key={tag} variant="secondary" className="bg-black/40 hover:bg-black/60">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-1">
              <ScrollText className="h-4 w-4" />
              <span className="hidden sm:inline">Recipe Details</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">AI Personalization</span>
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 mt-4">
            <TabsContent value="overview" className="space-y-4 min-h-[300px]">
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{recipe.prepTime} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{recipe.servings} servings</span>
                </div>
                <div className="flex items-center gap-1">
                  <ChefHat className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {recipe.difficulty?.charAt(0).toUpperCase() + recipe.difficulty?.slice(1) || "Medium"}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Ingredients</h3>
                <ul className="space-y-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-primary font-medium">•</span>
                      <span>
                        {["100g flour", "2 eggs", "50g butter", "1 tsp vanilla extract", "100g sugar", "pinch of salt"][i] || "Ingredient"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Instructions</h3>
                <ol className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Badge variant="outline" className="px-2 py-1 h-6 min-w-6 flex items-center justify-center rounded-full">
                        {i + 1}
                      </Badge>
                      <span className="flex-1">
                        {[
                          "Preheat oven to 350°F (175°C)",
                          "Mix all dry ingredients in a large bowl",
                          "Add wet ingredients and stir until just combined",
                          "Pour into prepared baking dish and bake for 25-30 minutes"
                        ][i] || "Instruction step"}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4 min-h-[300px]">
              <div>
                <h3 className="text-lg font-medium mb-2">Nutrition Facts</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted rounded-md p-3">
                    <div className="text-sm text-muted-foreground">Calories</div>
                    <div className="text-lg font-medium">320 kcal</div>
                  </div>
                  <div className="bg-muted rounded-md p-3">
                    <div className="text-sm text-muted-foreground">Protein</div>
                    <div className="text-lg font-medium">12g</div>
                  </div>
                  <div className="bg-muted rounded-md p-3">
                    <div className="text-sm text-muted-foreground">Carbs</div>
                    <div className="text-lg font-medium">42g</div>
                  </div>
                  <div className="bg-muted rounded-md p-3">
                    <div className="text-sm text-muted-foreground">Fat</div>
                    <div className="text-lg font-medium">14g</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Notes</h3>
                <p className="text-muted-foreground">
                  This recipe can be prepared ahead of time and refrigerated for up to 24 hours before baking.
                  For a gluten-free version, substitute regular flour with a gluten-free baking mix.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags?.map((tag: string) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ai" className="min-h-[300px]">
              <RecipePersonalization recipe={recipe} />
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleAddToMealPlan} className="gap-2">
            <CalendarPlus className="h-4 w-4" />
            Add to Meal Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
