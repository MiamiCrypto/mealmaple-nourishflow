
import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { PageTitle } from "@/components/ui/page-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Download, Check, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const generateImage = async () => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt },
      });

      if (error) throw new Error(error.message);
      
      if (data.success) {
        setGeneratedImage(data.imageUrl);
        setImageFileName(data.fileName);
        toast({
          title: "Image generated successfully",
          description: "Your branded image has been created and saved.",
        });
      } else {
        throw new Error(data.error || "Failed to generate image");
      }
    } catch (error) {
      console.error("Image generation error:", error);
      toast({
        title: "Image generation failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyImageUrl = async () => {
    if (generatedImage) {
      await navigator.clipboard.writeText(generatedImage);
      toast({
        title: "URL copied",
        description: "Image URL has been copied to clipboard",
      });
    }
  };

  const downloadImage = async () => {
    if (generatedImage) {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = imageFileName || 'mealmaple-custom-image.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download started",
        description: "Your image is being downloaded",
      });
    }
  };

  const updateWebsiteOgImage = async () => {
    if (!generatedImage) return;
    
    toast({
      title: "Update required",
      description: "To update your website's OG image, you need to edit the index.html file manually with this URL: " + generatedImage,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8 px-4 md:px-6">
        <div className="space-y-6">
          <PageTitle 
            title="MealMaple Image Generator" 
            description="Create custom branded images for your website and social media"
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Image Prompt</h2>
              <p className="text-muted-foreground text-sm">
                Describe the image you want to generate. Be specific about colors, style, and elements you want to include.
              </p>
              
              <Textarea
                placeholder="Create a professional, appetizing image for MealMaple with fresh ingredients, a maple leaf motif, and meal prep containers..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[150px]"
              />
              
              <Button 
                onClick={generateImage} 
                disabled={isGenerating || !prompt.trim()} 
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : "Generate Custom Image"}
              </Button>
            </Card>
            
            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Generated Image</h2>
              <div className="bg-slate-100 rounded-md aspect-[16/9] flex items-center justify-center overflow-hidden">
                {generatedImage ? (
                  <img 
                    src={generatedImage} 
                    alt="Generated MealMaple brand image" 
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <p className="text-muted-foreground text-center p-4">
                    {isGenerating ? "Generating your image..." : "Your generated image will appear here"}
                  </p>
                )}
              </div>
              
              {generatedImage && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Input value={generatedImage} readOnly />
                    <Button variant="outline" size="icon" onClick={copyImageUrl}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={downloadImage}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button onClick={updateWebsiteOgImage}>
                      <Check className="mr-2 h-4 w-4" />
                      Use as Website Image
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ImageGenerator;
