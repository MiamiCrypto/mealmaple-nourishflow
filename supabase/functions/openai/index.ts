
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Monthly token limit per user
const DEFAULT_MONTHLY_TOKEN_LIMIT = 30000;
const WARNING_THRESHOLD = 0.8; // 80%

// Create a Supabase client for managing token usage
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface TokenUsage {
  used: number;
  limit: number;
  isApproachingLimit: boolean;
  percentUsed: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();
    
    // Extract user information from request authorization header
    const authHeader = req.headers.get('Authorization');
    let userId = null;
    
    if (authHeader) {
      try {
        // Try to get the user ID from the JWT
        const token = authHeader.replace('Bearer ', '');
        const { data: userData, error } = await supabase.auth.getUser(token);
        if (!error && userData.user) {
          userId = userData.user.id;
        }
      } catch (error) {
        console.error("Error getting user from token:", error);
      }
    }
    
    // If no auth or user identification, generate a temporary ID based on IP
    if (!userId) {
      const clientIp = req.headers.get('x-forwarded-for') || 'anonymous';
      userId = `anonymous-${clientIp}`;
    }

    // Check token usage before proceeding
    const tokenUsageInfo = await checkTokenUsage(userId);
    if (tokenUsageInfo.used >= tokenUsageInfo.limit) {
      return new Response(
        JSON.stringify({ 
          error: "Monthly token limit exceeded. Please try again next month.",
          tokenUsage: tokenUsageInfo
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
      );
    }

    let result;
    let tokenUsage = 0;

    // Call appropriate function based on action
    switch (action) {
      case 'personalizeRecipe':
        result = await personalizeRecipe(data.recipe, data);
        tokenUsage = result.tokenUsage || 0;
        delete result.tokenUsage;
        break;
      case 'generateMealPlanIdeas':
        result = await generateMealPlanIdeas(data.preferences, data.existingMeals, data.duration);
        tokenUsage = result.tokenUsage || 0;
        delete result.tokenUsage;
        break;
      case 'generateRecipeDescription':
        result = await generateRecipeDescription(data.recipe);
        tokenUsage = result.tokenUsage || 0;
        delete result.tokenUsage;
        break;
      case 'createRecipeFromIngredients':
        result = await createRecipeFromIngredients(data.ingredients, data.preferences);
        tokenUsage = result.tokenUsage || 0;
        delete result.tokenUsage;
        break;
      case 'getSuggestedRecipes':
        result = await getSuggestedRecipes(data.preferences, data.favoriteTags);
        tokenUsage = result.tokenUsage || 0;
        delete result.tokenUsage;
        break;
      default:
        throw new Error(`Unsupported action: ${action}`);
    }

    // Update token usage in database
    if (tokenUsage > 0) {
      await updateTokenUsage(userId, tokenUsage);
    }

    // Get updated token usage information
    const updatedTokenUsage = await checkTokenUsage(userId);

    // Return the result with updated token usage info
    return new Response(
      JSON.stringify({ ...result, tokenUsage: updatedTokenUsage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

// Personalize a recipe based on user preferences
async function personalizeRecipe(recipe, preferences) {
  const prompt = `
    I have the following recipe:
    Title: ${recipe.title}
    Ingredients: ${recipe.ingredients ? recipe.ingredients.join(', ') : 'None provided'}
    Instructions: ${recipe.instructions ? recipe.instructions.join(' ') : 'None provided'}
    
    Please personalize this recipe ${preferences.dietaryPreferences ? `for a ${preferences.dietaryPreferences.join(', ')} diet` : ''}
    ${preferences.allergies ? `avoiding these allergens: ${preferences.allergies.join(', ')}` : ''}
    ${preferences.cookingTime ? `with a max cooking time of ${preferences.cookingTime} minutes` : ''}
    ${preferences.skillLevel ? `appropriate for a ${preferences.skillLevel} chef` : ''}
    
    Return the result as a JSON object with title, description, ingredients (array), instructions (array), prepTime, cookTime, servings, and nutritionalNotes fields.
  `;

  const result = await callOpenAI(prompt);
  return { ...result, originalRecipe: recipe };
}

// Generate meal plan ideas based on preferences
async function generateMealPlanIdeas(preferences, existingMeals = [], duration = 7) {
  const existingMealsText = existingMeals.length > 0 
    ? `I already have these meals in my plan: ${JSON.stringify(existingMeals)}.` 
    : '';

  const prompt = `
    Create a ${duration}-day meal plan with delicious, appealing meals ${preferences.dietaryPreferences ? `for a ${preferences.dietaryPreferences.join(', ')} diet` : ''}
    ${preferences.allergies ? `avoiding these allergens: ${preferences.allergies.join(', ')}` : ''}
    ${preferences.cookingTime ? `with a max cooking time of ${preferences.cookingTime} minutes per meal` : ''}
    ${preferences.mealTypes ? `including these meal types: ${preferences.mealTypes.join(', ')}` : 'including breakfast, lunch, and dinner'}
    
    ${existingMealsText}
    
    Focus on delicious, appealing meals that would make someone want to eat them.
    
    Return a JSON object with an array of meal suggestions. Each meal should have: title, type (breakfast, lunch, dinner, or snack), description (short), and prepTime.
  `;

  return await callOpenAI(prompt);
}

// Generate a recipe description
async function generateRecipeDescription(recipe) {
  const prompt = `
    Write an enticing, detailed description for this recipe:
    Title: ${recipe.title}
    Ingredients: ${recipe.ingredients ? recipe.ingredients.join(', ') : 'None provided'}
    Instructions: ${recipe.instructions ? recipe.instructions.join(' ') : 'None provided'}
    
    The description should highlight the flavors, textures, and appeal of the dish in about 2-3 sentences.
  `;

  return await callOpenAI(prompt);
}

// Create a recipe from a list of ingredients
async function createRecipeFromIngredients(ingredients, preferences = {}) {
  const prompt = `
    Create a delicious recipe using these ingredients: ${ingredients.join(', ')}
    ${preferences.dietaryPreferences ? `The recipe should be suitable for a ${preferences.dietaryPreferences.join(', ')} diet.` : ''}
    ${preferences.mealType ? `This should be a ${preferences.mealType} recipe.` : ''}
    ${preferences.cookingTime ? `The recipe should take no more than ${preferences.cookingTime} minutes to prepare.` : ''}
    
    Return a JSON object with title, description, ingredients (array including quantities), instructions (array of steps), prepTime, cookTime, and nutritionalNotes.
  `;

  return await callOpenAI(prompt);
}

// Get suggested recipes based on preferences and favorite tags
async function getSuggestedRecipes(preferences = {}, favoriteTags = []) {
  const prompt = `
    Suggest 5 delicious, appealing recipes 
    ${preferences.dietaryPreferences ? `suitable for a ${preferences.dietaryPreferences.join(', ')} diet` : ''}
    ${preferences.allergies ? `avoiding these allergens: ${preferences.allergies.join(', ')}` : ''}
    ${preferences.cookingTime ? `that can be prepared in ${preferences.cookingTime} minutes or less` : ''}
    ${favoriteTags.length > 0 ? `similar to these favorite foods: ${favoriteTags.join(', ')}` : ''}
    
    Focus on recipes that are delicious, visually appealing, and would make someone want to eat them.
    
    Return a JSON object with an array called 'recipes'. Each recipe should have: title, description (short), ingredients (array), instructions (array), prepTime, cookTime, mealType, and imageDescription (for AI image generation).
  `;

  return await callOpenAI(prompt);
}

// Helper function to make OpenAI API calls
async function callOpenAI(prompt) {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant specialized in culinary arts and nutrition. Provide detailed, accurate, and creative responses for recipe and meal planning queries."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  
  try {
    // Extract JSON from the response
    const content = data.choices[0].message.content;
    let parsedContent;
    
    // Try to parse the entire response as JSON
    try {
      parsedContent = JSON.parse(content);
    } catch (e) {
      // If that fails, try to extract JSON from the text
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                        content.match(/{[\s\S]*}/);
      
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else {
        // Return the raw content if JSON parsing fails
        parsedContent = { description: content };
      }
    }
    
    // Calculate and add token usage information
    const promptTokens = data.usage.prompt_tokens;
    const completionTokens = data.usage.completion_tokens;
    const totalTokens = promptTokens + completionTokens;
    
    return {
      ...parsedContent,
      tokenUsage: totalTokens
    };
  } catch (error) {
    console.error("Error parsing OpenAI response:", error);
    return { 
      description: data.choices[0].message.content,
      tokenUsage: data.usage.total_tokens
    };
  }
}

// Check user's token usage for the current month
async function checkTokenUsage(userId) {
  // Check if the user has a token usage record for the current month
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  
  const { data, error } = await supabase
    .from('user_token_usage')
    .select('*')
    .eq('user_id', userId)
    .eq('month', currentMonth)
    .eq('year', currentYear)
    .maybeSingle();
  
  if (error) {
    console.error("Error checking token usage:", error);
    // In case of error, return a default token usage with default limit
    return {
      used: 0,
      limit: DEFAULT_MONTHLY_TOKEN_LIMIT,
      isApproachingLimit: false,
      percentUsed: 0
    };
  }
  
  // If no record exists for current month, create one
  if (!data) {
    const newRecord = {
      user_id: userId,
      token_usage: 0,
      month: currentMonth,
      year: currentYear,
      token_limit: DEFAULT_MONTHLY_TOKEN_LIMIT
    };
    
    await supabase.from('user_token_usage').insert([newRecord]);
    
    return {
      used: 0,
      limit: DEFAULT_MONTHLY_TOKEN_LIMIT,
      isApproachingLimit: false,
      percentUsed: 0
    };
  }
  
  // Calculate percentage and check if approaching limit
  const percentUsed = Math.round((data.token_usage / data.token_limit) * 100);
  const isApproachingLimit = data.token_usage >= (data.token_limit * WARNING_THRESHOLD);
  
  return {
    used: data.token_usage,
    limit: data.token_limit,
    isApproachingLimit,
    percentUsed
  };
}

// Update the user's token usage
async function updateTokenUsage(userId, tokens) {
  // Get current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  
  // Check if user has a record for current month
  const { data, error } = await supabase
    .from('user_token_usage')
    .select('*')
    .eq('user_id', userId)
    .eq('month', currentMonth)
    .eq('year', currentYear)
    .maybeSingle();
  
  if (error) {
    console.error("Error updating token usage:", error);
    return;
  }
  
  if (data) {
    // Update existing record
    await supabase
      .from('user_token_usage')
      .update({ token_usage: data.token_usage + tokens })
      .eq('id', data.id);
  } else {
    // Create new record
    await supabase
      .from('user_token_usage')
      .insert([{
        user_id: userId,
        token_usage: tokens,
        month: currentMonth,
        year: currentYear,
        token_limit: DEFAULT_MONTHLY_TOKEN_LIMIT
      }]);
  }
}
