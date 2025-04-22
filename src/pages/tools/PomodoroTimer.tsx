
import { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { CardWithHover } from "@/components/ui/card-with-hover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, RotateCcw } from "lucide-react";

export default function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [focusLength, setFocusLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);
  const [completedSessions, setCompletedSessions] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer completed
            clearInterval(interval as NodeJS.Timeout);
            setIsActive(false);
            handleTimerComplete();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds]);

  const handleTimerComplete = () => {
    if (mode === "focus") {
      setCompletedSessions(completedSessions + 1);
      toast({
        title: "Focus session completed!",
        description: "Time for a break.",
      });
      setMode("break");
      setMinutes(breakLength);
      setSeconds(0);
    } else {
      toast({
        title: "Break time over!",
        description: "Ready for another focus session?",
      });
      setMode("focus");
      setMinutes(focusLength);
      setSeconds(0);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (mode === "focus") {
      setMinutes(focusLength);
    } else {
      setMinutes(breakLength);
    }
    setSeconds(0);
  };

  const updateFocusLength = (value: number[]) => {
    const newLength = value[0];
    setFocusLength(newLength);
    if (mode === "focus" && !isActive) {
      setMinutes(newLength);
      setSeconds(0);
    }
  };

  const updateBreakLength = (value: number[]) => {
    const newLength = value[0];
    setBreakLength(newLength);
    if (mode === "break" && !isActive) {
      setMinutes(newLength);
      setSeconds(0);
    }
  };

  const switchMode = (newMode: "focus" | "break") => {
    if (isActive) {
      setIsActive(false);
    }
    
    setMode(newMode);
    if (newMode === "focus") {
      setMinutes(focusLength);
    } else {
      setMinutes(breakLength);
    }
    setSeconds(0);
  };

  return (
    <PageContainer>
      <div className="max-w-md mx-auto">
        <CardWithHover
          gradient={mode === "focus" ? "blue" : "green"}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-lg">
              <Button
                variant={mode === "focus" ? "default" : "outline"}
                className={`rounded-l-lg rounded-r-none ${mode === "focus" ? "bg-kelvi-blue text-white" : ""}`}
                onClick={() => switchMode("focus")}
              >
                Focus
              </Button>
              <Button
                variant={mode === "break" ? "default" : "outline"}
                className={`rounded-r-lg rounded-l-none ${mode === "break" ? "bg-kelvi-green text-white" : ""}`}
                onClick={() => switchMode("break")}
              >
                Break
              </Button>
            </div>
          </div>
          
          <div className="text-7xl font-bold mb-8">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
          
          <div className="flex justify-center space-x-4 mb-8">
            <Button 
              size="lg" 
              onClick={toggleTimer}
              className={`${mode === "focus" ? "bg-kelvi-blue/90" : "bg-kelvi-green/90"}`}
            >
              {isActive ? <Pause className="mr-2" /> : <Play className="mr-2" />}
              {isActive ? "Pause" : "Start"}
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              onClick={resetTimer}
            >
              <RotateCcw className="mr-2" />
              Reset
            </Button>
          </div>
          
          <div className="mt-8 space-y-6">
            <div className="space-y-2 text-left">
              <div className="flex justify-between">
                <Label>Focus Session Length</Label>
                <span>{focusLength} min</span>
              </div>
              <Slider
                value={[focusLength]}
                min={5}
                max={60}
                step={5}
                onValueChange={updateFocusLength}
                disabled={isActive && mode === "focus"}
              />
            </div>
            
            <div className="space-y-2 text-left">
              <div className="flex justify-between">
                <Label>Break Length</Label>
                <span>{breakLength} min</span>
              </div>
              <Slider
                value={[breakLength]}
                min={1}
                max={30}
                step={1}
                onValueChange={updateBreakLength}
                disabled={isActive && mode === "break"}
              />
            </div>
          </div>
          
          <div className="mt-8 text-sm">
            Completed sessions: {completedSessions}
          </div>
        </CardWithHover>
      </div>
    </PageContainer>
  );
}
