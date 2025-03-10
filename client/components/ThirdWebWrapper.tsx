"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThirdwebProvider } from "thirdweb/react";
import { ProjectProvider } from "@/app/context/ProjectContext"


const queryClient = new QueryClient();

export default function ThirdWebWrapper({
    children,
  }: {
    children: React.ReactNode;
  }) {

    return (
        <ProjectProvider>
      <QueryClientProvider client={queryClient}>
        <ThirdwebProvider>
          {children}
        </ThirdwebProvider>
      </QueryClientProvider>
      </ProjectProvider>
    );
  }