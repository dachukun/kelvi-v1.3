import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { CardWithHover } from "@/components/ui/card-with-hover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Loader2, Upload } from "lucide-react";
import { callDeepSeekReasoner } from "@/lib/deepseek";
import { useToast } from "@/hooks/use-toast";

export default function AnswerSheetAnalyzer() {
  const [grade, setGrade] = useState("");
  const [board, setBoard] = useState("CBSE");
  const [subject, setSubject] = useState("");
  const [questionPaper, setQuestionPaper] = useState("");
  const [answerSheet, setAnswerSheet] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const analyzeAnswerSheet = async () => {
    if (!grade || !subject || !questionPaper || !answerSheet) {
      toast({
        title: "Missing information",
        description: "Please fill in all the required fields.",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);
    setResult(null);

    try {
      const systemPrompt = `You are an expert CBSE teacher and evaluator who specializes in providing detailed feedback on student answers. Analyze the answer sheet with precision and provide constructive feedback aligned with CBSE evaluation standards.`;
      
      const userPrompt = `I need you to analyze a student's answer sheet for:
Board: ${board}
Grade: ${grade}
Subject: ${subject}

Here's the question paper:
${questionPaper}

And here's the student's answer sheet:
${answerSheet}

Please provide a comprehensive analysis that includes:
1. A detailed evaluation of each answer, comparing it to what would be an ideal response
2. An estimated score for each answer and the overall paper
3. Specific areas of strength in the student's responses
4. Areas where the student can improve
5. Suggestions for better answer writing techniques
6. Subject-specific feedback relevant to the ${subject} curriculum for grade ${grade}

Format your response clearly with sections for Score, Strengths, Areas for Improvement, and Detailed Feedback.`;

      const analysis = await callDeepSeekReasoner(userPrompt, systemPrompt);
      setResult(analysis);
    } catch (error) {
      console.error("Error analyzing answer sheet:", error);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your answer sheet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <PageContainer>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <CardWithHover title="Answer Sheet Analyzer" description="Get detailed feedback on your answers">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="board">Board</Label>
                  <Select value={board} onValueChange={setBoard}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select board" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CBSE">CBSE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
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
              
              <Separator />
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="questionPaper">Question Paper</Label>
                  <Textarea
                    id="questionPaper"
                    value={questionPaper}
                    onChange={(e) => setQuestionPaper(e.target.value)}
                    placeholder="Paste the question paper here"
                    className="min-h-[120px]"
                  />
                  <p className="text-xs text-gray-500">
                    You can also upload an image of the question paper (coming soon)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="answerSheet">Your Answer Sheet</Label>
                  <Textarea
                    id="answerSheet"
                    value={answerSheet}
                    onChange={(e) => setAnswerSheet(e.target.value)}
                    placeholder="Paste your answers here"
                    className="min-h-[150px]"
                  />
                  <p className="text-xs text-gray-500">
                    You can also upload an image of your answer sheet (coming soon)
                  </p>
                </div>
                
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={true}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Images (Coming Soon)
                </Button>
              </div>
              
              <Button 
                onClick={analyzeAnswerSheet} 
                disabled={analyzing}
                className="w-full bg-[#b2ec5d] hover:bg-[#b2ec5d]/90 text-black"
              >
                {analyzing ? 
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Analyzing Answers...
                  </> : 
                  "Analyze Answer Sheet"
                }
              </Button>
            </div>
          </CardWithHover>
        </div>
        
        <div>
          <CardWithHover title="Analysis Results" className="h-full">
            {analyzing ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative">
                  <img src="/Kais/analyze.png" alt="Analyzing" className="w-32 h-32 object-contain opacity-50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin h-12 w-12 border-4 border-kelvi-green border-t-transparent rounded-full"></div>
                  </div>
                </div>
                <p className="mt-4">Analyzing your answer sheet...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a minute</p>
              </div>
            ) : result ? (
              <div className="prose max-w-full">
                <pre className="whitespace-pre-wrap text-sm">{result}</pre>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>Your analysis results will appear here.</p>
                <p className="text-sm mt-2">
                  Fill out the form and click "Analyze Answer Sheet"
                </p>
              </div>
            )}
          </CardWithHover>
        </div>
      </div>
    </PageContainer>
  );
}
