
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useOpenAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const callOpenAIFunction = async (action: string, data: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        'openai',
        {
          body: { action, data },
        }
      );

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (functionData.error) {
        throw new Error(functionData.error);
      }

      return functionData;
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred with the AI service';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const personalizeRecipe = async (recipe: any, preferences: any = {}) => {
    return callOpenAIFunction('personalizeRecipe', {
      recipe,
      ...preferences
    });
  };

  const generateMealPlanIdeas = async (preferences: any, existingMeals: any[] = [], duration: number = 7) => {
    return callOpenAIFunction('generateMealPlanIdeas', {
      preferences,
      existingMeals,
      duration
    });
  };

  const generateRecipeDescription = async (recipe: any) => {
    return callOpenAIFunction('generateRecipeDescription', { recipe });
  };

  const createRecipeFromIngredients = async (ingredients: string[], preferences: any = {}) => {
    return callOpenAIFunction('createRecipeFromIngredients', {
      ingredients,
      preferences
    });
  };

  return {
    personalizeRecipe,
    generateMealPlanIdeas,
    generateRecipeDescription,
    createRecipeFromIngredients,
    isLoading,
    error,
  };
}
