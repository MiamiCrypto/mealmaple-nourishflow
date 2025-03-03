
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GroceryStore, groceryStores, createGroceryOrder } from "@/utils/groceryStoreApi";
import { ShoppingCart, Check, AlertCircle } from "lucide-react";

interface GroceryStoreSelectorProps {
  groceryItems: Array<{ id: string; name: string; checked: boolean }>;
  onOrderComplete?: () => void;
}

export function GroceryStoreSelector({ groceryItems, onOrderComplete }: GroceryStoreSelectorProps) {
  const [isOrdering, setIsOrdering] = useState(false);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  
  const handleStoreSelect = (storeId: string) => {
    setSelectedStore(storeId);
  };
  
  const handleCreateOrder = async () => {
    if (!selectedStore) return;
    
    setIsOrdering(true);
    try {
      const result = await createGroceryOrder(selectedStore, groceryItems);
      if (result && result.success && onOrderComplete) {
        onOrderComplete();
      }
    } finally {
      setIsOrdering(false);
    }
  };
  
  const uncheckedItemsCount = groceryItems.filter(item => !item.checked).length;

  return (
    <Card className="border shadow-sm w-full animate-scale-in">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          <span>Order Groceries</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {uncheckedItemsCount === 0 ? (
          <div className="flex items-center justify-center p-4 bg-muted/30 rounded-md">
            <p className="text-sm text-muted-foreground">All items are checked. Mark items as unchecked to order them.</p>
          </div>
        ) : (
          <>
            <p className="text-sm">Select a grocery store to order {uncheckedItemsCount} items:</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {groceryStores.map((store) => (
                <div
                  key={store.id}
                  className={`border rounded-md p-3 cursor-pointer transition-all ${
                    selectedStore === store.id
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/30"
                  } ${!store.isAvailable ? "opacity-60" : ""}`}
                  onClick={() => store.isAvailable && handleStoreSelect(store.id)}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      {store.logo ? (
                        <img src={store.logo} alt={store.name} className="h-full w-full object-cover" />
                      ) : (
                        <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <span className="text-sm font-medium">{store.name}</span>
                    {!store.isAvailable && (
                      <span className="text-xs text-muted-foreground">Coming soon</span>
                    )}
                    {selectedStore === store.id && (
                      <Check className="h-4 w-4 text-primary absolute top-2 right-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <Button
              onClick={handleCreateOrder}
              disabled={!selectedStore || isOrdering || uncheckedItemsCount === 0}
              className="w-full mt-2"
            >
              {isOrdering ? "Creating Order..." : `Order from ${selectedStore ? groceryStores.find(s => s.id === selectedStore)?.name : "Store"}`}
            </Button>
          </>
        )}
        
        <div className="mt-4 p-3 bg-muted/20 rounded-md border-l-4 border-primary/40">
          <div className="flex gap-2">
            <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Demo Mode</p>
              <p className="text-xs text-muted-foreground mt-1">
                This is a demonstration of how grocery ordering would work. In a production application, 
                you would integrate with real grocery store APIs using their official SDKs or APIs.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
