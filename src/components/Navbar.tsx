import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary hover:text-primary-dark transition-colors">
          TerrierTable
        </Link>
        <Link to="/auth">
          <Button variant="outline">Log In</Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
