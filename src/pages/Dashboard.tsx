
import { Navbar } from "@/components/navbar";
import { PageTitle } from "@/components/ui/page-title";
import { QuickStats } from "@/components/quick-stats";
import { MealPlanner } from "@/components/meal-planner";
import { PopularRecipes } from "@/components/popular-recipes";
import { GroceryList } from "@/components/grocery-list";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8 px-4 md:px-6">
        <div className="space-y-8 animate-fade-in">
          <PageTitle 
            title="Welcome to MealMaple" 
            description="Your personalized meal planning assistant"
          />
          
          <QuickStats />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <MealPlanner />
              <PopularRecipes />
            </div>
            <div>
              <GroceryList />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
