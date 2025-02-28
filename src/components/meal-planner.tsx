
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { format, addDays, startOfWeek, addWeeks, subWeeks } from "date-fns";
import { useOpenAI } from "@/hooks/use-openai";
import { useToast } from "@/hooks/use-toast";

interface MealSlot {
  id: string;
  title: string;
  image: string;
  type: 'breakfast' | 'lunch' | 'dinner';
}

interface Day {
  date: Date;
  meals: {
    breakfast?: MealSlot;
    lunch?: MealSlot;
    dinner?: MealSlot;
  };
}

export function MealPlanner() {
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const { generateMealPlanIdeas, isLoading } = useOpenAI();
  const { toast } = useToast();
  
  const handlePrevWeek = () => {
    setCurrentWeek(prev => subWeeks(prev, 1));
  };
  
  const handleNextWeek = () => {
    setCurrentWeek(prev => addWeeks(prev, 1));
  };

  // Generate meal suggestions
  const handleGetSuggestions = async () => {
    setShowSuggestions(true);
    try {
      // Example user preferences - in a real app, these would come from user settings
      const preferences = {
        dietary: ["balanced", "high-protein"],
        mealTypes: ["breakfast", "lunch", "dinner"],
        cookingTime: 30
      };
      
      const result = await generateMealPlanIdeas(preferences);
      if (result && result.meals) {
        setSuggestions(result.meals);
        toast({
          title: "Meal suggestions ready",
          description: "Check out these personalized meal ideas for your plan",
        });
      }
    } catch (error) {
      console.error("Failed to get meal suggestions:", error);
      toast({
        title: "Couldn't generate suggestions",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  // Generate 7 days starting from the current week
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Start on Monday
  const weekDays: Day[] = Array.from({ length: 7 }).map((_, i) => {
    const date = addDays(weekStart, i);
    return {
      date,
      meals: {
        // Sample data - in a real app, this would come from your state or API
        ...(i % 3 === 0 && {
          breakfast: {
            id: `breakfast-${i}`,
            title: "Avocado Toast with Eggs",
            image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            type: "breakfast"
          }
        }),
        ...(i % 2 === 0 && {
          lunch: {
            id: `lunch-${i}`,
            title: "Colorful Buddha Bowl",
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            type: "lunch"
          }
        }),
        ...(i % 2 === 1 && {
          dinner: {
            id: `dinner-${i}`,
            title: "Garlic Butter Shrimp Pasta",
            image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            type: "dinner"
          }
        })
      }
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Weekly Meal Plan</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium px-2">
            {format(weekStart, "MMM d")} - {format(addDays(weekStart, 6), "MMM d, yyyy")}
          </span>
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleGetSuggestions}
          variant="outline"
          className="mb-4"
          disabled={isLoading}
        >
          {isLoading ? "Getting ideas..." : "Get Meal Suggestions"}
        </Button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <Card className="mb-6 animate-fade-in">
          <CardHeader className="bg-primary/10 pb-2">
            <h3 className="font-medium">Suggested Meals Based on Your Preferences</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2">
              {suggestions.slice(0, 3).map((meal, idx) => (
                <div key={idx} className="bg-card border rounded-md p-3 hover:shadow-md transition-shadow">
                  <h4 className="font-medium">{meal.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{meal.type}</p>
                  <div className="flex justify-end mt-2">
                    <Button size="sm" variant="outline">Add to Plan</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day, index) => (
          <Card key={index} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
            <CardHeader className="p-3 border-b bg-muted/30">
              <div className="text-center">
                <div className="text-sm font-medium">
                  {format(day.date, "EEE")}
                </div>
                <div className="text-xl font-bold">
                  {format(day.date, "d")}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              {/* Breakfast */}
              <MealTimeSlot
                title="Breakfast"
                meal={day.meals.breakfast}
                type="breakfast"
              />
              
              {/* Lunch */}
              <MealTimeSlot
                title="Lunch"
                meal={day.meals.lunch}
                type="lunch"
              />
              
              {/* Dinner */}
              <MealTimeSlot
                title="Dinner"
                meal={day.meals.dinner}
                type="dinner"
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

interface MealTimeSlotProps {
  title: string;
  type: 'breakfast' | 'lunch' | 'dinner';
  meal?: MealSlot;
}

function MealTimeSlot({ title, type, meal }: MealTimeSlotProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={cn("meal-badge", `meal-badge-${type}`)}>
          {title}
        </span>
      </div>
      
      {meal ? (
        <div className="relative overflow-hidden rounded-md group hover-scale">
          <img
            src={meal.image}
            alt={meal.title}
            className="w-full h-24 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2">
            <span className="text-white text-xs font-medium line-clamp-2">
              {meal.title}
            </span>
          </div>
        </div>
      ) : (
        <Button 
          variant="outline" 
          className="w-full h-24 border-dashed flex flex-col gap-1 hover:border-primary hover:text-primary"
        >
          <Plus className="h-5 w-5" />
          <span className="text-xs">Add {title}</span>
        </Button>
      )}
    </div>
  );
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
