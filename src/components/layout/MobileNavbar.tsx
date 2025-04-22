
import { useLocation, Link } from "react-router-dom";
import { Home, ClipboardCheck, User, HelpCircle } from "lucide-react";

export function MobileNavbar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t flex justify-around items-center py-2 z-50">
      <Link
        to="/"
        className={`flex flex-col items-center justify-center p-2 rounded-md ${
          isActive("/") ? "text-kelvi-blue" : "text-gray-500"
        }`}
      >
        <Home size={20} />
        <span className="text-xs">Home</span>
      </Link>
      
      <Link
        to="/experiments"
        className={`flex flex-col items-center justify-center p-2 rounded-md ${
          isActive("/experiments") ? "text-kelvi-blue" : "text-gray-500"
        }`}
      >
        <ClipboardCheck size={20} />
        <span className="text-xs">Experiments</span>
      </Link>
      
      <Link
        to="/profile"
        className={`flex flex-col items-center justify-center p-2 rounded-md ${
          isActive("/profile") ? "text-kelvi-blue" : "text-gray-500"
        }`}
      >
        <User size={20} />
        <span className="text-xs">Profile</span>
      </Link>
      
      <Link
        to="/support"
        className={`flex flex-col items-center justify-center p-2 rounded-md ${
          isActive("/support") ? "text-kelvi-blue" : "text-gray-500"
        }`}
      >
        <HelpCircle size={20} />
        <span className="text-xs">Support</span>
      </Link>
    </div>
  );
}
