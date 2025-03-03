
import { Navbar } from "@/components/navbar";
import { PageTitle } from "@/components/ui/page-title";
import { GroceryList } from "@/components/grocery-list";
import { GroceryStoreSelector } from "@/components/grocery-store-selector";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer, Share2 } from "lucide-react";
import { useState } from "react";

const GroceryListPage = () => {
  // We need grocery items state at this level to share between components
  const [groceryItems, setGroceryItems] = useState([
    { id: "1", name: "Avocados", category: "Produce", checked: false },
    { id: "2", name: "Spinach", category: "Produce", checked: false },
    { id: "3", name: "Cherry Tomatoes", category: "Produce", checked: false },
    { id: "4", name: "Quinoa", category: "Grains", checked: false },
    { id: "5", name: "Salmon Fillets", category: "Protein", checked: false },
    { id: "6", name: "Greek Yogurt", category: "Dairy", checked: false },
    { id: "7", name: "Eggs", category: "Dairy", checked: true },
    { id: "8", name: "Olive Oil", category: "Pantry", checked: true },
    { id: "9", name: "Honey", category: "Pantry", checked: false },
    { id: "10", name: "Lemons", category: "Produce", checked: false },
  ]);

  const handleOrderComplete = () => {
    // Mark ordered items as checked
    setGroceryItems(prev => 
      prev.map(item => 
        !item.checked ? { ...item, checked: true } : item
      )
    );
  };

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
            <div className="space-y-6">
              <GroceryStoreSelector 
                groceryItems={groceryItems} 
                onOrderComplete={handleOrderComplete} 
              />
              
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
