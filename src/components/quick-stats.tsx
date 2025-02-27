
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, ShoppingBag, Utensils, Leaf } from "lucide-react";

export function QuickStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Time Saved" 
        value="4.5 hrs" 
        description="this week"
        icon={<Clock className="h-4 w-4 text-primary" />} 
      />
      <StatCard 
        title="Meals Planned" 
        value="16" 
        description="of 21 slots filled"
        icon={<Utensils className="h-4 w-4 text-primary" />} 
      />
      <StatCard 
        title="Grocery Items" 
        value="32" 
        description="ready for shopping"
        icon={<ShoppingBag className="h-4 w-4 text-primary" />} 
      />
      <StatCard 
        title="Nutrition Score" 
        value="8.4" 
        description="out of 10"
        icon={<Leaf className="h-4 w-4 text-primary" />} 
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

function StatCard({ title, value, description, icon }: StatCardProps) {
  return (
    <Card className="hover-scale card-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}
