import { Link, useLocation } from "react-router-dom";
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
} from "lucide-react";
import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
      { title: "Todo List", path: "/tools/todo", icon: FileQuestion },
      { title: "Pomodoro Timer", path: "/tools/pomodoro", icon: Brain },
    ]
  }
];

export function SideNav({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user } = useAuth();
  
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2">
                <img src="/Kais/kailogo.png" alt="Kai Logo" className="h-[2cm] w-[2cm] object-contain mb-4" />
                <div className="text-xs bg-[#b2ec5d]/20 px-2 py-0.5 rounded-full">Beta</div>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {allNavItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === item.path}
                        tooltip={item.title}
                        size="lg"
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
          </SidebarContent>
          
          {location.pathname !== '/profile' && (
            <Link to="/profile">
              <div className="absolute bottom-0 left-0 right-0 mx-4 mb-4 p-2 border border-white/40 backdrop-blur-md bg-[#b2ec5d]/10 hover:bg-[#b2ec5d]/20 transition-all duration-300 cursor-pointer rounded-2xl shadow-xl">
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
            </Link>
          )}
          
          <SidebarRail />
        </Sidebar>
        
        <div className="flex-1 min-h-screen">
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
