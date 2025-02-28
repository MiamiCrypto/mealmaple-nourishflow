
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const MODEL = 'gpt-4o-mini-2024-07-18'; // Using the specified model
const TOKEN_LIMIT_PER_MONTH = 30000;
const WARNING_THRESHOLD = 0.8; // 80%

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TokenUsage {
  used: number;
  limit: number;
  isApproachingLimit: boolean;
  percentUsed: number;
}

async function getUserTokenUsage(supabase: any, userId: string): Promise<TokenUsage> {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // JavaScript months are 0-11
  const currentYear = now.getFullYear();

  // Check if user exists in the token usage table for current month
  const { data, error } = await supabase
    .from('user_token_usage')
    .select('*')
    .eq('user_id', userId)
    .eq('month', currentMonth)
    .eq('year', currentYear)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user token usage:', error);
    throw error;
  }

  // If no record exists, create one
  if (!data) {
    const { data: newRecord, error: insertError } = await supabase
      .from('user_token_usage')
      .insert({
        user_id: userId,
        month: currentMonth,
        year: currentYear,
        tokens_used: 0,
        last_reset: now.toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating user token usage record:', insertError);
      throw insertError;
    }

    return {
      used: 0,
      limit: TOKEN_LIMIT_PER_MONTH,
      isApproachingLimit: false,
      percentUsed: 0
    };
  }

  const percentUsed = Math.round((data.tokens_used / TOKEN_LIMIT_PER_MONTH) * 100);
  
  return {
    used: data.tokens_used,
    limit: TOKEN_LIMIT_PER_MONTH,
    isApproachingLimit: data.tokens_used >= TOKEN_LIMIT_PER_MONTH * WARNING_THRESHOLD,
    percentUsed
  };
}

