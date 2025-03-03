
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GroceryItem {
  id: string;
  name: string;
  category: string;
  checked: boolean;
}

export function GroceryList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [newItem, setNewItem] = useState("");
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([
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

  const handleCheck = (id: string) => {
    setGroceryItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const addItem = () => {
    if (newItem.trim()) {
      setGroceryItems(prev => [
        ...prev,
        { 
          id: Date.now().toString(), 
          name: newItem, 
          category: "Other", 
          checked: false 
        }
      ]);
      setNewItem("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addItem();
    }
  };

  const removeCheckedItems = () => {
    setGroceryItems(prev => prev.filter(item => !item.checked));
  };

  const filteredItems = groceryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group by category
  const groupedItems: Record<string, GroceryItem[]> = {};
  filteredItems.forEach(item => {
    if (!groupedItems[item.category]) {
      groupedItems[item.category] = [];
    }
    groupedItems[item.category].push(item);
  });

  // Sort categories with Produce first, then alphabetically
  const sortedCategories = Object.keys(groupedItems).sort((a, b) => {
    if (a === "Produce") return -1;
    if (b === "Produce") return 1;
    return a.localeCompare(b);
  });

  return (
    <Card className="border shadow-sm w-full animate-scale-in">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <span>Grocery List</span>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8"
            onClick={removeCheckedItems}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear Checked
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search items..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <Input
            placeholder="Add new item..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button onClick={addItem}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <ScrollArea className="h-[400px] pr-4">
          {sortedCategories.map(category => (
            <div key={category} className="mb-4">
              <h3 className="text-sm font-medium mb-2 text-muted-foreground">{category}</h3>
              <div className="space-y-2">
                {groupedItems[category].map(item => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      id={`item-${item.id}`}
                      checked={item.checked}
                      onCheckedChange={() => handleCheck(item.id)}
                    />
                    <Label
                      htmlFor={`item-${item.id}`}
                      className={`flex-grow cursor-pointer ${item.checked ? "line-through text-muted-foreground" : ""}`}
                    >
                      {item.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
