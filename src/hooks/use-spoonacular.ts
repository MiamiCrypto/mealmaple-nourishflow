
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SearchParams {
  query?: string;
  diet?: string;
  cuisine?: string;
  type?: string;
  includeIngredients?: string;
  excludeIngredients?: string;
  maxReadyTime?: number;
  minCalories?: number;
  maxCalories?: number;
  offset?: number;
  number?: number;
}

interface UseSpoonacularReturn {
  searchRecipes: (params: SearchParams) => Promise<any>;
  getRecipeById: (id: number) => Promise<any>;
  isLoading: boolean;
  error: string | null;
}

export function useSpoonacular(): UseSpoonacularReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const callSpoonacularFunction = async (action: string, params: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        'spoonacular',
        {
          body: { action, params },
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
      const errorMessage = err.message || 'An error occurred while fetching recipes';
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

  const searchRecipes = async (params: SearchParams) => {
    return callSpoonacularFunction('search', params);
  };

  const getRecipeById = async (id: number) => {
    return callSpoonacularFunction('getRecipeById', { id });
  };

  return {
    searchRecipes,
    getRecipeById,
    isLoading,
    error,
  };
}
