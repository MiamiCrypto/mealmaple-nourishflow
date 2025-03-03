
import { Navbar } from "@/components/navbar";
import { PageTitle } from "@/components/ui/page-title";
import { GroceryList as GroceryListComponent } from "@/components/grocery-list";
import { GroceryStoreSelector } from "@/components/grocery-store-selector";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogIn, Save, FileDown, FileUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface GroceryItem {
  id: string;
  name: string;
  category: string;
  checked: boolean;
}

const GroceryList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([
    { id: "1", name: "Avocados", category: "Produce", checked: false },
    { id: "2", name: "Spinach", category: "Produce", checked: false },
    { id: "3", name: "Eggs", category: "Dairy", checked: true },
    { id: "4", name: "Olive Oil", category: "Pantry", checked: true },
  ]);
  const [isGeneratingFromRecipes, setIsGeneratingFromRecipes] = useState(false);

  // This would typically fetch items from backend/Supabase
  // Example placeholder for future implementation
  useEffect(() => {
    // If we have a user and want to load their saved items
    if (user) {
      // For a real implementation, you would fetch from Supabase here
      console.log("Would load saved grocery items for user:", user.id);
    }
  }, [user]);

  const handleAddFromRecipes = () => {
    // In a real implementation, this would fetch ingredients from saved recipes
    // For now we'll simulate adding some recipe ingredients
    const recipeIngredients = [
      { id: crypto.randomUUID(), name: "Chickpeas", category: "Pantry", checked: false },
      { id: crypto.randomUUID(), name: "Bell Peppers", category: "Produce", checked: false },
      { id: crypto.randomUUID(), name: "Quinoa", category: "Grains", checked: false },
      { id: crypto.randomUUID(), name: "Onions", category: "Produce", checked: false },
    ];
    
    // Add only unique items that aren't already in the list
    const existingNames = groceryItems.map(item => item.name.toLowerCase());
    const newItems = recipeIngredients.filter(
      item => !existingNames.includes(item.name.toLowerCase())
    );
    
    if (newItems.length > 0) {
      setGroceryItems(prev => [...prev, ...newItems]);
      toast({
        title: "Ingredients added",
        description: `Added ${newItems.length} ingredients from your recipes`,
      });
    } else {
      toast({
        title: "No new ingredients",
        description: "All recipe ingredients are already in your list",
      });
    }
  };

  const handleSaveList = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please sign in to save your grocery list",
        variant: "default",
      });
      navigate("/auth");
    } else {
      // In a real implementation, this would save to Supabase
      toast({
        title: "Grocery list saved",
        description: "Your grocery list has been saved successfully",
      });
    }
  };

  const handleOrderComplete = () => {
    // Mark ordered items as checked
    setGroceryItems(prev => 
      prev.map(item => ({...item, checked: true}))
    );
    
    toast({
      title: "Order completed",
      description: "Your grocery order has been placed successfully!",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8 px-4 md:px-6">
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <PageTitle 
              title="Grocery List" 
              description="Manage your shopping items"
            />
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={handleAddFromRecipes} 
                variant="outline"
                className="flex-1 sm:flex-auto"
              >
                <FileDown className="h-4 w-4 mr-2" />
                Add From Recipes
              </Button>
              
              {!user ? (
                <Button 
                  onClick={() => navigate("/auth")} 
                  variant="outline"
                  className="flex-1 sm:flex-auto"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login to Save
                </Button>
              ) : (
                <Button 
                  onClick={handleSaveList} 
                  variant="outline"
                  className="flex-1 sm:flex-auto"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save List
                </Button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GroceryListComponent />
            </div>
            <div>
              <GroceryStoreSelector 
                groceryItems={groceryItems} 
                onOrderComplete={handleOrderComplete}
              />
              
              {!user && (
                <Alert className="mt-6">
                  <AlertTitle>Login to access all features</AlertTitle>
                  <AlertDescription>
                    Sign in to save your grocery list and order groceries from partner stores.
                  </AlertDescription>
                  <Button 
                    className="mt-2" 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate("/auth")}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Alert>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GroceryList;
