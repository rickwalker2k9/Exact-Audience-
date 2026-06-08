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
import BreezeDashboard from "./pages/BreezeDashboard";
import StarlingDashboard from "./pages/StarlingDashboard";
import EcholsDashboard from "./pages/EcholsDashboard";
import LandRoverDashboard from "./pages/LandRoverDashboard";
import BarrettDashboard from "./pages/BarrettDashboard";
import GovernorDashboard from "./pages/GovernorDashboard";
import MazzeiPitchDashboard from "./pages/MazzeiPitchDashboard";
import DrummondPitchDashboard from "./pages/DrummondPitchDashboard";
import KeatingPitchDashboard from "./pages/KeatingPitchDashboard";
import McCallPitchDashboard from "./pages/McCallPitchDashboard";
import VoterJourneyPage from "./pages/VoterJourneyPage";

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
      <Route path="/breeze-insurance" component={BreezeDashboard} />
      <Route path="/starling" component={StarlingDashboard} />
      <Route path="/echols" component={EcholsDashboard} />
      <Route path="/land-rover" component={LandRoverDashboard} />
      <Route path="/barrett-financial" component={BarrettDashboard} />
      <Route path="/governor" component={GovernorDashboard} />
      <Route path="/pitch/mazzei" component={MazzeiPitchDashboard} />
      <Route path="/pitch/drummond" component={DrummondPitchDashboard} />
      <Route path="/pitch/keating" component={KeatingPitchDashboard} />
      <Route path="/pitch/mccall" component={McCallPitchDashboard} />

      {/* Placeholder for campaigns without a full dashboard */}
      <Route path="/campaign/:slug" component={CampaignPlaceholder} />

      {/* Buyer profile detail pages */}
      <Route path="/buyer/:id" component={BuyerProfilePage} />

      {/* Voter journey detail pages */}
      <Route path="/voter/:id" component={VoterJourneyPage} />

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
