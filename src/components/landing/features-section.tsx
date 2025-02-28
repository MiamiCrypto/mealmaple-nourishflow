
import { Calendar, ShoppingBag, Utensils } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function FeaturesSection() {
  return (
    <section className="py-16 px-4 md:px-6">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our intuitive platform makes meal planning and preparation effortless
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-card border rounded-lg p-6 hover-scale card-shadow"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const features: Feature[] = [
  {
    title: "Create Meal Plans",
    description: "Plan your weekly meals with a simple drag-and-drop interface. Customize for dietary preferences and schedule.",
    icon: <Calendar className="h-6 w-6" />,
  },
  {
    title: "Generate Grocery Lists",
    description: "Automatically create shopping lists based on your meal plan. Never forget an ingredient again.",
    icon: <ShoppingBag className="h-6 w-6" />,
  },
  {
    title: "Discover Recipes",
    description: "Browse our collection of healthy recipes filtered by dietary preferences, prep time, and more.",
    icon: <Utensils className="h-6 w-6" />,
  },
];
