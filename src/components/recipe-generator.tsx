
import { useState } from "react";
import { useOpenAI } from "@/hooks/use-openai";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, ChefHat, Trash2, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { TokenUsageDisplay } from "@/components/token-usage-display";
import { ErrorDisplay } from "@/components/error-display";

// Define proper types for the recipe data
interface RecipeIngredient {
  ingredient: string;
  quantity: string;
}

interface GeneratedRecipe {
  title: string;
  description: string;
  ingredients: RecipeIngredient[] | string[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  nutritionalNotes?: string;
}

export function RecipeGenerator() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [preferences, setPreferences] = useState({
    dietaryPreferences: [] as string[],
    mealType: "dinner",
    cookingTime: 30
  });
  const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null);
  const { createRecipeFromIngredients, isLoading, error, tokenUsage } = useOpenAI();

  const handleAddIngredient = () => {
    if (inputValue.trim() && !ingredients.includes(inputValue.trim())) {
      setIngredients(prev => [...prev, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setIngredients(prev => prev.filter(i => i !== ingredient));
  };

  const handleGenerateRecipe = async () => {
    if (ingredients.length < 1) {
      alert("Please add at least 1 ingredient");
      return;
    }

    try {
      console.log("Generating recipe with ingredients:", ingredients, "and preferences:", preferences);
      const result = await createRecipeFromIngredients(ingredients, preferences);
      if (result) {
        console.log("Recipe generated successfully:", result);
        setGeneratedRecipe(result);
      }
    } catch (err) {
      console.error("Failed to generate recipe:", err);
    }
  };

  const handleReset = () => {
    setGeneratedRecipe(null);
  };

  // Helper function to render ingredients correctly based on their data structure
  const renderIngredient = (ingredient: string | RecipeIngredient, index: number) => {
    if (typeof ingredient === 'string') {
      return (
        <li key={index} className="flex items-start gap-2">
          <span className="text-primary font-medium">•</span>
          <span>{ingredient}</span>
        </li>
      );
    } else {
      return (
        <li key={index} className="flex items-start gap-2">
          <span className="text-primary font-medium">•</span>
          <span>{ingredient.quantity} {ingredient.ingredient}</span>
        </li>
      );
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChefHat className="h-5 w-5 text-primary" />
          AI Recipe Generator
        </CardTitle>
        {tokenUsage && <TokenUsageDisplay {...tokenUsage} />}
      </CardHeader>

      <CardContent className="space-y-6">
        {!generatedRecipe && (
          <>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-3">What ingredients do you have?</h3>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Add an ingredient..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                  />
                  <Button onClick={handleAddIngredient} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {ingredients.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {ingredients.map((ingredient) => (
                    <Badge key={ingredient} variant="secondary" className="gap-1 px-2 py-1">
                      {ingredient}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 hover:bg-transparent text-muted-foreground"
                        onClick={() => handleRemoveIngredient(ingredient)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <Label className="text-sm font-medium mb-1 block">Meal Type</Label>
                  <Select 
                    value={preferences.mealType} 
                    onValueChange={(value) => setPreferences({...preferences, mealType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select meal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="dessert">Dessert</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-sm font-medium mb-1 block">Dietary Preference</Label>
                  <Select 
                    value={preferences.dietaryPreferences[0] || "none"} 
                    onValueChange={(value) => setPreferences({...preferences, dietaryPreferences: value !== "none" ? [value] : []})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No specific preference</SelectItem>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="gluten-free">Gluten-Free</SelectItem>
                      <SelectItem value="low-carb">Low Carb</SelectItem>
                      <SelectItem value="keto">Keto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-sm font-medium mb-1 block">Max Cooking Time</Label>
                  <Select 
                    value={preferences.cookingTime.toString()} 
                    onValueChange={(value) => setPreferences({...preferences, cookingTime: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Cooking time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90+ minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button
              onClick={handleGenerateRecipe}
              className="w-full mt-6"
              disabled={ingredients.length < 1 || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Recipe...
                </>
              ) : (
                "Generate Recipe"
              )}
            </Button>
          </>
        )}

        {isLoading && !generatedRecipe && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Creating a delicious recipe with your ingredients...</p>
          </div>
        )}

        <ErrorDisplay error={error} />

        {generatedRecipe && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold">{generatedRecipe.title}</h2>
              <p className="text-muted-foreground mt-2">{generatedRecipe.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Ingredients</h3>
                <ul className="space-y-2">
                  {Array.isArray(generatedRecipe.ingredients) && generatedRecipe.ingredients.map((ingredient, index) => 
                    renderIngredient(ingredient, index)
                  )}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Instructions</h3>
                <ol className="space-y-3">
                  {generatedRecipe.instructions?.map((step: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <Badge variant="outline" className="px-2 py-1 h-6 min-w-6 flex items-center justify-center rounded-full">
                        {index + 1}
                      </Badge>
                      <span className="flex-1">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              <div>
                <span className="text-sm font-medium">Prep Time:</span>
                <span className="ml-2">{generatedRecipe.prepTime}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Cook Time:</span>
                <span className="ml-2">{generatedRecipe.cookTime}</span>
              </div>
              {generatedRecipe.nutritionalNotes && (
                <div className="w-full mt-2">
                  <span className="text-sm font-medium">Nutritional Notes:</span>
                  <p className="text-muted-foreground mt-1">{generatedRecipe.nutritionalNotes}</p>
                </div>
              )}
            </div>

            <Button onClick={handleReset} variant="outline" className="mt-4">
              Create Another Recipe
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
