
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

const SPOONACULAR_API_KEY = Deno.env.get('SPOONACULAR_API_KEY')

// Create a Supabase client with the auth context of the logged in user
const supabaseClient = (req: Request) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  
  const authHeader = req.headers.get('Authorization')
  const jwt = authHeader?.replace('Bearer ', '')

  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    },
  })
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    // Get the auth token from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header provided' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!SPOONACULAR_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Spoonacular API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { action, params } = await req.json()
    const supabase = supabaseClient(req)

    switch (action) {
      case 'search':
        return await handleSearch(params, supabase)
      case 'getRecipeById':
        return await handleGetRecipeById(params.id, supabase)
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function handleSearch(params: any, supabase: any) {
  const { query, diet, cuisine, type, includeIngredients, excludeIngredients, maxReadyTime, minCalories, maxCalories, offset = 0, number = 10 } = params
  
  // Construct query parameters
  const queryParams = new URLSearchParams({
    apiKey: SPOONACULAR_API_KEY,
    query: query || '',
    offset: offset.toString(),
    number: number.toString(),
    addRecipeInformation: 'true',
    fillIngredients: 'true',
  })
  
  if (diet) queryParams.append('diet', diet)
  if (cuisine) queryParams.append('cuisine', cuisine)
  if (type) queryParams.append('type', type)
  if (includeIngredients) queryParams.append('includeIngredients', includeIngredients)
  if (excludeIngredients) queryParams.append('excludeIngredients', excludeIngredients)
  if (maxReadyTime) queryParams.append('maxReadyTime', maxReadyTime.toString())
  if (minCalories) queryParams.append('minCalories', minCalories.toString())
  if (maxCalories) queryParams.append('maxCalories', maxCalories.toString())
  
  console.log(`Searching Spoonacular with params: ${queryParams.toString()}`)

  try {
    const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?${queryParams.toString()}`)
    const data = await response.json()
    
    console.log(`Received ${data.results?.length || 0} results from Spoonacular`)
    
    // Process and save results to database in a background task
    if (data.results && data.results.length > 0) {
      EdgeRuntime.waitUntil(saveRecipesToDatabase(data.results, supabase))
    }
    
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error searching recipes:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function handleGetRecipeById(id: number, supabase: any) {
  // First check if the recipe exists in our database
  const { data: existingRecipe, error: dbError } = await supabase
    .from('recipes')
    .select('*')
    .eq('external_id', id.toString())
    .single()
  
  if (!dbError && existingRecipe) {
    console.log(`Recipe with ID ${id} found in database`)
    return new Response(
      JSON.stringify(existingRecipe),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
  
  // If not found in database, fetch from Spoonacular
  try {
    const queryParams = new URLSearchParams({
      apiKey: SPOONACULAR_API_KEY,
      includeNutrition: 'true',
    })
    
    console.log(`Fetching recipe ${id} from Spoonacular`)
    const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?${queryParams.toString()}`)
    const recipeData = await response.json()
    
    if (recipeData.id) {
      // Process and save the recipe to database
      const savedRecipe = await processAndSaveRecipe(recipeData, supabase)
      return new Response(
        JSON.stringify(savedRecipe),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      return new Response(
        JSON.stringify({ error: 'Recipe not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error('Error fetching recipe details:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function saveRecipesToDatabase(recipes: any[], supabase: any) {
  console.log(`Processing ${recipes.length} recipes for saving to database`)
  
  for (const recipe of recipes) {
    try {
      // Check if recipe already exists in our database
      const { data: existingRecipe } = await supabase
        .from('recipes')
        .select('id')
        .eq('external_id', recipe.id.toString())
        .maybeSingle()
      
      if (existingRecipe) {
        console.log(`Recipe ${recipe.id} already exists in database, skipping`)
        continue
      }
      
      await processAndSaveRecipe(recipe, supabase)
    } catch (error) {
      console.error(`Error saving recipe ${recipe.id}:`, error)
    }
  }
}

async function processAndSaveRecipe(recipeData: any, supabase: any) {
  // Extract and transform the recipe data
  const { id, title, image, readyInMinutes, servings, vegetarian, vegan, glutenFree, dairyFree, sustainable, lowFodmap, dishTypes, diets, instructions, analyzedInstructions, nutrition, extendedIngredients } = recipeData
  
  // Determine meal type from dishTypes
  let mealType = 'dinner' // Default
  if (dishTypes && dishTypes.length > 0) {
    if (dishTypes.includes('breakfast')) mealType = 'breakfast'
    else if (dishTypes.includes('lunch')) mealType = 'lunch'
    else if (dishTypes.includes('snack')) mealType = 'snack'
  }
  
  // Determine difficulty based on readyInMinutes and complexity of instructions
  let difficulty = 'medium' // Default
  if (readyInMinutes) {
    if (readyInMinutes <= 15) difficulty = 'easy'
    else if (readyInMinutes >= 45) difficulty = 'hard'
  }
  
  // Process nutritional info
  let nutritionInfo = null
  if (nutrition && nutrition.nutrients) {
    nutritionInfo = {
      calories: nutrition.nutrients.find((n: any) => n.name === 'Calories')?.amount || 0,
      protein: nutrition.nutrients.find((n: any) => n.name === 'Protein')?.amount || 0,
      fat: nutrition.nutrients.find((n: any) => n.name === 'Fat')?.amount || 0,
      carbs: nutrition.nutrients.find((n: any) => n.name === 'Carbohydrates')?.amount || 0,
      fiber: nutrition.nutrients.find((n: any) => n.name === 'Fiber')?.amount || 0,
      sugar: nutrition.nutrients.find((n: any) => n.name === 'Sugar')?.amount || 0,
    }
  }
  
  // Process instructions
  let processedInstructions = []
  if (analyzedInstructions && analyzedInstructions.length > 0) {
    analyzedInstructions.forEach((instructionGroup: any) => {
      if (instructionGroup.steps && instructionGroup.steps.length > 0) {
        processedInstructions = instructionGroup.steps.map((step: any) => ({
          step: step.number,
          description: step.step,
        }))
      }
    })
  } else if (instructions) {
    // If we only have a string of instructions, split by periods or numbers
    processedInstructions = instructions.split(/\.\s+|\d+\.\s+/).filter(Boolean).map((step: string, index: number) => ({
      step: index + 1,
      description: step.trim(),
    }))
  }
  
  // Calculate prep and cook time (estimate)
  const totalTime = readyInMinutes || 0
  const cookTime = Math.floor(totalTime * 0.7) // Estimate 70% of total time for cooking
  const prepTime = totalTime - cookTime // Remaining time for prep
  
  // Create the recipe object to be saved
  const recipeToSave = {
    title,
    description: recipeData.summary || '',
    image_url: image,
    source: 'Spoonacular',
    external_id: id.toString(),
    prep_time: prepTime,
    cook_time: cookTime,
    servings,
    difficulty,
    meal_type: mealType,
    instructions: processedInstructions,
    nutrition_info: nutritionInfo,
    tags: dishTypes || [],
    dietary_tags: diets || [],
  }
  
  console.log(`Saving recipe "${title}" to database`)
  
  // Insert the recipe into the database
  const { data: savedRecipe, error: recipeError } = await supabase
    .from('recipes')
    .insert(recipeToSave)
    .select()
    .single()
  
  if (recipeError) {
    console.error('Error saving recipe:', recipeError)
    throw recipeError
  }
  
  // If we have ingredients, save them too
  if (extendedIngredients && extendedIngredients.length > 0 && savedRecipe) {
    console.log(`Processing ${extendedIngredients.length} ingredients for recipe ${savedRecipe.id}`)
    
    for (const ingredient of extendedIngredients) {
      try {
        // Check if ingredient exists in our database
        const { data: existingIngredient, error: ingredientError } = await supabase
          .from('ingredients')
          .select('id')
          .eq('name', ingredient.name)
          .maybeSingle()
        
        let ingredientId
        
        if (existingIngredient) {
          ingredientId = existingIngredient.id
        } else {
          // Create the ingredient
          const { data: newIngredient, error: createError } = await supabase
            .from('ingredients')
            .insert({
              name: ingredient.name,
              category: ingredient.aisle,
              nutritional_info: {
                calories: ingredient.nutrition?.nutrients?.find((n: any) => n.name === 'Calories')?.amount || 0,
                protein: ingredient.nutrition?.nutrients?.find((n: any) => n.name === 'Protein')?.amount || 0,
                fat: ingredient.nutrition?.nutrients?.find((n: any) => n.name === 'Fat')?.amount || 0,
                carbs: ingredient.nutrition?.nutrients?.find((n: any) => n.name === 'Carbohydrates')?.amount || 0,
              }
            })
            .select()
            .single()
          
          if (createError) {
            console.error('Error creating ingredient:', createError)
            continue
          }
          
          ingredientId = newIngredient.id
        }
        
        // Create recipe_ingredient relationship
        await supabase
          .from('recipe_ingredients')
          .insert({
            recipe_id: savedRecipe.id,
            ingredient_id: ingredientId,
            amount: ingredient.amount,
            unit: ingredient.unit,
            notes: ingredient.original,
          })
      } catch (error) {
        console.error(`Error processing ingredient ${ingredient.name}:`, error)
      }
    }
  }
  
  return savedRecipe
}
