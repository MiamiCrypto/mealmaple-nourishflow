
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useOpenAI } from "@/hooks/use-openai";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, RefreshCw, ChefHat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface RecipePersonalizationProps {
  recipe: any;
  onSave?: (personalized: any) => void;
}

export function RecipePersonalization({ recipe, onSave }: RecipePersonalizationProps) {
  const [personalizedRecipe, setPersonalizedRecipe] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState<string>("ingredients");
  const { personalizeRecipe, isLoading, error } = useOpenAI();

  const handlePersonalize = async () => {
    // Example preferences - in a real app these might come from user profile
    const preferences = {
      dietaryPreferences: ["vegetarian"],
      healthConditions: ["low-sodium"],
      skillLevel: "beginner"
    };

    const result = await personalizeRecipe(recipe, preferences);
    if (result) {
      setPersonalizedRecipe(result);
    }
  };

  const handleSave = () => {
    if (onSave && personalizedRecipe) {
      onSave(personalizedRecipe);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChefHat className="h-5 w-5 text-primary" />
          Recipe Personalization
        </CardTitle>
        <CardDescription>
          Customize this recipe to match your dietary needs and cooking skill
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {!personalizedRecipe && !isLoading && (
          <div className="flex flex-col items-center justify-center py-6">
            <p className="mb-4 text-center text-muted-foreground">
              Click the button below to personalize this recipe with AI
            </p>
            <Button onClick={handlePersonalize} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Personalize Recipe
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Personalizing your recipe...</p>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 p-4 rounded-md text-destructive">
            <p>Error: {error}</p>
          </div>
        )}

        {personalizedRecipe && (
          <div className="space-y-4 animate-fade-in">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                <TabsTrigger value="instructions">Instructions</TabsTrigger>
              </TabsList>

              <TabsContent value="ingredients" className="space-y-4 pt-4">
                <div>
                  <h4 className="font-medium mb-2">Personalized Ingredients</h4>
                  <ul className="space-y-2">
                    {personalizedRecipe.adjustedIngredients?.map((ingredient: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary font-medium">•</span>
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Nutritional Notes</h4>
                  <p className="text-muted-foreground">{personalizedRecipe.nutritionalNotes}</p>
                </div>
              </TabsContent>

              <TabsContent value="instructions" className="space-y-4 pt-4">
                <div>
                  <h4 className="font-medium mb-2">Personalized Instructions</h4>
                  <ol className="space-y-3">
                    {personalizedRecipe.adjustedInstructions?.map((instruction: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <Badge variant="outline" className="px-2 py-1 h-6 min-w-6 flex items-center justify-center rounded-full">
                          {index + 1}
                        </Badge>
                        <span className="flex-1">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Why These Changes</h4>
                  <p className="text-muted-foreground">{personalizedRecipe.explanation}</p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end pt-2">
              <Button onClick={handleSave} variant="secondary" className="gap-2">
                Save Personalized Recipe
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
