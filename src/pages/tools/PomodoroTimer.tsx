import { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { CardWithHover } from "@/components/ui/card-with-hover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, RotateCcw, Bell, BellOff, Target, CheckCircle2, Timer, Volume2 } from "lucide-react";

interface PomodoroSettings {
  focusLength: number;
  breakLength: number;
  dailyGoal: number;
  autoStartNextSession: boolean;
  soundEnabled: boolean;
}

export default function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [focusLength, setFocusLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(8);
  const [currentTask, setCurrentTask] = useState("");
  const [autoStartNextSession, setAutoStartNextSession] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("pomodoro_settings");
    if (savedSettings) {
      const settings: PomodoroSettings = JSON.parse(savedSettings);
      setFocusLength(settings.focusLength);
      setBreakLength(settings.breakLength);
      setDailyGoal(settings.dailyGoal);
      setAutoStartNextSession(settings.autoStartNextSession);
      setSoundEnabled(settings.soundEnabled);
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    const settings: PomodoroSettings = {
      focusLength,
      breakLength,
      dailyGoal,
      autoStartNextSession,
      soundEnabled
    };
    localStorage.setItem("pomodoro_settings", JSON.stringify(settings));
  }, [focusLength, breakLength, dailyGoal, autoStartNextSession, soundEnabled]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          const totalSeconds = mode === "focus" ? focusLength * 60 : breakLength * 60;
          const currentSeconds = minutes * 60 + seconds;
          return ((totalSeconds - currentSeconds) / totalSeconds) * 100;
        });

        if (seconds === 0) {
          if (minutes === 0) {
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        toggleTimer();
      } else if (e.code === "KeyR") {
        resetTimer();
      } else if (e.code === "KeyF") {
        switchMode("focus");
      } else if (e.code === "KeyB") {
        switchMode("break");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isActive]);

  const handleTimerComplete = () => {
    if (mode === "focus") {
      setCompletedSessions(completedSessions + 1);
      
      if (soundEnabled) {
        const audio = new Audio("/notification.mp3");
        audio.play();
      }

      toast({
        title: "Focus session completed!",
        description: currentTask ? `Completed: ${currentTask}` : "Time for a break.",
      });

      setMode("break");
      setMinutes(breakLength);
      setSeconds(0);
      setProgress(0);
      
      if (autoStartNextSession) {
        setIsActive(true);
      }
    } else {
      if (soundEnabled) {
        const audio = new Audio("/notification.mp3");
        audio.play();
      }

      toast({
        title: "Break time over!",
        description: "Ready for another focus session?",
      });

      setMode("focus");
      setMinutes(focusLength);
      setSeconds(0);
      setProgress(0);
      setCurrentTask("");
      
      if (autoStartNextSession) {
        setIsActive(true);
      }
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
    setProgress(0);
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
    setProgress(0);
  };

  return (
    <PageContainer>
      <div className="max-w-md mx-auto">
        <CardWithHover
          gradient={mode === "focus" ? "green" : "green"}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-lg">
              <Button
                variant={mode === "focus" ? "default" : "outline"}
                className={`rounded-l-lg rounded-r-none ${mode === "focus" ? "bg-kelvi-green text-white" : ""}`}
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

          {mode === "focus" && !isActive && (
            <div className="mb-4">
              <Input
                placeholder="What are you working on?"
                value={currentTask}
                onChange={(e) => setCurrentTask(e.target.value)}
                className="text-center"
              />
            </div>
          )}
          
          <div className="relative mb-8">
            <div className="text-7xl font-bold">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </div>
            <Progress value={progress} className="h-2 mt-4" />
          </div>
          
          <div className="flex justify-center space-x-4 mb-8">
            <Button 
              size="lg" 
              onClick={toggleTimer}
              className={`${mode === "focus" ? "bg-kelvi-green/90" : "bg-kelvi-green/90"}`}
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

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-center gap-2 text-kelvi-green mb-1">
                <Target className="h-4 w-4" />
                <span>Daily Goal</span>
              </div>
              <div className="text-2xl font-bold">
                {completedSessions} / {dailyGoal}
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-center gap-2 text-kelvi-green mb-1">
                <Timer className="h-4 w-4" />
                <span>Total Focus Time</span>
              </div>
              <div className="text-2xl font-bold">
                {completedSessions * focusLength}m
              </div>
            </div>
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

            <div className="space-y-2 text-left">
              <div className="flex justify-between">
                <Label>Daily Goal (sessions)</Label>
                <span>{dailyGoal} sessions</span>
              </div>
              <Slider
                value={[dailyGoal]}
                min={1}
                max={16}
                step={1}
                onValueChange={(value) => setDailyGoal(value[0])}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center">
                    <Bell className="h-4 w-4 mr-2" />
                    <Label>Sound Notifications</Label>
                  </div>
                </div>
                <Switch
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    <Label>Auto-start Next Session</Label>
                  </div>
                </div>
                <Switch
                  checked={autoStartNextSession}
                  onCheckedChange={setAutoStartNextSession}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            Keyboard shortcuts: Space (Start/Pause), R (Reset), F (Focus), B (Break)
          </div>
        </CardWithHover>
      </div>
    </PageContainer>
  );
}
