
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-secondary py-8 px-4 md:px-6 border-t">
      <div className="container max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">
              <span className="text-primary">Meal</span>Maple
            </h3>
            <p className="text-muted-foreground">
              Smart meal planning for a healthier lifestyle.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/recipes" className="text-muted-foreground hover:text-foreground transition-colors">
                  Recipes
                </Link>
              </li>
              <li>
                <Link to="/meal-plan" className="text-muted-foreground hover:text-foreground transition-colors">
                  Meal Plan
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <address className="not-italic text-muted-foreground">
              <p>contact@mealmaple.com</p>
              <p>1234 Healthy Street</p>
              <p>San Francisco, CA 94110</p>
            </address>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MealMaple. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
