import { App } from "./App";
import { ThemeProvider } from "./components/theme/theme-provider";
import { Toaster } from "./components/ui/toaster";

export function Root() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <App />
      <Toaster />
    </ThemeProvider>
  );
}
