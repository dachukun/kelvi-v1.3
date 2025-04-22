
import { MobileNavbar } from "./MobileNavbar";
import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className={`container mx-auto pt-4 pb-24 px-4 ${className}`}>
        {children}
      </main>
      <MobileNavbar />
    </div>
  );
}
