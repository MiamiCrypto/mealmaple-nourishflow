
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TokenUsage {
  used: number;
  limit: number;
  isApproachingLimit: boolean;
  percentUsed: number;
}

export function useOpenAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(null);
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

      // Handle token usage information
      if (functionData.tokenUsage) {
        setTokenUsage(functionData.tokenUsage);
        
        // Show warning if approaching limit
        if (functionData.tokenUsage.isApproachingLimit) {
          toast({
            title: 'API Usage Warning',
            description: `You've used ${functionData.tokenUsage.percentUsed}% of your monthly token limit.`,
            variant: 'destructive',
          });
        }
      }

      return functionData;
    } catch (err: any) {
      // Check for token limit exceeded error
      if (err.message?.includes('token limit exceeded')) {
        const errorMessage = 'You have reached your monthly token limit. Please try again next month.';
        setError(errorMessage);
        toast({
          title: 'Token Limit Exceeded',
          description: errorMessage,
          variant: 'destructive',
        });
      } else {
        const errorMessage = err.message || 'An error occurred with the AI service';
        setError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
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

  const getSuggestedRecipes = async (preferences: any = {}, favoriteTags: string[] = []) => {
    return callOpenAIFunction('getSuggestedRecipes', {
      preferences,
      favoriteTags
    });
  };

  return {
    personalizeRecipe,
    generateMealPlanIdeas,
    generateRecipeDescription,
    createRecipeFromIngredients,
    getSuggestedRecipes,
    isLoading,
    error,
    tokenUsage,
  };
}
