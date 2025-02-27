
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Clock, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface RecipeCardProps {
  id: string;
  title: string;
  image: string;
  prepTime: number;
  servings: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  className?: string;
  style?: React.CSSProperties;
  onAddToMealPlan?: (recipeId: string) => void;
}

export function RecipeCard({ 
  id, 
  title, 
  image, 
  prepTime, 
  servings, 
  mealType,
  className,
  style,
  onAddToMealPlan
}: RecipeCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Card className={cn("overflow-hidden hover-scale card-shadow", className)} style={style}>
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90"
            onClick={toggleFavorite}
          >
            <Heart 
              className={cn(
                "h-4 w-4", 
                isFavorite ? "fill-red-500 text-red-500" : "text-slate-700"
              )} 
            />
          </Button>
        </div>
        <div className="absolute top-2 left-2">
          <span className={cn("meal-badge", `meal-badge-${mealType}`)}>
            {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
          </span>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-lg line-clamp-1">{title}</h3>
        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{prepTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            <span>{servings} servings</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => onAddToMealPlan && onAddToMealPlan(id)}
        >
          Add to Meal Plan
        </Button>
      </CardFooter>
    </Card>
  );
}
