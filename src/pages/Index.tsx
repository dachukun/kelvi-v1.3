
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      // Redirect to dashboard if logged in, otherwise to login
      navigate(user ? "/dashboard" : "/login");
    }
  }, [navigate, user, isLoading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 border-4 border-kelvi-blue border-t-transparent rounded-full mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold">Loading KelviAI...</h1>
      </div>
    </div>
  );
};

export default Index;
