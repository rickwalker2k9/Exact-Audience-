import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import PasswordGate from "./components/PasswordGate";
import { ThemeProvider } from "./contexts/ThemeContext";

// Pages
import Campaigns from "./pages/Campaigns";
import Home from "./pages/Home";
import LamborghiniDashboard from "./pages/LamborghiniDashboard";
import WarbyDashboard from "./pages/WarbyDashboard";
import PolicyGeniusDashboard from "./pages/PolicyGeniusDashboard";
import CampaignPlaceholder from "./pages/CampaignPlaceholder";
import BuyerProfilePage from "./pages/BuyerProfilePage";
import McCartryDashboard from "./pages/McCartryDashboard";

function Router() {
  return (
    <Switch>
      {/* Campaign directory — post-login home */}
      <Route path="/campaigns" component={Campaigns} />

      {/* Full dashboards */}
      <Route path="/" component={Home} />
      <Route path="/lamborghini" component={LamborghiniDashboard} />
      <Route path="/warby-parker" component={WarbyDashboard} />
      <Route path="/policygenius" component={PolicyGeniusDashboard} />
      <Route path="/mccarty" component={McCartryDashboard} />

      {/* Placeholder for campaigns without a full dashboard */}
      <Route path="/campaign/:slug" component={CampaignPlaceholder} />

      {/* Buyer profile detail pages */}
      <Route path="/buyer/:id" component={BuyerProfilePage} />

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <TooltipProvider>
          <Toaster />
          <PasswordGate>
            <Router />
          </PasswordGate>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
