
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { CardWithHover } from "@/components/ui/card-with-hover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold gradient-blue bg-clip-text text-transparent">KelviAI</h1>
          <p className="mt-2 text-gray-600">Smart toolkit for CBSE students</p>
        </div>
        
        <CardWithHover>
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">Log in to your account</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full gradient-blue"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
            
            <div className="text-center text-sm">
              <p>
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="text-kelvi-blue font-medium hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </CardWithHover>
      </div>
    </div>
  );
}
