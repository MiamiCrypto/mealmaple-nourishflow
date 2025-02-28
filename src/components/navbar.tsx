
import { Link } from "react-router-dom";
import { User, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "?";
    const name = user.user_metadata?.name || user.email || "";
    if (!name) return "?";
    
    const parts = name.split(" ");
    if (parts.length === 1) return name.charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
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
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/meal-plan">Meal Plan</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/grocery-list">Grocery List</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button size="sm" asChild>
                <Link to="/auth">
                  <User className="mr-2 h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              </Button>
            )}
          </div>
        )}

        {/* Mobile menu dropdown */}
        {isMobile && isMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-background border-b shadow-lg animate-slide-in z-50">
            <div className="container py-4 flex flex-col gap-4">
              <MobileNavLinks />
              <div className="flex flex-col gap-2 mt-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-2 py-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{user.user_metadata?.name || user.email}</span>
                    </div>
                    <Button size="sm" variant="outline" onClick={handleSignOut} className="justify-start">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" asChild className="justify-start">
                      <Link to="/auth">
                        <User className="mr-2 h-4 w-4" />
                        <span>Sign In</span>
                      </Link>
                    </Button>
                    <Button size="sm" asChild className="justify-start">
                      <Link to="/auth?tab=signup">
                        <span>Get Started</span>
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLinks() {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <>
        <Link to="/recipes" className="text-sm font-medium transition-colors hover:text-primary">
          Recipes
        </Link>
      </>
    );
  }
  
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
  const { user } = useAuth();
  
  return (
    <>
      {user && (
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
        </>
      )}
      <Link to="/recipes" className="text-sm font-medium py-2 transition-colors hover:text-primary">
        Browse Recipes
      </Link>
    </>
  );
}