async function updateUserTokenUsage(supabase: any, userId: string, tokensUsed: number): Promise<TokenUsage> {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // Get current usage
  const { data: currentData } = await supabase
    .from('user_token_usage')
    .select('tokens_used')
    .eq('user_id', userId)
    .eq('month', currentMonth)
    .eq('year', currentYear)
    .single();

  // Update token usage
  const newTokensTotal = (currentData?.tokens_used || 0) + tokensUsed;
  
  const { error } = await supabase
    .from('user_token_usage')
    .update({
      tokens_used: newTokensTotal,
      last_updated: now.toISOString()
    })
    .eq('user_id', userId)
    .eq('month', currentMonth)
    .eq('year', currentYear);

  if (error) {
    console.error('Error updating token usage:', error);
    throw error;
  }

  const percentUsed = Math.round((newTokensTotal / TOKEN_LIMIT_PER_MONTH) * 100);
  
  return {
    used: newTokensTotal,
    limit: TOKEN_LIMIT_PER_MONTH,
    isApproachingLimit: newTokensTotal >= TOKEN_LIMIT_PER_MONTH * WARNING_THRESHOLD,
    percentUsed
  };
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();
    
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    // Create authenticated Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.39.3');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Extract user ID from auth header if present
    let userId = 'anonymous';
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const { data: userData, error } = await supabase.auth.getUser(token);
        if (!error && userData.user) {
          userId = userData.user.id;
        }
      }
    }
    
    // Check if user has exceeded token limit
    const tokenUsage = await getUserTokenUsage(supabase, userId);
    if (tokenUsage.used >= TOKEN_LIMIT_PER_MONTH) {
      return new Response(
        JSON.stringify({ 
          error: 'Monthly token limit exceeded. Please try again next month.',
          tokenUsage
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify that the model parameter is set correctly
    const modelVerification = MODEL;
    console.log(`Using OpenAI model: ${modelVerification}`);

    let result;
    let totalTokensUsed = 0;

    switch (action) {
      case 'personalizeRecipe': {
        const { recipe, ...preferences } = data;
        
        const messages = [
          {
            role: 'system',
            content: `You are a helpful culinary assistant that personalizes recipes based on user preferences.
                      Adjust the recipe to accommodate the user's dietary preferences while maintaining flavor and balance.
                      Provide the full recipe with adjusted ingredients and instructions.`
          },
          {
            role: 'user',
            content: `Please personalize this recipe for me:\n\nTitle: ${recipe.title}\n\nIngredients:\n${recipe.ingredients.join('\n')}\n\nInstructions:\n${recipe.instructions.join('\n')}\n\nPlease adjust for these preferences: ${JSON.stringify(preferences)}`
          }
        ];
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: MODEL,
            messages,
            temperature: 0.7,
          }),
        });
        
        const responseData = await response.json();
        
        if (responseData.error) {
          throw new Error(responseData.error.message);
        }
        
        result = {
          personalizedRecipe: JSON.parse(responseData.choices[0].message.content),
        };
        
        totalTokensUsed = responseData.usage.total_tokens;
        break;
      }

      case 'generateMealPlanIdeas': {
        const { preferences, existingMeals, duration } = data;

        const messages = [
          {
            role: 'system',
            content: `You are a nutrition expert and meal planner. Create a meal plan based on the user's preferences.
                      Always return a valid JSON object with an array of meal suggestions that are balanced and nutritious.`
          },
          {
            role: 'user',
            content: `Generate a ${duration}-day meal plan with these preferences: ${JSON.stringify(preferences)}.
                     ${existingMeals.length > 0 ? `I already have these meals planned: ${JSON.stringify(existingMeals)}` : ''}
                     Return a JSON object with the format: { "meals": [{"title": "Meal Name", "type": "breakfast/lunch/dinner", "description": "Brief description"}] }`
          }
        ];

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: MODEL,
            messages,
            temperature: 0.7,
            response_format: { type: "json_object" }
          }),
        });

        const responseData = await response.json();
        
        if (responseData.error) {
          throw new Error(responseData.error.message);
        }
        
        result = JSON.parse(responseData.choices[0].message.content);
        totalTokensUsed = responseData.usage.total_tokens;
        break;
      }

      case 'generateRecipeDescription': {
        const { recipe } = data;

        const messages = [
          {
            role: 'system',
            content: `You are a food writer who creates engaging, appetizing descriptions of recipes.
                      Keep descriptions concise (max 2-3 sentences) but enticing.`
          },
          {
            role: 'user',
            content: `Write a short, appealing description for this recipe:\nTitle: ${recipe.title}\nIngredients: ${recipe.ingredients.join(', ')}\nMeal type: ${recipe.mealType}`
          }
        ];

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: MODEL,
            messages,
            temperature: 0.7,
          }),
        });

        const responseData = await response.json();
        
        if (responseData.error) {
          throw new Error(responseData.error.message);
        }
        
        result = {
          description: responseData.choices[0].message.content.trim(),
        };
        
        totalTokensUsed = responseData.usage.total_tokens;
        break;
      }

      case 'createRecipeFromIngredients': {
        const { ingredients, preferences } = data;

        const messages = [
          {
            role: 'system',
            content: `You are a professional chef who creates delicious recipes from available ingredients.
                      Create a complete recipe with title, ingredients with measurements, step-by-step instructions,
                      prep time, cook time, and nutritional notes.
                      Format the response as JSON with the keys: title, ingredients, instructions, prepTime, cookTime, nutritionalNotes.`
          },
          {
            role: 'user',
            content: `Create a recipe using these ingredients: ${ingredients.join(', ')}.
                     ${Object.keys(preferences).length > 0 ? `Consider these preferences: ${JSON.stringify(preferences)}` : ''}
                     Return a complete recipe in JSON format.`
          }
        ];

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: MODEL,
            messages,
            temperature: 0.7,
            response_format: { type: "json_object" }
          }),
        });

        const responseData = await response.json();
        
        if (responseData.error) {
          throw new Error(responseData.error.message);
        }
        
        result = JSON.parse(responseData.choices[0].message.content);
        totalTokensUsed = responseData.usage.total_tokens;
        break;
      }

      case 'getSuggestedRecipes': {
        const { preferences, favoriteTags } = data;

        const messages = [
          {
            role: 'system',
            content: `You are a personal chef who recommends recipes based on user preferences and past favorites.
                      Suggest 3-5 recipes that match the user's taste profile.
                      Return the results as a JSON array with title, description, and meal type for each recipe.`
          },
          {
            role: 'user',
            content: `Suggest recipes for me based on these preferences: ${JSON.stringify(preferences)}.
                     ${favoriteTags.length > 0 ? `I've previously enjoyed recipes with these characteristics: ${favoriteTags.join(', ')}` : ''}
                     Return results in JSON format.`
          }
        ];

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: MODEL,
            messages,
            temperature: 0.7,
            response_format: { type: "json_object" }
          }),
        });

        const responseData = await response.json();
        
        if (responseData.error) {
          throw new Error(responseData.error.message);
        }
        
        result = JSON.parse(responseData.choices[0].message.content);
        totalTokensUsed = responseData.usage.total_tokens;
        break;
      }

      default:
        throw new Error(`Unsupported action: ${action}`);
    }

    // Update token usage
    const updatedTokenUsage = await updateUserTokenUsage(supabase, userId, totalTokensUsed);
    
    // Log the token usage
    console.log(`User ${userId} used ${totalTokensUsed} tokens. Total usage: ${updatedTokenUsage.used}/${TOKEN_LIMIT_PER_MONTH}`);

    return new Response(
      JSON.stringify({ ...result, tokenUsage: updatedTokenUsage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error(`Error processing OpenAI request:`, err);
    
    return new Response(
      JSON.stringify({ error: err.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
