
import { Navbar } from "@/components/navbar";
import { PageTitle } from "@/components/ui/page-title";
import { GroceryList as GroceryListComponent } from "@/components/grocery-list";
import { GroceryStoreSelector } from "@/components/grocery-store-selector";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogIn, Save } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const GroceryList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [groceryItems, setGroceryItems] = useState([
    { id: "1", name: "Avocados", checked: false },
    { id: "2", name: "Spinach", checked: false },
    { id: "3", name: "Eggs", checked: true },
    { id: "4", name: "Olive Oil", checked: true },
  ]);

  const handleSaveList = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please sign in to save your grocery list",
        variant: "default",
      });
      navigate("/auth");
    } else {
      toast({
        title: "Grocery list saved",
        description: "Your grocery list has been saved successfully",
      });
    }
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
            {!user ? (
              <Button onClick={() => navigate("/auth")} variant="outline">
                <LogIn className="h-4 w-4 mr-2" />
                Login to Save
              </Button>
            ) : (
              <Button onClick={handleSaveList} variant="outline">
                <Save className="h-4 w-4 mr-2" />
                Save List
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GroceryListComponent />
            </div>
            <div>
              <GroceryStoreSelector groceryItems={groceryItems} />
              
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
