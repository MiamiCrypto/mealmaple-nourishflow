
import { Navbar } from "@/components/navbar";
import { PageTitle } from "@/components/ui/page-title";
import { GroceryList } from "@/components/grocery-list";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer, Share2 } from "lucide-react";

const GroceryListPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8 px-4 md:px-6">
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <PageTitle 
              title="Grocery List" 
              description="Everything you need for your weekly meal plan"
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
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <GroceryList />
            </div>
            <div>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Shopping Tips</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">1</span>
                      <span>Shop the perimeter of the store first for fresh produce.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">2</span>
                      <span>Buy in bulk for staples like rice, beans, and nuts.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">3</span>
                      <span>Look for seasonal produce for better taste and value.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">4</span>
                      <span>Check what you already have at home before shopping.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">5</span>
                      <span>Try to avoid shopping when hungry to prevent impulse purchases.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GroceryListPage;
