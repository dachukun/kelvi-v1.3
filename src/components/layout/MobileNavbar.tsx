import { useLocation, Link } from "react-router-dom";
import { Home, FileText, User, HelpCircle, Brain, Search, BrainCircuit, Clock, Calculator, CheckSquare } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function MobileNavbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isExperimentActive = () => {
    return location.pathname.startsWith("/experiments") || location.pathname.startsWith("/tools");
  };

  return (
    <>
      {/* Rollout Menu */}
      <div 
        className={`fixed bottom-[64px] left-0 right-0 md:hidden bg-white border-t transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-y-0' : 'translate-y-full'
        } z-40`}
      >
        <div className="p-4">
          {/* Experiments Section */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-kelvi-green mb-2 px-3">Experiments</h3>
            <div className="space-y-1">
              <Link
                to="/experiments/doubt-solver"
                className={`flex items-center space-x-2 p-3 rounded-lg ${
                  isActive("/experiments/doubt-solver") ? "bg-kelvi-blue/10 text-kelvi-blue" : "hover:bg-gray-100"
                }`}
              >
                <Brain size={20} />
                <span>Doubt Solver</span>
              </Link>
              <Link
                to="/experiments/question-paper"
                className={`flex items-center space-x-2 p-3 rounded-lg ${
                  isActive("/experiments/question-paper") ? "bg-kelvi-blue/10 text-kelvi-blue" : "hover:bg-gray-100"
                }`}
              >
                <FileText size={20} />
                <span>Question Paper</span>
              </Link>
              <Link
                to="/experiments/answer-analyzer"
                className={`flex items-center space-x-2 p-3 rounded-lg ${
                  isActive("/experiments/answer-analyzer") ? "bg-kelvi-blue/10 text-kelvi-blue" : "hover:bg-gray-100"
                }`}
              >
                <Search size={20} />
                <span>Answer Analyzer</span>
              </Link>
            </div>
          </div>

          {/* Toolbox Section */}
          <div>
            <h3 className="text-sm font-semibold text-kelvi-green mb-2 px-3">Toolbox</h3>
            <div className="space-y-1">
              <Link
                to="/tools/pomodoro"
                className={`flex items-center space-x-2 p-3 rounded-lg ${
                  isActive("/tools/pomodoro") ? "bg-kelvi-blue/10 text-kelvi-blue" : "hover:bg-gray-100"
                }`}
              >
                <Clock size={20} />
                <span>Pomodoro Timer</span>
              </Link>
              <Link
                to="/tools/calculator"
                className={`flex items-center space-x-2 p-3 rounded-lg ${
                  isActive("/tools/calculator") ? "bg-kelvi-blue/10 text-kelvi-blue" : "hover:bg-gray-100"
                }`}
              >
                <Calculator size={20} />
                <span>Calculator</span>
              </Link>
              <Link
                to="/tools/todo"
                className={`flex items-center space-x-2 p-3 rounded-lg ${
                  isActive("/tools/todo") ? "bg-kelvi-blue/10 text-kelvi-blue" : "hover:bg-gray-100"
                }`}
              >
                <CheckSquare size={20} />
                <span>To-Do List</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
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
        
        <Button
          variant="ghost"
          className={`flex flex-col items-center justify-center p-2 rounded-md ${
            isExperimentActive() ? "text-kelvi-blue" : "text-gray-500"
          }`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <BrainCircuit
            size={20}
            className={`transform transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}
          />
          <span className="text-xs">Exps</span>
        </Button>
        
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
    </>
  );
}
