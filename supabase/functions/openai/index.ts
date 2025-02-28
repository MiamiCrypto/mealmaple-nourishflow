
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();
    let response;

    switch (action) {
      case 'personalizeRecipe':
        response = await personalizeRecipe(data);
        break;
      case 'generateMealPlanIdeas':
        response = await generateMealPlanIdeas(data);
        break;
      case 'generateRecipeDescription':
        response = await generateRecipeDescription(data);
        break;
      case 'createRecipeFromIngredients':
        response = await createRecipeFromIngredients(data);
        break;
      default:
        throw new Error(`Unsupported action: ${action}`);
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in OpenAI function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function personalizeRecipe(data: {
  recipe: any;
  dietaryPreferences?: string[];
  healthConditions?: string[];
  skillLevel?: string;
}) {
  const { recipe, dietaryPreferences = [], healthConditions = [], skillLevel = 'intermediate' } = data;
  
  const ingredients = recipe.extendedIngredients?.map((ing: any) => ing.original).join('\n') || 
    'Ingredients not provided';
  
  const instructions = recipe.analyzedInstructions?.[0]?.steps?.map((step: any) => step.step).join('\n') || 
    'Instructions not provided';
  
  const prompt = `
    Recipe to personalize: ${recipe.title}
    
    Original Ingredients:
    ${ingredients}
    
    Original Instructions:
    ${instructions}
    
    User Dietary Preferences: ${dietaryPreferences.join(', ') || 'None specified'}
    Health Conditions to Consider: ${healthConditions.join(', ') || 'None specified'}
    Cooking Skill Level: ${skillLevel}
    
    Please provide:
    1. Adjusted ingredients with appropriate substitutions for dietary needs or health conditions
    2. Modified cooking instructions appropriate for the skill level
    3. A brief explanation of why these adjustments improve the recipe for the specified preferences
    4. Estimated nutritional impact of these changes (if applicable)
    
    Format as JSON with keys: adjustedIngredients (array), adjustedInstructions (array), explanation (string), and nutritionalNotes (string).
  `;

  return await callOpenAI(prompt, 'Personalize this recipe with specific dietary adjustments.');
}

async function generateMealPlanIdeas(data: {
  preferences: any;
  existingMeals: any[];
  duration: number;
}) {
  const { preferences, existingMeals = [], duration = 7 } = data;
  
  const dietaryPrefs = preferences.dietaryPreferences?.join(', ') || 'None specified';
  const healthConditions = preferences.healthConditions?.join(', ') || 'None specified';
  const nutritionGoals = JSON.stringify(preferences.nutritionGoals || {});
  
  const existingMealsText = existingMeals.length > 0 
    ? existingMeals.map(m => `${m.mealType}: ${m.title}`).join('\n')
    : 'No meals currently in plan';
  
  const prompt = `
    Generate a ${duration}-day meal plan with these parameters:
    
    Dietary Preferences: ${dietaryPrefs}
    Health Conditions: ${healthConditions}
    Nutritional Goals: ${nutritionGoals}
    
    Existing meals in the plan:
    ${existingMealsText}
    
    Please provide meal suggestions that complement the existing meals and meet the dietary requirements.
    Focus on balanced nutrition across the week.
    
    Format as JSON with an array of meal suggestions, each with: title, mealType (breakfast, lunch, dinner, or snack), 
    estimatedPrepTime, keyIngredients (array), and nutritionalHighlights (brief string).
  `;

  return await callOpenAI(prompt, 'Create a personalized meal plan with specific dietary requirements.');
}

async function generateRecipeDescription(data: {
  recipe: any;
}) {
  const { recipe } = data;
  
  const ingredients = recipe.extendedIngredients?.map((ing: any) => ing.original).join(', ') || 
    'Ingredients not provided';
  
  const prompt = `
    Generate an engaging and informative description for this recipe:
    
    Recipe Name: ${recipe.title}
    Main Ingredients: ${ingredients}
    Cuisine Type: ${recipe.cuisines?.join(', ') || 'Not specified'}
    Dish Type: ${recipe.dishTypes?.join(', ') || 'Not specified'}
    Preparation Time: ${recipe.readyInMinutes || 'Not specified'} minutes
    
    Create a compelling 2-3 sentence description highlighting the key flavors, techniques, 
    or cultural background of this dish. Make it appealing to home cooks.
  `;

  return await callOpenAI(prompt, 'Create an engaging recipe description.');
}

async function createRecipeFromIngredients(data: {
  ingredients: string[];
  preferences?: {
    dietaryPreferences?: string[];
    mealType?: string;
    cookingTime?: number;
  };
}) {
  const { ingredients, preferences = {} } = data;
  
  const dietaryPrefs = preferences.dietaryPreferences?.join(', ') || 'None specified';
  const mealType = preferences.mealType || 'Not specified';
  const cookingTime = preferences.cookingTime ? `${preferences.cookingTime} minutes or less` : 'Not specified';
  
  const prompt = `
    Create a recipe using these available ingredients:
    ${ingredients.join(', ')}
    
    Additional parameters:
    Dietary Preferences: ${dietaryPrefs}
    Meal Type: ${mealType}
    Maximum Cooking Time: ${cookingTime}
    
    Please create a complete recipe including:
    1. An appealing title
    2. A brief description of the dish
    3. A list of ingredients with measurements
    4. Step-by-step cooking instructions
    5. Estimated preparation and cooking time
    6. Any nutritional highlights or serving suggestions
    
    Format as JSON with keys: title, description, ingredients (array of strings with measurements), 
    instructions (array of steps), prepTime, cookTime, and nutritionalNotes.
  `;

  return await callOpenAI(prompt, 'Create a recipe from these ingredients.');
}

async function callOpenAI(prompt: string, systemMessage: string = 'You are a helpful culinary assistant.') {
  if (!openAIApiKey) {
    throw new Error('OpenAI API key is not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  
  try {
    // Try to parse as JSON first
    const content = data.choices[0].message.content;
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/{[\s\S]*}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0].replace(/```json\n|```/g, ''));
    }
    
    // If not valid JSON or no JSON found, return the raw content
    return { 
      rawContent: content,
      // Also try to extract a helpful result even if not proper JSON
      message: "Received non-JSON response from OpenAI. See rawContent for details."
    };
  } catch (e) {
    console.error("Error parsing OpenAI response:", e);
    return { 
      rawContent: data.choices[0].message.content,
      error: "Failed to parse response as JSON" 
    };
  }
}
