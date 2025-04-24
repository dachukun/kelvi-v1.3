import { Link, useLocation } from "react-router-dom";
import "@/styles/custom-scrollbar.css";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  BrainCircuit,
  Calculator,
  FileQuestion,
  Brain,
  MessagesSquare,
  HelpCircle,
  UserRound,
  ListTodo,
  Timer,
  PanelLeftClose,
  PanelRightOpen,
} from "lucide-react";
import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type NavItem = {
  title: string;
  path: string;
  icon: React.ComponentType<any>;
  isStatic?: boolean;
  subItems?: NavItem[];
};

const staticNavItems: NavItem[] = [
  { 
    title: "Dashboard", 
    path: "/dashboard", 
    icon: LayoutDashboard, 
    isStatic: true 
  },
  { 
    title: "Experiments", 
    path: "/experiments", 
    icon: BrainCircuit, 
    isStatic: true,
    subItems: [
      { title: "Question Paper", path: "/experiments/question-paper", icon: FileQuestion },
      { title: "Answer Analyzer", path: "/experiments/answer-analyzer", icon: MessagesSquare },
      { title: "Doubt Solver", path: "/experiments/doubt-solver", icon: Brain },
    ]
  },
  { 
    title: "Tools", 
    path: "/tools", 
    icon: Calculator, 
    isStatic: true,
    subItems: [
      { title: "Calculator", path: "/tools/calculator", icon: Calculator },
      { title: "Todo List", path: "/tools/todo", icon: ListTodo },
      { title: "Pomodoro Timer", path: "/tools/pomodoro", icon: Timer },
    ]
  }
];

export function SideNav({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user } = useAuth();
  const { state, toggleSidebar } = useSidebar();
  
  const dynamicNavItems = useMemo(() => {
    const currentPath = location.pathname;
    const isStaticPath = staticNavItems.some(item => 
      item.path === currentPath || 
      (item.subItems && item.subItems.some(subItem => subItem.path === currentPath))
    );

    if (isStaticPath) {
      return [];
    }
    
    return [{
      title: currentPath.split("/").pop()?.replace("-", " ") || "Page",
      path: currentPath,
      icon: LayoutDashboard,
      isStatic: false
    }] as NavItem[];
  }, [location.pathname]);

  const allNavItems = [...staticNavItems, ...dynamicNavItems];

  return (
    <div className="flex h-screen">
      <Sidebar className="border-r">
        <SidebarContent className="flex flex-col h-screen">
          <SidebarGroup className="flex-shrink-0">
            <div className="flex items-center justify-between px-4 h-[3cm]">
              <img src="/Kais/kailogo.png" alt="Kai Logo" className="h-[2.5cm] w-[2.5cm] object-contain" />
              {state === "expanded" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="hover:bg-[#b2ec5d]/20"
                >
                  <PanelLeftClose className="h-5 w-5" />
                </Button>
              )}
            </div>
          </SidebarGroup>
          
          <SidebarGroup className="flex-1 overflow-y-auto custom-scrollbar">
            <SidebarGroupContent className="mt-[-0.3cm] pt-[0.2cm]">
              <SidebarMenu className="border-t-2 border-b-2 border-[#b2ec5d]/40 py-[0.2cm]">
                {allNavItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.path}
                      tooltip={item.title}
                      size="lg"
                      className={item.title === "Experiments" || item.title === "Tools" ? "text-[#b2ec5d]" : ""}
                    >
                      <Link to={item.path}>
                        <item.icon size={24} />
                        <span className="text-base">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.subItems && (
                      <SidebarMenu>
                        {item.subItems.map((subItem) => (
                          <SidebarMenuItem key={subItem.path} className="ml-4 mt-1">
                            <SidebarMenuButton
                              asChild
                              isActive={location.pathname === subItem.path}
                              tooltip={subItem.title}
                              size="default"
                            >
                              <Link to={subItem.path}>
                                <subItem.icon size={20} />
                                <span className="text-sm">{subItem.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup className="flex-shrink-0 mt-auto">
            {location.pathname !== '/profile' && (
              <Link to="/profile">
                <div className="mx-4 mb-4 border-t-2 border-[#b2ec5d]/40 pt-[0.2cm]">
                  <div className="p-2 border border-white/40 backdrop-blur-md bg-[#b2ec5d]/10 hover:bg-[#b2ec5d]/20 transition-all duration-300 cursor-pointer rounded-2xl shadow-xl">
                    <div className="flex items-center justify-between h-[2cm] p-2">
                      <div className="flex items-center gap-3">
                        <Avatar 
                          className="h-10 w-10" 
                          style={{ 
                            backgroundColor: user?.user_metadata?.avatar_bg || "#F2FCE2"
                          }}
                        >
                          {user?.user_metadata?.avatar_url ? (
                            <AvatarImage src={user.user_metadata.avatar_url} alt="Profile" />
                          ) : (
                            <AvatarFallback className="bg-[#b2ec5d] text-black">
                              {(user?.user_metadata?.display_name || user?.user_metadata?.full_name || 'U')[0].toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{user?.user_metadata?.display_name || user?.user_metadata?.full_name || 'User'}</span>
                          <span className="text-xs text-gray-500">{user?.user_metadata?.school_name || 'School'}</span>
                        </div>
                      </div>
                      {location.pathname !== '/support' && (
                        <Link 
                          to="/support" 
                          className="p-2 rounded-full hover:bg-[#b2ec5d]/20"
                        >
                          <HelpCircle size={20} className="text-gray-500" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            )}
          </SidebarGroup>
          
          <SidebarRail />
        </SidebarContent>
      </Sidebar>
      
      {state === "collapsed" && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="fixed left-2 top-4 z-50 hover:bg-[#b2ec5d]/20"
        >
          <PanelRightOpen className="h-5 w-5" />
        </Button>
      )}
      
      <div className="flex-1 min-h-screen">
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
