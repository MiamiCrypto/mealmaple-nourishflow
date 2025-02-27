
import { Navbar } from "@/components/navbar";
import { PageTitle } from "@/components/ui/page-title";
import { MealPlanner } from "@/components/meal-planner";
import { Button } from "@/components/ui/button";
import { Download, Printer, Share2 } from "lucide-react";

const MealPlan = () => {
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
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
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
