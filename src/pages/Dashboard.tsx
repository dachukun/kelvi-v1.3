
import { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { CardWithHover } from "@/components/ui/card-with-hover";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Clock, Calculator, CheckSquare, Award, ArrowRight, BookOpen } from "lucide-react";

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

  return (
    <PageContainer>
      <h1 className="text-3xl font-bold mb-2">Welcome, {user?.user_metadata?.full_name || 'Student'}</h1>
      <p className="text-gray-600 mb-8">Here's your learning dashboard.</p>
      
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
              <div className="text-5xl font-bold mb-2">{streak}</div>
              <div className="text-sm text-gray-600">Days in a row</div>
              
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
          <CardWithHover 
            title="Toolbox" 
            description="Quick access to study tools"
          >
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
