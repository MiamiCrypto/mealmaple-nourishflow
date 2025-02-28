
import { useState } from "react";
import { RecipeCard } from "@/components/recipe-card";
import { RecipeDetailModal } from "@/components/recipe-detail-modal";

interface RecipeCardWrapperProps {
  id: string;
  title: string;
  image: string;
  prepTime: number;
  servings: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  tags?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  className?: string;
  style?: React.CSSProperties;
  onAddToMealPlan: (recipeId: string) => void;
}

export function RecipeCardWrapper(props: RecipeCardWrapperProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <RecipeCard
        {...props}
        onClick={handleCardClick}
      />
      <RecipeDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recipe={props}
        onAddToMealPlan={props.onAddToMealPlan}
      />
    </>
  );
}
