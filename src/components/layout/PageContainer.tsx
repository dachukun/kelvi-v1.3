import { MobileNavbar } from "./MobileNavbar";
import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className={`container mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-32 ${className}`}>
        {children}
      </main>
      <MobileNavbar />
    </div>
  );
}
