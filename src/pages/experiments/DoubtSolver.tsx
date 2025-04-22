
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { CardWithHover } from "@/components/ui/card-with-hover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, Image } from "lucide-react";
import { callDeepSeekAPI } from "@/lib/deepseek";
import { useToast } from "@/hooks/use-toast";

export default function DoubtSolver() {
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [solving, setSolving] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const solveDoubt = async () => {
    if (!grade || !subject || !question) {
      toast({
        title: "Missing information",
        description: "Please fill in all the required fields.",
        variant: "destructive",
      });
      return;
    }

    setSolving(true);
    setResult(null);

    try {
      const systemPrompt = `You are an expert CBSE teacher specializing in ${subject} for grade ${grade}. Provide clear, accurate explanations that are easy for students to understand. Use step-by-step approaches and include examples where applicable.`;
      
      const userPrompt = `I'm a grade ${grade} CBSE student and I need help with this ${subject} question:

${question}

Please provide:
1. A clear, step-by-step solution that's easy to understand
2. The underlying concepts involved
3. Any formulas or rules that apply
4. A brief explanation of how to approach similar problems

Make sure your explanation is aligned with the CBSE curriculum for grade ${grade} ${subject}.`;

      const solution = await callDeepSeekAPI(userPrompt, systemPrompt);
      setResult(solution);
    } catch (error) {
      console.error("Error solving doubt:", error);
      toast({
        title: "Solving failed",
        description: "There was an error solving your doubt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSolving(false);
    }
  };

  return (
    <PageContainer>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <CardWithHover title="Doubt Solver" description="Get help with difficult questions">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">                
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Select value={grade} onValueChange={setGrade}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
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
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="Social Science">Social Science</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="question">Your Question</Label>
                <Textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Type your question here in detail"
                  className="min-h-[200px]"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  disabled={true}
                >
                  <Image className="mr-2 h-4 w-4" />
                  Upload Image (Coming Soon)
                </Button>
                
                <Button 
                  onClick={solveDoubt} 
                  disabled={solving}
                  className="flex-1 bg-[#b2ec5d] hover:bg-[#b2ec5d]/90 text-black"
                >
                  {solving ? 
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Solving...
                    </> : 
                    "Solve Doubt"
                  }
                </Button>
              </div>
            </div>
          </CardWithHover>
        </div>
        
        <div>
          <CardWithHover title="Solution" className="h-full">
            {solving ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin mb-4 text-kelvi-blue" />
                <p>Solving your doubt...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a minute</p>
              </div>
            ) : result ? (
              <div className="prose max-w-full">
                <pre className="whitespace-pre-wrap text-sm">{result}</pre>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>Your solution will appear here.</p>
                <p className="text-sm mt-2">
                  Fill out the form and click "Solve Doubt"
                </p>
              </div>
            )}
          </CardWithHover>
        </div>
      </div>
    </PageContainer>
  );
}
