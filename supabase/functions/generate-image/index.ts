
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

// Create a Supabase client for storing the generated images
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured");
    }

    const { prompt, size = "1024x1024" } = await req.json();
    
    // Default prompt if none provided
    const finalPrompt = prompt || "Create a professional, appetizing image for a meal planning app called MealMaple. Include colorful fresh ingredients, a maple leaf motif, and organized meal prep containers. Use warm, inviting colors with green and amber accents. Style should be clean, modern and minimalist.";
    
    console.log("Generating image with prompt:", finalPrompt);

    // Call OpenAI API to generate the image
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: finalPrompt,
        n: 1,
        size: size,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const imageUrl = data.data[0].url;
    
    // Download the image
    const imageResponse = await fetch(imageUrl);
    const imageBlob = await imageResponse.blob();
    
    // Convert blob to buffer for Supabase storage
    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    
    // Create a unique filename
    const timestamp = new Date().getTime();
    const fileName = `mealmaple-og-image-${timestamp}.png`;
    
    // Upload to Supabase Storage
    const { data: fileData, error } = await supabase
      .storage
      .from('public')
      .upload(`og-images/${fileName}`, buffer, {
        contentType: 'image/png',
        upsert: false
      });
    
    if (error) {
      console.error("Supabase Storage error:", error);
      throw new Error(`Error storing image: ${error.message}`);
    }
    
    // Get public URL
    const { data: publicUrlData } = supabase
      .storage
      .from('public')
      .getPublicUrl(`og-images/${fileName}`);
    
    const publicUrl = publicUrlData.publicUrl;
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl: publicUrl,
        originalUrl: imageUrl,
        fileName: fileName 
      }),
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
