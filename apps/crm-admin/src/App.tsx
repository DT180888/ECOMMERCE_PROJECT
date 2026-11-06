// src/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import router from "@app/router";
import { ToastProvider, ThemeProvider } from "@my-project/ui";


const queryClient = new QueryClient();

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          {/* Hide DevTools on mobile to avoid overlapping BottomBar; dock at bottom-right on desktop */}
          <div className="hidden md:block">
            <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
          </div>
        </QueryClientProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
