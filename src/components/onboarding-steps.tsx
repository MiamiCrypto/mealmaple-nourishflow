
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { 
  Clock, 
  Coffee, 
  Cookie, 
  AlignLeft, 
  Utensils, 
  AlignJustify,
  User,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function OnboardingSteps({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    dietaryPreferences: [] as string[],
    allergies: [] as string[],
    mealCount: 3,
    cookingTime: 30,
  });
  const { toast } = useToast();

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      toast({
        title: "Profile created!",
        description: "Your personalized meal plan is being generated.",
      });
      onComplete();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleDietaryPreference = (value: string) => {
    setFormData(prev => {
      const preferences = [...prev.dietaryPreferences];
      const index = preferences.indexOf(value);
      
      if (index === -1) {
        preferences.push(value);
      } else {
        preferences.splice(index, 1);
      }
      
      return { ...prev, dietaryPreferences: preferences };
    });
  };

  const toggleAllergy = (value: string) => {
    setFormData(prev => {
      const allergies = [...prev.allergies];
      const index = allergies.indexOf(value);
      
      if (index === -1) {
        allergies.push(value);
      } else {
        allergies.splice(index, 1);
      }
      
      return { ...prev, allergies: allergies };
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-scale-in">
      <CardHeader>
        <CardTitle>Let's get to know you</CardTitle>
        <CardDescription>
          Step {step} of 5: {getStepDescription(step)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">What's your name?</Label>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <Input 
                  id="name" 
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select your dietary preferences</Label>
              <div className="grid grid-cols-2 gap-2">
                {dietaryOptions.map((option) => (
                  <div 
                    key={option.value} 
                    className="flex items-center space-x-2"
                  >
                    <Checkbox 
                      id={option.value} 
                      checked={formData.dietaryPreferences.includes(option.value)}
                      onCheckedChange={() => toggleDietaryPreference(option.value)}
                    />
                    <Label htmlFor={option.value} className="text-sm cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Do you have any allergies?</Label>
              <div className="grid grid-cols-2 gap-2">
                {allergyOptions.map((option) => (
                  <div 
                    key={option.value} 
                    className="flex items-center space-x-2"
                  >
                    <Checkbox 
                      id={option.value} 
                      checked={formData.allergies.includes(option.value)}
                      onCheckedChange={() => toggleAllergy(option.value)}
                    />
                    <Label htmlFor={option.value} className="text-sm cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>How many meals do you want to plan per day?</Label>
              <RadioGroup 
                value={formData.mealCount.toString()} 
                onValueChange={(value) => updateFormData("mealCount", parseInt(value))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" id="meals-3" />
                  <Label htmlFor="meals-3" className="flex items-center space-x-2">
                    <div className="flex gap-0.5">
                      <Utensils className="h-4 w-4" />
                      <Utensils className="h-4 w-4" />
                      <Utensils className="h-4 w-4" />
                    </div>
                    <span>3 meals (breakfast, lunch, dinner)</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="4" id="meals-4" />
                  <Label htmlFor="meals-4" className="flex items-center space-x-2">
                    <div className="flex gap-0.5">
                      <Utensils className="h-4 w-4" />
                      <Utensils className="h-4 w-4" />
                      <Utensils className="h-4 w-4" />
                      <Cookie className="h-4 w-4" />
                    </div>
                    <span>4 meals (including snack)</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5" id="meals-5" />
                  <Label htmlFor="meals-5" className="flex items-center space-x-2">
                    <div className="flex gap-0.5">
                      <Coffee className="h-4 w-4" />
                      <Utensils className="h-4 w-4" />
                      <Utensils className="h-4 w-4" />
                      <Cookie className="h-4 w-4" />
                      <Utensils className="h-4 w-4" />
                    </div>
                    <span>5 meals (including snacks)</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>How much time do you want to spend cooking (per meal)?</Label>
              <div className="py-4">
                <Slider
                  defaultValue={[formData.cookingTime]}
                  max={60}
                  min={5}
                  step={5}
                  onValueChange={(values) => updateFormData("cookingTime", values[0])}
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>5 min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formData.cookingTime} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>60 min</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrev}
          disabled={step === 1}
        >
          Back
        </Button>
        <Button onClick={handleNext}>
          {step === 5 ? "Complete" : "Next"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function getStepDescription(step: number): string {
  switch (step) {
    case 1:
      return "Personal Information";
    case 2:
      return "Dietary Preferences";
    case 3:
      return "Allergies";
    case 4:
      return "Meal Frequency";
    case 5:
      return "Cooking Time";
    default:
      return "";
  }
}

const dietaryOptions = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "pescatarian", label: "Pescatarian" },
  { value: "keto", label: "Keto" },
  { value: "paleo", label: "Paleo" },
  { value: "gluten-free", label: "Gluten-Free" },
  { value: "dairy-free", label: "Dairy-Free" },
  { value: "low-carb", label: "Low Carb" },
];

const allergyOptions = [
  { value: "nuts", label: "Nuts" },
  { value: "shellfish", label: "Shellfish" },
  { value: "dairy", label: "Dairy" },
  { value: "eggs", label: "Eggs" },
  { value: "soy", label: "Soy" },
  { value: "wheat", label: "Wheat" },
  { value: "fish", label: "Fish" },
  { value: "sesame", label: "Sesame" },
];
