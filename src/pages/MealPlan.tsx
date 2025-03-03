
import { Navbar } from "@/components/navbar";
import { PageTitle } from "@/components/ui/page-title";
import { MealPlanner } from "@/components/meal-planner";
import { Button } from "@/components/ui/button";
import { Download, LogIn, Printer, Share2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const MealPlan = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSaveAction = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please sign in to save your meal plan",
        variant: "default",
      });
      navigate("/auth");
    } else {
      toast({
        title: "Meal plan saved",
        description: "Your meal plan has been saved successfully",
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
              title="Weekly Meal Plan" 
              description="Organize your meals for the week ahead"
            />
            
            <div className="flex items-center gap-2">
              {!user ? (
                <Button onClick={() => navigate("/auth")} variant="outline" size="sm">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login to Save
                </Button>
              ) : (
                <Button onClick={handleSaveAction} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Save Plan
                </Button>
              )}
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
          
          <MealPlanner />
        </div>
      </main>
    </div>
  );
};

export default MealPlan;
