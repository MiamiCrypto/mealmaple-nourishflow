
import { Link } from "react-router-dom";
import { User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-semibold text-lg">
            <span className="text-primary">Meal</span>Maple
          </Link>
          {!isMobile && (
            <div className="flex items-center gap-6 ml-6">
              <NavLinks />
            </div>
          )}
        </div>

        {isMobile ? (
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/recipes">Browse Recipes</Link>
            </Button>
            <Button size="sm">
              <User className="mr-2 h-4 w-4" />
              <span>Sign In</span>
            </Button>
          </div>
        )}

        {/* Mobile menu dropdown */}
        {isMobile && isMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-background border-b shadow-lg animate-slide-in z-50">
            <div className="container py-4 flex flex-col gap-4">
              <MobileNavLinks />
              <div className="flex flex-col gap-2 mt-2">
                <Button variant="outline" size="sm" className="justify-start">
                  <User className="mr-2 h-4 w-4" />
                  <span>Sign In</span>
                </Button>
                <Button size="sm" className="justify-start">
                  <span>Get Started</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLinks() {
  return (
    <>
      <Link to="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
        Dashboard
      </Link>
      <Link to="/meal-plan" className="text-sm font-medium transition-colors hover:text-primary">
        Meal Plan
      </Link>
      <Link to="/grocery-list" className="text-sm font-medium transition-colors hover:text-primary">
        Grocery List
      </Link>
    </>
  );
}

function MobileNavLinks() {
  return (
    <>
      <Link to="/dashboard" className="text-sm font-medium py-2 transition-colors hover:text-primary">
        Dashboard
      </Link>
      <Link to="/meal-plan" className="text-sm font-medium py-2 transition-colors hover:text-primary">
        Meal Plan
      </Link>
      <Link to="/grocery-list" className="text-sm font-medium py-2 transition-colors hover:text-primary">
        Grocery List
      </Link>
      <Link to="/recipes" className="text-sm font-medium py-2 transition-colors hover:text-primary">
        Browse Recipes
      </Link>
    </>
  );
}
