
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { format, addDays, startOfWeek, addWeeks, subWeeks } from "date-fns";

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
  
  const handlePrevWeek = () => {
    setCurrentWeek(prev => subWeeks(prev, 1));
  };
  
  const handleNextWeek = () => {
    setCurrentWeek(prev => addWeeks(prev, 1));
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
            image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            type: "breakfast"
          }
        }),
        ...(i % 2 === 0 && {
          lunch: {
            id: `lunch-${i}`,
            title: "Quinoa Salad Bowl",
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            type: "lunch"
          }
        }),
        ...(i % 2 === 1 && {
          dinner: {
            id: `dinner-${i}`,
            title: "Grilled Salmon with Vegetables",
            image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
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
