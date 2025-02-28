
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const openAIApiKey = Deno.env.get('OPENAI_API_KEY') || '';

// Configuration - making it easy to adjust
const CONFIG = {
  MODEL: "gpt-4o-mini-2024-07-18", // Specific model version
  MONTHLY_TOKEN_LIMIT: 30000,       // Monthly token limit per user
  WARNING_THRESHOLD: 0.8,           // Notify users at 80% of limit
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract the authorization token from the request
    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'No authorization token provided' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user information from the token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if the user has exceeded their monthly token limit
    const { data: usageData, error: usageError } = await supabase
      .from('user_token_usage')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (usageError && usageError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      console.error('Error fetching token usage:', usageError);
    }

    // Get the current month and year
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Initialize or reset token count if it's a new month
    let tokenUsage = usageData || {
      user_id: user.id,
      tokens_used: 0,
      last_reset: now.toISOString(),
      month: currentMonth,
      year: currentYear
    };

    // Reset counter if it's a new month
    if (tokenUsage.month !== currentMonth || tokenUsage.year !== currentYear) {
      tokenUsage = {
        ...tokenUsage,
        tokens_used: 0,
        last_reset: now.toISOString(),
        month: currentMonth,
        year: currentYear
      };
    }

    // Check if the user has exceeded their token limit
    if (tokenUsage.tokens_used >= CONFIG.MONTHLY_TOKEN_LIMIT) {
      return new Response(
        JSON.stringify({ 
          error: 'Monthly token limit exceeded', 
          tokenUsage: tokenUsage.tokens_used,
          limit: CONFIG.MONTHLY_TOKEN_LIMIT
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the request body
    const { action, data } = await req.json();
    
    // Handle different actions
    let result;
    let tokenCount = 0;
    
    if (action === 'personalizeRecipe') {
      result = await personalizeRecipe(data);
      tokenCount = result.usage.total_tokens;
    } else if (action === 'generateMealPlanIdeas') {
      result = await generateMealPlanIdeas(data);
      tokenCount = result.usage.total_tokens;
    } else if (action === 'generateRecipeDescription') {
      result = await generateRecipeDescription(data);
      tokenCount = result.usage.total_tokens;
    } else if (action === 'createRecipeFromIngredients') {
      result = await createRecipeFromIngredients(data);
      tokenCount = result.usage.total_tokens;
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update token usage
    const newTokenUsage = tokenUsage.tokens_used + tokenCount;
    
    // Upsert the token usage
    const { error: updateError } = await supabase
      .from('user_token_usage')
      .upsert({
        user_id: user.id,
        tokens_used: newTokenUsage,
        last_reset: tokenUsage.last_reset,
        month: tokenUsage.month,
        year: tokenUsage.year,
        last_updated: now.toISOString()
      });

    if (updateError) {
      console.error('Error updating token usage:', updateError);
    }

    // Add token usage warning if approaching limit
    const isApproachingLimit = newTokenUsage >= CONFIG.MONTHLY_TOKEN_LIMIT * CONFIG.WARNING_THRESHOLD;
    const responseData = {
      ...result.data,
      tokenUsage: {
        used: newTokenUsage,
        limit: CONFIG.MONTHLY_TOKEN_LIMIT,
        isApproachingLimit,
        percentUsed: Math.round((newTokenUsage / CONFIG.MONTHLY_TOKEN_LIMIT) * 100)
      }
    };

    // Log the request for auditing
    console.log({
      timestamp: now.toISOString(),
      user_id: user.id,
      action,
      model: CONFIG.MODEL,
      tokens_used: tokenCount,
      total_usage: newTokenUsage
    });

    return new Response(
      JSON.stringify(responseData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in OpenAI function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// OpenAI API Functions
async function personalizeRecipe(data) {
  const messages = [
    {
      role: "system",
      content: "You are a culinary AI assistant that specializes in personalizing recipes based on user preferences, dietary restrictions, and health conditions. Return the recipe in a structured JSON format."
    },
    {
      role: "user",
      content: `Please personalize this recipe according to the following preferences:
Recipe: ${JSON.stringify(data.recipe)}
${data.dietaryPreferences ? `Dietary Preferences: ${data.dietaryPreferences.join(', ')}` : ''}
${data.healthConditions ? `Health Conditions: ${data.healthConditions.join(', ')}` : ''}
${data.allergies ? `Allergies: ${data.allergies.join(', ')}` : ''}
${data.servingSize ? `Adjust serving size to: ${data.servingSize} portions` : ''}
${data.skillLevel ? `Cooking Skill Level: ${data.skillLevel}` : ''}

Return a JSON object with the following structure:
{
  "title": "Personalized recipe title",
  "description": "Brief description of the personalized recipe",
  "ingredients": ["list", "of", "ingredients", "with", "measurements"],
  "instructions": ["step 1", "step 2", "etc"],
  "prepTime": number in minutes,
  "cookTime": number in minutes,
  "totalTime": number in minutes,
  "servings": number of servings,
  "nutritionalNotes": "Brief nutritional notes if applicable",
  "adaptations": "Brief explanation of the changes made to personalize the recipe"
}`
    }
  ];

  return await callOpenAI(messages);
}

async function generateMealPlanIdeas(data) {
  const messages = [
    {
      role: "system",
      content: "You are a meal planning assistant that helps users create balanced, nutritious meal plans based on their preferences. Return the meal plan in a structured JSON format."
    },
    {
      role: "user",
      content: `Please generate meal plan ideas for ${data.duration} days based on the following preferences:
${data.preferences.dietaryPreferences ? `Dietary Preferences: ${data.preferences.dietaryPreferences.join(', ')}` : ''}
${data.preferences.healthConditions ? `Health Conditions: ${data.preferences.healthConditions.join(', ')}` : ''}
${data.preferences.allergies ? `Allergies: ${data.preferences.allergies.join(', ')}` : ''}
${data.preferences.mealTypes ? `Preferred Meal Types: ${data.preferences.mealTypes.join(', ')}` : ''}
${data.preferences.cookingTime ? `Maximum Cooking Time: ${data.preferences.cookingTime} minutes` : ''}

${data.existingMeals && data.existingMeals.length > 0 ? `Existing Meals in Plan: ${JSON.stringify(data.existingMeals)}` : ''}

Return a JSON object with the following structure:
{
  "mealPlan": [
    {
      "day": 1,
      "meals": [
        {
          "mealType": "breakfast/lunch/dinner/snack",
          "title": "Recipe title",
          "description": "Brief description",
          "prepTime": number in minutes,
          "estimatedNutrition": {
            "calories": approximate calories,
            "protein": approximate protein in grams,
            "carbs": approximate carbs in grams,
            "fat": approximate fat in grams
          }
        }
      ]
    }
  ],
  "nutritionalSummary": "Brief summary of nutritional balance of the meal plan",
  "tips": "Optional tips for meal prep or variations"
}`
    }
  ];

  return await callOpenAI(messages);
}

async function generateRecipeDescription(data) {
  const messages = [
    {
      role: "system",
      content: "You are a culinary content writer who specializes in creating appetizing, engaging recipe descriptions. Your descriptions should highlight flavors, textures, and appeal of the dish."
    },
    {
      role: "user",
      content: `Write an engaging description for this recipe:
Recipe: ${JSON.stringify(data.recipe)}

Return a JSON object with the following structure:
{
  "description": "The engaging recipe description (about 2-3 sentences)",
  "shortDescription": "A very brief 1-sentence description",
  "tags": ["list", "of", "relevant", "tags", "for", "this", "recipe"]
}`
    }
  ];

  return await callOpenAI(messages);
}

async function createRecipeFromIngredients(data) {
  const messages = [
    {
      role: "system",
      content: "You are a creative chef who can generate recipes based on available ingredients. Create a complete, practical recipe that uses the provided ingredients and matches the user's preferences."
    },
    {
      role: "user",
      content: `Create a ${data.preferences?.mealType || 'meal'} recipe using these ingredients: ${data.ingredients.join(', ')}

Additional preferences:
${data.preferences?.dietaryPreferences ? `Dietary Preferences: ${data.preferences.dietaryPreferences.join(', ')}` : ''}
${data.preferences?.cookingTime ? `Maximum Cooking Time: ${data.preferences.cookingTime} minutes` : ''}

Return a JSON object with the following structure:
{
  "title": "Recipe title",
  "description": "Brief description of the recipe",
  "ingredients": ["list", "of", "ingredients", "with", "measurements"],
  "instructions": ["step 1", "step 2", "etc"],
  "prepTime": number in minutes,
  "cookTime": number in minutes,
  "servings": number of servings,
  "nutritionalNotes": "Brief nutritional notes if applicable"
}`
    }
  ];

  return await callOpenAI(messages);
}

async function callOpenAI(messages) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: CONFIG.MODEL,
      messages: messages,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('OpenAI API error:', errorData);
    throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
  }

  const responseData = await response.json();
  
  // Verify the model used
  if (responseData.model !== CONFIG.MODEL) {
    console.warn(`Warning: Model mismatch. Requested ${CONFIG.MODEL} but got ${responseData.model}`);
  }

  try {
    const content = responseData.choices[0].message.content;
    let parsedContent;
    
    // Try to parse the content as JSON
    try {
      parsedContent = JSON.parse(content);
    } catch (error) {
      // If parsing fails, look for a JSON object within the text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsedContent = JSON.parse(jsonMatch[0]);
        } catch (nestedError) {
          throw new Error('Could not parse response as JSON');
        }
      } else {
        throw new Error('Response does not contain valid JSON');
      }
    }

    return {
      data: parsedContent,
      usage: responseData.usage
    };
  } catch (error) {
    console.error('Error parsing OpenAI response:', error);
    throw new Error('Failed to parse OpenAI response');
  }
}
