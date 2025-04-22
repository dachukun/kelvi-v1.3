import { PageContainer } from "@/components/layout/PageContainer";
import { CardWithHover } from "@/components/ui/card-with-hover";
import { Link } from "react-router-dom";
import { ClipboardCheck, BookOpen, Award, HelpCircle } from "lucide-react";

export default function ExperimentsPage() {
  const experiments = [
    {
      id: "question-paper",
      title: "Generate Question Paper",
      description: "Create custom practice papers based on specific chapters and topics.",
      icon: <BookOpen className="h-10 w-10 mb-4" />,
      gradient: "none"
    },
    {
      id: "answer-analyzer",
      title: "Answer Sheet Analyzer",
      description: "Get detailed feedback and score estimation for your answer sheets.",
      icon: <Award className="h-10 w-10 mb-4" />,
      gradient: "none"
    },
    {
      id: "doubt-solver",
      title: "Doubt Solver",
      description: "Get instant solutions to your academic queries and doubts.",
      icon: <HelpCircle className="h-10 w-10 mb-4" />,
      gradient: "none"
    }
  ];

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <ClipboardCheck className="h-12 w-12 mx-auto mb-4 text-kelvi-blue" />
          <h1 className="text-3xl font-bold mb-2">AI Experiments</h1>
          <p className="text-gray-600">
            Interactive AI tools designed to enhance your learning experience
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {experiments.map((exp) => (
            <Link key={exp.id} to={`/experiments/${exp.id}`}>
              <CardWithHover
                className="h-full bg-gradient-to-br from-[#f0f7ff]/50 to-[#e8f3ff]/50 hover:from-[#e8f3ff]/50 hover:to-[#d8ebff]/50"
              >
                <div className="flex flex-col items-center text-center p-4">
                  {exp.icon}
                  <h3 className="text-xl font-bold mb-2">{exp.title}</h3>
                  <p className="text-sm text-gray-600">{exp.description}</p>
                </div>
              </CardWithHover>
            </Link>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our AI experiments are powered by DeepSeek AI technology to provide accurate, 
            curriculum-aligned assistance for CBSE students.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
