
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { CardWithHover } from "@/components/ui/card-with-hover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [grade, setGrade] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signUp(email, password, {
        full_name: fullName,
        school_name: schoolName,
        grade: grade,
      });
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
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
            <h2 className="text-2xl font-bold text-center mb-6">Create an account</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              
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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="schoolName">School Name</Label>
                <Input
                  id="schoolName"
                  type="text"
                  placeholder="Enter your school name"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="grade">Grade</Label>
                <Select
                  value={grade}
                  onValueChange={setGrade}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {[6, 7, 8, 9, 10, 11, 12].map((g) => (
                      <SelectItem key={g} value={g.toString()}>
                        Grade {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full gradient-blue"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Sign up"}
            </Button>
            
            <div className="text-center text-sm">
              <p>
                Already have an account?{" "}
                <Link to="/login" className="text-kelvi-blue font-medium hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </CardWithHover>
      </div>
    </div>
  );
}
