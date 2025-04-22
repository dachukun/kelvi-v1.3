
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { CardWithHover } from "@/components/ui/card-with-hover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { callDeepSeekAPI } from "@/lib/deepseek";
import { useToast } from "@/hooks/use-toast";

interface ChapterDistribution {
  chapter: string;
  marks: number;
}

export default function QuestionPaperGenerator() {
  const [schoolName, setSchoolName] = useState("");
  const [board, setBoard] = useState("CBSE");
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [distributions, setDistributions] = useState<ChapterDistribution[]>([
    { chapter: "", marks: 0 }
  ]);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const addChapter = () => {
    setDistributions([...distributions, { chapter: "", marks: 0 }]);
  };

  const removeChapter = (index: number) => {
    const newDistributions = [...distributions];
    newDistributions.splice(index, 1);
    setDistributions(newDistributions);
  };

  const updateChapter = (index: number, field: keyof ChapterDistribution, value: string | number) => {
    const newDistributions = [...distributions];
    newDistributions[index] = {
      ...newDistributions[index],
      [field]: value
    };
    setDistributions(newDistributions);
  };

  const totalMarks = distributions.reduce((sum, item) => sum + item.marks, 0);

  const generateQuestionPaper = async () => {
    if (!schoolName || !grade || !subject) {
      toast({
        title: "Missing information",
        description: "Please fill in all the required fields.",
        variant: "destructive",
      });
      return;
    }

    if (distributions.some(d => !d.chapter) || totalMarks === 0) {
      toast({
        title: "Incomplete chapter distribution",
        description: "Please ensure all chapters are named and marks are allocated.",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    setResult(null);

    try {
      const systemPrompt = `You are an expert educational question paper designer for CBSE curriculum. Create a well-structured, professional question paper that follows CBSE formatting guidelines.`;
      
      const userPrompt = `Generate a complete question paper with the following details:
School Name: ${schoolName}
Board: ${board}
Grade: ${grade}
Subject: ${subject}

Chapter Distribution:
${distributions.map(d => `- ${d.chapter}: ${d.marks} marks`).join('\n')}

Total Marks: ${totalMarks}

Please create a well-structured question paper with:
1. A proper header including school name, subject, grade, and total marks
2. Sections divided by question types
3. Clear instructions for each section
4. A mix of different question types (MCQs, short answer, long answer, etc.)
5. The exact distribution of marks as specified above for each chapter
6. Proper formatting and numbering

The question paper should follow standard CBSE format and include quality questions that are age-appropriate and align with the curriculum for grade ${grade}.`;

      const generatedPaper = await callDeepSeekAPI(userPrompt, systemPrompt);
      setResult(generatedPaper);
    } catch (error) {
      console.error("Error generating question paper:", error);
      toast({
        title: "Generation failed",
        description: "There was an error generating your question paper. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <PageContainer>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <CardWithHover title="Generate Question Paper" description="Create a custom practice paper">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="schoolName">School Name</Label>
                <Input
                  id="schoolName"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="Enter school name"
                />
              </div>
              
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
              
              <div>
                <div className="flex justify-between items-center mb-4">
                  <Label>Chapter Distribution</Label>
                  <div className="text-sm">Total: {totalMarks} marks</div>
                </div>
                
                <div className="space-y-3">
                  {distributions.map((dist, index) => (
                    <div key={index} className="flex gap-3">
                      <Input
                        placeholder="Chapter name"
                        value={dist.chapter}
                        onChange={(e) => updateChapter(index, "chapter", e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Marks"
                        className="w-24"
                        value={dist.marks || ""}
                        onChange={(e) => updateChapter(index, "marks", parseInt(e.target.value) || 0)}
                      />
                      {distributions.length > 1 && (
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => removeChapter(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2" 
                    onClick={addChapter}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Chapter
                  </Button>
                </div>
              </div>
              
              <Button 
                onClick={generateQuestionPaper} 
                disabled={generating}
                className="w-full gradient-blue"
              >
                {generating ? 
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Generating Paper...
                  </> : 
                  "Generate Question Paper"
                }
              </Button>
            </div>
          </CardWithHover>
        </div>
        
        <div>
          <CardWithHover title="Generated Question Paper" className="h-full">
            {generating ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin mb-4 text-kelvi-blue" />
                <p>Generating your question paper...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a minute</p>
              </div>
            ) : result ? (
              <div className="prose max-w-full">
                <pre className="whitespace-pre-wrap text-sm">{result}</pre>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>Your generated question paper will appear here.</p>
                <p className="text-sm mt-2">
                  Fill out the form and click "Generate Question Paper"
                </p>
              </div>
            )}
          </CardWithHover>
        </div>
      </div>
    </PageContainer>
  );
}
