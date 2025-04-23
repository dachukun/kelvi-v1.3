import { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { CardWithHover } from "@/components/ui/card-with-hover";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Clock, Calculator, CheckSquare, Award, ArrowRight, BookOpen, FileText, HelpCircle, CheckCircle2 } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [quizQuestion, setQuizQuestion] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState<number>(localStorage.getItem('quiz_streak') ? parseInt(localStorage.getItem('quiz_streak') || '0') : 0);

  // Move demoQuestions to component scope so it's accessible by all functions
  const demoQuestions = [
    {
      question: "What is the capital of India?",
      options: ["Mumbai", "New Delhi", "Kolkata", "Chennai"],
      correct_answer: "New Delhi"
    },
    {
      question: "Which of the following is not a renewable source of energy?",
      options: ["Solar Energy", "Wind Energy", "Nuclear Energy", "Tidal Energy"],
      correct_answer: "Nuclear Energy"
    },
    {
      question: "Who is known as the Father of the Indian Constitution?",
      options: ["Mahatma Gandhi", "Jawaharlal Nehru", "Dr. B.R. Ambedkar", "Sardar Vallabhbhai Patel"],
      correct_answer: "Dr. B.R. Ambedkar"
    }
  ];

  useEffect(() => {
    setQuizQuestion(demoQuestions[Math.floor(Math.random() * demoQuestions.length)]);
    setLoading(false);
  }, []);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    if (quizQuestion) {
      const correct = option === quizQuestion.correct_answer;
      setIsCorrect(correct);
      
      if (correct) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem('quiz_streak', newStreak.toString());
      } else {
        setStreak(0);
        localStorage.setItem('quiz_streak', '0');
      }
    }
  };

  const startQuiz = () => {
    setQuizQuestion(demoQuestions[Math.floor(Math.random() * demoQuestions.length)]);
    setSelectedOption(null);
    setIsCorrect(null);
    setLoading(false);
  };

  const toolboxItems = [
    { name: "Pomodoro Timer", icon: <Clock className="h-6 w-6" />, path: "/tools/pomodoro" },
    { name: "Calculator", icon: <Calculator className="h-6 w-6" />, path: "/tools/calculator" },
    { name: "To-Do List", icon: <CheckSquare className="h-6 w-6" />, path: "/tools/todo" },
  ];

  const aiTools = [
    {
      name: "Question Paper Generator",
      icon: "/Kais/questionnp.png",
      fallbackIcon: <FileText className="h-8 w-8" />,
      path: "/experiments/question-paper",
      gradient: "from-blue-500/10 to-blue-600/10"
    },
    {
      name: "Doubt Solver",
      icon: "/Kais/doubt.png",
      fallbackIcon: <HelpCircle className="h-8 w-8" />,
      path: "/experiments/doubt-solver",
      gradient: "from-green-500/10 to-green-600/10"
    },
    {
      name: "Answer Sheet Analyzer",
      icon: "/Kais/analyze.png",
      fallbackIcon: <CheckCircle2 className="h-8 w-8" />,
      path: "/experiments/answer-analyzer",
      gradient: "from-purple-500/10 to-purple-600/10"
    }
  ];

  return (
    <PageContainer>
      <h1 className="text-3xl font-bold mb-2">Welcome, {user?.user_metadata?.full_name || 'Student'}</h1>
      <p className="text-gray-600 mb-8">Here's your learning dashboard.</p>
      
      {/* AI Experiments Section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">AI Experiments</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {aiTools.map((tool) => (
            <Link key={tool.name} to={tool.path}>
              <CardWithHover
                className={`h-full backdrop-blur-md bg-white/30 border border-white/40 hover:shadow-lg transition-all duration-300 bg-gradient-to-br ${tool.gradient}`}
              >
                <div className="flex items-center space-x-4 p-3">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-lg bg-white/50 flex items-center justify-center">
                      <img
                        src={tool.icon}
                        alt={tool.name}
                        className="w-20 h-20 object-contain"
                        onError={(e) => {
                          const target = e.currentTarget;
                          const nextElement = target.nextElementSibling as HTMLElement;
                          target.style.display = 'none';
                          if (nextElement) {
                            nextElement.style.display = 'block';
                          }
                        }}
                      />
                      <div className="hidden text-gray-600">{tool.fallbackIcon}</div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-800 flex-1">{tool.name}</h3>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardWithHover>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 space-y-6">
          {/* Daily Quiz Section */}
          <CardWithHover 
            title="Daily Quiz Challenge" 
            description="Test your knowledge with a daily quiz question."
            className="h-full"
          >
            {loading ? (
              <div className="py-8 text-center">Loading question...</div>
            ) : quizQuestion ? (
              <div className="space-y-4">
                <div className="font-medium text-lg">{quizQuestion.question}</div>
                
                <div className="space-y-2">
                  {quizQuestion.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleOptionSelect(option)}
                      disabled={selectedOption !== null}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                        selectedOption === option
                          ? option === quizQuestion.correct_answer
                            ? "bg-green-100 border-green-500"
                            : "bg-red-100 border-red-500"
                          : "hover:bg-gray-100 border-gray-200"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                
                {isCorrect !== null && (
                  <div className={`text-center p-3 rounded-lg ${isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {isCorrect 
                      ? "Correct! Well done." 
                      : `Incorrect. The correct answer is ${quizQuestion.correct_answer}.`}
                  </div>
                )}
                
                <div className="flex justify-center">
                  <Button 
                    onClick={startQuiz} 
                    className="w-full bg-[#b2ec5d] hover:bg-[#b2ec5d]/90 text-black"
                  >
                    Start Quiz
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">No question available. Please try again later.</div>
            )}
          </CardWithHover>
        </div>
        
        <div className="space-y-6">
          {/* Streak Card */}
          <CardWithHover 
            title="Quiz Streak" 
            description="Keep learning to build your streak!"
            className="bg-[#b2ec5d]/10"
          >
            <div className="flex flex-col items-center py-4">
              <div className="relative">
                <img src="/Kais/streak.png" alt="Streak" className="w-32 h-32 object-contain" />
                <div className="absolute top-0 left-0 bg-white/80 rounded-full px-2 py-1 text-2xl font-bold">
                  {streak}
                </div>
              </div>
              <div className="text-sm text-gray-600 mt-2">Days in a row</div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-6">
                <div 
                  className="bg-kelvi-green h-2.5 rounded-full" 
                  style={{ width: `${Math.min(streak * 10, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs mt-2 text-gray-500">
                {streak >= 10 ? 'Streak master!' : `${10 - streak} more days to reach level 10`}
              </div>
            </div>
          </CardWithHover>
          
          {/* Toolbox */}
          <CardWithHover>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">Toolbox</h3>
                <p className="text-sm text-gray-500">Quick access to study tools</p>
              </div>
              <img 
                src="/Kais/toolbox.png" 
                alt="Toolbox" 
                className="w-12 h-12 object-contain"
              />
            </div>
            <div className="space-y-2">
              {toolboxItems.map((item) => (
                <Button
                  key={item.name}
                  variant="outline"
                  className="w-full justify-start gap-3"
                  asChild
                >
                  <Link to={item.path}>
                    {item.icon}
                    {item.name}
                  </Link>
                </Button>
              ))}
            </div>
          </CardWithHover>
        </div>
      </div>
    </PageContainer>
  );
}
