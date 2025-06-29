"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CollectionProvider } from "../contexts/CollectionContext";
import { HeroProvider } from "../contexts/HeroContext";
import { AuthProvider } from "../contexts/AuthContext";

const queryClient = new QueryClient();

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CollectionProvider>
            <HeroProvider>{children}</HeroProvider>
          </CollectionProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
