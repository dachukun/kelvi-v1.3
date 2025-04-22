
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { CardWithHover } from "@/components/ui/card-with-hover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { HelpCircle, Send } from "lucide-react";

export default function Support() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent",
        description: "We'll get back to you as soon as possible!",
      });
      setName("");
      setEmail("");
      setMessage("");
      setIsSubmitting(false);
    }, 1500);
  };

  const faqs = [
    {
      question: "How does the Question Paper Generator experiment work?",
      answer: "The Question Paper Generator uses DeepSeek AI to create customized practice papers based on your inputs. You simply provide your school name, board, grade, subject, and specify chapters with mark distribution. The AI then generates a complete question paper following CBSE guidelines with appropriate questions for your specified topics."
    },
    {
      question: "Can I save the generated question papers?",
      answer: "Currently, you can copy and paste the generated content into a document for saving. We're working on adding a direct download feature in a future update."
    },
    {
      question: "How accurate is the Answer Sheet Analyzer?",
      answer: "The Answer Sheet Analyzer uses DeepSeek Reasoner, a specialized AI model, to evaluate your answers. While it provides detailed feedback based on CBSE standards, it should be used as a learning tool rather than as an official evaluation. The accuracy depends on the clarity and completeness of the question paper and answer sheet you provide."
    },
    {
      question: "What subjects are supported by the Doubt Solver?",
      answer: "Doubt Solver supports all major CBSE subjects including Mathematics, Science, Social Science, English, Hindi, Physics, Chemistry, and Biology for grades 6-12. The AI is trained on CBSE curriculum content to provide accurate, curriculum-aligned answers."
    },
    {
      question: "Is my data private and secure?",
      answer: "Yes, we take data privacy seriously. Your account information is securely stored with Supabase. The questions and answers you submit to our AI tools are not permanently stored after processing, and we do not use your content for AI training."
    },
    {
      question: "How can I provide feedback or report issues?",
      answer: "You can use the contact form on this Support page to send us your feedback, report any issues, or make feature suggestions. We welcome your input to help improve KelviAI."
    }
  ];

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <HelpCircle className="h-12 w-12 mx-auto mb-4 text-kelvi-blue" />
          <h1 className="text-3xl font-bold mb-2">Support Center</h1>
          <p className="text-gray-600">Find answers to common questions or contact our team</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <CardWithHover title="Frequently Asked Questions">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardWithHover>
          </div>
          
          <div>
            <CardWithHover title="Contact Us" description="We're here to help">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help you?"
                    rows={5}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full gradient-blue"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </div>
                  )}
                </Button>
              </form>
            </CardWithHover>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
