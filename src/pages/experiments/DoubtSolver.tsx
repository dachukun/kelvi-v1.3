import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { CardWithHover } from "@/components/ui/card-with-hover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, Image, RefreshCw } from "lucide-react";
import { callDeepSeekAPI } from "@/lib/deepseek";
import { useToast } from "@/hooks/use-toast";
import { MarkdownContent } from "@/components/ui/markdown-content";

export default function DoubtSolver() {
  const [grade, setGrade] = useState("");
  const [board, setBoard] = useState("CBSE");
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
      const systemPrompt = `You are an expert ${board} teacher specializing in ${subject} for grade ${grade}. 
Provide clear, accurate explanations that are easy for students to understand. 
Use step-by-step approaches and include examples where applicable.

IMPORTANT FORMATTING INSTRUCTIONS:
1. Use LaTeX for all mathematical expressions:
   - Inline math should be wrapped in \\( and \\)
   - Display math should be wrapped in \\[ and \\]
   - Use proper LaTeX commands for fractions (\\frac{num}{den}), exponents (^), subscripts (_), etc.
2. Use markdown for text formatting:
   - **bold** for important terms
   - *italic* for emphasis
3. Number steps clearly and use proper spacing
4. Format equations on separate lines using display math mode
5. Use proper mathematical notation for:
   - Fractions: \\frac{numerator}{denominator}
   - Square roots: \\sqrt{x}
   - Powers: x^{n}
   - Subscripts: x_{i}
   - Vectors: \\vec{v}
   - Matrices: \\begin{matrix} a & b \\\\ c & d \\end{matrix}
   - Greek letters: \\alpha, \\beta, etc.
   - Trigonometric functions: \\sin, \\cos, \\tan
   - Limits: \\lim_{x \\to a}
   - Integrals: \\int_{a}^{b}
   - Summations: \\sum_{i=1}^{n}`;
      
      const userPrompt = `I'm a grade ${grade} ${board} student and I need help with this ${subject} question:

${question}

Please provide:
1. A clear, step-by-step solution that's easy to understand
2. The underlying concepts involved
3. Any formulas or rules that apply
4. A brief explanation of how to approach similar problems

Make sure your explanation is aligned with the ${board} curriculum for grade ${grade} ${subject}.`;

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
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="w-full min-w-[300px]">
            <CardWithHover 
              title="Doubt Solver" 
              description="Get help with difficult questions"
              className="w-full min-h-[600px]"
            >
              <div className="space-y-6 p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="board">Board</Label>
                    <Select value={board} onValueChange={setBoard}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select board" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CBSE">CBSE</SelectItem>
                        <SelectItem value="ICSE">ICSE</SelectItem>
                        <SelectItem value="State Board">State Board</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade</Label>
                    <Select value={grade} onValueChange={setGrade}>
                      <SelectTrigger className="w-full">
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
                      <SelectTrigger className="w-full">
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
                    className="min-h-[200px] w-full"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
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
          
          <div className="w-full min-w-[300px]">
            <CardWithHover 
              title="Solution" 
              className="w-full min-h-[600px]"
            >
              <div className="relative h-full p-4">
                {result && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute right-4 top-4 z-10"
                    onClick={() => {
                      setResult(null);
                      solveDoubt();
                    }}
                  >
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                )}
                
                {solving ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="relative">
                      <img src="/Kais/doubt.png" alt="Solving Doubt" className="w-32 h-32 object-contain opacity-50" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin h-12 w-12 border-4 border-kelvi-green border-t-transparent rounded-full"></div>
                      </div>
                    </div>
                    <p className="mt-4">Solving your doubt...</p>
                    <p className="text-sm text-gray-500 mt-2">This may take a minute</p>
                  </div>
                ) : result ? (
                  <div className="p-4">
                    <MarkdownContent content={result} />
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p>Your solution will appear here.</p>
                    <p className="text-sm mt-2">
                      Fill out the form and click "Solve Doubt"
                    </p>
                  </div>
                )}
              </div>
            </CardWithHover>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
