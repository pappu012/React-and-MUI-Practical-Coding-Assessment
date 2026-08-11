import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell } from "./components/layout/AppShell";
import { HomePage } from "./features/home/HomePage";
import { TrainingSchedulePage } from "./features/schedule/TrainingSchedulePage";
import { theme } from "./theme";
import type { AppView } from "./types/navigation";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [activeView, setActiveView] = useState<AppView>("home");

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AppShell activeView={activeView} onNavigate={setActiveView}>
            {activeView === "home" ? (
              <HomePage onNavigateToSchedule={() => setActiveView("schedule")} />
            ) : (
              <TrainingSchedulePage />
            )}
          </AppShell>
        </LocalizationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
