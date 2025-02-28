
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
      console.log(`Calling OpenAI function: ${action}`, data);
      
      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        'openai',
        {
          body: { action, data },
        }
      );

      if (functionError) {
        console.error("Supabase function error:", functionError);
        const errorMessage = functionError.message || "Error calling AI service";
        throw new Error(errorMessage);
      }

      if (!functionData) {
        console.error("No data returned from OpenAI function");
        throw new Error("No data returned from AI service");
      }

      if (functionData.error) {
        console.error("OpenAI function error:", functionData.error);
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

      console.log(`OpenAI function response for ${action}:`, functionData);
      return functionData;
    } catch (err: any) {
      console.error("OpenAI hook error:", err);
      
      // Format the error message for display
      let errorMessage = err.message || 'An error occurred with the AI service';
      
      // Detect quota exceeded error
      // Look for both API limit messages and specific OpenAI billing-related errors
      if (errorMessage.includes('exceeded your current quota') || 
          errorMessage.includes('billing details') ||
          errorMessage.includes('quota')) {
        errorMessage = 'Your OpenAI API key has reached its usage limit. Please check your OpenAI account billing details or upgrade your plan.';
      }
      // Check for specific error types
      else if (errorMessage.includes('non-2xx status code')) {
        // Since we know from the logs that the 500 error is likely related to quota issues
        if (errorMessage.includes('500')) {
          errorMessage = 'The AI service returned an error (500). This is likely due to API quota limits being exceeded. Please check your OpenAI account billing details.';
        } else {
          errorMessage = 'The AI service is currently unavailable. This could be due to API limits or service disruption. Please try again later.';
        }
      } else if (errorMessage.includes('token limit exceeded')) {
        errorMessage = 'You have reached your monthly token limit. Please try again next month.';
      }
      
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
