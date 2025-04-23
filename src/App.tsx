import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SideNav } from "./components/layout/SideNav";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

// Auth pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

// Main pages
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Support from "./pages/Support";

// Experiment pages
import QuestionPaperGenerator from "./pages/experiments/QuestionPaperGenerator";
import AnswerSheetAnalyzer from "./pages/experiments/AnswerSheetAnalyzer";
import DoubtSolver from "./pages/experiments/DoubtSolver";

// Tool pages
import PomodoroTimer from "./pages/tools/PomodoroTimer";
import Calculator from "./pages/tools/Calculator";
import TodoList from "./pages/tools/TodoList";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-kelvi-blue border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public route that redirects to dashboard if already authenticated
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-kelvi-blue border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    {/* Root route */}
    <Route path="/" element={<Index />} />
    
    {/* Public routes */}
    <Route 
      path="/login" 
      element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } 
    />
    <Route 
      path="/signup" 
      element={
        <PublicRoute>
          <Signup />
        </PublicRoute>
      } 
    />
    
    {/* Protected routes - Wrapped in SideNav */}
    <Route 
      path="/dashboard" 
      element={
        <ProtectedRoute>
          <SideNav>
            <Dashboard />
          </SideNav>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/profile" 
      element={
        <ProtectedRoute>
          <SideNav>
            <Profile />
          </SideNav>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/support" 
      element={
        <ProtectedRoute>
          <SideNav>
            <Support />
          </SideNav>
        </ProtectedRoute>
      } 
    />
    
    {/* Experiment routes */}
    <Route 
      path="/experiments/question-paper" 
      element={
        <ProtectedRoute>
          <SideNav>
            <QuestionPaperGenerator />
          </SideNav>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/experiments/answer-analyzer" 
      element={
        <ProtectedRoute>
          <SideNav>
            <AnswerSheetAnalyzer />
          </SideNav>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/experiments/doubt-solver" 
      element={
        <ProtectedRoute>
          <SideNav>
            <DoubtSolver />
          </SideNav>
        </ProtectedRoute>
      } 
    />
    
    {/* Tool routes */}
    <Route 
      path="/tools/pomodoro" 
      element={
        <ProtectedRoute>
          <SideNav>
            <PomodoroTimer />
          </SideNav>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/tools/calculator" 
      element={
        <ProtectedRoute>
          <SideNav>
            <Calculator />
          </SideNav>
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/tools/todo" 
      element={
        <ProtectedRoute>
          <SideNav>
            <TodoList />
          </SideNav>
        </ProtectedRoute>
      } 
    />
    
    {/* 404 route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
